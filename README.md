# GIS Portfolio Website

Personal portfolio for a GIS Analyst / Geological Mapping Specialist, built with
**Next.js (App Router) + TypeScript + TailwindCSS**.

## Pages (Phase 1)

- `/` — Home (hero, intro, featured projects, focus areas)
- `/about` — About Me
- `/skills` — Core skills (GIS, Programming, Remote Sensing, Geology)
- `/projects` — Project list
- `/projects/[slug]` — Project detail (Kalgoorlie structural control)
- `/downloads` — Resume / CV / report downloads
- `/contact` — Contact form + links

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build    # production build
npm start        # serve the production build
```

## Editing content

- **Name, role, email, social links:** `src/lib/site.ts`
- **Projects (list + detail):** `src/lib/projects.ts`
- **Skills:** `src/app/skills/page.tsx`
- **Theme colours:** `tailwind.config.ts`
- **Profile photo:** add `public/profile.jpg` and wire it into `src/app/page.tsx`
- **Downloadable PDFs:** drop files into `public/downloads/`

## Roadmap

1. Portfolio website (this phase) ✅
2. Interactive GIS maps (Leaflet / MapLibre)
3. Python GIS automation showcase
4. PostGIS spatial database platform
5. Mineral exploration GIS consultancy site

## Deploy

Optimised for **Vercel** — push to a Git repo and import the project.
