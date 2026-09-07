import localEvents from "../../content/events.json";
import { siteConfig } from "@/lib/site";
import type { Event, EventStatus, SiteSettings } from "@/lib/types";
import { sanityClient } from "@/lib/sanity/client";
import { isSanityConfigured } from "@/lib/sanity/env";
import {
  eventBySlugQuery,
  eventsQuery,
  settingsQuery,
} from "@/lib/sanity/queries";

const STATUS_MAP: Record<string, EventStatus> = {
  verfuegbar: "verfuegbar",
  verfügbar: "verfuegbar",
  letzte_tickets: "letzte_tickets",
  ausverkauft: "ausverkauft",
  coming_soon: "coming_soon",
};

function normalizeEvent(raw: Partial<Event> & { status?: string }): Event {
  const status = STATUS_MAP[raw.status ?? "verfuegbar"] ?? "verfuegbar";
  return {
    id: raw.id!,
    titel: raw.titel!,
    datum: raw.datum!,
    uhrzeit: raw.uhrzeit ?? "20:00",
    location: raw.location!,
    flyer: raw.flyer!,
    flyerAspect: raw.flyerAspect === "1/1" ? "1/1" : "4/5",
    ticketUrl: raw.ticketUrl ?? "",
    status,
    info: raw.info,
    musik: raw.musik,
    lineup: raw.lineup,
    einlass: raw.einlass,
    preis: raw.preis,
    adresse: raw.adresse,
  };
}

function localEventList(): Event[] {
  return (localEvents.events as Array<Partial<Event> & { status?: string }>)
    .map(normalizeEvent)
    .sort((a, b) => a.datum.localeCompare(b.datum));
}

const defaultSettings: SiteSettings = {
  claim: siteConfig.claim,
  about: siteConfig.about,
  email: siteConfig.email,
  instagram: siteConfig.instagram,
  heroPoster: "/assets/hero-poster.jpg",
  heroVideo: "/assets/hero.mp4",
  aboutBg: "/assets/about-bg.jpg",
  logo: "/assets/logo.png",
};

export async function getEvents(): Promise<Event[]> {
  if (isSanityConfigured() && sanityClient) {
    try {
      const data = await sanityClient.fetch<Array<Partial<Event>>>(eventsQuery);
      if (data?.length) return data.map(normalizeEvent);
    } catch {
      // fall through to local content
    }
  }
  return localEventList();
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
  if (isSanityConfigured() && sanityClient) {
    try {
      const data = await sanityClient.fetch<Partial<Event> | null>(
        eventBySlugQuery,
        { slug },
      );
      if (data?.id) return normalizeEvent(data);
    } catch {
      // fall through
    }
  }
  return localEventList().find((e) => e.id === slug) ?? null;
}

export async function getSettings(): Promise<SiteSettings> {
  if (isSanityConfigured() && sanityClient) {
    try {
      const data = await sanityClient.fetch<Partial<SiteSettings> | null>(
        settingsQuery,
      );
      if (data) {
        return {
          claim: data.claim || defaultSettings.claim,
          about: data.about || defaultSettings.about,
          email: data.email || defaultSettings.email,
          instagram: data.instagram || defaultSettings.instagram,
          heroPoster: data.heroPoster || defaultSettings.heroPoster,
          heroVideo: data.heroVideo || defaultSettings.heroVideo,
          aboutBg: data.aboutBg || defaultSettings.aboutBg,
          logo: data.logo || defaultSettings.logo,
        };
      }
    } catch {
      // fall through
    }
  }
  return defaultSettings;
}

export function ticketOrigins(events: Event[]): string[] {
  const origins = new Set<string>();
  for (const event of events) {
    if (!event.ticketUrl) continue;
    try {
      origins.add(new URL(event.ticketUrl).origin);
    } catch {
      // ignore invalid urls
    }
  }
  return [...origins];
}
