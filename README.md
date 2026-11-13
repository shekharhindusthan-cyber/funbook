# Funbook

A playful reading app for little explorers. Bright picture pages, read-aloud narration,
three-question quizzes and sticker rewards — with every reader's progress stored in Supabase.

**Stack:** Next.js 15 (App Router) · React 19 · Tailwind CSS 4 · Supabase (anonymous auth + Postgres) · Vercel

## Features

- 📚 Three illustrated books with 4 tap-through pages each
- 🔊 "Read to me" narration using the browser Speech Synthesis API
- ✨ End-of-book quiz with instant feedback
- 🏅 Sticker shelf and stars, saved per reader
- 🦊 Editable reader name + avatar
- ☁️ Progress persists in Supabase (anonymous sign-in, no passwords for kids)

## Local development

```bash
npm install
cp .env.local.example .env.local   # then fill in your Supabase keys
npm run dev
```

Open http://localhost:3000.

## Supabase setup

1. Create a project at [supabase.com/dashboard](https://supabase.com/dashboard).
2. Run [`supabase/schema.sql`](supabase/schema.sql) in the SQL Editor.
3. Enable **Authentication → Providers → Anonymous sign-ins**.
4. Copy **Project URL** and **anon public key** from Project Settings → API into `.env.local`.

## Deploy

The repo is connected to Vercel, so every push to `main` deploys automatically.
Set the same two env vars in Vercel → Project → Settings → Environment Variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Adding a book

Edit `lib/books.ts` — each book needs `slug`, `title`, pages (`text` + `art` emoji),
quiz questions, a sticker emoji and a star reward. No database migration needed.
