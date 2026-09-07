# Kind People Only

Modern Next.js site for the Karlsruhe event collective — same design language and content as the previous static landing page, with Sanity CMS ready when you connect a project.

**Live domain:** [www.kindpeopleonly.de](https://www.kindpeopleonly.de)

## Stack

- **Next.js** (App Router) + TypeScript + Tailwind CSS v4
- **Sanity** Studio at `/studio` (optional; local JSON fallback until configured)
- **Vercel**-ready deploy

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Events load from [`content/events.json`](content/events.json) until Sanity env vars are set.

## Project layout

```
src/app/                 # Routes: /, /events/[slug], /impressum, /datenschutz, /studio
src/components/          # Header, Hero, EventCard, About, Footer, …
src/lib/                 # Site config, formatters, Sanity client + local fallback
src/sanity/schemaTypes/  # Event, Settings, Legal schemas
content/events.json      # Seed / offline content
public/assets/           # Logo, hero, flyers, fonts, favicons
```

Design tokens

Colors, radii and type live in [`src/app/globals.css`](src/app/globals.css) (`:root` + Tailwind `@theme`). Accent red (`#FF3B3B`) is reserved for ticket CTAs only. Display + body use self-hosted **Bastardo Rounded** (Thin → Black).

## Connect Sanity

1. Create a project at [sanity.io/manage](https://www.sanity.io/manage).
2. Copy `.env.example` → `.env.local` and set:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=yourProjectId
NEXT_PUBLIC_SANITY_DATASET=production
```

3. Restart `npm run dev`, open `/studio`, sign in.
4. Create **Event** documents (slug = previous `id`, e.g. `summer-closing-2026`) and upload flyers (4:5).
5. Optional **Settings** singleton for claim, about, hero assets.

Until Sanity returns events, the site keeps using `content/events.json`.

## Content model (Event)

| Field | Notes |
|---|---|
| `titel`, `slug`, `datum`, `uhrzeit`, `location` | required |
| `flyer` | 4:5 image |
| `ticketUrl` | external shop |
| `status` | `verfuegbar` / `letzte_tickets` / `ausverkauft` |
| `info`, `musik`, `lineup`, `einlass`, `preis`, `adresse` | optional; values starting with `[` are hidden as placeholders |

## Assets

Optimized files live under `public/assets/`. Do **not** commit raw `quellmaterial/` (large source video).

| Path | Use |
|---|---|
| `logo.png` | Header + hero |
| `hero.mp4` + `hero-poster.jpg` | Hero background |
| `flyer/*.jpg` | Event cards (800×1000) |
| `about-bg.jpg` | About section |
| `og-image.jpg` | Link previews |
| `fonts/bastardo/*.otf` | Bastardo Rounded (site type) |

## Deploy (Vercel)

1. Push this repo to GitHub/GitLab.
2. Import in Vercel, set the Sanity env vars if used.
3. Point `kindpeopleonly.de` / `www` to the Vercel project.
4. Confirm OG preview (WhatsApp/iMessage) uses `https://www.kindpeopleonly.de/og-image.jpg`.

## Scripts

```bash
npm run dev      # local development
npm run build    # production build
npm run start    # serve production build
npm run lint     # ESLint
```

## Legal placeholders

Impressum and Datenschutz still contain the dashed `[Platzhalter]` fields from the previous site — fill them before going fully public.
