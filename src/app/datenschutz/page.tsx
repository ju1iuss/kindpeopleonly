import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { KpoText } from "@/components/KpoText";

export const metadata: Metadata = {
  title: "Datenschutz",
  description: "Datenschutzerklärung von Kind People Only.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/datenschutz" },
};

const sections = [
  ["1. Datenschutz auf einen Blick", "Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können. Daten werden erhoben, wenn Sie sie mitteilen, etwa über eine Kontaktanfrage, oder automatisch durch unsere IT-Systeme, etwa technische Daten wie Browser, Betriebssystem und Zeitpunkt des Seitenaufrufs. Die Verarbeitung dient der fehlerfreien Bereitstellung der Website, der Kommunikation und — soweit angeboten — der Abwicklung von Verträgen und Ticketanfragen."],
  ["2. Hosting", "Diese Website wird extern über Vercel gehostet. Personenbezogene Daten, die auf dieser Website erfasst werden, können auf den Servern des Hosters gespeichert werden. Das Hosting erfolgt zur Vertragserfüllung gemäß Art. 6 Abs. 1 lit. b DSGVO und im berechtigten Interesse an einer sicheren, schnellen und effizienten Bereitstellung gemäß Art. 6 Abs. 1 lit. f DSGVO. Wir haben, soweit erforderlich, einen Vertrag über Auftragsverarbeitung geschlossen."],
  ["3. Verantwortliche Stelle und allgemeine Hinweise", "Verantwortlicher ist Aaron Martin, Kanalweg 46, 76149 Karlsruhe. Telefon: +49 157 55048076. E-Mail: info@foreverstudios.xyz. Wir behandeln personenbezogene Daten vertraulich und entsprechend den gesetzlichen Datenschutzvorschriften. Eine lückenlose Sicherheit der Datenübertragung im Internet kann nicht garantiert werden."],
  ["4. Speicherdauer und Rechtsgrundlagen", "Soweit keine speziellere Speicherdauer genannt wird, verbleiben Daten bei uns, bis der Zweck entfällt oder gesetzliche Aufbewahrungsfristen ablaufen. Je nach Vorgang erfolgt die Verarbeitung auf Grundlage von Art. 6 Abs. 1 lit. a, b, c oder f DSGVO sowie — soweit erforderlich — § 25 Abs. 1 TDDDG. Einwilligungen können jederzeit mit Wirkung für die Zukunft widerrufen werden."],
  ["5. Ihre Rechte", "Sie haben im Rahmen der gesetzlichen Bestimmungen das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch. Zur Ausübung Ihrer Rechte genügt eine Nachricht an info@foreverstudios.xyz. Außerdem besteht ein Beschwerderecht bei einer Datenschutzaufsichtsbehörde."],
  ["6. Cookies", "Unsere Website kann technisch notwendige Cookies oder vergleichbare Technologien verwenden. Nicht notwendige Cookies und Zugriffe auf Informationen im Endgerät setzen wir nur mit der erforderlichen Einwilligung ein. Sie können Ihren Browser so einstellen, dass Cookies nur im Einzelfall erlaubt oder beim Schließen gelöscht werden."],
  ["7. Google Maps", "Soweit Google Maps eingebunden wird, können beim Aufruf des Kartenbereichs Daten, insbesondere die IP-Adresse, an Google Ireland Limited übertragen werden. Die Einbindung erfolgt nur mit der erforderlichen Einwilligung beziehungsweise auf Grundlage eines berechtigten Interesses an der Darstellung von Veranstaltungsorten. Weitere Informationen finden Sie in der Datenschutzerklärung von Google unter https://policies.google.com/privacy?hl=de."],
  ["8. Kontakt und Ticketanfragen", "Wenn Sie uns per E-Mail oder über die Kontaktseite erreichen, verarbeiten wir die mitgeteilten Daten zur Bearbeitung der Anfrage. Für Ticketkäufe oder externe Zahlungs- und Ticketanbieter gelten zusätzlich deren Datenschutzbestimmungen. Die Daten werden gelöscht, sobald sie für den Zweck nicht mehr erforderlich sind und keine gesetzlichen Aufbewahrungspflichten entgegenstehen."],
];

export default function DatenschutzPage() {
  return (
    <>
      <Header homeHref="/" />
      <main className="legal mx-auto max-w-[44rem] px-[clamp(1.25rem,4vw,3rem)] pt-[calc(var(--header-h)+clamp(2.5rem,6vw,4rem))] pb-[clamp(3rem,6vw,5rem)]">
        <h1 className="mb-8 font-display text-[clamp(2.5rem,7vw,4rem)] leading-none uppercase"><KpoText text="Datenschutzerklärung" /></h1>
        <div className="space-y-10 text-sm leading-relaxed text-muted">
          {sections.map(([title, content]) => <section key={title}><h2 className="mb-3 text-base font-semibold text-ink">{title}</h2><p>{content}</p></section>)}
          <p className="text-xs text-muted">Stand: März 2026. Weitere Hinweise: <Link href="/impressum" className="text-ink underline underline-offset-2">Impressum</Link> · <Link href="/kontakt" className="text-ink underline underline-offset-2">Kontakt</Link>.</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
