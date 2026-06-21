# Sai Phani Krishna Arumalla — Portfolio

[![CI](https://github.com/Saiphanikrishna05/portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/Saiphanikrishna05/portfolio/actions/workflows/ci.yml)
[![Deployed on Vercel](https://img.shields.io/badge/deployed-vercel-black?logo=vercel)](https://sai-phani-portfolio.vercel.app)

**Live site:** [sai-phani-portfolio.vercel.app](https://sai-phani-portfolio.vercel.app)

A data-driven, AI-native portfolio for an AI/ML Engineer — not a static resume page. Project data, skills, and timeline are all derived from a single [`resume.json`](src/data/resume.json) file (JSON Resume schema), and the site embeds two live LLM-powered features recruiters can actually interact with.

## Features

- **Ask AI about Sai** — a floating chat widget backed by Gemini, grounded in the full resume context. Refuses to fabricate facts and stays on-topic (declines unrelated requests).
- **JD Matcher** — paste any job description and get a streamed, structured fit analysis: match score, specific evidence from real projects, honest gaps, and a ready-to-use pitch.
- **Live GitHub sync** — pinned repositories are pulled from the GitHub GraphQL API at build time (ISR, revalidated every 24h), so the Projects section never goes stale.
- **Derived skill radar** — skill proficiency is computed from a weighted blend of resume-declared level (60%) and actual GitHub language usage (40%), not hardcoded percentages.
- **Auto-generated resume PDF** — a GitHub Action compiles `resume.json` into a LaTeX-typeset PDF on every change and commits it back to `public/`.
- **Cinematic intro** — a one-time, session-scoped intro animation with a photo scan-reveal effect; respects `prefers-reduced-motion` and is skippable.
- **Accessible by default** — reduced-motion support across all animated components, semantic structure, keyboard-dismissable dialogs.

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router), TypeScript |
| Styling | Tailwind CSS, Framer Motion |
| AI | Vercel AI SDK (`ai`) + `@ai-sdk/google` (Gemini, free tier) |
| Data | `resume.json` (JSON Resume schema) + GitHub GraphQL API (`@octokit/graphql`) |
| Validation | Zod |
| Deployment | Vercel |
| CI/CD | GitHub Actions (lint + typecheck + build on every push/PR, resume PDF generation, auto-redeploy on data changes) |

## Getting Started

```bash
git clone https://github.com/Saiphanikrishna05/portfolio.git
cd portfolio
npm install
cp .env.example .env.local   # fill in the values below
npm run dev
```

Open [localhost:3000](http://localhost:3000).

### Environment Variables

See [.env.example](.env.example) for the full list with setup links. At minimum, for local development:

| Variable | Required for | Notes |
|---|---|---|
| `GOOGLE_GENERATIVE_AI_API_KEY` | Chat widget, JD Matcher | Free tier, no card — [aistudio.google.com/apikey](https://aistudio.google.com/apikey) |
| `GITHUB_TOKEN` / `GITHUB_USERNAME` | Live Projects section | [github.com/settings/tokens](https://github.com/settings/tokens), scopes: `read:user`, `public_repo` |

`NEXT_PUBLIC_*` variables (analytics, contact form, site URL) are optional for local dev.

## Project Structure

```
src/
├── app/
│   ├── api/{chat,match,revalidate}/route.ts   # streaming AI endpoints + ISR webhook
│   ├── layout.tsx, page.tsx
├── components/
│   ├── sections/    # Hero, Projects, SkillMatrix, Timeline, Certificates, JobMatcher, Contact
│   ├── ui/          # ChatWidget, IntroOverlay, Typewriter, TimelineItem
│   └── layout/      # Navbar, Footer, Background, ThemeProvider
├── data/resume.json # single source of truth for all resume content
└── lib/             # resume.ts (Zod-validated loader), github.ts, skillDeriver.ts
```

## Scripts

```bash
npm run dev      # start dev server
npm run build    # production build
npm run lint     # ESLint
npx tsc --noEmit # type-check
```

## Deployment

Deployed on Vercel, linked to this repository for automatic deploys on push to `main`. Production environment variables are configured in the Vercel project settings (not committed — see `.env.example` for the full list required).

## License

MIT for the code. Resume content, photos, and personal branding in [`src/data/resume.json`](src/data/resume.json) and `public/` are not covered by the license — please don't reuse those.
