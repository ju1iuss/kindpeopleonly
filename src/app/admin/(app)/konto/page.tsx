import type { Metadata } from "next";
import {
  buildEvents, cashOverview, categoryLabel, counts, eur, fmtDay, int, loadAll, monthLabel, months,
  signedEur, today, txDay, txTitle,
} from "@/lib/admin/data";
import { Badge, Card, Columns, Empty, HBars, PageHead, Stat, Tabs } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Konto" };

export default async function KontoPage({ searchParams }: { searchParams: Promise<{ [k: string]: string | string[] | undefined }> }) {
  const { f } = await searchParams;
  const data = await loadAll();
  const events = buildEvents(data);
  const cash = cashOverview(data, events);
  const qonto = data.sync.find((s) => s.key === "qonto");

  if (!cash.connected) {
    return (
      <>
        <PageHead title="Konto" sub="Qonto-Konto, Buchungen und was davon frei ist." />
        <Card>
          <Empty title="Qonto ist noch nicht verbunden">
            <p style={{ margin: "6px auto 0", maxWidth: 520 }}>
              {!qonto?.message || qonto.message === "not_configured"
                ? "Es ist kein Qonto-Schlüssel hinterlegt."
                : qonto.message.includes("401")
                  ? "Qonto lehnt den Schlüssel ab."
                  : "Der letzte Abgleich mit Qonto ist fehlgeschlagen."}
              <br />
              In Supabase unter Edge Functions → Secrets den Wert <code>QONTO_API_KEY</code> auf <code>login:secret-key</code> setzen
              (beides steht in Qonto unter Einstellungen → API-Schlüssel). Danach oben auf „Aktualisieren“.
            </p>
          </Empty>
        </Card>
      </>
    );
  }

  const filter = f === "offen" || f === "fixkosten" ? f : "alle";
  const valid = data.txs.filter(counts);
  const open = valid.filter((t) => !t.category);
  const fix = valid.filter((t) => t.category === "fixkosten");
  const list = (filter === "offen" ? open : filter === "fixkosten" ? fix : valid).slice(0, 150);
  const eventTitle = new Map(events.map((e) => [e.key, e.title]));

  const ms = months(data, 12);
  const year = today().slice(0, 4);
  const yearCosts = new Map<string, number>();
  for (const t of valid) {
    if (t.side !== "debit" || t.category === "intern" || !txDay(t).startsWith(year)) continue;
    const label = categoryLabel(t.category, false);
    yearCosts.set(label, (yearCosts.get(label) ?? 0) + t.amount);
  }
  const costRows = [...yearCosts].map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value).slice(0, 9);

  return (
    <>
      <PageHead title="Konto" sub={<>Qonto · Stand {qonto?.synced_at ? fmtDay(qonto.synced_at.slice(0, 10)) : "unbekannt"}</>} />

      <div className="grid kpis">
        <Stat label="Kontostand" value={eur(cash.balance)} sub={data.accounts.length > 1 ? `${data.accounts.length} Konten` : undefined} />
        <Stat label="Offene Rechnungen" value={eur(cash.payables)} sub={`${cash.payablesCount} an uns`} />
        <Stat label="Geplante Kosten" value={eur(cash.plannedCosts)} sub="kommende Events, noch nicht bezahlt" />
        <Stat label="Frei verfügbar" value={eur(cash.free)} sub={<>mit erwarteten Einnahmen <b>{eur(cash.withIncome)}</b></>} />
      </div>

      <div className="grid two">
        <Card title="Saldo pro Monat" sub="Einnahmen minus Ausgaben, ohne Umbuchungen">
          <Columns
            height={200}
            unit="€"
            data={ms.map((m) => ({
              key: m.key,
              label: monthLabel(m.key).slice(0, 3),
              value: m.saldo,
              tone: m.saldo >= 0 ? "pos" : "neg",
              tip: (
                <>
                  <b>{signedEur(m.saldo)}</b>
                  {monthLabel(m.key)}
                  <br />
                  <span>+{eur(m.inc)} · −{eur(m.out)}</span>
                </>
              ),
            }))}
          />
        </Card>
        <Card title={`Ausgaben ${year}`} sub="nach Kategorie">
          {costRows.length ? <HBars rows={costRows} format={(v) => eur(v)} /> : <Empty title="Keine Ausgaben" />}
        </Card>
      </div>

      <Tabs
        current={filter}
        items={[
          { key: "alle", label: "Alle Buchungen", href: "/admin/konto" },
          { key: "offen", label: "Nicht zugeordnet", href: "/admin/konto?f=offen", count: open.length },
          { key: "fixkosten", label: "Fixkosten", href: "/admin/konto?f=fixkosten", count: fix.length },
        ]}
      />
      <Card flush>
        {list.length ? (
          <div className="table-wrap">
            <table className="t">
              <thead><tr><th>Datum</th><th>Buchung</th><th>Event</th><th>Kategorie</th><th className="r">Betrag</th></tr></thead>
              <tbody>
                {list.map((t) => (
                  <tr key={t.id}>
                    <td>{fmtDay(txDay(t))}</td>
                    <td>
                      <span className="title">{txTitle(t)}</span>
                      <span className="sub">{[t.initiator, t.status === "pending" ? "vorgemerkt" : null, (t.attachment_count ?? 0) > 0 ? "Beleg da" : null].filter(Boolean).join(" · ") || " "}</span>
                    </td>
                    <td>{t.event_id ? eventTitle.get(t.event_id) ?? t.event_id : <span className="faint">—</span>}</td>
                    <td>{t.category ? <Badge>{categoryLabel(t.category, t.side === "credit")}</Badge> : <Badge tone="warn">offen</Badge>}</td>
                    <td className="r"><span className={t.side === "credit" ? "up" : undefined}>{signedEur(t.side === "credit" ? t.amount : -t.amount, 2)}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Empty title="Nichts offen">Alle Buchungen sind zugeordnet.</Empty>
        )}
      </Card>
      {filter === "offen" && open.length > 0 && (
        <p className="faint" style={{ margin: 0, fontSize: 12.5 }}>
          Zuordnen geht in der App unter Finanzen. {int(open.length)} Buchungen warten.
        </p>
      )}
    </>
  );
}
