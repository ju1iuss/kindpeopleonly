import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TicketIcon } from "@/components/TicketIcon";
import { EventJsonLd } from "@/components/JsonLd";
import { TicketPreconnect } from "@/components/TicketPreconnect";
import { getEventBySlug, getEvents, getSettings } from "@/lib/events";
import {
  formatEventDateTime,
  isPlaceholder,
} from "@/lib/format";
import { siteConfig } from "@/lib/site";

export const revalidate = 60;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const events = await getEvents();
  return events.map((event) => ({ slug: event.id }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return { title: "Event" };

  const title = event.titel;
  const description = event.info || siteConfig.description;
  const image = event.flyer;

  return {
    title,
    description,
    alternates: { canonical: `/events/${event.id}` },
    openGraph: {
      title: `${event.titel} – ${formatEventDateTime(event.datum, event.uhrzeit).replace(` · ${event.uhrzeit}`, "")}`,
      description,
      url: `${siteConfig.url}/events/${event.id}`,
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${event.titel} – ${siteConfig.name}`,
      description,
      images: [image],
    },
  };
}

export default async function EventPage({ params }: PageProps) {
  const { slug } = await params;
  const [event, settings] = await Promise.all([
    getEventBySlug(slug),
    getSettings(),
  ]);

  if (!event) notFound();

  const soldOut = event.status === "ausverkauft";
  const comingSoon = event.status === "coming_soon";
  const almostGone = event.status === "letzte_tickets";
  const facts = [
    { label: "Doors", value: event.uhrzeit },
    { label: "Music", value: event.musik },
    { label: "Lineup", value: event.lineup },
    { label: "Entry", value: event.einlass },
    { label: "Price", value: event.preis },
  ].filter((f) => f.value && !isPlaceholder(f.value));

  const addressLine = event.adresse && !isPlaceholder(event.adresse)
    ? event.adresse
    : null;

  return (
    <>
      {event.ticketUrl && !comingSoon && !soldOut && (
        <>
          <link rel="preconnect" href={new URL(event.ticketUrl).origin} />
          <link rel="dns-prefetch" href={new URL(event.ticketUrl).origin} />
          <script
            type="speculationrules"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                prefetch: [
                  { urls: [event.ticketUrl], eagerness: "moderate" },
                ],
              }),
            }}
          />
        </>
      )}
      <EventJsonLd event={event} />
      <Header logoSrc={settings.logo} homeHref="/" />
      <main className="mx-auto max-w-[var(--max-w)] px-[clamp(1.25rem,4vw,3rem)] pt-[calc(var(--header-h)+clamp(1.5rem,4vw,3rem))] pb-[clamp(3rem,7vw,5rem)]">
        <p className="mb-[clamp(1.25rem,3vw,2rem)]">
          <Link
            href="/#events"
            className="inline-flex min-h-11 items-center text-[0.8rem] font-light uppercase text-muted transition-colors hover:text-ink"
          >
            <span aria-hidden="true">← </span>All Events
          </Link>
        </p>

        <div className="grid grid-cols-1 items-start gap-[clamp(1.75rem,4vw,3.5rem)] md:grid-cols-[minmax(0,440px)_minmax(0,1fr)]">
          <div>
            <Image
              src={event.flyer}
              alt={`Flyer: ${event.titel}, ${formatEventDateTime(event.datum, event.uhrzeit)} – ${event.location}`}
              width={event.flyerAspect === "1/1" ? 800 : 800}
              height={event.flyerAspect === "1/1" ? 800 : 1000}
              priority
              className={`h-auto w-full rounded-[var(--radius)] object-cover ${
                event.flyerAspect === "1/1" ? "aspect-square" : "aspect-[4/5]"
              }`}
              sizes="(max-width: 760px) 100vw, 440px"
            />
          </div>

          <div>
            <p className="mb-2 text-[0.8rem] font-light uppercase text-muted">
              {formatEventDateTime(event.datum, event.uhrzeit)}
            </p>
            <h1 className="mb-4 font-display text-[clamp(2.75rem,7vw,4.5rem)] font-black leading-[0.98] uppercase">
              {event.titel}
            </h1>

            {almostGone && (
              <span className="mb-4 inline-flex items-center rounded-full bg-accent px-[0.85rem] py-[0.35rem] text-[0.7rem] font-bold uppercase text-accent-ink">
                Almost Sold Out
              </span>
            )}
            {comingSoon && (
              <span className="mb-4 inline-flex items-center rounded-full border border-line px-[0.85rem] py-[0.35rem] text-[0.7rem] font-bold uppercase text-muted">
                Coming Soon
              </span>
            )}
            {soldOut && (
              <span className="mb-4 inline-flex items-center rounded-full border border-line px-[0.85rem] py-[0.35rem] text-[0.7rem] font-bold uppercase text-muted">
                Sold Out
              </span>
            )}

            {event.info && (
              <p className="mb-6 max-w-[44ch] text-[clamp(1rem,1.8vw,1.15rem)] font-light leading-[1.7]">
                {event.info}
              </p>
            )}

            {soldOut ? (
              <p className="m-0 inline-flex min-h-[52px] items-center rounded-full border border-line px-9 text-[0.85rem] font-bold uppercase text-muted">
                Sold Out
              </p>
            ) : comingSoon ? (
              <p
                aria-disabled="true"
                className="m-0 inline-flex min-h-[52px] cursor-default items-center gap-2 rounded-full border border-line bg-[rgba(242,240,236,0.06)] px-9 text-[0.85rem] font-bold uppercase text-muted opacity-70"
              >
                <TicketIcon className="h-[17px] w-[17px] shrink-0 opacity-60" />
                Coming Soon
              </p>
            ) : (
              <a
                href={event.ticketUrl}
                rel="noopener noreferrer"
                target="_blank"
                data-ticket
                className="btn-accent inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full px-9 text-[0.85rem] font-bold uppercase"
              >
                <TicketIcon className="h-[17px] w-[17px] shrink-0" />
                Get Tickets
              </a>
            )}

            {facts.length > 0 && (
              <dl className="mt-[clamp(1.75rem,4vw,2.5rem)] grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-x-6 gap-y-5 border-t border-line pt-[clamp(1.5rem,3vw,2rem)]">
                {facts.map((fact) => (
                  <div key={fact.label}>
                    <dt className="mb-1 text-[0.72rem] font-light uppercase text-muted">
                      {fact.label}
                    </dt>
                    <dd className="m-0 text-[0.95rem] font-semibold">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            )}

            <div className="mt-[clamp(1.75rem,4vw,2.5rem)] border-t border-line pt-[clamp(1.5rem,3vw,2rem)]">
              <h2 className="mb-2 text-[0.72rem] font-light uppercase text-muted">
                Location
              </h2>
              <p className="m-0 font-semibold">
                {event.location}
                {addressLine ? (
                  <>
                    <br />
                    {addressLine}
                  </>
                ) : null}
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer email={settings.email} instagram={settings.instagram} />
      <TicketPreconnect />
    </>
  );
}
