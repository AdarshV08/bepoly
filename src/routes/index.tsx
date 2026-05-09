import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, BookOpen, Trophy } from "lucide-react";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { streak, xpTotal } = useApp();
  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-3xl mx-auto px-4 pt-16 pb-24 sm:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
            <Sparkles className="h-3 w-3" /> Grammar-first language learning
          </div>
          <h1 className="mt-5 text-5xl sm:text-7xl font-black tracking-tighter leading-[0.95] text-foreground">
            Be<span className="text-primary">Poly</span>.
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-muted-foreground max-w-xl leading-relaxed">
            Bring a book. Pick a topic. Get a focused lesson, a quick quiz, and a paragraph
            to read aloud — all in the time you have.
          </p>

          <Link
            to="/onboarding/language"
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-4 text-base font-semibold text-primary-foreground shadow-[0_8px_30px_-8px_oklch(0.62_0.14_35/0.45)] btn-press hover:shadow-[0_12px_40px_-8px_oklch(0.62_0.14_35/0.55)] transition-shadow"
          >
            Start learning <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="mt-3 text-xs text-muted-foreground">No login. No sign-up. Just go.</p>
        </motion.div>

        {(streak > 0 || xpTotal > 0) && (
          <motion.div
            className="mt-14 grid grid-cols-2 gap-3 max-w-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="rounded-2xl bg-card border border-border p-4">
              <div className="flex items-center gap-2 text-muted-foreground text-xs font-semibold uppercase tracking-wide">
                <Trophy className="h-3.5 w-3.5" /> XP
              </div>
              <p className="mt-1 text-3xl font-black tabular-nums">{xpTotal}</p>
            </div>
            <div className="rounded-2xl bg-card border border-border p-4">
              <div className="flex items-center gap-2 text-muted-foreground text-xs font-semibold uppercase tracking-wide">
                🔥 Streak
              </div>
              <p className="mt-1 text-3xl font-black tabular-nums">{streak}</p>
            </div>
          </motion.div>
        )}

        <motion.div
          className="mt-16 grid sm:grid-cols-3 gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {[
            { icon: BookOpen, title: "Bring your PDF", body: "Upload any language book." },
            { icon: Sparkles, title: "AI-tailored lesson", body: "Picks the topic, teaches it cleanly." },
            { icon: Trophy, title: "Confetti included", body: "Quiz answers feel good when right." },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl bg-card border border-border p-4">
              <f.icon className="h-5 w-5 text-primary" />
              <h3 className="mt-3 font-bold">{f.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{f.body}</p>
            </div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}
