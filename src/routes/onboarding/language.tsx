import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { OnboardingShell } from "@/components/OnboardingShell";
import { LANGUAGES } from "@/lib/languages";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/onboarding/language")({
  component: LanguagePage,
});

function LanguagePage() {
  const nav = useNavigate();
  const setStore = useApp((s) => s.set);
  const current = useApp((s) => s.language);
  return (
    <OnboardingShell step={1} back="/">
      <h1 className="text-3xl sm:text-4xl font-black tracking-tight">What language are you learning?</h1>
      <p className="text-muted-foreground mt-2">Pick one to start your session.</p>
      <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3">
        {LANGUAGES.map((lang, i) => {
          const selected = current === lang.name;
          return (
            <motion.button
              key={lang.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                setStore({ language: lang.name });
                setTimeout(() => nav({ to: "/onboarding/level" }), 180);
              }}
              className={`group rounded-3xl border-2 p-5 bg-card text-left transition-colors ${
                selected ? "border-primary bg-accent" : "border-border hover:border-primary/40"
              }`}
            >
              <div className="text-4xl">{lang.flag}</div>
              <div className="mt-3 font-bold">{lang.name}</div>
              <div className="text-xs text-muted-foreground">{lang.native}</div>
            </motion.button>
          );
        })}
      </div>
    </OnboardingShell>
  );
}
