export type EventStatus =
  | "verfuegbar"
  | "letzte_tickets"
  | "ausverkauft"
  | "coming_soon";

export type FlyerAspect = "1/1" | "4/5";

export type Event = {
  id: string;
  titel: string;
  datum: string;
  uhrzeit: string;
  location: string;
  flyer: string;
  flyerAspect?: FlyerAspect;
  ticketUrl: string;
  status: EventStatus;
  info?: string;
  musik?: string;
  lineup?: string;
  einlass?: string;
  preis?: string;
  adresse?: string;
};

export type SiteSettings = {
  claim: string;
  about: string;
  email: string;
  instagram: string;
  heroPoster: string;
  heroVideo: string;
  aboutBg: string;
  logo: string;
};
