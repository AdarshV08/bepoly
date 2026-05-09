import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Flame, RefreshCw, Trophy } from "lucide-react";
import { useEffect, useRef } from "react";
import { SessionShell } from "@/components/SessionShell";
import { useApp } from "@/lib/store";
import { celebrate } from "@/lib/confetti";

const MESSAGES = [
  "Brick by brick, you're building fluency.",
  "Small daily reps beat big rare ones. Keep going.",
  "That's how languages are learned: one focused session at a time.",
  "Future-you, speaking confidently, says thanks.",
  "You showed up. That's most of the work.",
];

export const Route = createFileRoute("/session/done")({
  component: DonePage,
});

function DonePage() {
  const nav = useNavigate();
  const { quizScore, completeSession, streak, xpTotal, resetSession } = useApp();
  const claimed = useRef(false);

  useEffect(() => {
    if (claimed.current) return;
    claimed.current = true;
    const earned = (quizScore || 0) + 25; // +25 for completing
    completeSession(earned);
    celebrate(true);
    setTimeout(() => celebrate(true), 400);
  }, [quizScore, completeSession]);

  const message = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
  const earned = (quizScore || 0) + 25;

  return (
    <SessionShell>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center pt-6"
      >
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-success/15 text-forest text-4xl">
          🎉
        </div>
        <h1 className="mt-6 text-4xl sm:text-5xl font-black tracking-tight">Well done!</h1>
        <p className="mt-3 text-muted-foreground max-w-md mx-auto">{message}</p>

        <div className="mt-8 grid grid-cols-2 gap-3 max-w-sm mx-auto">
          <div className="rounded-2xl bg-card border border-border p-5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              <Trophy className="h-3.5 w-3.5 text-primary" /> Earned
            </div>
            <motion.p
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", bounce: 0.5 }}
              className="mt-1 text-3xl font-black tabular-nums text-primary"
            >
              +{earned} XP
            </motion.p>
          </div>
          <div className="rounded-2xl bg-card border border-border p-5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              <Flame className="h-3.5 w-3.5 text-primary" /> Streak
            </div>
            <p className="mt-1 text-3xl font-black tabular-nums">{streak}</p>
          </div>
        </div>

        <p className="mt-4 text-xs text-muted-foreground">Total XP: {xpTotal}</p>

        <div className="mt-10 flex flex-col gap-3 max-w-sm mx-auto">
          <button
            onClick={() => {
              resetSession();
              nav({ to: "/onboarding/focus" });
            }}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 font-semibold text-primary-foreground btn-press"
          >
            <RefreshCw className="h-4 w-4" /> Start a new session
          </button>
          <button
            onClick={() => nav({ to: "/" })}
            className="rounded-full bg-secondary px-6 py-3 font-semibold text-secondary-foreground btn-press"
          >
            Back home
          </button>
        </div>
      </motion.div>
    </SessionShell>
  );
}
