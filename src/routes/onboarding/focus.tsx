import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { BookOpen, Sparkles, MessagesSquare, ScrollText } from "lucide-react";
import { OnboardingShell } from "@/components/OnboardingShell";
import { useApp, type Focus } from "@/lib/store";

const FOCI: { name: Focus; icon: typeof BookOpen; desc: string }[] = [
  { name: "Grammar", icon: BookOpen, desc: "Rules, structures and patterns" },
  { name: "Vocabulary", icon: Sparkles, desc: "New words you can actually use" },
  { name: "Expressions", icon: MessagesSquare, desc: "Real-life phrases and idioms" },
  { name: "Reading", icon: ScrollText, desc: "Comprehension through texts" },
];

export const Route = createFileRoute("/onboarding/focus")({
  component: FocusPage,
});

function FocusPage() {
  const nav = useNavigate();
  const setStore = useApp((s) => s.set);
  const current = useApp((s) => s.focus);
  return (
    <OnboardingShell step={6} back="/onboarding/duration">
      <h1 className="text-3xl sm:text-4xl font-black tracking-tight">What's today's focus?</h1>
      <p className="text-muted-foreground mt-2">Pick one to anchor your lesson.</p>
      <div className="mt-8 grid sm:grid-cols-2 gap-3">
        {FOCI.map((f, i) => {
          const Icon = f.icon;
          const selected = current === f.name;
          return (
            <motion.button
              key={f.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                setStore({ focus: f.name });
                setTimeout(() => nav({ to: "/onboarding/topic" }), 180);
              }}
              className={`group text-left rounded-3xl border-2 p-6 bg-card transition-colors ${
                selected ? "border-primary bg-accent" : "border-border hover:border-primary/40"
              }`}
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-xl font-bold">{f.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{f.desc}</p>
            </motion.button>
          );
        })}
      </div>
    </OnboardingShell>
  );
}
