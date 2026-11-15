import type { Metadata } from "next";
import { buildEvents, eur, fmtDay, loadAll, today, type Invoice } from "@/lib/admin/data";
import { Badge, Card, Empty, PageHead, Stat } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Rechnungen & Belege" };

export default async function BelegePage() {
  const data = await loadAll();
  const events = new Map(buildEvents(data).map((e) => [e.key, e.title]));
  const people = new Map(data.people.map((p) => [p.id, p.name]));
  const linked = new Set(data.txs.filter((t) => t.receipt_id).map((t) => t.receipt_id));
  const supplier = data.invoices.filter((i) => i.kind === "supplier");
  const client = data.invoices.filter((i) => i.kind === "client");
  const overdue = supplier.filter((i) => i.due_date && i.due_date < today());
  const looseReceipts = data.receipts.filter((r) => !r.transaction_id && !linked.has(r.id));
  const qontoOk = data.sync.find((s) => s.key === "qonto")?.ok;

  return (
    <>
      <PageHead title="Rechnungen & Belege" sub="Offene Rechnungen aus Qonto und die Belege, die das Team in der App fotografiert." />

      <div className="grid kpis">
        <Stat label="Wir zahlen" value={qontoOk ? eur(supplier.reduce((a, i) => a + i.amount, 0)) : "—"} muted={!qontoOk} sub={qontoOk ? `${supplier.length} offen${overdue.length ? ` · ${overdue.length} überfällig` : ""}` : "Qonto nicht verbunden"} />
        <Stat label="Wir bekommen" value={qontoOk ? eur(client.reduce((a, i) => a + i.amount, 0)) : "—"} muted={!qontoOk} sub={qontoOk ? `${client.length} offen` : undefined} />
        <Stat label="Belege" value={String(data.receipts.length)} sub={`${looseReceipts.length} ohne Qonto-Buchung`} />
      </div>

      <div className="grid halves">
        <Card title="Wir zahlen" sub="Eingangsrechnungen" flush>
          <InvoiceList list={supplier} empty={qontoOk ? "Keine offenen Rechnungen" : "Kommt mit Qonto"} />
        </Card>
        <Card title="Wir bekommen" sub="Eigene Rechnungen" flush>
          <InvoiceList list={client} empty={qontoOk ? "Nichts offen" : "Kommt mit Qonto"} />
        </Card>
      </div>

      <Card title="Belege" sub="Aus der App" flush>
        {data.receipts.length ? (
          <div className="table-wrap">
            <table className="t">
              <thead><tr><th>Datum</th><th>Beleg</th><th>Event</th><th>Bezahlt von</th><th>Status</th><th className="r">Betrag</th></tr></thead>
              <tbody>
                {data.receipts.map((r) => {
                  const withTx = !!r.transaction_id || linked.has(r.id);
                  return (
                    <tr key={r.id}>
                      <td>{fmtDay(r.date)}</td>
                      <td>
                        <span className="title">{r.title || "Beleg"}</span>
                        {r.note && <span className="sub">{r.note}</span>}
                      </td>
                      <td>{r.event_id ? events.get(r.event_id) ?? r.event_id : <span className="faint">—</span>}</td>
                      <td>{r.paid_by ? people.get(r.paid_by) ?? r.paid_by : <span className="faint">—</span>}</td>
                      <td>{withTx ? <Badge tone="good">mit Buchung</Badge> : r.in_qonto ? <Badge>in Qonto</Badge> : <Badge tone="warn">bar / privat</Badge>}</td>
                      <td className="r">{r.amount != null ? eur(r.amount, 2) : "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <Empty title="Noch keine Belege" />
        )}
      </Card>
    </>
  );
}

function InvoiceList({ list, empty }: { list: Invoice[]; empty: string }) {
  if (!list.length) return <Empty title={empty} />;
  const now = today();
  return (
    <div className="table-wrap">
      <table className="t">
        <thead><tr><th>Partner</th><th>Fällig</th><th className="r">Betrag</th></tr></thead>
        <tbody>
          {list.map((i) => {
            const late = i.due_date && i.due_date < now;
            return (
              <tr key={i.id}>
                <td>
                  <span className="title">{i.party || "Unbekannt"}</span>
                  {i.number && <span className="sub">{i.number}</span>}
                </td>
                <td>{i.due_date ? (late ? <Badge tone="bad">{fmtDay(i.due_date)}</Badge> : fmtDay(i.due_date)) : <span className="faint">—</span>}</td>
                <td className="r">{eur(i.amount, 2)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
