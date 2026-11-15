import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE, isConfigured, isValidToken } from "@/lib/admin/session";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Anmelden" };

export default async function LoginPage() {
  if (isValidToken((await cookies()).get(COOKIE)?.value)) redirect("/admin");
  return (
    <main className="adm adm-login" lang="de">
      <div className="login-card">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/logo.png" alt="kindpeopleonly" />
        <h1>Admin</h1>
        <p>Finanzen und Events für das Team.</p>
        {isConfigured() ? (
          <LoginForm />
        ) : (
          <p className="login-error">
            Noch nicht eingerichtet: ADMIN_PASSWORD und KPO_TEAM_KEY fehlen in Vercel.
          </p>
        )}
      </div>
    </main>
  );
}
