# WJ Cathedral website

A production-oriented, local-only bilingual website for Worship to Jesus Cathedral, Nannilam. This repository implements Package A: a static React frontend with no database, authentication, admin panel, private API, or paid service.

## Run locally

Requirements: Node.js 20 or newer and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`).

Quality checks:

```bash
npm run typecheck
npm run lint
npm run build
npm run preview
```

## Technology

- React 19 + Vite
- TypeScript in strict mode
- Tailwind CSS 4 (Vite integration) plus a purpose-built CSS design system
- Motion for React for restrained section and menu animation
- Embla Carousel for touch and keyboard-friendly hero behavior
- Lucide React icons

## Content architecture

All church content is kept outside UI components so a future CMS can replace the local modules without rebuilding the design:

- `src/data/churchInfo.ts` — name, address, phone, map link and navigation
- `src/data/services.ts` — recurring worship and prayer times
- `src/data/events.ts` — confirmed event state
- `src/data/sermons.ts` — selected public YouTube videos
- `src/data/heroSlides.ts` — hero copy and media references
- `src/data/gallery.ts` — approved gallery media and alt text
- `src/data/ministries.ts` — verified church activities
- `src/locales/en.ts` and `src/locales/ta.ts` — interface translations

## Update banners and approved photos

1. Add optimized `.avif` or `.webp` images to `public/banners` or a new `public/gallery` folder.
2. Keep each hero image around 1920×1080 and preferably below 300 KB.
3. Update the `image` field in `src/data/heroSlides.ts`.
4. Update `imageAlt` in both English and Tamil.
5. For gallery photos, add an entry in `src/data/gallery.ts` and set `approved: true` only after church approval.
6. Remove the `mediaStatus`/pending label only after all visible hero media is approved.

## Update events

The current site deliberately shows a no-confirmed-events state. Add a typed `events` array to `src/data/events.ts`, then render it in `EventsSection.tsx`. Every event should contain a confirmed title, date, time, location, bilingual description and source/approval note. Never add example dates to the public interface.

## Localization

English is the first-visit default. Tamil selection is stored in `localStorage` under `wj-cathedral-language`; the page `<html lang>` value updates with the selection. Interface text belongs in the locale files. Dynamic church content stores English and Tamil together through `LocalizedText`.

## Media and factual safety

The abstract hero/gallery visuals are clearly marked placeholders. They do not represent the building or congregation. Replace them only with church-owned or explicitly licensed WJ Cathedral photography. The two YouTube IDs were supplied in the project brief. See `RESEARCH.md` and `CONTENT_CHECKLIST.md` before any public launch.

## Package B path

The UI consumes arrays and objects with stable TypeScript shapes. A future CMS adapter can fetch the same shapes and pass them to these components. Recommended later options are a hosted headless CMS with role-based access, media approval and preview—not a custom admin panel unless the client’s workflow requires one.

