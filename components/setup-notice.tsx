"use client";

import Link from "next/link";
import { useFunbook } from "@/components/funbook-provider";

export function SetupNotice({ message }: { message: string }) {
  const { stickers } = useFunbook();
  const missingEnv = message.includes("NEXT_PUBLIC_SUPABASE");

  return (
    <div className="card pop-in mx-auto mt-10 max-w-xl p-7 text-center">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-sun/40 text-3xl">
        🛠️
      </div>
      <h1 className="font-display mt-4 text-2xl font-extrabold">Almost ready to read!</h1>
      <p className="mt-2 font-semibold text-ink-soft">{message}</p>

      {missingEnv ? (
        <div className="mt-5 rounded-2xl bg-cream p-4 text-left text-sm font-semibold text-ink-soft">
          <p className="font-extrabold text-ink">Add these environment variables:</p>
          <code className="mt-2 block rounded-xl bg-white p-3 text-xs">
            NEXT_PUBLIC_SUPABASE_URL=…
            <br />
            NEXT_PUBLIC_SUPABASE_ANON_KEY=…
          </code>
          <p className="mt-2">
            Locally they live in <code>.env.local</code>; on Vercel add them under Project →
            Settings → Environment Variables.
          </p>
        </div>
      ) : (
        <p className="mt-4 text-sm font-semibold text-ink-soft">
          Turn on anonymous sign-ins in Supabase, then run the SQL in{" "}
          <code className="rounded bg-white px-1.5 py-0.5">supabase/schema.sql</code>.
        </p>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        <a
          href="https://supabase.com/dashboard"
          target="_blank"
          rel="noreferrer"
          className="btn btn-primary"
        >
          Open Supabase
        </a>
        <Link href="/stickers" className="btn btn-ghost">
          Sticker shelf ({stickers.length})
        </Link>
      </div>
    </div>
  );
}
