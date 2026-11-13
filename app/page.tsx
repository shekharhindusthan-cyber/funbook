"use client";

import Link from "next/link";
import { books } from "@/lib/books";
import { useFunbook } from "@/components/funbook-provider";
import { ProfileCard } from "@/components/profile-card";
import { BookCard } from "@/components/book-card";
import { SetupNotice } from "@/components/setup-notice";

export default function HomePage() {
  const { status, error, profile, progress, stickers } = useFunbook();

  if (status === "error") {
    return <SetupNotice message={error ?? "Something went wrong."} />;
  }

  const finished = books.filter((book) => progress[book.slug]?.completed).length;

  return (
    <div className="space-y-8">
      <section className="grid items-stretch gap-4 pt-4 md:grid-cols-[1.5fr_1fr]">
        <div className="card relative overflow-hidden p-6 sm:p-8">
          <span className="pointer-events-none absolute -right-6 -top-6 text-8xl opacity-15" aria-hidden>
            ☀️
          </span>
          <p className="chip bg-mint/60">
            <span aria-hidden>🌱</span> New story every week
          </p>

          <h1 className="font-display mt-4 text-4xl font-extrabold leading-[1.05] sm:text-5xl">
            Pick a book,
            <br />
            little explorer{" "}
            <span className="inline-block wobble" aria-hidden>
              {profile?.avatar ?? "🦊"}
            </span>
          </h1>

          <p className="mt-3 max-w-md font-semibold text-ink-soft">
            Tap through bright picture pages, listen to the story, then answer three tiny
            questions to earn a sticker.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            <Link href={`/book/${books[0].slug}`} className="btn btn-primary">
              Start {books[0].title} <span aria-hidden>→</span>
            </Link>
            <Link href="/stickers" className="btn btn-ghost">
              My sticker shelf
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <ProfileCard />

          <div className="card grid grid-cols-3 divide-x-2 divide-ink/5 p-2 text-center">
            <div className="px-2 py-2">
              <div className="font-display text-2xl font-extrabold">{profile?.stars ?? 0}</div>
              <div className="text-[0.68rem] font-extrabold uppercase tracking-wide text-ink-soft">
                Stars
              </div>
            </div>
            <div className="px-2 py-2">
              <div className="font-display text-2xl font-extrabold">{finished}</div>
              <div className="text-[0.68rem] font-extrabold uppercase tracking-wide text-ink-soft">
                Books
              </div>
            </div>
            <div className="px-2 py-2">
              <div className="font-display text-2xl font-extrabold">{stickers.length}</div>
              <div className="text-[0.68rem] font-extrabold uppercase tracking-wide text-ink-soft">
                Stickers
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="font-display text-3xl font-extrabold">The bookshelf</h2>
            <p className="font-semibold text-ink-soft">
              Three adventures, ready when you are.
            </p>
          </div>
          <span className="chip">
            <span aria-hidden>📖</span> {books.length} books
          </span>
        </div>

        {status === "loading" ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((item) => (
              <div key={item} className="card h-72 animate-pulse bg-white/70" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((book) => (
              <BookCard key={book.slug} book={book} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
