import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowRight, Loader2, Mic, Pause, Play } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { SessionShell } from "@/components/SessionShell";
import { useApp } from "@/lib/store";
import { aiGenerateParagraph } from "@/lib/ai-client";

export const Route = createFileRoute("/session/read")({
  component: ReadPage,
});

function ReadPage() {
  const nav = useNavigate();
  const { language, level, focus, topic, paragraph, durationMinutes, set } = useApp();

  const q = useQuery({
    queryKey: ["paragraph", language, level, focus, topic],
    enabled: !!(language && level && focus && topic) && !paragraph,
    queryFn: () =>
      aiGenerateParagraph({ language: language!, level: level!, focus: focus!, topic: topic! }),
  });

  useEffect(() => {
    if (q.data && !paragraph) set({ paragraph: q.data });
  }, [q.data, paragraph, set]);

  const data = paragraph ?? q.data;

  // 25% of session time, capped to a reasonable read window
  const totalSec = useMemo(() => {
    const minutes = durationMinutes ?? 10;
    return Math.max(45, Math.round(minutes * 60 * 0.25));
  }, [durationMinutes]);

  const [remaining, setRemaining] = useState(totalSec);
  const [running, setRunning] = useState(true);
  const tick = useRef<number | null>(null);

  useEffect(() => setRemaining(totalSec), [totalSec]);

  useEffect(() => {
    if (!data || !running) return;
    tick.current = window.setInterval(() => {
      setRemaining((r) => Math.max(0, r - 1));
    }, 1000);
    return () => {
      if (tick.current) window.clearInterval(tick.current);
    };
  }, [data, running]);

  useEffect(() => {
    if (remaining === 0 && data) {
      nav({ to: "/session/done" });
    }
  }, [remaining, data, nav]);

  const minutes = Math.floor(remaining / 60).toString().padStart(2, "0");
  const seconds = (remaining % 60).toString().padStart(2, "0");
  const pct = ((totalSec - remaining) / totalSec) * 100;

  if (!data) {
    return (
      <SessionShell>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin text-primary" /> Writing a paragraph…
        </div>
      </SessionShell>
    );
  }

  // Highlight target words in the paragraph
  const renderParagraph = () => {
    if (!data.highlights?.length) return data.paragraph;
    const escaped = data.highlights
      .map((h) => h.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .filter(Boolean)
      .sort((a, b) => b.length - a.length);
    if (!escaped.length) return data.paragraph;
    const re = new RegExp(`(${escaped.join("|")})`, "gi");
    const parts = data.paragraph.split(re);
    return parts.map((p, i) =>
      escaped.some((e) => new RegExp(`^${e}$`, "i").test(p)) ? (
        <mark key={i} className="bg-accent text-accent-foreground rounded px-1 font-semibold">
          {p}
        </mark>
      ) : (
        <span key={i}>{p}</span>
      )
    );
  };

  return (
    <SessionShell>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 text-primary mb-3">
          <Mic className="h-4 w-4" />
          <p className="text-xs font-semibold uppercase tracking-wider">Read aloud</p>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black">Read this out loud, slowly.</h1>

        <div className="mt-6 rounded-3xl bg-card border border-border p-6 sm:p-8">
          <p
            lang={language ?? undefined}
            className="text-xl sm:text-2xl leading-relaxed font-display font-medium"
          >
            {renderParagraph()}
          </p>
        </div>

        <div className="mt-6 rounded-3xl bg-primary/5 border border-primary/20 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                Time left
              </p>
              <p className="mt-1 text-4xl font-black tabular-nums">{minutes}:{seconds}</p>
            </div>
            <button
              onClick={() => setRunning((r) => !r)}
              className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground btn-press"
              aria-label={running ? "Pause" : "Resume"}
            >
              {running ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </button>
          </div>
          <div className="mt-4 h-2 w-full bg-background rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: "0%" }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <button
          onClick={() => nav({ to: "/session/done" })}
          className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 font-semibold text-primary-foreground btn-press"
        >
          I'm done reading <ArrowRight className="h-4 w-4" />
        </button>
      </motion.div>
    </SessionShell>
  );
}
