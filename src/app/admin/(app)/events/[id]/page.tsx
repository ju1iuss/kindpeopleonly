import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  actualResult, breakEven, buildEvents, eur, fmtDay, fmtShort, fmtWeekday, hasPlan, int, loadAll, net, pct,
  planResult, relDays, signedEur, today, type Cat, type FinEvent,
} from "@/lib/admin/data";
import { Badge, Card, Columns, Empty, Icon, PageHead, Stat } from "@/components/admin/ui";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const e = buildEvents(await loadAll()).find((x) => x.key === id);
  return { title: e?.title ?? "Event" };
}

export default async function EventPage({ params }: Props) {
  const { id } = await params;
  const e = buildEvents(await loadAll()).find((x) => x.key === id);
  if (!e) notFound();

  const data = await loadAll();
  const provisional = !data.sync.find((s) => s.key === "qonto")?.ok;
  const be = breakEven(e);
  const soldToday = e.sales.find((s) => s.d === today())?.n ?? 0;
  const salesDays = e.sales.length;

  return (
    <>
      <PageHead
        title={e.title}
        back={{ href: "/admin/events", label: "Events" }}
        sub={<>{fmtWeekday(e.day)}, {fmtDay(e.day)}{e.time ? ` · ${e.time} Uhr` : ""}{e.location ? ` · ${e.location}` : ""} · {relDays(e.day)}</>}
      >
        {e.url && (
          <a className="adm-btn" href={e.url} target="_blank" rel="noreferrer">
            <Icon name="external" /> In Luma öffnen
          </a>
        )}
      </PageHead>

      <div className="grid kpis">
        <Stat label="Tickets" value={e.tickets ? int(e.tickets) : "—"} muted={!e.tickets} sub={e.capacity ? `von ${int(e.capacity)} Plätzen · ${pct(e.tickets / e.capacity)}` : e.upcoming ? `${int(soldToday)} heute verkauft` : undefined} />
        <Stat label="Umsatz brutto" value={e.gross ? eur(e.gross) : "—"} muted={!e.gross} sub={e.tickets && e.gross ? `Ø ${eur(e.gross / e.tickets, 2)} pro Ticket` : undefined} />
        <Stat label="Netto nach Gebühren" value={e.gross ? eur(net(e)) : "—"} muted={!e.gross} sub={e.fees ? `Stripe ca. ${eur(e.fees)}` : undefined} />
        {e.upcoming ? (
          <Stat label="Break-even" value={be ? `${int(be)} Tickets` : "—"} muted={!be} sub={be ? (e.tickets >= be ? <span className="up">erreicht</span> : `noch ${int(be - e.tickets)} Tickets`) : "braucht eine Kalkulation in der App"} />
        ) : (
          <Stat label="Check-in" value={e.tickets ? pct(e.checkedIn / e.tickets) : "—"} muted={!e.tickets} sub={e.tickets ? `${int(e.checkedIn)} von ${int(e.tickets)} Gästen` : undefined} />
        )}
      </div>

      <div className="grid two">
        <Card title="Ticketverkauf pro Tag" sub={salesDays ? `${salesDays} Verkaufstage · Event-Tag rot` : undefined}>
          {salesDays ? (
            <Columns
              height={200}
              labelEvery={Math.max(1, Math.ceil(salesDays / 7))}
              data={withRunningTotal(e).map(({ d, n, total }) => ({
                key: d,
                label: fmtShort(d),
                value: n,
                tone: d === e.day ? "hi" : undefined,
                tip: (
                  <>
                    <b>{int(n)} Tickets</b>
                    {fmtWeekday(d)}, {fmtDay(d)}
                    <br />
                    <span>{int(total)} bis dahin</span>
                  </>
                ),
              }))}
            />
          ) : (
            <Empty title="Noch keine Verkäufe" />
          )}
        </Card>

        <Card title="Ticketarten" flush>
          {e.ticketTypes.length ? (
            <div className="table-wrap">
              <table className="t">
                <thead><tr><th>Ticket</th><th className="r">Preis</th><th className="r">Verkauft</th><th className="r">Umsatz</th></tr></thead>
                <tbody>
                  {e.ticketTypes.map((t) => (
                    <tr key={t.name}>
                      <td className="title">{t.name}</td>
                      <td className="r">{t.price ? eur(t.price, t.price % 1 ? 2 : 0) : "frei"}</td>
                      <td className="r">{int(t.sold)}</td>
                      <td className="r">{eur(t.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Empty title="Keine Ticketdaten" />
          )}
        </Card>
      </div>

      <Budget e={e} provisional={provisional} />
    </>
  );
}

function withRunningTotal(e: FinEvent) {
  let total = 0;
  return e.sales.map((s) => {
    total += s.n;
    return { ...s, total };
  });
}

function Budget({ e, provisional }: { e: FinEvent; provisional: boolean }) {
  if (!e.kpo) {
    return (
      <Card title="Kalkulation">
        <Empty title="Nur in Luma">Kalkulation und Kosten gibt es für Events, die in der App angelegt sind.</Empty>
      </Card>
    );
  }
  const income = e.income.filter((c) => c.planLines.length || c.actualLines.length);
  const costs = e.costs.filter((c) => c.planLines.length || c.actualLines.length);
  if (!income.length && !costs.length) {
    return (
      <Card title="Kalkulation">
        <Empty title="Noch keine Kalkulation">Plan und Kosten trägt das Team in der App beim Event ein.</Empty>
      </Card>
    );
  }
  const worst = e.planIncome - e.planCosts * 1.2;
  return (
    <Card title="Kalkulation" sub="Plan aus der App, Ist aus Luma, Qonto und Belegen" flush>
      <div className="table-wrap">
        <table className="t top">
          <thead><tr><th>Kategorie</th><th className="r">Plan</th><th className="r">Ist</th><th className="r">Abweichung</th></tr></thead>
          <tbody>
            <tr className="section"><td colSpan={4}>Einnahmen</td></tr>
            {income.map((c) => <CatRow key={c.id} c={c} income />)}
            <tr className="section"><td colSpan={4}>Kosten</td></tr>
            {costs.length ? costs.map((c) => <CatRow key={c.id} c={c} />) : <tr><td colSpan={4} className="faint">Noch keine Kosten</td></tr>}
          </tbody>
          <tfoot>
            <tr>
              <td>Ergebnis</td>
              <td className="r">{hasPlan(e) ? <span className={planResult(e) >= 0 ? "up" : "down"}>{signedEur(planResult(e))}</span> : "—"}</td>
              <td className="r">{e.actualCosts > 0 ? <span className={provisional ? "muted" : actualResult(e) >= 0 ? "up" : "down"}>{signedEur(actualResult(e))}{provisional ? " *" : ""}</span> : <span className="faint">Kosten fehlen</span>}</td>
              <td className="r" />
            </tr>
          </tfoot>
        </table>
      </div>
      {provisional && e.actualCosts > 0 && (
        <p className="card-sub" style={{ padding: "0 20px 6px" }}>* vorläufig: Ohne Qonto zählen nur Kosten, die in der App eingetragen sind.</p>
      )}
      {hasPlan(e) && (
        <p className="card-sub" style={{ padding: "0 20px 18px" }}>
          Worst Case (alle Kosten 20 % teurer): <b className={worst >= 0 ? "up" : "down"}>{signedEur(worst)}</b>
          {e.planIncome > 0 && <> · Plan-Marge {pct(planResult(e) / e.planIncome)}</>}
        </p>
      )}
    </Card>
  );
}

function CatRow({ c, income }: { c: Cat; income?: boolean }) {
  const diff = c.actual - c.plan;
  const good = income ? diff >= 0 : diff <= 0;
  const lines = [...c.planLines.map((l) => ({ ...l, kind: "Plan" })), ...c.actualLines.map((l) => ({ ...l, kind: "Ist" }))];
  return (
    <tr>
      <td>
        <details className="lines">
          <summary><span className="chev">›</span><span className="title">{c.label}</span></summary>
          <div className="line-list">
            {lines.map((l, i) => (
              <div key={i}>
                <span>
                  <Badge>{l.kind}</Badge> {l.title}
                  {l.detail ? <span className="faint"> · {l.detail}</span> : null}
                </span>
                <span className={l.counted === false ? "tnum faint" : "tnum"}>{eur(l.amount, 2)}</span>
              </div>
            ))}
          </div>
        </details>
      </td>
      <td className="r">{c.planLines.length ? eur(c.plan) : "—"}</td>
      <td className="r">{c.actualLines.length ? eur(c.actual) : "—"}</td>
      <td className="r">{c.planLines.length && c.actualLines.length ? <span className={good ? "up" : "down"}>{signedEur(diff)}</span> : <span className="faint">—</span>}</td>
    </tr>
  );
}
