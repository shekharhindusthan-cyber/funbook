"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Book } from "@/lib/books";
import { colorStyles } from "@/lib/colors";
import { useFunbook } from "@/components/funbook-provider";
import { Quiz } from "@/components/quiz";

type Result = { score: number; newSticker: boolean };

export function Reader({ book }: { book: Book }) {
  const { status, progress, completeBook, savePage } = useFunbook();
  const palette = colorStyles[book.color];
  const saved = progress[book.slug];

  const [pageIndex, setPageIndex] = useState(0);
  const [mode, setMode] = useState<"read" | "quiz">("read");
  const [result, setResult] = useState<Result | null>(null);
  const [speaking, setSpeaking] = useState(false);
  const didInit = useRef(false);

  useEffect(() => {
    if (didInit.current || status !== "ready") return;
    didInit.current = true;

    if (saved) {
      setPageIndex(saved.completed ? 0 : Math.min(saved.pageIndex, book.pages.length - 1));
    }
  }, [book.pages.length, saved, status]);

  const stopSpeaking = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, []);

  useEffect(() => stopSpeaking, [stopSpeaking]);

  const goToPage = (index: number) => {
    const next = Math.max(0, Math.min(index, book.pages.length - 1));
    stopSpeaking();
    setPageIndex(next);
    void savePage(book.slug, next);
  };

  const readAloud = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    if (speaking) {
      stopSpeaking();
      return;
    }

    stopSpeaking();
    const utterance = new SpeechSynthesisUtterance(book.pages[pageIndex].text);
    utterance.rate = 0.92;
    utterance.pitch = 1.08;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const finishQuiz = async (score: number) => {
    stopSpeaking();
    const outcome = await completeBook(book, score);
    setResult({ score, newSticker: outcome.newSticker });
  };

  const restart = () => {
    stopSpeaking();
    setResult(null);
    setMode("read");
    setPageIndex(0);
    void savePage(book.slug, 0);
  };

  if (result) {
    const perfect = result.score === book.quiz.length;

    return (
      <div className="mx-auto max-w-xl pt-6">
        <div className="card pop-in overflow-hidden text-center">
          <div className={`relative px-6 py-10 ${palette.cover}`}>
            <div className="mx-auto grid h-28 w-28 place-items-center rounded-full border-4 border-sun bg-white text-6xl shadow-[0_8px_0_rgba(44,33,23,0.1)]">
              {book.sticker}
            </div>
            {result.newSticker ? (
              <p className="chip mx-auto mt-4 bg-sun">New sticker unlocked!</p>
            ) : (
              <p className="chip mx-auto mt-4 bg-white/80">Read again — nice work!</p>
            )}
          </div>

          <div className="p-6 sm:p-8">
            <h1 className="font-display text-3xl font-extrabold">
              {perfect ? "Perfect reading!" : "You did it!"}
            </h1>
            <p className="mt-2 font-semibold text-ink-soft">
              {result.score} of {book.quiz.length} quiz questions right ·{" "}
              {result.newSticker ? `+${book.stars} stars` : "stars already earned"}
            </p>

            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <Link href="/" className="btn btn-primary">
                Back to bookshelf
              </Link>
              <Link href="/stickers" className="btn btn-ghost">
                Sticker shelf
              </Link>
              <button type="button" onClick={restart} className="btn btn-ghost">
                Read again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (mode === "quiz") {
    return (
      <Quiz
        book={book}
        palette={palette}
        onComplete={(score) => void finishQuiz(score)}
        onBack={() => setMode("read")}
      />
    );
  }

  const page = book.pages[pageIndex];
  const isLast = pageIndex === book.pages.length - 1;

  return (
    <div className="mx-auto max-w-3xl pt-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <Link
          href="/"
          className="chip transition-colors hover:bg-white"
          onClick={() => stopSpeaking()}
        >
          <span aria-hidden>←</span> Bookshelf
        </Link>
        <span className={`chip ${palette.soft}`}>
          <span aria-hidden>{book.emoji}</span> {book.title}
        </span>
      </div>

      <article className="card overflow-hidden">
        <div className={`relative flex h-52 items-center justify-center sm:h-64 ${palette.cover}`}>
          <div className="text-[5.5rem] leading-none drop-shadow-sm sm:text-[7rem]" aria-hidden>
            <span className="inline-block wobble">{page.art}</span>
          </div>

          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5">
            {book.pages.map((_, index) => (
              <button
                key={`dot-${index}`}
                type="button"
                aria-label={`Go to page ${index + 1}`}
                aria-current={index === pageIndex}
                onClick={() => goToPage(index)}
                className={`h-2.5 rounded-full transition-all ${
                  index === pageIndex ? "w-6 bg-ink/70" : "w-2.5 bg-ink/25 hover:bg-ink/40"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <p className="text-[0.7rem] font-extrabold uppercase tracking-[0.2em] text-ink-soft">
            Page {pageIndex + 1} of {book.pages.length}
          </p>

          <p className="font-display pop-in mt-3 text-2xl font-bold leading-relaxed sm:text-3xl">
            {page.text}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={readAloud}
              className={`btn ${speaking ? "btn-sun" : "btn-ghost"}`}
              aria-pressed={speaking}
            >
              <span aria-hidden>{speaking ? "⏹" : "🔊"}</span>
              {speaking ? "Stop" : "Read to me"}
            </button>

            <div className="ml-auto flex gap-2">
              <button
                type="button"
                onClick={() => goToPage(pageIndex - 1)}
                disabled={pageIndex === 0}
                className="btn btn-ghost"
              >
                <span aria-hidden>←</span> Back
              </button>

              {isLast ? (
                <button
                  type="button"
                  onClick={() => {
                    stopSpeaking();
                    setMode("quiz");
                  }}
                  className="btn btn-primary"
                >
                  Quiz time <span aria-hidden>✨</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => goToPage(pageIndex + 1)}
                  className="btn btn-primary"
                >
                  Next <span aria-hidden>→</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
