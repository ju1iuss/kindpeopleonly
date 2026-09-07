import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getSettings } from "@/lib/events";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Datenschutz",
  description: "Datenschutzerklärung von Kind People Only.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/datenschutz" },
};

export default async function DatenschutzPage() {
  const settings = await getSettings();

  return (
    <>
      <Header logoSrc={settings.logo} homeHref="/" />
      <main className="legal mx-auto max-w-[44rem] px-[clamp(1.25rem,4vw,3rem)] pt-[calc(var(--header-h)+clamp(2.5rem,6vw,4rem))] pb-[clamp(3rem,6vw,5rem)]">
        <h1 className="mb-8 font-display text-[clamp(2.5rem,7vw,4rem)] font-black leading-none uppercase">
          Datenschutz
        </h1>

        <h2 className="mt-10 mb-3 text-[1.1rem]">1. Verantwortliche Stelle</h2>
        <p className="mb-4 text-muted">
          <strong className="text-ink">
            <span className="rounded border border-dashed border-line bg-surface px-[0.45rem] py-[0.1rem] text-ink">
              [Name / Firma wie im Impressum]
            </span>
          </strong>
          <br />
          <span className="rounded border border-dashed border-line bg-surface px-[0.45rem] py-[0.1rem] text-ink">
            [Straße Hausnummer]
          </span>
          <br />
          <span className="rounded border border-dashed border-line bg-surface px-[0.45rem] py-[0.1rem] text-ink">
            [PLZ]
          </span>{" "}
          Karlsruhe
          <br />
          E-Mail:{" "}
          <a
            href={`mailto:${siteConfig.email}`}
            className="text-ink underline underline-offset-[3px]"
          >
            {siteConfig.email}
          </a>
        </p>

        <h2 className="mt-10 mb-3 text-[1.1rem]">2. Grundsätzliches</h2>
        <p className="mb-4 text-muted">
          Diese Website ist eine Informationsseite ohne Login und ohne Newsletter.
          Wir setzen <strong className="text-ink">keine Cookies</strong>, kein
          Tracking, keine Analyse-Tools und keine Social-Media-Plugins ein. Schriften
          und Medien werden von unserem eigenen Hosting ausgeliefert.
        </p>

        <h2 className="mt-10 mb-3 text-[1.1rem]">3. Server-Logfiles</h2>
        <p className="mb-4 text-muted">
          Beim Aufruf der Website verarbeitet unser Hosting-Anbieter (Vercel Inc.,
          440 N Barranca Ave #4133, Covina, CA 91723, USA) automatisch Informationen,
          die Ihr Browser übermittelt: IP-Adresse, Datum und Uhrzeit des Zugriffs,
          aufgerufene Datei, Browsertyp und Betriebssystem. Diese Daten dienen der
          technischen Bereitstellung und Sicherheit der Website (Rechtsgrundlage:
          Art. 6 Abs. 1 lit. f DSGVO) und werden nach den Vorgaben des Anbieters
          gelöscht bzw. anonymisiert.
        </p>

        <h2 className="mt-10 mb-3 text-[1.1rem]">4. Externe Ticketshops</h2>
        <p className="mb-4 text-muted">
          Tickets für unsere Veranstaltungen werden über externe Anbieter verkauft
          (z.&nbsp;B.{" "}
          <span className="rounded border border-dashed border-line bg-surface px-[0.45rem] py-[0.1rem] text-ink">
            [Eventbrite / ticket.io / rausgegangen.de]
          </span>
          ). Wenn Sie auf einen Ticket-Link klicken, verlassen Sie unsere Website.
          Für die dort stattfindende Datenverarbeitung ist ausschließlich der
          jeweilige Anbieter verantwortlich; es gilt dessen Datenschutzerklärung. Zur
          schnelleren Weiterleitung kann Ihr Browser bereits beim Überfahren eines
          Ticket-Links eine technische Verbindung zum Shop aufbauen; dabei werden
          keine personenbezogenen Daten durch uns übermittelt oder gespeichert.
        </p>

        <h2 className="mt-10 mb-3 text-[1.1rem]">5. Content-Management (Sanity)</h2>
        <p className="mb-4 text-muted">
          Zur Pflege von Event-Inhalten kann Sanity (Sanity AS, Norwegen) als
          Headless-CMS eingesetzt werden. Besucher der öffentlichen Website greifen
          dabei nur auf bereits veröffentlichte, nicht personenbezogene Inhalte zu.
          Das Redaktions-Studio unter <code className="text-ink">/studio</code> ist
          nur für berechtigte Personen gedacht.
        </p>

        <h2 className="mt-10 mb-3 text-[1.1rem]">6. Kontakt per E-Mail</h2>
        <p className="mb-4 text-muted">
          Wenn Sie uns per E-Mail kontaktieren, verarbeiten wir Ihre Angaben zur
          Bearbeitung der Anfrage (Art. 6 Abs. 1 lit. b bzw. f DSGVO). Die Daten
          werden gelöscht, sobald sie für die Bearbeitung nicht mehr erforderlich
          sind.
        </p>

        <h2 className="mt-10 mb-3 text-[1.1rem]">7. Ihre Rechte</h2>
        <p className="mb-4 text-muted">
          Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der
          Verarbeitung, Datenübertragbarkeit sowie Widerspruch (Art. 15–21 DSGVO).
          Außerdem besteht ein Beschwerderecht bei einer Datenschutz-Aufsichtsbehörde;
          für Baden-Württemberg ist dies der Landesbeauftragte für den Datenschutz und
          die Informationsfreiheit.
        </p>
      </main>
      <Footer email={settings.email} instagram={settings.instagram} />
    </>
  );
}
