"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useFunbook } from "@/components/funbook-provider";

export function TopBar() {
  const { profile, stickers } = useFunbook();
  const pathname = usePathname();

  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 pt-5 pb-2 sm:px-6">
      <Link href="/" className="group flex items-center gap-2">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-sun text-2xl shadow-[0_4px_0_rgba(44,33,23,0.18)] transition-transform group-hover:-rotate-6">
          📚
        </span>
        <span className="font-display text-2xl font-extrabold leading-none sm:text-3xl">
          Funbook
        </span>
      </Link>

      <nav className="flex items-center gap-2">
        <span className="chip" title="Stars earned">
          <span aria-hidden>⭐</span>
          <span>{profile?.stars ?? 0}</span>
        </span>

        <Link
          href="/stickers"
          className={`chip transition-colors hover:bg-sun/40 ${
            pathname === "/stickers" ? "bg-sun/50" : ""
          }`}
          title="Sticker shelf"
        >
          <span aria-hidden>✨</span>
          <span className="hidden sm:inline">Stickers</span>
          <span className="rounded-full bg-ink/10 px-1.5 py-0.5 text-xs">
            {stickers.length}
          </span>
        </Link>

        <Link
          href="/"
          className="chip max-w-[9.5rem] transition-colors hover:bg-mint/50"
          title={profile?.displayName ?? "Little Reader"}
        >
          <span className="text-lg leading-none" aria-hidden>
            {profile?.avatar ?? "🦊"}
          </span>
          <span className="truncate">{profile?.displayName ?? "Little Reader"}</span>
        </Link>
      </nav>
    </header>
  );
}
