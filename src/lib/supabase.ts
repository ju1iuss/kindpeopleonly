import type { Event, EventStatus, FlyerAspect } from "@/lib/types";

// Events werden in der KPO-App gepflegt und liegen in Supabase.
// Der Publishable Key ist für den öffentlichen Einsatz gedacht; die Website
// sieht nur öffentliche Events über die Funktion `website_events`.
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mmusokbogqzgwfpxzpoa.supabase.co";
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  "sb_publishable_uUFpEMQAQMl0smaprYeqsA_KB965TtT";

export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseKey);
}

type WebsiteEventRow = {
  id: string;
  titel: string;
  datum: string;
  uhrzeit: string | null;
  location: string;
  flyer: string;
  flyer_aspect: string | null;
  ticket_url: string | null;
  status: string;
  info: string | null;
  musik: string | null;
  lineup: string | null;
  einlass: string | null;
  preis: string | null;
  adresse: string | null;
};

export type RemoteEvent = Partial<Event>;

/** Prüft den Team-Schlüssel der App: Nur damit liefert Supabase Team-Daten. */
export async function isTeamKey(teamKey: string): Promise<boolean> {
  if (!teamKey || !isSupabaseConfigured()) return false;
  const headers: Record<string, string> = { apikey: supabaseKey, "x-kpo-key": teamKey };
  if (!supabaseKey.startsWith("sb_")) headers.Authorization = `Bearer ${supabaseKey}`;
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/people?select=id&limit=1`, {
      headers,
      cache: "no-store",
    });
    if (!res.ok) return false;
    const rows = (await res.json()) as unknown[];
    return rows.length > 0;
  } catch {
    return false;
  }
}

/** Öffentliche Events aus der App, oder `null`, wenn Supabase nicht erreichbar ist. */
export async function fetchWebsiteEvents(): Promise<RemoteEvent[] | null> {
  if (!isSupabaseConfigured()) return null;

  const headers: Record<string, string> = { apikey: supabaseKey };
  if (!supabaseKey.startsWith("sb_")) headers.Authorization = `Bearer ${supabaseKey}`;

  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/rpc/website_events`, {
      headers,
      next: { revalidate: 60, tags: ["events"] },
    });
    if (!res.ok) return null;
    const rows = (await res.json()) as WebsiteEventRow[];
    return rows.map((r) => ({
      id: r.id,
      titel: r.titel,
      datum: r.datum,
      uhrzeit: r.uhrzeit ?? undefined,
      location: r.location,
      flyer: r.flyer,
      flyerAspect: (r.flyer_aspect ?? undefined) as FlyerAspect | undefined,
      ticketUrl: r.ticket_url ?? "",
      // unbekannte Werte fängt normalizeEvent ab
      status: r.status as EventStatus,
      info: r.info ?? undefined,
      musik: r.musik ?? undefined,
      lineup: r.lineup ?? undefined,
      einlass: r.einlass ?? undefined,
      preis: r.preis ?? undefined,
      adresse: r.adresse ?? undefined,
    }));
  } catch {
    return null;
  }
}
