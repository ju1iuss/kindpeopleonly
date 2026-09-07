import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getSettings } from "@/lib/events";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Impressum",
  description: "Impressum von Kind People Only.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/impressum" },
};

export default async function ImpressumPage() {
  const settings = await getSettings();

  return (
    <>
      <Header logoSrc={settings.logo} homeHref="/" />
      <main className="legal mx-auto max-w-[44rem] px-[clamp(1.25rem,4vw,3rem)] pt-[calc(var(--header-h)+clamp(2.5rem,6vw,4rem))] pb-[clamp(3rem,6vw,5rem)]">
        <h1 className="mb-8 font-display text-[clamp(2.5rem,7vw,4rem)] font-black leading-none uppercase">
          Impressum
        </h1>

        <h2 className="mt-10 mb-3 text-[1.1rem]">Angaben gemäß § 5 DDG</h2>
        <p className="mb-4 text-muted">
          <strong className="text-ink">
            <span className="rounded border border-dashed border-line bg-surface px-[0.45rem] py-[0.1rem] text-ink">
              [Name / Firma, z. B. Kind People Only GbR]
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
        </p>

        <h2 className="mt-10 mb-3 text-[1.1rem]">Vertreten durch</h2>
        <p className="mb-4 text-muted">
          <span className="rounded border border-dashed border-line bg-surface px-[0.45rem] py-[0.1rem] text-ink">
            [Vor- und Nachname(n) der Vertretungsberechtigten]
          </span>
        </p>

        <h2 className="mt-10 mb-3 text-[1.1rem]">Kontakt</h2>
        <p className="mb-4 text-muted">
          Telefon:{" "}
          <span className="rounded border border-dashed border-line bg-surface px-[0.45rem] py-[0.1rem] text-ink">
            [Telefonnummer]
          </span>
          <br />
          E-Mail:{" "}
          <a
            href={`mailto:${siteConfig.email}`}
            className="text-ink underline underline-offset-[3px]"
          >
            {siteConfig.email}
          </a>
        </p>

        <h2 className="mt-10 mb-3 text-[1.1rem]">Umsatzsteuer-ID</h2>
        <p className="mb-4 text-muted">
          Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG:{" "}
          <span className="rounded border border-dashed border-line bg-surface px-[0.45rem] py-[0.1rem] text-ink">
            [USt-IdNr., falls vorhanden – sonst Abschnitt löschen]
          </span>
        </p>

        <h2 className="mt-10 mb-3 text-[1.1rem]">
          Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV
        </h2>
        <p className="mb-4 text-muted">
          <span className="rounded border border-dashed border-line bg-surface px-[0.45rem] py-[0.1rem] text-ink">
            [Vor- und Nachname]
          </span>
          <br />
          <span className="rounded border border-dashed border-line bg-surface px-[0.45rem] py-[0.1rem] text-ink">
            [Anschrift wie oben]
          </span>
        </p>

        <h2 className="mt-10 mb-3 text-[1.1rem]">Hinweis zum Ticketverkauf</h2>
        <p className="mb-4 text-muted">
          Der Ticketverkauf erfolgt nicht über diese Website, sondern über externe
          Anbieter (z.&nbsp;B.{" "}
          <span className="rounded border border-dashed border-line bg-surface px-[0.45rem] py-[0.1rem] text-ink">
            [Eventbrite / ticket.io / rausgegangen.de]
          </span>
          ). Für den Kaufvorgang gelten die Bedingungen des jeweiligen Anbieters.
        </p>

        <h2 className="mt-10 mb-3 text-[1.1rem]">Streitbeilegung</h2>
        <p className="mb-4 text-muted">
          Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor
          einer Verbraucherschlichtungsstelle teilzunehmen.
        </p>
      </main>
      <Footer email={settings.email} instagram={settings.instagram} />
    </>
  );
}
