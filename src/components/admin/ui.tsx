import Link from "next/link";
import type { ReactNode } from "react";

// Bausteine für /admin. Nur Server-Komponenten, Tooltips laufen über CSS.

const PATHS: Record<string, ReactNode> = {
  overview: (
    <>
      <rect x="3" y="3" width="7.5" height="9" rx="2" />
      <rect x="13.5" y="3" width="7.5" height="5.5" rx="2" />
      <rect x="13.5" y="11.5" width="7.5" height="9.5" rx="2" />
      <rect x="3" y="15" width="7.5" height="6" rx="2" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="4.5" width="18" height="16.5" rx="2.5" />
      <path d="M3 9.5h18M8 2.5v4M16 2.5v4" />
    </>
  ),
  bank: (
    <>
      <path d="M3 9.5 12 4l9 5.5" />
      <path d="M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20.5h18" />
    </>
  ),
  receipt: (
    <>
      <path d="M6 2.5h12v19l-3-2-3 2-3-2-3 2z" />
      <path d="M9 8h6M9 12h6M9 16h3" />
    </>
  ),
  logout: (
    <>
      <path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4" />
      <path d="M10 16.5 5.5 12 10 7.5M5.5 12H15" />
    </>
  ),
  refresh: (
    <>
      <path d="M20 12a8 8 0 1 1-2.34-5.66" />
      <path d="M20 4v4.5h-4.5" />
    </>
  ),
  ticket: (
    <>
      <path d="M3 8a2 2 0 0 0 2-2h14a2 2 0 0 0 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 0-2 2H5a2 2 0 0 0-2-2v-2a2 2 0 0 0 0-4z" />
      <path d="M14 6v12" strokeDasharray="2 2.5" />
    </>
  ),
  external: (
    <>
      <path d="M14 4h6v6M20 4l-9 9" />
      <path d="M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4" />
    </>
  ),
  back: <path d="M15 5 8 12l7 7" />,
  alert: (
    <>
      <path d="M12 3.5 2.5 20h19z" />
      <path d="M12 10v4.5M12 17.2v.3" />
    </>
  ),
};

export function Icon({ name, size }: { name: keyof typeof PATHS | string; size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  );
}

export function PageHead({ title, sub, back, children }: { title: string; sub?: ReactNode; back?: { href: string; label: string }; children?: ReactNode }) {
  return (
    <header className="page-head">
      <div>
        {back && (
          <Link className="crumb" href={back.href}>
            <Icon name="back" size={14} /> {back.label}
          </Link>
        )}
        <h1>{title}</h1>
        {sub && <p>{sub}</p>}
      </div>
      {children}
    </header>
  );
}

export function Card({ title, sub, action, flush, children }: { title?: string; sub?: ReactNode; action?: ReactNode; flush?: boolean; children: ReactNode }) {
  return (
    <section className={flush ? "card flush" : "card"}>
      {(title || action) && (
        <div className="card-h">
          <div>
            {title && <h2>{title}</h2>}
            {sub && <p>{sub}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function Stat({ label, value, sub, muted }: { label: string; value: string; sub?: ReactNode; muted?: boolean }) {
  return (
    <div className="card">
      <div className="stat-label">{label}</div>
      <div className={muted ? "stat-value muted" : "stat-value"}>{value}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  );
}

export function Tabs({ items, current }: { items: { href: string; label: string; key: string; count?: number }[]; current: string }) {
  return (
    <nav className="tabs" aria-label="Ansicht">
      {items.map((t) => (
        <Link key={t.key} href={t.href} aria-current={t.key === current ? "page" : undefined}>
          {t.label}
          {t.count != null && <small>{t.count}</small>}
        </Link>
      ))}
    </nav>
  );
}

export function Badge({ tone, children }: { tone?: "good" | "bad" | "warn" | "accent"; children: ReactNode }) {
  return <span className={tone ? `badge ${tone}` : "badge"}>{children}</span>;
}

export function Notice({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="notice" role="status">
      <Icon name="alert" />
      <div>
        <b>{title}</b>
        {children && <p>{children}</p>}
      </div>
    </div>
  );
}

export function Empty({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="empty">
      <b>{title}</b>
      {children}
    </div>
  );
}

export function Progress({ value }: { value: number }) {
  return (
    <div className="progress" role="presentation">
      <span style={{ width: `${Math.max(0, Math.min(1, value)) * 100}%` }} />
    </div>
  );
}

// MARK: - Säulen

function niceMax(v: number): number {
  if (v <= 0) return 1;
  const p = 10 ** Math.floor(Math.log10(v));
  for (const m of [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10]) if (m * p >= v) return m * p;
  return 10 * p;
}

function tick(v: number, unit?: string): string {
  const abs = Math.abs(v);
  const s = abs >= 10_000 ? `${(v / 1000).toLocaleString("de-DE", { maximumFractionDigits: 1 })}k` : v.toLocaleString("de-DE");
  return unit ? `${s} ${unit}` : s;
}

export type Column = { key: string; label: string; value: number; tip: ReactNode; tone?: "hi" | "dim" | "pos" | "neg"; showValue?: string };

/** Säulen ab einer Nulllinie. Negative Werte gehen nach unten (Saldo). */
export function Columns({ data, height = 200, unit, labelEvery = 1 }: { data: Column[]; height?: number; unit?: string; labelEvery?: number }) {
  const maxPos = Math.max(0, ...data.map((d) => d.value));
  const maxNeg = Math.max(0, ...data.map((d) => -d.value));
  const top = niceMax(maxPos || (maxNeg ? 0 : 1));
  const bottom = maxNeg ? niceMax(maxNeg) : 0;
  const range = (maxPos ? top : 0) + bottom || 1;
  const zero = (bottom / range) * 100; // Prozent von unten
  const ticks = maxNeg
    ? [-(bottom), 0, maxPos ? top : 0].filter((v, i, a) => a.indexOf(v) === i)
    : [0, top / 2, top];
  const pos = (v: number) => ((v + bottom) / range) * 100;

  return (
    <div className="chart">
      <div className="chart-y" style={{ height }}>
        {ticks.map((t) => (
          <span key={t} style={{ bottom: `${pos(t)}%` }}>
            {tick(t, unit)}
          </span>
        ))}
      </div>
      <div className="chart-plot" style={{ height }}>
        {ticks.map((t) => (
          <div key={t} className={t === 0 ? "chart-grid chart-zero" : "chart-grid"} style={{ bottom: `${pos(t)}%` }} />
        ))}
        {data.map((d) => {
          const h = (Math.abs(d.value) / range) * 100;
          const neg = d.value < 0;
          return (
            <div key={d.key} className="col" tabIndex={0} aria-label={d.label}>
              <div
                className={["col-bar", neg ? "neg" : d.tone === "pos" ? "pos" : "", d.tone === "hi" ? "hi" : d.tone === "dim" ? "dim" : ""].join(" ")}
                style={neg ? { bottom: `${zero - h}%`, height: `${h}%` } : { bottom: `${zero}%`, height: `${Math.max(h, d.value > 0 ? 0.8 : 0)}%` }}
              />
              {d.showValue && (
                <span className="col-val" style={{ bottom: `${zero + h}%` }}>
                  {d.showValue}
                </span>
              )}
              <div className="tip">{d.tip}</div>
            </div>
          );
        })}
      </div>
      <div className="chart-x" aria-hidden="true">
        {data.map((d, i) => (
          <span key={d.key}>{i === data.length - 1 || (i % labelEvery === 0 && data.length - 1 - i >= labelEvery / 2) ? d.label : ""}</span>
        ))}
      </div>
    </div>
  );
}

export function HBars({ rows, format }: { rows: { label: string; value: number }[]; format: (v: number) => string }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <div className="hbars">
      {rows.map((r) => (
        <div key={r.label} className="hbar-row">
          <span className="muted">{r.label}</span>
          <div className="hbar-track">
            <div className="hbar-fill" style={{ width: `${(r.value / max) * 100}%` }} />
          </div>
          <span className="tnum">{format(r.value)}</span>
        </div>
      ))}
    </div>
  );
}
