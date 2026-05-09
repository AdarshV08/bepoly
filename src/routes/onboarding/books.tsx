import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen } from "lucide-react";
import { OnboardingShell } from "@/components/OnboardingShell";
import { booksFor } from "@/lib/books";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/onboarding/books")({
  component: BooksPage,
});

function BooksPage() {
  const nav = useNavigate();
  const { language, level } = useApp();
  if (!language || !level) {
    return (
      <OnboardingShell step={3} back="/onboarding/language">
        <p>Pick a language and level first.</p>
      </OnboardingShell>
    );
  }
  const books = booksFor(language, level);
  return (
    <OnboardingShell step={3} back="/onboarding/level">
      <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
        Recommended for {language}, {level}
      </h1>
      <p className="text-muted-foreground mt-2">
        Pick one to find online as a PDF, or use any book you already have.
      </p>
      <div className="mt-8 space-y-3">
        {books.map((b, i) => (
          <motion.div
            key={b.title}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-3xl border border-border bg-card p-5"
          >
            <div className="flex items-start gap-3">
              <span className="shrink-0 inline-flex items-center justify-center h-10 w-10 rounded-xl bg-accent text-accent-foreground">
                <BookOpen className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-bold leading-tight">{b.title}</h3>
                <p className="text-sm text-muted-foreground">by {b.author}</p>
                <p className="mt-2 text-sm">{b.why}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <button
        onClick={() => nav({ to: "/onboarding/upload" })}
        className="mt-8 w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 font-semibold text-primary-foreground btn-press"
      >
        Continue to upload <ArrowRight className="h-4 w-4" />
      </button>
    </OnboardingShell>
  );
}
