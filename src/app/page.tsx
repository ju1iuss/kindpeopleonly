import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { EventGrid } from "@/components/EventGrid";
import { About } from "@/components/About";
import { SkipLink } from "@/components/SkipLink";
import { TicketPreconnect } from "@/components/TicketPreconnect";
import { getEvents, getSettings, ticketOrigins } from "@/lib/events";
import { siteConfig } from "@/lib/site";

export const revalidate = 60;

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const [events, settings] = await Promise.all([getEvents(), getSettings()]);
  const buyable = events.filter(
    (e) => e.status === "verfuegbar" || e.status === "letzte_tickets",
  );
  const origins = ticketOrigins(buyable);
  const speculationUrls = [
    ...buyable.map((e) => e.ticketUrl),
    ...events.map((e) => `/events/${e.id}`),
  ].filter(Boolean);

  return (
    <>
      {origins.map((origin) => (
        <link key={origin} rel="preconnect" href={origin} />
      ))}
      {origins.map((origin) => (
        <link key={`dns-${origin}`} rel="dns-prefetch" href={origin} />
      ))}
      {speculationUrls.length > 0 && (
        <script
          type="speculationrules"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              prefetch: [{ urls: speculationUrls, eagerness: "moderate" }],
            }),
          }}
        />
      )}
      <SkipLink />
      <Header logoSrc={settings.logo} homeHref="/#top" />
      <main id="top">
        <Hero
          logoSrc={settings.logo}
          posterSrc={settings.heroPoster}
          videoSrc={settings.heroVideo}
          claim={settings.claim}
        />
        <EventGrid events={events} />
        <About text={settings.about} backgroundSrc={settings.aboutBg} />
      </main>
      <Footer email={settings.email} instagram={settings.instagram} />
      <TicketPreconnect />
    </>
  );
}
