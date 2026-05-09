import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowRight, Loader2, Lightbulb } from "lucide-react";
import { SessionShell } from "@/components/SessionShell";
import { useApp } from "@/lib/store";
import { aiGenerateLesson } from "@/lib/ai-client";
import { useEffect } from "react";

export const Route = createFileRoute("/session/lesson")({
  component: LessonPage,
});

function LessonPage() {
  const nav = useNavigate();
  const { language, level, focus, topic, lesson, set } = useApp();

  const q = useQuery({
    queryKey: ["lesson", language, level, focus, topic],
    enabled: !!(language && level && focus && topic) && !lesson,
    queryFn: () =>
      aiGenerateLesson({ language: language!, level: level!, focus: focus!, topic: topic! }),
  });

  useEffect(() => {
    if (q.data && !lesson) set({ lesson: q.data });
  }, [q.data, lesson, set]);

  const data = lesson ?? q.data;

  if (!topic) {
    return (
      <SessionShell>
        <p className="text-muted-foreground">Pick a topic first.</p>
      </SessionShell>
    );
  }

  return (
    <SessionShell>
      {!data && (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin text-primary" /> Crafting your lesson…
        </div>
      )}
      {q.isError && (
        <p className="text-sm text-destructive">
          {(q.error as Error).message} — <button className="underline" onClick={() => q.refetch()}>retry</button>
        </p>
      )}
      {data && (
        <motion.article
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <header>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              {focus} · {level} · {language}
            </p>
            <h1 className="mt-1 text-3xl sm:text-4xl font-black tracking-tight">{data.title}</h1>
            <p className="mt-3 text-muted-foreground leading-relaxed">{data.intro}</p>
          </header>

          {data.sections.map((s, i) => (
            <motion.section
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="rounded-3xl bg-card border border-border p-5 sm:p-6"
            >
              <h2 className="text-xl font-bold">{s.heading}</h2>
              <p className="mt-2 text-foreground/90 leading-relaxed">{s.body}</p>
              <div className="mt-4 space-y-2">
                {s.examples.map((ex, j) => (
                  <div key={j} className="rounded-2xl bg-accent/60 p-3 sm:p-4">
                    <p className="font-semibold text-accent-foreground" lang={language ?? undefined}>
                      {ex.source}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">{ex.target}</p>
                    {ex.note && (
                      <p className="mt-2 text-xs text-foreground/70 italic">— {ex.note}</p>
                    )}
                  </div>
                ))}
              </div>
            </motion.section>
          ))}

          <section className="rounded-3xl bg-primary/5 border-2 border-primary/20 p-5 sm:p-6">
            <div className="flex items-center gap-2 text-primary">
              <Lightbulb className="h-4 w-4" />
              <h3 className="font-bold uppercase tracking-wide text-xs">Key takeaways</h3>
            </div>
            <ul className="mt-3 space-y-2">
              {data.keyTakeaways.map((k, i) => (
                <li key={i} className="flex gap-2 text-sm">
                  <span className="text-primary font-bold">•</span>
                  <span>{k}</span>
                </li>
              ))}
            </ul>
          </section>

          <button
            onClick={() => nav({ to: "/session/quiz" })}
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 font-semibold text-primary-foreground btn-press"
          >
            Got it — quiz me <ArrowRight className="h-4 w-4" />
          </button>
        </motion.article>
      )}
    </SessionShell>
  );
}
