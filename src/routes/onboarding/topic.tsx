import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import { useState } from "react";
import { OnboardingShell } from "@/components/OnboardingShell";
import { useApp } from "@/lib/store";
import { aiExtractTopics } from "@/lib/ai-client";

export const Route = createFileRoute("/onboarding/topic")({
  component: TopicPage,
});

function TopicPage() {
  const nav = useNavigate();
  const { language, level, focus, pdfText, set, resetSession } = useApp();
  const [picked, setPicked] = useState<string | null>(null);

  const ready = !!(language && level && focus);

  const q = useQuery({
    queryKey: ["topics", language, level, focus, !!pdfText],
    enabled: ready,
    queryFn: () =>
      aiExtractTopics({
        language: language!,
        level: level!,
        focus: focus!,
        pdfText: pdfText ?? undefined,
      }),
    staleTime: 60_000,
  });

  return (
    <OnboardingShell step={7} back="/onboarding/focus">
      <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Pick today's topic</h1>
      <p className="text-muted-foreground mt-2">
        {pdfText
          ? "From your PDF — choose what to study now."
          : "Suggested for your level and focus."}
      </p>

      <div className="mt-8 space-y-3 min-h-[200px]">
        {q.isLoading && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            Generating topics…
          </div>
        )}
        {q.isError && (
          <p className="text-sm text-destructive">
            {(q.error as Error).message} — <button className="underline" onClick={() => q.refetch()}>retry</button>
          </p>
        )}
        {q.data?.topics?.map((t, i) => {
          const selected = picked === t;
          return (
            <motion.button
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setPicked(t)}
              className={`w-full text-left rounded-2xl border-2 p-4 bg-card font-medium transition-colors ${
                selected ? "border-primary bg-accent" : "border-border hover:border-primary/40"
              }`}
            >
              {t}
            </motion.button>
          );
        })}
      </div>

      <button
        disabled={!picked}
        onClick={() => {
          if (!picked) return;
          resetSession();
          set({ topic: picked });
          nav({ to: "/session/lesson" });
        }}
        className="mt-8 w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 font-semibold text-primary-foreground btn-press disabled:opacity-50"
      >
        Begin session <ArrowRight className="h-4 w-4" />
      </button>
    </OnboardingShell>
  );
}
