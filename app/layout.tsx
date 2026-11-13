import type { Metadata } from "next";
import { Baloo_2, Nunito } from "next/font/google";
import "./globals.css";
import { FunbookProvider } from "@/components/funbook-provider";
import { TopBar } from "@/components/top-bar";

const display = Baloo_2({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display",
});

const body = Nunito({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Funbook — little books, big adventures",
  description:
    "A playful reading app for little explorers: illustrated story books, read-aloud pages, quizzes and sticker rewards.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable} antialiased`}>
        <FunbookProvider>
          <div className="flex min-h-dvh flex-col">
            <TopBar />
            <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-16 pt-2 sm:px-6">
              {children}
            </main>
            <footer className="px-4 pb-6 text-center text-sm font-semibold text-ink-soft">
              Made for curious little readers · Funbook
            </footer>
          </div>
        </FunbookProvider>
      </body>
    </html>
  );
}
