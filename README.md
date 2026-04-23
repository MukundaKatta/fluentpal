# FluentPal

> Learn English by talking.

An AI tutor in your pocket. Real conversations, gentle corrections. 5 free lessons per day.

**Live MVP:** https://fluentpal-two.vercel.app

## Features

- Magic-link sign-in via Supabase (no password)
- 6 lesson scenarios: Coffee shop, Job interview, Doctor's visit, Airport, Small talk, Phone call
- Streaming AI chat via OpenAI `gpt-4o-mini`
- Gentle corrections: AI shows mistake then correct version
- Free tier: 5 lessons/day per user, tracked in Supabase

## Stack

- Next.js 16 (App Router)
- Tailwind CSS
- Supabase (auth + usage tracking)
- OpenAI API (gpt-4o-mini, streaming)
- Vercel (deployment)

## Setup

### 1. Clone and install

```bash
git clone https://github.com/MukundaKatta/fluentpal.git
cd fluentpal
npm install
```

### 2. Environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your keys:

| Variable | Where to find it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase project → Settings → API |
| `OPENAI_API_KEY` | platform.openai.com → API Keys |

### 3. Supabase setup

In your Supabase project:

1. **Auth → Email** — enable "Email OTP" / magic links, set Site URL to your Vercel domain
2. **SQL Editor** — run the migration in `supabase/migrations/001_usage_table.sql`

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Deploy to Vercel

```bash
vercel --prod
```

Add `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `OPENAI_API_KEY` in the Vercel project settings, then redeploy.
