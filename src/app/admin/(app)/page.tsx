import type { Metadata } from "next";
import Link from "next/link";
import {
  ago, buildEvents, cashOverview, daysBetween, eur, fmtDay, int, loadAll,
  pct, relDays, signedEur, soldBefore, today, type FinEvent,
} from "@/lib/admin/data";
import { Badge, Card, Columns, Empty, Icon, Notice, PageHead, Progress, Stat } from "@/components/admin/ui";
import { EventTable } from "@/components/admin/EventTable";

export const metadata: Metadata = { title: "Übersicht" };

export default async function Overview() {
  const data = await loadAll();
  const events = buildEvents(data);
  const cash = cashOverview(data, events);
  const now = today();
  const year = now.slice(0, 4);
  const prevYear = String(Number(year) - 1);
  const sameDayLastYear = `${prevYear}${now.slice(4)}`;

  const paid = events.filter((e) => e.gross > 0);
  const thisYear = paid.filter((e) => e.day.startsWith(year));
  const lastYearToDate = paid.filter((e) => e.day.startsWith(prevYear) && e.day <= sameDayLastYear);
  const gross = thisYear.reduce((a, e) => a + e.gross, 0);
  const grossPrev = lastYearToDate.reduce((a, e) => a + e.gross, 0);
  const tickets = thisYear.reduce((a, e) => a + e.tickets, 0);
  const past = thisYear.filter((e) => !e.upcoming && e.tickets > 0);
  const pastTickets = past.reduce((a, e) => a + e.tickets, 0);
  const checked = past.reduce((a, e) => a + e.checkedIn, 0);

  const next = events.filter((e) => e.upcoming).sort((a, b) => a.day.localeCompare(b.day))[0];
  const chart = paid.slice(0, 10).reverse();
  const qonto = data.sync.find((s) => s.key === "qonto");
  const lumaTitle = new Map(events.filter((e) => e.luma).map((e) => [e.luma!.id, e]));

  return (
    <>
      <PageHead title="Übersicht" sub="Finanzen von kindpeopleonly auf einen Blick." />

      {qonto && !qonto.ok && (
        <Notice title="Qonto ist nicht verbunden">
          Kontostand und Buchungen fehlen. Der Schlüssel <code>QONTO_API_KEY</code> in Supabase muss
          die Form <code>login:secret-key</code> haben.
        </Notice>
      )}

      <div className="grid kpis">
        <Stat
          label="Kontostand"
          value={cash.connected ? eur(cash.balance) : "—"}
          muted={!cash.connected}
          sub={cash.connected ? <>frei nach Rechnungen und Plan: <b>{eur(cash.free)}</b></> : "Qonto nicht verbunden"}
        />
        <Stat
          label={`Ticketumsatz ${year}`}
          value={eur(gross)}
          sub={grossPrev > 0 ? <><span className={gross >= grossPrev ? "up" : "down"}>{signedEur(gross - grossPrev)}</span> zum Vorjahr bis heute</> : `${thisYear.length} Events mit Tickets`}
        />
        <Stat
          label={`Tickets ${year}`}
          value={int(tickets)}
          sub={tickets ? `Ø ${eur(gross / tickets, 2)} pro Ticket` : undefined}
        />
        <Stat
          label="Check-in-Quote"
          value={pastTickets ? pct(checked / pastTickets) : "—"}
          sub={pastTickets ? `${int(checked)} von ${int(pastTickets)} Gästen kamen` : undefined}
        />
      </div>

      <div className="grid two">
        {next ? <NextEvent e={next} history={paid.filter((p) => !p.upcoming).slice(0, 3)} /> : (
          <Card title="Nächstes Event"><Empty title="Kein Event geplant">Neue Events kommen automatisch aus Luma.</Empty></Card>
        )}

        <Card title="Letzte Ticketkäufe" sub="Live aus Luma, ohne Namen">
          {data.sales.length ? (
            <div className="feed">
              {data.sales.slice(0, 7).map((s) => {
                const e = s.event_id ? lumaTitle.get(s.event_id) : undefined;
                return (
                  <div key={s.id} className="feed-row">
                    <span className="feed-icon"><Icon name="ticket" /></span>
                    <div className="feed-main">
                      <b>{s.tickets} {s.tickets === 1 ? "Ticket" : "Tickets"} · {e?.title ?? "Event"}</b>
                      <span>{ago(s.created_at)}</span>
                    </div>
                    <span className="feed-amount">{s.amount > 0 ? `+${eur(s.amount, 2)}` : "frei"}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <Empty title="Noch keine Käufe">Jeder neue Kauf erscheint hier sofort.</Empty>
          )}
        </Card>
      </div>

      <Card title="Ticketumsatz pro Event" sub="Brutto aus Luma, die letzten 10 Events mit Tickets" action={<Link className="link" href="/admin/events">Alle Events →</Link>}>
        <Columns
          height={220}
          unit="€"
          data={chart.map((e) => ({
            key: e.key,
            label: `${fmtDay(e.day, false)}`,
            value: e.gross,
            tone: e.upcoming ? "hi" : undefined,
            showValue: e.gross === Math.max(...chart.map((c) => c.gross)) || e.upcoming ? eur(e.gross) : undefined,
            tip: (
              <>
                <b>{e.title}</b>
                {eur(e.gross)} · {int(e.tickets)} Tickets
                <br />
                <span>{fmtDay(e.day)}{e.upcoming ? " · läuft noch" : ""}</span>
              </>
            ),
          }))}
        />
      </Card>

      <Card title="Letzte Events" flush action={<Link className="link" href="/admin/events">Alle Events →</Link>}>
        <EventTable events={events.slice(0, 6)} provisional={!qonto?.ok} />
      </Card>
    </>
  );
}

function NextEvent({ e, history }: { e: FinEvent; history: FinEvent[] }) {
  const days = Math.max(0, daysBetween(today(), e.day));
  const soldToday = e.sales.find((s) => s.d === today())?.n ?? 0;
  return (
    <Card
      title={e.title}
      sub={<>{fmtDay(e.day)} · {relDays(e.day)}{e.location ? ` · ${e.location}` : ""}</>}
      action={<Link className="link" href={`/admin/events/${e.key}`}>Details →</Link>}
    >
      <div className="hero-num">
        <div><span>Tickets</span><b>{int(e.tickets)}</b></div>
        <div><span>Umsatz brutto</span><b>{eur(e.gross)}</b></div>
        <div><span>Heute verkauft</span><b>{int(soldToday)}</b></div>
      </div>
      {e.capacity ? (
        <div style={{ marginBottom: 18 }}>
          <div className="card-h" style={{ marginBottom: 8 }}>
            <span className="muted">{int(e.tickets)} von {int(e.capacity)} Plätzen</span>
            <span className="tnum">{pct(e.tickets / e.capacity)}</span>
          </div>
          <Progress value={e.tickets / e.capacity} />
        </div>
      ) : null}
      {history.length > 0 && (
        <table className="t">
          <thead>
            <tr><th>Vergleich</th><th className="r">{days} Tage vorher</th><th className="r">Am Ende</th></tr>
          </thead>
          <tbody>
            <tr>
              <td className="title">{e.title} <Badge tone="accent">jetzt</Badge></td>
              <td className="r">{int(e.tickets)}</td>
              <td className="r faint">offen</td>
            </tr>
            {history.map((h) => {
              const before = soldBefore(h, days);
              return (
                <tr key={h.key}>
                  <td>{h.title} <span className="faint">· {fmtDay(h.day)}</span></td>
                  <td className="r">{before == null ? "—" : int(before)}</td>
                  <td className="r">{int(h.tickets)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </Card>
  );
}
