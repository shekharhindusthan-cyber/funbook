"use client";

import { useEffect, useRef, useState } from "react";
import { avatars } from "@/lib/books";
import { useFunbook } from "@/components/funbook-provider";

export function ProfileCard() {
  const { profile, updateProfile } = useFunbook();
  const [name, setName] = useState(profile?.displayName ?? "");
  const hydrated = useRef(false);

  useEffect(() => {
    if (profile && !hydrated.current) {
      setName(profile.displayName);
      hydrated.current = true;
    }
  }, [profile]);

  useEffect(() => {
    if (!hydrated.current) return;
    const trimmed = name.trim();
    if (!trimmed || trimmed === profile?.displayName) return;

    const timer = window.setTimeout(() => {
      void updateProfile({ displayName: trimmed.slice(0, 24) });
    }, 700);

    return () => window.clearTimeout(timer);
  }, [name, profile?.displayName, updateProfile]);

  return (
    <div className="card p-5">
      <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-ink-soft">
        Who&apos;s reading?
      </p>

      <label className="mt-3 block">
        <span className="sr-only">Reader name</span>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          onBlur={() => {
            const trimmed = name.trim();
            if (trimmed && trimmed !== profile?.displayName) {
              void updateProfile({ displayName: trimmed.slice(0, 24) });
            }
          }}
          maxLength={24}
          placeholder="Little Reader"
          className="w-full rounded-2xl border-2 border-ink/10 bg-white px-4 py-3 font-display text-xl font-bold outline-none transition-colors focus:border-teal"
        />
      </label>

      <div className="mt-4 grid grid-cols-4 gap-2">
        {avatars.map((avatar) => {
          const active = profile?.avatar === avatar;
          return (
            <button
              key={avatar}
              type="button"
              onClick={() => void updateProfile({ avatar })}
              aria-pressed={active}
              className={`grid aspect-square place-items-center rounded-2xl border-2 text-2xl transition-transform hover:-translate-y-0.5 ${
                active
                  ? "border-ink/20 bg-sun shadow-[0_3px_0_rgba(44,33,23,0.16)]"
                  : "border-ink/5 bg-white"
              }`}
            >
              {avatar}
            </button>
          );
        })}
      </div>
    </div>
  );
}
