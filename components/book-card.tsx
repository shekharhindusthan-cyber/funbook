"use client";

import Link from "next/link";
import type { Book } from "@/lib/books";
import { colorStyles } from "@/lib/colors";
import { useFunbook } from "@/components/funbook-provider";

export function BookCard({ book }: { book: Book }) {
  const { progress } = useFunbook();
  const saved = progress[book.slug];
  const palette = colorStyles[book.color];

  const pageNumber = saved ? Math.min(saved.pageIndex + 1, book.pages.length) : 0;
  const percent = saved
    ? saved.completed
      ? 100
      : Math.round((pageNumber / book.pages.length) * 100)
    : 0;

  let label = "Start reading";
  if (saved?.completed) label = `Finished · ${saved.score ?? 0}/${book.quiz.length} quiz`;
  else if (saved && pageNumber > 1) label = `Continue · page ${pageNumber}`;

  return (
    <Link
      href={`/book/${book.slug}`}
      className={`card group flex flex-col overflow-hidden transition-transform hover:-translate-y-1 ${palette.ring}`}
    >
      <div className={`relative flex h-40 items-center justify-center ${palette.cover}`}>
        <span className="absolute left-4 top-4 text-4xl drop-shadow-sm transition-transform duration-300 group-hover:-rotate-12">
          {book.emoji}
        </span>
        <div className="flex items-end gap-1 text-3xl opacity-80">
          {book.cover.slice(1).map((item, index) => (
            <span
              key={`${book.slug}-${item}`}
              className="drop-shadow-sm"
              style={{ transform: `translateY(${index % 2 === 0 ? "-6px" : "4px"})` }}
            >
              {item}
            </span>
          ))}
        </div>
        {saved?.completed ? (
          <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-extrabold text-teal">
            ✓ Done
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h3 className="font-display text-2xl font-extrabold leading-tight">{book.title}</h3>
          <p className="mt-1 text-sm font-semibold text-ink-soft">{book.tagline}</p>
        </div>

        <div className="mt-auto space-y-2">
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-ink/10">
            <div
              className={`h-full rounded-full transition-[width] duration-500 ${palette.bar}`}
              style={{ width: `${percent}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs font-extrabold">
            <span className="text-ink-soft">{label}</span>
            <span className={palette.badge + " rounded-full px-2 py-0.5"}>
              {book.pages.length} pages
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
