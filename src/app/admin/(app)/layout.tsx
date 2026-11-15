import { requireAdmin } from "@/lib/admin/auth";
import { ago, loadAll, today, fmtWeekday } from "@/lib/admin/data";
import { Icon } from "@/components/admin/ui";
import { logout, refresh } from "../actions";
import { Nav, RefreshButton } from "./Nav";

const WEEKDAY_LONG: Record<string, string> = { Mo: "Montag", Di: "Dienstag", Mi: "Mittwoch", Do: "Donnerstag", Fr: "Freitag", Sa: "Samstag", So: "Sonntag" };
const MONTH_LONG = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];

export default async function AdminShell({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  const data = await loadAll();
  const qonto = data.sync.find((s) => s.key === "qonto");
  const luma = data.sync.find((s) => s.key === "luma");
  const day = today();
  const [, m, d] = day.split("-").map(Number);
  const dateLabel = `${WEEKDAY_LONG[fmtWeekday(day)]}, ${d}. ${MONTH_LONG[m - 1]}`;

  return (
    <div className="adm" lang="de">
      <aside className="adm-side">
        <div className="adm-brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/logo.png" alt="kindpeopleonly" />
          <span>Admin</span>
        </div>
        <Nav />
        <div className="adm-side-foot">
          <div className="adm-sync" title={luma?.message ?? undefined}>
            <i className={luma?.ok ? "dot" : "dot bad"} />
            <span><b>Luma</b> · {ago(luma?.synced_at ?? null)}</span>
          </div>
          <div className="adm-sync" title={qonto?.message ?? undefined}>
            <i className={qonto?.ok ? "dot" : qonto ? "dot bad" : "dot off"} />
            <span><b>Qonto</b> · {qonto?.ok ? ago(qonto.synced_at) : "nicht verbunden"}</span>
          </div>
          <form action={logout}>
            <button type="submit" className="adm-btn-plain">
              <Icon name="logout" />
              <span>Abmelden</span>
            </button>
          </form>
        </div>
      </aside>
      <div className="adm-main">
        <div className="adm-top">
          <span className="adm-top-date">{dateLabel}</span>
          <div className="adm-top-right">
            <form action={refresh}>
              <RefreshButton />
            </form>
            <span className="adm-avatar" aria-hidden="true">KPO</span>
          </div>
        </div>
        <main className="adm-content">{children}</main>
      </div>
    </div>
  );
}
