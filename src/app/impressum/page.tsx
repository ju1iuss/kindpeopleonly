import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Impressum",
  description: "Impressum von Kind People Only.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/impressum" },
};

export default function ImpressumPage() {
  return (
    <>
      <Header homeHref="/" />
      <main className="legal mx-auto max-w-[44rem] px-[clamp(1.25rem,4vw,3rem)] pt-[calc(var(--header-h)+clamp(2.5rem,6vw,4rem))] pb-[clamp(3rem,6vw,5rem)]">
        <h1 className="mb-8 font-display text-[clamp(2.5rem,7vw,4rem)] font-black leading-none uppercase">Impressum</h1>
        <div className="space-y-10 text-sm leading-relaxed text-muted">
          <section>
            <address className="not-italic text-ink">
              <p>Kindpeopleonly GmbH i.G.</p>
              <p>Organisation und Durchführung von Veranstaltungen mit dem Schwerpunkt Musik</p>
              <p>Kanalweg 46</p>
              <p>76149 Karlsruhe</p>
            </address>
          </section>
          <section>
            <h2 className="mb-3 text-base font-semibold text-ink">Kontakt</h2>
            <p>Telefon: <a href="tel:+4915755048076" className="text-ink underline underline-offset-2">+49 157 55048076</a></p>
            <p>E-Mail: <a href="mailto:info@foreverstudios.xyz" className="text-ink underline underline-offset-2">info@foreverstudios.xyz</a></p>
          </section>
          <section>
            <h2 className="mb-3 text-base font-semibold text-ink">Redaktionell verantwortlich</h2>
            <address className="not-italic text-ink"><p>Kindpeopleonly GmbH i.G.</p><p>Kanalweg 46</p><p>76149 Karlsruhe</p></address>
          </section>
          <section>
            <h2 className="mb-3 text-base font-semibold text-ink">Verbraucherstreitbeilegung</h2>
            <p>Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>
          </section>
          <p>Für Rückfragen nutze bitte die <Link href="/kontakt" className="text-ink underline underline-offset-2">Kontaktseite</Link>.</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
