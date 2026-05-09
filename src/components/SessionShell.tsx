import { motion } from "framer-motion";
import { Link, useLocation } from "@tanstack/react-router";
import { type ReactNode } from "react";
import { Flame } from "lucide-react";
import { useApp } from "@/lib/store";

const PARTS = [
  { path: "/session/lesson", label: "Lesson" },
  { path: "/session/quiz", label: "Quiz" },
  { path: "/session/read", label: "Read aloud" },
];

export function SessionShell({ children }: { children: ReactNode }) {
  const loc = useLocation();
  const streak = useApp((s) => s.streak);
  const idx = PARTS.findIndex((p) => loc.pathname.startsWith(p.path));
  const activeIdx = idx === -1 ? 0 : idx;
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-10 bg-background/85 backdrop-blur border-b border-border">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <Link to="/" className="text-sm font-bold tracking-tight text-primary">BePoly</Link>
            {streak > 0 && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-foreground">
                <Flame className="h-4 w-4 text-primary" /> {streak}
              </span>
            )}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {PARTS.map((p, i) => {
              const state =
                i < activeIdx ? "done" : i === activeIdx ? "active" : "todo";
              return (
                <div key={p.path} className="space-y-1">
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-primary"
                      initial={{ width: state === "todo" ? "0%" : "0%" }}
                      animate={{
                        width: state === "todo" ? "0%" : state === "active" ? "55%" : "100%",
                      }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                  <p
                    className={`text-[11px] font-semibold uppercase tracking-wide ${
                      state === "active" ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {p.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </header>
      <motion.main
        key={loc.pathname}
        className="flex-1 max-w-3xl w-full mx-auto px-4 py-6 sm:py-10"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        {children}
      </motion.main>
    </div>
  );
}
