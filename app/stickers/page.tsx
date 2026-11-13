"use client";

import Link from "next/link";
import { books } from "@/lib/books";
import { useFunbook } from "@/components/funbook-provider";
import { SetupNotice } from "@/components/setup-notice";

export default function StickersPage() {
  const { status, error, stickers } = useFunbook();

  if (status === "error") {
    return <SetupNotice message={error ?? "Something went wrong."} />;
  }

  const earned = new Set(stickers.map((sticker) => sticker.sticker));

  return (
    <div className="pt-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl font-extrabold">My sticker shelf</h1>
          <p className="mt-1 font-semibold text-ink-soft">
            Finish a book and its sticker lands right here.
          </p>
        </div>
        <span className="chip bg-sun/40">
          <span aria-hidden>✨</span> {earned.size} of {books.length} collected
        </span>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {books.map((book) => {
          const owned = earned.has(book.slug);
          return (
            <div
              key={book.slug}
              className={`card p-5 text-center ${owned ? "bg-white" : "bg-white/50"}`}
            >
              <div
                className={`mx-auto grid h-24 w-24 place-items-center rounded-full border-4 text-5xl ${
                  owned
                    ? "border-sun bg-sun/25 shadow-[0_6px_0_rgba(44,33,23,0.08)]"
                    : "border-dashed border-ink/15 bg-cream text-ink/25 grayscale"
                }`}
              >
                {owned ? book.sticker : "🔒"}
              </div>
              <h2 className="font-display mt-3 text-xl font-extrabold">
                {owned ? book.stickerLabel : "Not yet…"}
              </h2>
              <p className="mt-1 text-sm font-semibold text-ink-soft">
                {owned ? `From ${book.title}` : `Finish ${book.title} to unlock`}
              </p>
              <Link
                href={`/book/${book.slug}`}
                className="btn btn-ghost mt-4 w-full text-sm"
              >
                {owned ? "Read again" : "Let’s read"}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
