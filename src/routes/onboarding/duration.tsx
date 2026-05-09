import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { OnboardingShell } from "@/components/OnboardingShell";
import { useApp } from "@/lib/store";

const OPTIONS = [5, 10, 15, 30, 45, 60];

export const Route = createFileRoute("/onboarding/duration")({
  component: DurationPage,
});

function DurationPage() {
  const nav = useNavigate();
  const setStore = useApp((s) => s.set);
  const current = useApp((s) => s.durationMinutes);
  return (
    <OnboardingShell step={5} back="/onboarding/upload">
      <h1 className="text-3xl sm:text-4xl font-black tracking-tight">How long do you have today?</h1>
      <p className="text-muted-foreground mt-2">We'll tailor the session to fit.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        {OPTIONS.map((m, i) => {
          const selected = current === m;
          return (
            <motion.button
              key={m}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setStore({ durationMinutes: m })}
              className={`rounded-full border-2 px-6 py-3 font-bold transition-colors ${
                selected
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card hover:border-primary/40"
              }`}
            >
              {m} min
            </motion.button>
          );
        })}
      </div>
      <button
        onClick={() => nav({ to: "/onboarding/focus" })}
        disabled={!current}
        className="mt-10 w-full rounded-full bg-primary px-6 py-4 font-semibold text-primary-foreground btn-press disabled:opacity-50"
      >
        Continue
      </button>
    </OnboardingShell>
  );
}
