import { revalidatePath, revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import { isTeamKey } from "@/lib/supabase";

// Wird von der KPO-App nach dem Speichern eines Events aufgerufen,
// damit Änderungen sofort statt erst nach ca. einer Minute sichtbar sind.
// Zugriff nur mit dem Team-Schlüssel der App (wird bei Supabase geprüft).
export async function POST(request: NextRequest) {
  const key = request.headers.get("x-kpo-key") ?? "";
  if (!(await isTeamKey(key))) {
    return Response.json({ ok: false }, { status: 401 });
  }

  revalidateTag("events", { expire: 0 });
  revalidatePath("/", "layout");

  return Response.json({ ok: true, revalidatedAt: new Date().toISOString() });
}
