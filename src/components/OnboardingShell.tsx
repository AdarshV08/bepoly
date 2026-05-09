import { motion } from "framer-motion";
import { type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

const STEPS = [
  { path: "/onboarding/language", label: "Language" },
  { path: "/onboarding/level", label: "Level" },
  { path: "/onboarding/books", label: "Books" },
  { path: "/onboarding/upload", label: "PDF" },
  { path: "/onboarding/duration", label: "Time" },
  { path: "/onboarding/focus", label: "Focus" },
  { path: "/onboarding/topic", label: "Topic" },
];

export function OnboardingShell({
  step,
  back,
  children,
}: {
  step: number;
  back?: string;
  children: ReactNode;
}) {
  const pct = (step / STEPS.length) * 100;
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-10 bg-background/85 backdrop-blur border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            {back ? (
              <Link
                to={back}
                className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground btn-press"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </Link>
            ) : (
              <span className="text-sm font-bold tracking-tight text-primary">BePoly</span>
            )}
            <span className="text-xs font-medium text-muted-foreground tabular-nums">
              Step {step} of {STEPS.length}
            </span>
          </div>
          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </div>
      </header>
      <motion.main
        className="flex-1 max-w-2xl w-full mx-auto px-4 py-6 sm:py-10"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        {children}
      </motion.main>
    </div>
  );
}
