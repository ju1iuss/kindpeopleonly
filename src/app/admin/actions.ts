"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { COOKIE, MAX_AGE, checkPassword, isConfigured, newToken, teamKey } from "@/lib/admin/session";
import { requireAdmin } from "@/lib/admin/auth";
import { supabaseKey, supabaseUrl } from "@/lib/supabase";

export type LoginState = { error?: string } | undefined;

export async function login(_: LoginState, formData: FormData): Promise<LoginState> {
  if (!isConfigured()) return { error: "Admin ist noch nicht eingerichtet." };
  const input = String(formData.get("password") ?? "");
  if (!checkPassword(input)) {
    // Bremst Raten aus.
    await new Promise((r) => setTimeout(r, 900));
    return { error: "Falsches Passwort." };
  }
  (await cookies()).set(COOKIE, newToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin",
    maxAge: MAX_AGE,
  });
  redirect("/admin");
}

export async function logout() {
  (await cookies()).set(COOKIE, "", { path: "/admin", maxAge: 0 });
  redirect("/admin/login");
}

/** Holt neue Zahlen aus Qonto und Luma (höchstens alle 2 Minuten, wie in der App). */
export async function refresh() {
  await requireAdmin();
  try {
    await fetch(`${supabaseUrl}/functions/v1/finance-sync`, {
      method: "POST",
      headers: { apikey: supabaseKey, "x-kpo-key": teamKey(), "content-type": "application/json" },
      body: "{}",
      cache: "no-store",
      signal: AbortSignal.timeout(25_000),
    });
  } catch {
    // Zeigt dann einfach den letzten Stand.
  }
  revalidatePath("/admin", "layout");
}
