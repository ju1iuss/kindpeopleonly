export const eventsQuery = `*[_type == "event"] | order(datum asc) {
  "id": slug.current,
  titel,
  datum,
  uhrzeit,
  location,
  adresse,
  "flyer": flyer.asset->url,
  flyerAspect,
  ticketUrl,
  status,
  info,
  musik,
  lineup,
  einlass,
  preis
}`;

export const eventBySlugQuery = `*[_type == "event" && slug.current == $slug][0] {
  "id": slug.current,
  titel,
  datum,
  uhrzeit,
  location,
  adresse,
  "flyer": flyer.asset->url,
  flyerAspect,
  ticketUrl,
  status,
  info,
  musik,
  lineup,
  einlass,
  preis
}`;

export const settingsQuery = `*[_type == "settings"][0] {
  claim,
  about,
  email,
  instagram,
  "heroPoster": heroPoster.asset->url,
  "heroVideo": heroVideo.asset->url,
  "aboutBg": aboutBg.asset->url,
  "logo": logo.asset->url
}`;
