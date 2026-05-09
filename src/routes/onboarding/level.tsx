import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { OnboardingShell } from "@/components/OnboardingShell";
import { LEVELS } from "@/lib/languages";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/onboarding/level")({
  component: LevelPage,
});

function LevelPage() {
  const nav = useNavigate();
  const setStore = useApp((s) => s.set);
  const current = useApp((s) => s.level);
  return (
    <OnboardingShell step={2} back="/onboarding/language">
      <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Where are you right now?</h1>
      <p className="text-muted-foreground mt-2">Tap the highest card that describes you.</p>
      <div className="mt-8 space-y-3">
        {LEVELS.map((lvl, i) => {
          const selected = current === lvl.code;
          return (
            <motion.button
              key={lvl.code}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setStore({ level: lvl.code });
                setTimeout(() => nav({ to: "/onboarding/books" }), 200);
              }}
              className={`w-full rounded-3xl border-2 p-5 bg-card text-left flex items-start gap-4 transition-colors ${
                selected ? "border-primary bg-accent" : "border-border hover:border-primary/40"
              }`}
            >
              <span className="shrink-0 inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-primary text-primary-foreground font-black text-lg font-display">
                {lvl.code}
              </span>
              <span className="text-base sm:text-lg leading-snug font-medium">
                {lvl.description}
              </span>
            </motion.button>
          );
        })}
      </div>
    </OnboardingShell>
  );
}
