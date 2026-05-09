import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Loader2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { SessionShell } from "@/components/SessionShell";
import { useApp, type QuizQuestion } from "@/lib/store";
import { aiGenerateQuiz } from "@/lib/ai-client";
import { celebrate } from "@/lib/confetti";

export const Route = createFileRoute("/session/quiz")({
  component: QuizPage,
});

function QuizPage() {
  const nav = useNavigate();
  const { language, level, focus, topic, quiz, set } = useApp();

  const q = useQuery({
    queryKey: ["quiz", language, level, focus, topic],
    enabled: !!(language && level && focus && topic) && !quiz,
    queryFn: () =>
      aiGenerateQuiz({ language: language!, level: level!, focus: focus!, topic: topic! }),
  });

  useEffect(() => {
    if (q.data?.questions && !quiz) set({ quiz: q.data.questions });
  }, [q.data, quiz, set]);

  const questions = quiz ?? q.data?.questions;

  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);

  if (!topic) return <SessionShell><p>Pick a topic first.</p></SessionShell>;

  if (!questions) {
    return (
      <SessionShell>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin text-primary" /> Building your quiz…
        </div>
        {q.isError && (
          <p className="mt-3 text-sm text-destructive">
            {(q.error as Error).message} — <button className="underline" onClick={() => q.refetch()}>retry</button>
          </p>
        )}
      </SessionShell>
    );
  }

  const total = questions.length;
  const done = idx >= total;

  const finish = () => {
    set({ quizScore: score });
    nav({ to: "/session/read" });
  };

  return (
    <SessionShell>
      <div className="flex items-center justify-between mb-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Quiz · {Math.min(idx + 1, total)} / {total}
        </p>
        <p className="text-xs font-bold tabular-nums text-primary">{score} XP</p>
      </div>

      <AnimatePresence mode="wait">
        {!done ? (
          <QuestionCard
            key={idx}
            question={questions[idx]}
            onAnswered={(correct) => {
              if (correct) {
                setScore((s) => s + 10);
                celebrate(false);
              }
            }}
            onNext={() => setIdx((i) => i + 1)}
          />
        ) : (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl bg-card border border-border p-6 text-center"
          >
            <h2 className="text-2xl font-black">Quiz complete!</h2>
            <p className="mt-2 text-muted-foreground">You earned {score} XP.</p>
            <button
              onClick={finish}
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground btn-press"
            >
              Read aloud next <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </SessionShell>
  );
}

function QuestionCard({
  question,
  onAnswered,
  onNext,
}: {
  question: QuizQuestion;
  onAnswered: (correct: boolean) => void;
  onNext: () => void;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [correct, setCorrect] = useState(false);

  const submit = (isCorrect: boolean) => {
    if (submitted) return;
    setCorrect(isCorrect);
    setSubmitted(true);
    onAnswered(isCorrect);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={{ duration: 0.25 }}
      className="rounded-3xl bg-card border border-border p-6"
    >
      {question.type === "mcq" && (
        <McqView q={question} submitted={submitted} onSubmit={submit} />
      )}
      {question.type === "fill" && (
        <FillView q={question} submitted={submitted} onSubmit={submit} />
      )}
      {question.type === "reorder" && (
        <ReorderView q={question} submitted={submitted} onSubmit={submit} />
      )}

      {submitted && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-5 rounded-2xl p-4 ${correct ? "bg-success/15 text-forest" : "bg-destructive/10 text-destructive"}`}
        >
          <div className="flex items-center gap-2 font-bold">
            {correct ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
            {correct ? "Nice!" : "Not quite."}
          </div>
          <p className="mt-1 text-sm text-foreground/80">{question.explain}</p>
        </motion.div>
      )}

      {submitted && (
        <button
          onClick={() => {
            setSubmitted(false);
            setCorrect(false);
            onNext();
          }}
          className="mt-5 w-full rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground btn-press"
        >
          Next
        </button>
      )}
    </motion.div>
  );
}

function McqView({
  q, submitted, onSubmit,
}: { q: Extract<QuizQuestion, { type: "mcq" }>; submitted: boolean; onSubmit: (c: boolean) => void }) {
  const [picked, setPicked] = useState<number | null>(null);
  return (
    <>
      <h3 className="text-lg sm:text-xl font-bold leading-snug">{q.q}</h3>
      <div className="mt-4 grid gap-2">
        {q.options.map((opt, i) => {
          const isPicked = picked === i;
          const isAnswer = i === q.answerIndex;
          let cls = "border-border bg-background hover:border-primary/40";
          if (submitted) {
            if (isAnswer) cls = "border-success bg-success/15";
            else if (isPicked) cls = "border-destructive bg-destructive/10";
            else cls = "border-border bg-background opacity-70";
          } else if (isPicked) cls = "border-primary bg-accent";
          return (
            <button
              key={i}
              disabled={submitted}
              onClick={() => setPicked(i)}
              className={`text-left rounded-2xl border-2 px-4 py-3 font-medium transition-colors ${cls}`}
            >
              {opt}
            </button>
          );
        })}
      </div>
      {!submitted && (
        <button
          disabled={picked === null}
          onClick={() => onSubmit(picked === q.answerIndex)}
          className="mt-5 w-full rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground btn-press disabled:opacity-50"
        >
          Check
        </button>
      )}
    </>
  );
}

function FillView({
  q, submitted, onSubmit,
}: { q: Extract<QuizQuestion, { type: "fill" }>; submitted: boolean; onSubmit: (c: boolean) => void }) {
  const [val, setVal] = useState("");
  const norm = (s: string) => s.trim().toLowerCase().replace(/[.,!?;]+$/g, "");
  const parts = q.sentence.split(/_{2,}/);
  return (
    <>
      <h3 className="text-lg sm:text-xl font-bold leading-snug">Fill the blank</h3>
      <p className="mt-3 text-base sm:text-lg leading-relaxed">
        {parts[0]}
        <span className="inline-block min-w-24 align-middle">
          <input
            disabled={submitted}
            value={val}
            onChange={(e) => setVal(e.target.value)}
            className="w-full rounded-lg border-2 border-primary/40 bg-accent px-2 py-1 font-bold text-primary focus:outline-none focus:border-primary"
            placeholder="…"
            autoFocus
          />
        </span>
        {parts[1]}
      </p>
      {submitted && !norm(val).length && (
        <p className="mt-2 text-sm text-muted-foreground">Answer: <b>{q.answer}</b></p>
      )}
      {!submitted && (
        <button
          disabled={!val.trim()}
          onClick={() => onSubmit(norm(val) === norm(q.answer))}
          className="mt-5 w-full rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground btn-press disabled:opacity-50"
        >
          Check
        </button>
      )}
    </>
  );
}

function ReorderView({
  q, submitted, onSubmit,
}: { q: Extract<QuizQuestion, { type: "reorder" }>; submitted: boolean; onSubmit: (c: boolean) => void }) {
  const shuffled = useMemo(
    () => q.tokens.map((_, i) => i).sort(() => Math.random() - 0.5),
    [q]
  );
  const [pool, setPool] = useState<number[]>(shuffled);
  const [chosen, setChosen] = useState<number[]>([]);
  const reset = () => { setPool(shuffled); setChosen([]); };
  const isCorrect =
    chosen.length === q.correctOrder.length &&
    chosen.every((v, i) => v === q.correctOrder[i]);
  return (
    <>
      <h3 className="text-lg sm:text-xl font-bold leading-snug">Tap the words in order</h3>
      <div className="mt-4 min-h-16 rounded-2xl border-2 border-dashed border-border bg-muted/40 p-3 flex flex-wrap gap-2">
        {chosen.length === 0 && (
          <span className="text-sm text-muted-foreground">Pick a word to start</span>
        )}
        {chosen.map((idx, i) => (
          <button
            key={`${idx}-${i}`}
            disabled={submitted}
            onClick={() => {
              setChosen(chosen.filter((_, j) => j !== i));
              setPool([...pool, idx]);
            }}
            className="rounded-xl bg-primary px-3 py-1.5 text-sm font-bold text-primary-foreground"
          >
            {q.tokens[idx]}
          </button>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {pool.map((idx, i) => (
          <button
            key={`${idx}-${i}`}
            disabled={submitted}
            onClick={() => {
              setChosen([...chosen, idx]);
              setPool(pool.filter((_, j) => j !== i));
            }}
            className="rounded-xl bg-accent px-3 py-1.5 text-sm font-bold text-accent-foreground border-2 border-transparent hover:border-primary/30"
          >
            {q.tokens[idx]}
          </button>
        ))}
      </div>
      {submitted && (
        <p className="mt-3 text-sm text-muted-foreground">
          Correct order: <b>{q.correctOrder.map((i) => q.tokens[i]).join(" ")}</b>
        </p>
      )}
      {!submitted && (
        <div className="mt-5 flex gap-2">
          <button
            onClick={reset}
            className="rounded-full bg-secondary px-4 py-3 text-sm font-semibold btn-press"
          >
            Reset
          </button>
          <button
            disabled={chosen.length !== q.tokens.length}
            onClick={() => onSubmit(isCorrect)}
            className="flex-1 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground btn-press disabled:opacity-50"
          >
            Check
          </button>
        </div>
      )}
    </>
  );
}
