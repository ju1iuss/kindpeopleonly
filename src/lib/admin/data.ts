import { cache } from "react";
import { requireAdmin } from "@/lib/admin/auth";
import { teamKey } from "@/lib/admin/session";
import { supabaseKey, supabaseUrl } from "@/lib/supabase";

// Finanzdaten für /admin. Gleiche Quellen und Regeln wie die App (ios/KPO/Finance.swift):
// Qonto (Konto, Buchungen, Rechnungen) und Luma füllt die Edge Function finance-sync,
// Kalkulation und Barposten kommen aus finance_items, Belege aus receipts.

// MARK: - Zeilen aus Supabase

export type KEvent = {
  id: string; titel: string; datum: string; uhrzeit: string | null; location: string;
  ticket_url: string | null; status: string; is_public: boolean; source_id: string | null;
};
export type LumaType = { name: string; price: number | null; sold: number; revenue: number };
export type Luma = {
  id: string; name: string | null; start_at: string | null; url: string | null; capacity: number | null;
  tickets: number | null; checked_in: number | null; revenue: number | null; fees: number | null;
  ticket_types: LumaType[] | null; sales: { d: string; n: number }[] | null; stats_at: string | null;
  visibility: string | null;
};
export type Item = {
  id: string; event_id: string; kind: "in" | "out"; label: string; amount: number; category: string | null;
  planned: boolean | null; qty: number | null; unit_price: number | null; fee: string | null; note: string | null;
  sort: number | null;
};
export type Tx = {
  id: string; amount: number; side: "credit" | "debit"; label: string | null; reference: string | null;
  status: string | null; emitted_at: string | null; settled_at: string | null; initiator: string | null;
  event_id: string | null; category: string | null; receipt_id: string | null; attachment_count: number | null;
};
export type Receipt = {
  id: string; event_id: string | null; title: string; note: string | null; amount: number | null;
  paid_by: string | null; date: string; in_qonto: boolean; transaction_id: string | null;
};
export type Invoice = {
  id: string; kind: "supplier" | "client"; party: string | null; number: string | null; amount: number;
  status: string | null; issue_date: string | null; due_date: string | null;
};
export type Account = {
  id: string; name: string | null; iban: string | null; balance: number | null;
  authorized_balance: number | null; is_main: boolean | null;
};
export type Sync = { key: string; synced_at: string | null; ok: boolean | null; message: string | null };
export type Sale = { id: string; event_id: string | null; tickets: number; amount: number; created_at: string };
export type Person = { id: string; name: string };

async function get<T>(path: string): Promise<T[]> {
  const res = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
    headers: { apikey: supabaseKey, "x-kpo-key": teamKey() },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Supabase ${path.split("?")[0]}: ${res.status}`);
  const rows = (await res.json()) as T[];
  // numeric kommt als Zahl, aber sicher ist sicher
  return rows;
}

const num = (v: unknown) => (v == null ? 0 : Number(v));

export const loadAll = cache(async () => {
  await requireAdmin();
  const [events, luma, items, txs, receipts, invoices, accounts, sync, sales, people] = await Promise.all([
    get<KEvent>("events?select=id,titel,datum,uhrzeit,location,ticket_url,status,is_public,source_id&order=datum.desc"),
    get<Luma>("luma_events?select=id,name,start_at,url,capacity,tickets,checked_in,revenue,fees,ticket_types,sales,stats_at,visibility&order=start_at.desc"),
    get<Item>("finance_items?select=id,event_id,kind,label,amount,category,planned,qty,unit_price,fee,note,sort&order=sort.asc"),
    get<Tx>("bank_transactions?select=id,amount,side,label,reference,status,emitted_at,settled_at,initiator,event_id,category,receipt_id,attachment_count&order=emitted_at.desc&limit=2000"),
    get<Receipt>("receipts?select=id,event_id,title,note,amount,paid_by,date,in_qonto,transaction_id&order=date.desc"),
    get<Invoice>("open_invoices?select=id,kind,party,number,amount,status,issue_date,due_date&order=due_date.asc"),
    get<Account>("bank_accounts?select=id,name,iban,balance,authorized_balance,is_main"),
    get<Sync>("sync_state?select=key,synced_at,ok,message"),
    get<Sale>("luma_sales?select=id,event_id,tickets,amount,created_at&order=created_at.desc&limit=50"),
    get<Person>("people?select=id,name&order=sort.asc"),
  ]);
  return {
    events,
    luma: luma.map((l) => ({ ...l, revenue: num(l.revenue), fees: num(l.fees) })),
    items: items.map((i) => ({ ...i, amount: num(i.amount), qty: i.qty == null ? null : num(i.qty), unit_price: i.unit_price == null ? null : num(i.unit_price) })),
    txs: txs.map((t) => ({ ...t, amount: num(t.amount) })),
    receipts: receipts.map((r) => ({ ...r, amount: r.amount == null ? null : num(r.amount) })),
    invoices: invoices.map((i) => ({ ...i, amount: num(i.amount) })),
    accounts: accounts.map((a) => ({ ...a, balance: a.balance == null ? null : num(a.balance), authorized_balance: a.authorized_balance == null ? null : num(a.authorized_balance) })),
    sync,
    sales: sales.map((s) => ({ ...s, amount: num(s.amount) })),
    people,
  };
});

export type Data = Awaited<ReturnType<typeof loadAll>>;

// MARK: - Datum (Berlin)

const dayFmt = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Berlin", year: "numeric", month: "2-digit", day: "2-digit" });
const timeFmt = new Intl.DateTimeFormat("de-DE", { timeZone: "Europe/Berlin", hour: "2-digit", minute: "2-digit" });

export const berlinDay = (d: Date | string) => dayFmt.format(typeof d === "string" ? new Date(d) : d);
export const berlinTime = (d: Date | string) => timeFmt.format(typeof d === "string" ? new Date(d) : d);
export const today = () => berlinDay(new Date());

export function addDays(day: string, n: number): string {
  const d = new Date(`${day}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

export function daysBetween(a: string, b: string): number {
  return Math.round((Date.parse(`${b}T12:00:00Z`) - Date.parse(`${a}T12:00:00Z`)) / 86_400_000);
}

// MARK: - Kategorien (wie in der App)

export const INCOME = [
  ["tickets", "Tickets"], ["abendkasse", "Abendkasse"], ["garderobe", "Garderobe"],
  ["sponsoring", "Sponsoring"], ["sonstiges", "Sonstiges"],
] as const;
export const COSTS = [
  ["technik", "Technik"], ["infrastruktur", "Infrastruktur"], ["personal", "Personal"],
  ["security", "Security"], ["location", "Location"], ["versicherung", "Versicherung"],
  ["marketing", "Marketing"], ["wareneinsatz", "Wareneinsatz"], ["sonstiges", "Weitere"],
] as const;

export function normalized(id: string | null, income: boolean): string {
  if (!id) return "sonstiges";
  const list = income ? INCOME : COSTS;
  if (list.some(([k]) => k === id)) return id;
  if (!income && id === "bar") return "wareneinsatz";
  if (!income && id === "artists") return "personal";
  return "sonstiges";
}

export function categoryLabel(id: string | null, income: boolean): string {
  if (id === "fixkosten") return "Fixkosten";
  if (id === "intern") return "Nicht zählen";
  if (!id) return "Nicht zugeordnet";
  const n = normalized(id, income);
  return (income ? INCOME : COSTS).find(([k]) => k === n)?.[1] ?? "Sonstiges";
}

/** Stripe 1,5 % + 0,25 € pro Ticket, Kartenzahlung 1,39 % (wie im Sheet). */
function itemNet(i: Item): number {
  if (i.kind !== "in") return i.amount;
  if (i.fee === "online") return i.amount - i.amount * 0.015 - (i.qty ?? 0) * 0.25;
  if (i.fee === "karte") return i.amount - i.amount * 0.0139;
  return i.amount;
}

export const counts = (t: Tx) => t.status !== "declined" && t.status !== "reversed";
export const txDay = (t: Tx) => berlinDay(t.emitted_at ?? t.settled_at ?? new Date().toISOString());
export const txTitle = (t: Tx) => t.label || t.reference || "Buchung";

// MARK: - Events: App-Event + Luma zusammen

export function cleanTitle(name: string): string {
  let t = name.replace(/\s*[-–—|·:]\s*kind\s*people\s*only\s*$/i, "").trim() || name.trim();
  if (t === t.toUpperCase() && /[A-ZÄÖÜ]/.test(t)) {
    t = t.toLowerCase().replace(/(^|\s)(\p{L})/gu, (_, s: string, c: string) => s + c.toUpperCase());
  }
  return t;
}

function slugOf(url: string | null): string | null {
  if (!url) return null;
  try {
    const u = new URL(url.includes("://") ? url : `https://${url}`);
    const last = u.pathname.split("/").filter(Boolean).pop();
    return last ? last.toLowerCase() : null;
  } catch {
    return null;
  }
}

export type Line = { title: string; detail?: string; amount: number; source: "plan" | "bar" | "konto" | "luma" | "beleg" | "gebuehr"; counted?: boolean };
export type Cat = { id: string; label: string; plan: number; actual: number; planLines: Line[]; actualLines: Line[] };

export type FinEvent = {
  key: string;
  kpo?: KEvent;
  luma?: Luma;
  title: string;
  day: string;
  time?: string;
  location?: string;
  url?: string;
  upcoming: boolean;
  tickets: number;
  capacity: number | null;
  checkedIn: number;
  gross: number;
  fees: number;
  ticketTypes: LumaType[];
  sales: { d: string; n: number }[];
  income: Cat[];
  costs: Cat[];
  planIncome: number;
  planCosts: number;
  actualIncome: number;
  actualCosts: number;
  openReceipts: number;
  planTickets: number;
  planTicketNet: number;
};

export const net = (e: FinEvent) => e.gross - e.fees;
export const hasPlan = (e: FinEvent) => e.planIncome !== 0 || e.planCosts !== 0;
export const planResult = (e: FinEvent) => e.planIncome - e.planCosts;
export const actualResult = (e: FinEvent) => e.actualIncome - e.actualCosts;

/** Ab so vielen Tickets (zum Ø-Netto-Preis) sind die Kosten gedeckt. */
export function breakEven(e: FinEvent): number | null {
  const costs = hasPlan(e) ? e.planCosts : e.actualCosts;
  let avg = e.planTickets > 0 ? e.planTicketNet / e.planTickets : 0;
  if (avg <= 0 && e.tickets > 0) avg = net(e) / e.tickets;
  if (costs <= 0 || avg <= 0) return null;
  return Math.ceil(costs / avg);
}

/** Verkaufte Tickets bis `days` Tage vor dem Event. */
export function soldBefore(e: FinEvent, days: number): number | null {
  if (!e.sales.length) return null;
  const cutoff = addDays(e.day, -days);
  return e.sales.filter((s) => s.d <= cutoff).reduce((a, s) => a + s.n, 0);
}

export function buildEvents(data: Data): FinEvent[] {
  const now = today();
  const usedLuma = new Set<string>();

  const lumaFor = (e: KEvent): Luma | undefined => {
    const bySource = e.source_id ? data.luma.find((l) => l.id === e.source_id) : undefined;
    if (bySource) return bySource;
    const slug = slugOf(e.ticket_url);
    const bySlug = slug ? data.luma.find((l) => slugOf(l.url) === slug) : undefined;
    if (bySlug) return bySlug;
    return data.luma.find((l) => l.start_at && berlinDay(l.start_at) === e.datum && !usedLuma.has(l.id));
  };

  const base: { key: string; kpo?: KEvent; luma?: Luma }[] = [];
  for (const e of data.events) {
    const l = lumaFor(e);
    if (l) usedLuma.add(l.id);
    base.push({ key: e.id, kpo: e, luma: l });
  }
  for (const l of data.luma) {
    if (usedLuma.has(l.id) || !l.start_at) continue;
    base.push({ key: l.id, luma: l });
  }

  const linked = new Set(data.txs.filter((t) => t.receipt_id).map((t) => t.receipt_id));

  return base
    .map(({ key, kpo, luma }) => {
      const day = kpo?.datum ?? berlinDay(luma!.start_at!);
      const stats = luma?.stats_at ? luma : undefined;
      const ev: FinEvent = {
        key, kpo, luma,
        title: kpo?.titel ?? cleanTitle(luma?.name ?? "Event"),
        day,
        time: kpo?.uhrzeit ?? (luma?.start_at ? berlinTime(luma.start_at) : undefined),
        location: kpo?.location || undefined,
        url: luma?.url ?? kpo?.ticket_url ?? undefined,
        upcoming: day >= now,
        tickets: stats?.tickets ?? 0,
        capacity: luma?.capacity ?? null,
        checkedIn: stats?.checked_in ?? 0,
        gross: stats?.revenue ?? 0,
        fees: stats?.fees ?? 0,
        ticketTypes: (stats?.ticket_types ?? []).map((t) => ({ ...t, revenue: num(t.revenue), price: t.price == null ? null : num(t.price) })),
        sales: [...(stats?.sales ?? [])].sort((a, b) => a.d.localeCompare(b.d)),
        income: [], costs: [],
        planIncome: 0, planCosts: 0, actualIncome: 0, actualCosts: 0, openReceipts: 0,
        planTickets: 0, planTicketNet: 0,
      };
      if (!kpo) {
        // Nur Luma: Ticketumsatz ist alles, was wir wissen.
        const c: Cat = { id: "tickets", label: "Tickets", plan: 0, actual: net(ev), planLines: [], actualLines: [] };
        ev.income = [c];
        ev.actualIncome = c.actual;
        return ev;
      }
      const items = data.items.filter((i) => i.event_id === kpo.id);
      const txs = data.txs.filter((t) => t.event_id === kpo.id && counts(t) && t.category && t.category !== "intern");

      for (const [id, label] of INCOME) {
        const c: Cat = { id, label, plan: 0, actual: 0, planLines: [], actualLines: [] };
        for (const i of items) {
          if (i.kind !== "in" || normalized(i.category, true) !== id) continue;
          const detail = [i.qty != null ? `${fmtQty(i.qty)} × ${eur(i.unit_price ?? 0, 2)}` : null, i.fee === "online" ? "Online" : i.fee === "karte" ? "Karte" : null, i.note]
            .filter(Boolean).join(" · ");
          const line: Line = { title: i.label, detail, amount: itemNet(i), source: i.planned ? "plan" : "bar" };
          if (i.planned) {
            c.planLines.push(line);
            if (id === "tickets" || id === "abendkasse") {
              ev.planTickets += i.qty ?? 0;
              ev.planTicketNet += itemNet(i);
            }
          } else c.actualLines.push(line);
        }
        if (id === "tickets" && stats) {
          for (const t of ev.ticketTypes.filter((t) => t.sold > 0)) {
            c.actualLines.push({ title: t.name, detail: `${t.sold} × · Luma`, amount: t.revenue, source: "luma" });
          }
          if (ev.fees > 0) c.actualLines.push({ title: "Stripe-Gebühren", detail: "geschätzt", amount: -ev.fees, source: "gebuehr" });
        }
        for (const t of txs) {
          if (t.side !== "credit" || normalized(t.category, true) !== id) continue;
          const inLuma = id === "tickets" && !!stats;
          c.actualLines.push({ title: txTitle(t), detail: inLuma ? "Auszahlung, in Luma enthalten" : fmtDay(txDay(t)), amount: t.amount, source: "konto", counted: !inLuma });
        }
        c.plan = sum(c.planLines);
        c.actual = sum(c.actualLines.filter((l) => l.counted !== false));
        ev.income.push(c);
      }

      for (const [id, label] of COSTS) {
        const c: Cat = { id, label, plan: 0, actual: 0, planLines: [], actualLines: [] };
        for (const i of items) {
          if (i.kind !== "out" || normalized(i.category, false) !== id) continue;
          const line: Line = { title: i.label, detail: i.note ?? undefined, amount: i.amount, source: i.planned ? "plan" : "bar" };
          (i.planned ? c.planLines : c.actualLines).push(line);
        }
        for (const t of txs) {
          if (t.side !== "debit" || normalized(t.category, false) !== id) continue;
          c.actualLines.push({ title: txTitle(t), detail: [fmtDay(txDay(t)), t.initiator].filter(Boolean).join(" · "), amount: t.amount, source: "konto" });
        }
        c.plan = sum(c.planLines);
        c.actual = sum(c.actualLines);
        ev.costs.push(c);
      }

      // Belege ohne Qonto-Buchung (bar oder privat bezahlt)
      const loose = data.receipts.filter((r) => r.event_id === kpo.id && (r.amount ?? 0) > 0 && !r.transaction_id && !linked.has(r.id));
      if (loose.length) {
        const c: Cat = { id: "belege", label: "Belege ohne Buchung", plan: 0, actual: 0, planLines: [], actualLines: [] };
        c.actualLines = loose.map((r) => ({ title: r.note || r.title || "Beleg", detail: fmtDay(r.date), amount: r.amount ?? 0, source: "beleg" as const }));
        c.actual = sum(c.actualLines);
        ev.openReceipts = c.actual;
        ev.costs.push(c);
      }

      ev.planIncome = ev.income.reduce((a, c) => a + c.plan, 0);
      ev.actualIncome = ev.income.reduce((a, c) => a + c.actual, 0);
      ev.planCosts = ev.costs.reduce((a, c) => a + c.plan, 0);
      ev.actualCosts = ev.costs.reduce((a, c) => a + c.actual, 0);
      return ev;
    })
    .sort((a, b) => b.day.localeCompare(a.day));
}

const sum = (lines: Line[]) => lines.reduce((a, l) => a + l.amount, 0);

// MARK: - Konto

export function cashOverview(data: Data, events: FinEvent[]) {
  const main = data.accounts.filter((a) => a.is_main);
  const balance = (main.length ? main : data.accounts).reduce((a, x) => a + (x.authorized_balance ?? x.balance ?? 0), 0);
  const supplier = data.invoices.filter((i) => i.kind === "supplier");
  const payables = supplier.reduce((a, i) => a + i.amount, 0);
  const receivables = data.invoices.filter((i) => i.kind === "client").reduce((a, i) => a + i.amount, 0);
  let plannedCosts = 0;
  let plannedIncome = 0;
  for (const e of events.filter((e) => e.upcoming && e.kpo)) {
    plannedCosts += Math.max(0, e.planCosts - (e.actualCosts - e.openReceipts));
    plannedIncome += Math.max(0, e.planIncome - e.actualIncome);
  }
  const free = balance - payables - plannedCosts;
  return { connected: data.accounts.length > 0, balance, payables, payablesCount: supplier.length, receivables, plannedCosts, plannedIncome, free, withIncome: free + receivables + plannedIncome };
}

export function months(data: Data, count = 12) {
  const now = today().slice(0, 7);
  const keys: string[] = [];
  const d = new Date(`${now}-15T12:00:00Z`);
  for (let i = count - 1; i >= 0; i--) {
    const m = new Date(d);
    m.setUTCMonth(d.getUTCMonth() - i);
    keys.push(m.toISOString().slice(0, 7));
  }
  return keys.map((k) => {
    const txs = data.txs.filter((t) => counts(t) && t.category !== "intern" && txDay(t).startsWith(k));
    const inc = txs.filter((t) => t.side === "credit").reduce((a, t) => a + t.amount, 0);
    const out = txs.filter((t) => t.side === "debit").reduce((a, t) => a + t.amount, 0);
    return { key: k, label: monthLabel(k), inc, out, saldo: inc - out };
  });
}

// MARK: - Format

const eurFmt = [0, 1, 2].map((d) => new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", minimumFractionDigits: d, maximumFractionDigits: d }));
export const eur = (v: number, decimals: 0 | 1 | 2 = 0) => eurFmt[decimals].format(v);
export const signedEur = (v: number, decimals: 0 | 2 = 0) => (v > 0 ? "+" : v < 0 ? "−" : "") + eur(Math.abs(v), decimals);
export const int = (v: number) => new Intl.NumberFormat("de-DE").format(Math.round(v));
export const pct = (v: number) => `${Math.round(v * 100)} %`;
const fmtQty = (v: number) => (Number.isInteger(v) ? String(v) : v.toLocaleString("de-DE"));

const MONTHS = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];
const MONTHS_LONG = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
const WEEKDAYS = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
export const monthLabel = (k: string) => `${MONTHS[Number(k.slice(5, 7)) - 1]} ${k.slice(2, 4)}`;
export const monthLong = (k: string) => `${MONTHS_LONG[Number(k.slice(5, 7)) - 1]} ${k.slice(0, 4)}`;
export function fmtDay(day: string, withYear = true): string {
  const [y, m, d] = day.split("-").map(Number);
  return `${d}. ${MONTHS[m - 1]}${withYear ? ` ${y}` : ""}`;
}
/** 5.7. */
export function fmtShort(day: string): string {
  const [, m, d] = day.split("-").map(Number);
  return `${d}.${m}.`;
}
export function fmtWeekday(day: string): string {
  const [y, m, d] = day.split("-").map(Number);
  return WEEKDAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
}
export function relDays(day: string): string {
  const n = daysBetween(today(), day);
  if (n === 0) return "heute";
  if (n === 1) return "morgen";
  if (n === -1) return "gestern";
  return n > 0 ? `in ${n} Tagen` : `vor ${-n} Tagen`;
}
export function ago(iso: string | null): string {
  if (!iso) return "nie";
  const min = Math.round((Date.now() - Date.parse(iso)) / 60_000);
  if (min < 1) return "gerade eben";
  if (min < 60) return `vor ${min} Min.`;
  const day = berlinDay(iso);
  if (day === today()) return `heute ${berlinTime(iso)}`;
  if (day === addDays(today(), -1)) return `gestern ${berlinTime(iso)}`;
  return `${fmtDay(day)} ${berlinTime(iso)}`;
}
