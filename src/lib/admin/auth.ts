import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE, isValidToken } from "@/lib/admin/session";

/** Für Layouts, Seiten und Server-Actions: ohne gültiges Cookie zurück zum Login. */
export const requireAdmin = cache(async () => {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!isValidToken(token)) redirect("/admin/login");
  return true;
});
