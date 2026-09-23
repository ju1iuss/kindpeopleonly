import Image from "next/image";
import Link from "next/link";
import type { Event } from "@/lib/types";
import { formatEventDate } from "@/lib/format";
import { EventTicketButton } from "@/components/EventTicketButton";

type EventCardProps = {
  event: Event;
};

function flyerSize() {
  return { width: 800, height: 800, className: "aspect-square" };
}

export function EventCard({ event }: EventCardProps) {
  const soldOut = event.status === "ausverkauft";
  const almostGone = event.status === "letzte_tickets";
  const detailHref = `/events/${event.id}`;
  const size = flyerSize();

  return (
    <li
      className={`flex h-full flex-col ${
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

        <div className="mt-4 flex flex-col gap-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-[0.6rem]">
          {soldOut ? (
            <span className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full border border-line px-6 text-[0.8rem] font-bold uppercase text-muted">
              Sold Out
            </span>
          ) : (
            <EventTicketButton href={event.ticketUrl} />
          )}
          <Link
            href={detailHref}
            className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-[rgba(242,240,236,0.28)] bg-transparent px-[1.2rem] text-[0.68rem] font-semibold uppercase text-ink transition-[border-color,background-color] duration-200 hover:border-[rgba(242,240,236,0.6)] hover:bg-[rgba(242,240,236,0.05)] sm:w-auto sm:text-[0.8rem]"
          >
            More Info
            <span className="visually-hidden">: {event.titel}</span>
          </Link>
          </div>
        </div>
      </div>
    </li>
  );
}
