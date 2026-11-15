import { createHash, createHmac, timingSafeEqual } from "node:crypto";

// Admin-Bereich: nur ein Passwort, kein Konto. Beides liegt nur auf dem Server (Vercel):
//   ADMIN_PASSWORD  das Passwort für /admin
//   KPO_TEAM_KEY    der Team-Schlüssel der App, damit der Server Finanzdaten aus Supabase lesen darf
// Das Cookie ist mit beiden signiert. Wer das Passwort ändert, meldet damit alle ab.

export const COOKIE = "kpo_admin";
export const MAX_AGE = 60 * 60 * 24 * 30; // 30 Tage

const password = () => process.env.ADMIN_PASSWORD ?? "";
export const teamKey = () => process.env.KPO_TEAM_KEY ?? "";

export function isConfigured(): boolean {
  return password().length >= 8 && teamKey().length > 0;
}

const sha = (s: string) => createHash("sha256").update(s).digest();

function sign(payload: string): string {
  const key = sha(`kpo-admin:${password()}:${teamKey()}`);
  return createHmac("sha256", key).update(payload).digest("base64url");
}

export function checkPassword(input: string): boolean {
  if (!isConfigured()) return false;
  return timingSafeEqual(sha(input), sha(password()));
}

export function newToken(): string {
  const payload = `v1.${Math.floor(Date.now() / 1000) + MAX_AGE}`;
  return `${payload}.${sign(payload)}`;
}

export function isValidToken(token: string | undefined): boolean {
  if (!token || !isConfigured()) return false;
  const [v, exp, sig] = token.split(".");
  if (v !== "v1" || !exp || !sig) return false;
  if (Number(exp) < Date.now() / 1000) return false;
  const expected = Buffer.from(sign(`${v}.${exp}`));
  const given = Buffer.from(sig);
  return expected.length === given.length && timingSafeEqual(expected, given);
}
