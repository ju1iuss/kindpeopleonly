import type { Event } from "@/lib/types";
import { EventCard } from "@/components/EventCard";

type EventGridProps = {
  events: Event[];
};

function todayIso(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function EventGrid({ events }: EventGridProps) {
  const today = todayIso();
  const upcoming = events.filter((e) => e.datum >= today);
  const past = events.filter((e) => e.datum < today).reverse();

  return (
    <section
      className="mx-auto max-w-[var(--max-w)] px-[clamp(1.25rem,4vw,3rem)] py-[clamp(4rem,9vw,7rem)]"
      id="events"
      aria-labelledby="events-heading"
    >
      <h2
        id="events-heading"
        className="mb-[clamp(2rem,5vw,3.5rem)] font-display text-[clamp(3rem,9vw,5.5rem)] font-black leading-[0.98] uppercase"
      >
        Upcoming Events
      </h2>
      {upcoming.length > 0 ? (
        <ul className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(min(300px,100%),1fr))] gap-x-[clamp(1.5rem,3vw,2rem)] gap-y-[clamp(2rem,4vw,2.75rem)] p-0 max-md:gap-y-12">
          {upcoming.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </ul>
      ) : (
        <p className="text-muted">No upcoming nights yet — check back soon.</p>
      )}

      {past.length > 0 && (
        <div className="mt-[clamp(4rem,9vw,7rem)]">
          <h2 className="mb-[clamp(2rem,5vw,3.5rem)] font-display text-[clamp(2.5rem,7vw,4.5rem)] font-black leading-[0.98] uppercase">
            Past Events
          </h2>
          <ul className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(min(300px,100%),1fr))] gap-x-[clamp(1.5rem,3vw,2rem)] gap-y-[clamp(2rem,4vw,2.75rem)] p-0 max-md:gap-y-12">
            {past.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
