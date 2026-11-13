"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { supabase } from "@/lib/supabase";
import type { Book } from "@/lib/books";

export type Profile = {
  id: string;
  displayName: string;
  avatar: string;
  stars: number;
};

export type BookProgress = {
  pageIndex: number;
  completed: boolean;
  score: number | null;
};

export type ProgressMap = Record<string, BookProgress>;

export type Sticker = {
  sticker: string;
  label: string;
  earnedAt: string;
};

type FunbookContextValue = {
  status: "loading" | "ready" | "error";
  error: string | null;
  profile: Profile | null;
  progress: ProgressMap;
  stickers: Sticker[];
  updateProfile: (patch: Partial<Pick<Profile, "displayName" | "avatar">>) => Promise<void>;
  savePage: (slug: string, pageIndex: number) => Promise<void>;
  completeBook: (book: Book, score: number) => Promise<{ newSticker: boolean }>;
};

const FunbookContext = createContext<FunbookContextValue | null>(null);

export function FunbookProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [progress, setProgress] = useState<ProgressMap>({});
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const userId = useRef<string | null>(null);

  const fetchAll = useCallback(async () => {
    if (!supabase || !userId.current) return;

    const [profileRes, progressRes, stickerRes] = await Promise.all([
      supabase
        .from("profiles")
        .select("id, display_name, avatar, stars")
        .eq("id", userId.current)
        .maybeSingle(),
      supabase
        .from("progress")
        .select("book_slug, page_index, completed, score")
        .eq("user_id", userId.current),
      supabase
        .from("stickers")
        .select("sticker, label, earned_at")
        .eq("user_id", userId.current)
        .order("earned_at", { ascending: true }),
    ]);

    if (profileRes.data) {
      setProfile({
        id: profileRes.data.id,
        displayName: profileRes.data.display_name ?? "Little Reader",
        avatar: profileRes.data.avatar ?? "🦊",
        stars: profileRes.data.stars ?? 0,
      });
    }

    if (progressRes.data) {
      const next: ProgressMap = {};
      for (const row of progressRes.data) {
        next[row.book_slug] = {
          pageIndex: row.page_index ?? 0,
          completed: Boolean(row.completed),
          score: row.score ?? null,
        };
      }
      setProgress(next);
    }

    if (stickerRes.data) {
      setStickers(
        stickerRes.data.map((row) => ({
          sticker: row.sticker,
          label: row.label ?? "Sticker",
          earnedAt: row.earned_at,
        })),
      );
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function boot() {
      if (!supabase) {
        setError("Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
        setStatus("error");
        return;
      }

      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        let user = session?.user ?? null;

        if (!user) {
          const { data, error: authError } = await supabase.auth.signInAnonymously();
          if (authError) {
            throw new Error(
              authError.message.toLowerCase().includes("anonymous")
                ? "Anonymous sign-ins are turned off in your Supabase project. Enable Authentication → Providers → Anonymous."
                : authError.message,
            );
          }
          user = data.user;
        }

        if (!user) throw new Error("Could not start a reading session.");

        userId.current = user.id;

        const { data: existing } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", user.id)
          .maybeSingle();

        if (!existing) {
          await supabase.from("profiles").insert({
            id: user.id,
            display_name: "Little Reader",
            avatar: "🦊",
          });
        }

        if (cancelled) return;

        await fetchAll();
        if (!cancelled) setStatus("ready");
      } catch (cause) {
        if (cancelled) return;
        setError(cause instanceof Error ? cause.message : "Something went wrong.");
        setStatus("error");
      }
    }

    boot();

    return () => {
      cancelled = true;
    };
  }, [fetchAll]);

  const updateProfile = useCallback(async (patch: Partial<Pick<Profile, "displayName" | "avatar">>) => {
    if (!supabase || !userId.current) return;

    setProfile((current) => (current ? { ...current, ...patch } : current));

    const payload: Record<string, string> = {};
    if (patch.displayName !== undefined) payload.display_name = patch.displayName;
    if (patch.avatar !== undefined) payload.avatar = patch.avatar;

    await supabase.from("profiles").update(payload).eq("id", userId.current);
  }, []);

  const savePage = useCallback(async (slug: string, pageIndex: number) => {
    if (!supabase || !userId.current) return;

    setProgress((current) => ({
      ...current,
      [slug]: {
        pageIndex,
        completed: current[slug]?.completed ?? false,
        score: current[slug]?.score ?? null,
      },
    }));

    await supabase.from("progress").upsert(
      {
        user_id: userId.current,
        book_slug: slug,
        page_index: pageIndex,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,book_slug" },
    );
  }, []);

  const completeBook = useCallback(
    async (book: Book, score: number) => {
      const alreadyEarned = stickers.some((sticker) => sticker.sticker === book.slug);

      if (supabase && userId.current) {
        await supabase.rpc("complete_book", {
          p_slug: book.slug,
          p_score: score,
          p_sticker: book.slug,
          p_label: book.stickerLabel,
          p_stars: book.stars,
        });

        setProgress((current) => ({
          ...current,
          [book.slug]: {
            pageIndex: current[book.slug]?.pageIndex ?? 0,
            completed: true,
            score: Math.max(current[book.slug]?.score ?? 0, score),
          },
        }));

        await fetchAll();
      }

      return { newSticker: !alreadyEarned };
    },
    [fetchAll, stickers],
  );

  const value = useMemo<FunbookContextValue>(
    () => ({
      status,
      error,
      profile,
      progress,
      stickers,
      updateProfile,
      savePage,
      completeBook,
    }),
    [completeBook, error, profile, progress, savePage, status, stickers, updateProfile],
  );

  return <FunbookContext.Provider value={value}>{children}</FunbookContext.Provider>;
}

export function useFunbook() {
  const context = useContext(FunbookContext);
  if (!context) throw new Error("useFunbook must be used inside FunbookProvider");
  return context;
}
