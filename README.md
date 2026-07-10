<div align="center">

# victormts.dev

Personal portfolio and technical showcase built with Next.js 16 App Router, Sanity CMS, and full i18n support.

[![Live Site](https://img.shields.io/badge/victormts.dev-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://victormts.dev)
[![Last Commit](https://img.shields.io/github/last-commit/SoulHiro/portfolio?style=for-the-badge&color=111111&labelColor=111111&logo=github&logoColor=white)](https://github.com/SoulHiro/portfolio/commits/main)
[![License](https://img.shields.io/badge/MIT-111111?style=for-the-badge)](LICENSE)

[![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Sanity](https://img.shields.io/badge/Sanity_v6-F03E2F?style=for-the-badge&logo=sanity&logoColor=white)](https://sanity.io)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)

<br />

<img src="public/og.webp" alt="victormts.dev preview" width="100%" />

</div>

---

## About

This is the source code for [victormts.dev](https://victormts.dev), the personal portfolio of Victor M. Santos. It serves a dual purpose: presenting projects, writing, and contact information to clients and recruiters, while demonstrating Next.js App Router patterns in a real production context — i18n with `next-intl`, ISR via Sanity webhooks, React Server Components, and a design system built on Tailwind v4 OKLCH tokens.

The site is fully bilingual (English and Brazilian Portuguese), statically generated, and deployed on Vercel with incremental revalidation.

---

## Features

- 🌍 **Internationalisation** — `next-intl` v4 with `en` and `pt-BR` locales, `hreflang` on all pages, bilingual Sanity content via `coalesce()` GROQ fallbacks
- 📝 **CMS** — Sanity v6 as headless CMS, Studio embedded at `/z-admin/studio`, ISR revalidation triggered by Sanity webhooks
- ⚡ **Performance** — Static generation + ISR via cache tags (`post`, `lab`), React Compiler enabled, Vercel Analytics
- 🎨 **Design system** — Monochromatic OKLCH palette, fluid `clamp()` type scale, Instrument Serif + Outfit + JetBrains Mono, dark/light mode via `next-themes`
- 🔍 **SEO** — JSON-LD structured data (Person, WebSite, BlogPosting, BreadcrumbList), OG/Twitter cards, dynamic sitemap, `/llms.txt` for AI crawlers
- 📬 **Contact form** — Resend transactional email, Zod v4 validation, in-memory rate limiting (3 req/hour per IP), honeypot anti-bot field
- 🧪 **Lab section** — YouTube Data API v3 with full pagination and duration batching, project roadmap, featured project driven by a Sanity settings singleton
- 🥚 **Easter eggs** — Konami code, `/void` interactive terminal, console art, logo click sequence

---

## Tech Stack

| Technology | Version | Role |
|---|---|---|
| [Next.js](https://nextjs.org) | 16 | Framework — App Router, SSG, ISR, API routes |
| [React](https://react.dev) | 19 | UI library, React Compiler enabled |
| [TypeScript](https://www.typescriptlang.org) | 5 | Type safety across client and server |
| [Tailwind CSS](https://tailwindcss.com) | v4 | Utility-first CSS with OKLCH design tokens |
| [Sanity](https://sanity.io) | v6 | Headless CMS with embedded Studio |
| [next-intl](https://next-intl.dev) | v4 | i18n — routing, translations, locale detection |
| [motion](https://motion.dev) | v12 | Animations (Framer Motion v12) |
| [Resend](https://resend.com) | — | Transactional email delivery |
| [React Email](https://react.email) | — | Email templates as React components |
| [Zod](https://zod.dev) | v4 | Schema validation for forms and API routes |
| [Radix UI](https://radix-ui.com) | — | Accessible UI primitives |
| [nuqs](https://nuqs.47ng.com) | — | Type-safe URL state management |
| [Biome](https://biomejs.dev) | v2 | Linting and formatting (replaces ESLint + Prettier) |
| [pnpm](https://pnpm.io) | — | Package manager |
| [Vercel](https://vercel.com) | — | Hosting, edge network, analytics |

---

## Project Structure

```
src/
├── app/
│   ├── [locale]/               # All user-facing routes (en / pt-br)
│   │   ├── page.tsx            # Home
│   │   ├── works/              # Devlog post list + individual post pages
│   │   ├── lab/                # Lab — featured project, roadmap, YouTube episodes
│   │   └── void/               # Easter egg — interactive terminal
│   ├── api/
│   │   ├── contact/route.ts    # Contact form — Resend integration + rate limiting
│   │   └── revalidate/route.ts # ISR webhook — Sanity triggers revalidateTag
│   ├── llms.txt/route.ts       # Plain-text description served to AI crawlers
│   └── z-admin/studio/         # Sanity Studio embedded at /z-admin/studio
│
├── components/
│   ├── lab/                    # Lab-specific: roadmap, episode player, build status
│   ├── easter-eggs/            # Console, Konami, logo click, glitch-404
│   └── ui/                     # shadcn/ui primitives
│
├── emails/                     # React Email templates (notification + confirmation)
├── i18n/                       # next-intl routing, request config, typed navigation
├── lib/
│   ├── sanity/                 # Client, GROQ queries, TypeScript types, image helper
│   └── schemas/                # Zod schemas (contact form)
└── proxy.ts                    # next-intl middleware — handles i18n routing
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm (`npm install -g pnpm`)
- A [Sanity](https://sanity.io) project
- A [Resend](https://resend.com) account
- A [YouTube Data API v3](https://console.cloud.google.com) key

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/SoulHiro/portfolio.git
cd portfolio

# 2. Install dependencies
pnpm install

# 3. Configure environment variables
cp .env.example .env.local
# Edit .env.local with your values — see the table below

# 4. Start the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.
The Sanity Studio is available at [http://localhost:3000/z-admin/studio](http://localhost:3000/z-admin/studio).

---

## Environment Variables

| Variable | Scope | Description |
|---|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Public | Sanity project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | Public | Dataset name — `production` or `development` |
| `SANITY_API_TOKEN` | Server only | Read token for server-side Sanity fetches |
| `RESEND_API_KEY` | Server only | API key for contact form email delivery |
| `YOUTUBE_API_KEY` | Server only | YouTube Data API v3 key for Lab playlist |
| `REVALIDATE_SECRET` | Server only | Shared secret for the Sanity ISR webhook |
| `NEXT_PUBLIC_SITE_URL` | Public | Canonical base URL, e.g. `https://victormts.dev` |

---

## Sanity CMS

The project uses five schemas defined in `sanity.config.ts`:

| Schema | Type | Description |
|---|---|---|
| `post` | Document | Devlog posts — title, slug, tags, reading time, Portable Text body with code blocks |
| `labProject` | Document | Lab projects — name, type, roadmap, tech stack, GitHub repo, live URL |
| `roadmapStep` | Object | Embedded in `labProject` — phase number, title, description, status |
| `labStatus` | Singleton | Free-text status of current Lab work, auto-dated on save |
| `labSettings` | Singleton | Featured project reference + YouTube playlist ID |

### ISR Revalidation

On every document publish, Sanity triggers a webhook to `POST /api/revalidate?secret=<REVALIDATE_SECRET>`. The endpoint calls `revalidateTag("post")` or `revalidateTag("lab")` based on `_type`, invalidating only the affected cache.

---

## Deploy

No `vercel.json` required. Vercel auto-detects Next.js and builds with zero configuration.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/SoulHiro/portfolio)

After deploying, add all environment variables in the Vercel dashboard under **Settings > Environment Variables**, then configure the Sanity webhook to point at `https://your-domain/api/revalidate`.

---

## License

[MIT](LICENSE) — Victor M. Santos, 2026
