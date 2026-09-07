import Image from "next/image";
import Link from "next/link";
import type { Event } from "@/lib/types";
import { formatEventDate } from "@/lib/format";
import { TicketIcon } from "@/components/TicketIcon";

type EventCardProps = {
  event: Event;
};

function flyerSize(aspect: Event["flyerAspect"]) {
  return aspect === "1/1"
    ? { width: 800, height: 800, className: "aspect-square" }
    : { width: 800, height: 1000, className: "aspect-[4/5]" };
}

export function EventCard({ event }: EventCardProps) {
  const soldOut = event.status === "ausverkauft";
  const comingSoon = event.status === "coming_soon";
  const almostGone = event.status === "letzte_tickets";
  const detailHref = `/events/${event.id}`;
  const size = flyerSize(event.flyerAspect);

  return (
    <li
      className={`flex h-full flex-col max-md:mx-auto max-md:w-full max-md:max-w-[360px] max-md:[&+&]:border-t max-md:[&+&]:border-[color-mix(in_srgb,var(--accent)_38%,transparent)] max-md:[&+&]:pt-11 ${
        soldOut ? "opacity-90" : ""
      }`}
    >
      <Link
        href={detailHref}
        className="group block rounded-[var(--radius)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ink"
      >
        <span
          className={`relative block overflow-hidden rounded-[var(--radius)] bg-surface [transform:translateZ(0)] ${size.className}`}
        >
          <Image
            src={event.flyer}
            alt={`Flyer: ${event.titel}, ${formatEventDate(event.datum)} – ${event.location}`}
            width={size.width}
            height={size.height}
            className={`h-full w-full object-cover transition-[filter] duration-200 group-hover:brightness-105 ${
              soldOut ? "grayscale-[0.35] brightness-90" : ""
            }`}
            sizes="(max-width: 640px) 360px, (max-width: 1024px) 45vw, 380px"
          />
          {almostGone && (
            <span className="absolute top-[0.9rem] left-[0.9rem] rounded-full bg-accent px-[0.85rem] py-[0.35rem] text-[0.7rem] font-bold uppercase text-accent-ink">
              Almost Sold Out
            </span>
          )}
          {comingSoon && (
            <span className="absolute top-[0.9rem] left-[0.9rem] rounded-full bg-[rgba(14,13,18,0.75)] px-[0.85rem] py-[0.35rem] text-[0.7rem] font-bold uppercase text-ink backdrop-blur-sm">
              Coming Soon
            </span>
          )}
          {soldOut && (
            <span className="absolute top-[0.9rem] left-[0.9rem] rounded-full bg-[rgba(14,13,18,0.75)] px-[0.85rem] py-[0.35rem] text-[0.7rem] font-bold uppercase text-ink backdrop-blur-sm">
              Sold Out
            </span>
          )}
        </span>
      </Link>

      <div className="flex flex-col gap-[0.3rem] px-1 pt-[1.15rem]">
        <Link href={detailHref} className="flex flex-col gap-[0.3rem]">
          <span className="text-[0.78rem] font-light uppercase text-muted">
            {formatEventDate(event.datum)}
          </span>
          <span
            className={`font-display text-[clamp(1.7rem,3vw,2.1rem)] font-bold leading-[1.05] uppercase max-md:text-[1.45rem] ${
              soldOut ? "text-muted" : ""
            }`}
          >
            {event.titel}
          </span>
          <span className="text-[0.92rem] font-light text-muted">
            {event.location} · {event.uhrzeit}
          </span>
        </Link>

        <div className="mt-4 flex flex-wrap items-center gap-[0.6rem]">
          {soldOut ? (
            <span className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full border border-line px-6 text-[0.8rem] font-bold uppercase text-muted">
              Sold Out
            </span>
          ) : comingSoon ? (
            <span
              aria-disabled="true"
              className="inline-flex min-h-11 flex-1 cursor-default items-center justify-center gap-2 rounded-full border border-line bg-[rgba(242,240,236,0.06)] px-6 text-[0.8rem] font-bold uppercase text-muted opacity-70"
            >
              <TicketIcon className="h-[17px] w-[17px] shrink-0 opacity-60" />
              Coming Soon
            </span>
          ) : (
            <a
              href={event.ticketUrl}
              rel="noopener noreferrer"
              target="_blank"
              data-ticket
              className="btn-accent inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full px-6 text-[0.8rem] font-bold uppercase"
            >
              <TicketIcon className="h-[17px] w-[17px] shrink-0" />
              Tickets
            </a>
          )}
          <Link
            href={detailHref}
            className="inline-flex min-h-11 items-center rounded-full border border-[rgba(242,240,236,0.28)] bg-transparent px-[1.4rem] text-[0.8rem] font-semibold uppercase text-ink transition-[border-color,background-color] duration-200 hover:border-[rgba(242,240,236,0.6)] hover:bg-[rgba(242,240,236,0.05)]"
          >
            More Info
            <span className="visually-hidden">: {event.titel}</span>
          </Link>
        </div>
      </div>
    </li>
  );
}
