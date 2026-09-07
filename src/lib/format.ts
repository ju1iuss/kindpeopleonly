const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

/** Format like: Fri · September 18, 2026 */
export function formatEventDate(isoDate: string): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  const weekday = WEEKDAYS[date.getUTCDay()];
  const month = MONTHS[date.getUTCMonth()];
  return `${weekday} · ${month} ${d}, ${y}`;
}

export function formatEventDateTime(isoDate: string, time: string): string {
  return `${formatEventDate(isoDate)} · ${time}`;
}

/** Schema.org startDate with Europe/Berlin offset approximation (+02:00 summer / +01:00 winter) */
export function toStartDateIso(isoDate: string, time: string): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  const month = m - 1;
  // Rough DST: last Sunday of March → last Sunday of October = CEST (+02:00)
  const isCest = month > 2 && month < 9;
  const offset = isCest ? "+02:00" : "+01:00";
  return `${isoDate}T${time}:00${offset}`;
}

export function isPlaceholder(value?: string): boolean {
  if (!value) return true;
  return value.trim().startsWith("[");
}
