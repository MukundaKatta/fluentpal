# FluentPal

> Learn English by talking.

An AI voice tutor in your pocket. Two minutes a day, real conversations, gentle corrections.

**Status:** v0 skeleton — landing page + voice-scenario route. Full AI not yet wired.

**Landing:** https://fluentpal.vercel.app

---

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind v4 |
| Fonts | Inter via `next/font/google` |
| Hosting | Vercel (zero config) |
| Waitlist | https://waitlist-api-sigma.vercel.app |

## Run locally

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000.

## Deploy

Push to `main` — Vercel auto-deploys. No environment variables required.

## Routes

| Route | Description |
|---|---|
| `/` | Landing page with waitlist form |
| `/try` | Scenario picker + Web Speech API mic capture |
| `/api/waitlist` | POST `{ email }` → forwards to waitlist-api-sigma |
