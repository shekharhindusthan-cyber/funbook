"use client";

import { useState } from "react";
import type { Book } from "@/lib/books";
import { colorStyles } from "@/lib/colors";

type Palette = (typeof colorStyles)[keyof typeof colorStyles];

export function Quiz({
  book,
  palette,
  onComplete,
  onBack,
}: {
  book: Book;
  palette: Palette;
  onComplete: (score: number) => void;
  onBack: () => void;
}) {
  const [step, setStep] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [saving, setSaving] = useState(false);

  const question = book.quiz[step];
  const isLast = step === book.quiz.length - 1;
  const answered = chosen !== null;
  const correct = chosen === question.answer;

  const choose = (index: number) => {
    if (answered) return;
    setChosen(index);
    if (index === question.answer) setScore((value) => value + 1);
  };

  const next = () => {
    if (isLast) {
      setSaving(true);
      onComplete(score);
      return;
    }
    setStep((value) => value + 1);
    setChosen(null);
  };

  return (
    <div className="mx-auto max-w-2xl pt-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <button type="button" onClick={onBack} className="chip hover:bg-white">
          <span aria-hidden>←</span> Back to story
        </button>
        <span className="chip">
          Question {step + 1} of {book.quiz.length}
        </span>
      </div>

      <div className="card overflow-hidden">
        <div className={`flex items-center gap-3 px-6 py-5 ${palette.cover}`}>
          <span className="text-4xl" aria-hidden>
            {book.emoji}
          </span>
          <div>
            <p className="text-[0.7rem] font-extrabold uppercase tracking-[0.18em] text-ink/60">
              {book.title} quiz
            </p>
            <p className="font-display text-lg font-extrabold">One little question at a time</p>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <div className="mb-5 flex gap-1.5">
            {book.quiz.map((_, index) => (
              <span
                key={`quiz-dot-${index}`}
                className={`h-2 flex-1 rounded-full ${
                  index < step ? palette.bar : index === step ? "bg-ink/40" : "bg-ink/10"
                }`}
              />
            ))}
          </div>

          <h2 className="font-display pop-in text-2xl font-extrabold leading-snug sm:text-3xl">
            {question.question}
          </h2>

          <div className="mt-5 grid gap-2.5">
            {question.options.map((option, index) => {
              const isAnswer = index === question.answer;
              const isChosen = index === chosen;

              let tone = "border-ink/10 bg-white hover:-translate-y-0.5";
              if (answered && isAnswer) tone = "border-teal bg-mint/70";
              else if (answered && isChosen) tone = "border-coral bg-coral/15";
              else if (answered) tone = "border-ink/5 bg-white/50 opacity-70";

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => choose(index)}
                  disabled={answered}
                  className={`flex items-center gap-3 rounded-2xl border-2 px-4 py-3.5 text-left font-display text-lg font-bold transition-all ${tone}`}
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-cream text-base font-extrabold">
                    {answered && isAnswer ? "✓" : answered && isChosen ? "✕" : String.fromCharCode(65 + index)}
                  </span>
                  {option}
                </button>
              );
            })}
          </div>

          {answered ? (
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <p className="font-extrabold">
                {correct ? "Yes! That’s right 🎉" : "Almost! The green one is right 💚"}
              </p>
              <button
                type="button"
                onClick={next}
                disabled={saving}
                className="btn btn-primary ml-auto"
              >
                {saving ? "Saving…" : isLast ? "See my sticker" : "Next question"} <span aria-hidden>→</span>
              </button>
            </div>
          ) : (
            <p className="mt-5 text-sm font-semibold text-ink-soft">
              Tap the answer you think is right.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
