import { siteConfig } from "@/lib/site";
import type { Event } from "@/lib/types";
import { toStartDateIso } from "@/lib/format";

export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    email: siteConfig.email,
    sameAs: [siteConfig.instagram],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Karlsruhe",
      addressCountry: "DE",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function EventJsonLd({ event }: { event: Event }) {
  const soldOut = event.status === "ausverkauft";
  const locationName = event.location.split(",")[0]?.trim() || event.location;

  const data = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.titel,
    startDate: toStartDateIso(event.datum, event.uhrzeit),
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: locationName,
      address: event.adresse?.startsWith("[")
        ? event.location
        : event.adresse || event.location,
    },
    image: [
      event.flyer.startsWith("http")
        ? event.flyer
        : `${siteConfig.url}${event.flyer}`,
    ],
    description: event.info,
    organizer: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    ...(event.ticketUrl
      ? {
          offers: {
            "@type": "Offer",
            url: event.ticketUrl,
            availability: soldOut
              ? "https://schema.org/SoldOut"
              : "https://schema.org/InStock",
          },
        }
      : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
