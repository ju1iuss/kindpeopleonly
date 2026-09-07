/**
 * Optional Sanity seed helper.
 * Run after configuring .env.local:
 *   SANITY_API_WRITE_TOKEN=… npm run seed
 *
 * Creates the two launch events if missing (no flyer upload — add images in Studio).
 */
import { createClient } from "@sanity/client";
import local from "../content/events.json";

async function main() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
  const token = process.env.SANITY_API_WRITE_TOKEN;

  if (!projectId || !token) {
    console.error(
      "Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_WRITE_TOKEN",
    );
    process.exit(1);
  }

  const client = createClient({
    projectId,
    dataset,
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01",
    token,
    useCdn: false,
  });

  for (const event of local.events) {
    const id = `event-${event.id}`;
    const existing = await client.fetch(`*[_id == $id][0]._id`, { id });
    if (existing) {
      console.log(`skip ${event.id} (exists)`);
      continue;
    }

    await client.create({
      _id: id,
      _type: "event",
      titel: event.titel,
      slug: { _type: "slug", current: event.id },
      datum: event.datum,
      uhrzeit: event.uhrzeit,
      location: event.location,
      adresse: event.adresse,
      ticketUrl: event.ticketUrl,
      status: event.status === "verfügbar" ? "verfuegbar" : event.status,
      info: event.info,
      musik: event.musik,
      lineup: event.lineup,
      einlass: event.einlass,
      preis: event.preis,
    });
    console.log(`created ${event.id} — upload flyer in Studio`);
  }

  const settingsId = "settings";
  const settingsExists = await client.fetch(`*[_id == $id][0]._id`, {
    id: settingsId,
  });
  if (!settingsExists) {
    await client.create({
      _id: settingsId,
      _type: "settings",
      claim: "A crowd you actually want to be around.",
      about:
        "kindpeopleonly is an event series from karlsruhe. we handle everything ourselves, from music and djs to lighting to the people we let in. we do not belong to any venue.",
      email: "hallo@kindpeopleonly.de",
      instagram: "https://www.instagram.com/kindpeopleonly_/",
    });
    console.log("created settings — upload logo / hero / about assets in Studio");
  } else {
    console.log("skip settings (exists)");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
