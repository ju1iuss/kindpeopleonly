import Link from "next/link";
import { actualResult, eur, fmtDay, hasPlan, int, net, pct, planResult, signedEur, type FinEvent } from "@/lib/admin/data";
import { Badge, Empty } from "@/components/admin/ui";

export function EventTable({ events, totals, provisional }: { events: FinEvent[]; totals?: boolean; provisional?: boolean }) {
  if (!events.length) return <Empty title="Keine Events">Hier ist gerade nichts.</Empty>;
  const sum = (f: (e: FinEvent) => number) => events.reduce((a, e) => a + f(e), 0);
  return (
    <div className="table-wrap">
      <table className="t">
        <thead>
          <tr>
            <th>Datum</th>
            <th>Event</th>
            <th className="r">Tickets</th>
            <th className="r">Check-in</th>
            <th className="r">Umsatz</th>
            <th className="r">Netto</th>
            <th className="r">Kosten</th>
            <th className="r">Ergebnis</th>
          </tr>
        </thead>
        <tbody>
          {events.map((e) => {
            const href = `/admin/events/${e.key}`;
            return (
              <tr key={e.key} className="link-row">
                <td><Link className="cell" href={href}>{fmtDay(e.day)}</Link></td>
                <td>
                  <Link className="cell" href={href}>
                    <span className="title">{e.title}</span>{" "}
                    {e.upcoming && <Badge tone="accent">kommt</Badge>}
                    {!e.kpo && <Badge>nur Luma</Badge>}
                  </Link>
                </td>
                <td className="r">{e.tickets ? int(e.tickets) : "—"}{e.capacity ? <span className="faint"> / {int(e.capacity)}</span> : null}</td>
                <td className="r">{!e.upcoming && e.tickets ? pct(e.checkedIn / e.tickets) : "—"}</td>
                <td className="r">{e.gross ? eur(e.gross) : "—"}</td>
                <td className="r">{e.gross ? eur(net(e)) : "—"}</td>
                <td className="r">{e.actualCosts ? eur(e.actualCosts) : hasPlan(e) ? <span className="faint">Plan {eur(e.planCosts)}</span> : "—"}</td>
                <td className="r"><Result e={e} provisional={provisional} /></td>
              </tr>
            );
          })}
        </tbody>
        {totals && (
          <tfoot>
            <tr>
              <td colSpan={2}>Summe · {events.length} Events</td>
              <td className="r">{int(sum((e) => e.tickets))}</td>
              <td className="r" />
              <td className="r">{eur(sum((e) => e.gross))}</td>
              <td className="r">{eur(sum(net))}</td>
              <td className="r">{eur(sum((e) => e.actualCosts))}</td>
              <td className="r" />
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}

function Result({ e, provisional }: { e: FinEvent; provisional?: boolean }) {
  if (e.actualCosts > 0) {
    const r = actualResult(e);
    if (provisional) return <span className="muted" title="Vorläufig: ohne Qonto nur Kosten aus der App">{signedEur(r)} *</span>;
    return <span className={r >= 0 ? "up" : "down"}>{signedEur(r)}</span>;
  }
  if (hasPlan(e)) return <span className="faint">Plan {signedEur(planResult(e))}</span>;
  return <span className="faint">—</span>;
}
