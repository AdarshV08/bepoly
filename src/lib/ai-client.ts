import type { Lesson, QuizQuestion, Paragraph } from "./store";

async function call<T>(action: string, payload: Record<string, unknown>): Promise<T> {
  const res = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, ...payload }),
  });
  if (!res.ok) {
    const text = await res.text();
    if (res.status === 429) throw new Error("Too many requests — please wait a moment.");
    if (res.status === 402) throw new Error("AI credits exhausted. Add credits in Settings → Workspace → Usage.");
    throw new Error(text || "AI request failed");
  }
  return res.json() as Promise<T>;
}

export const aiExtractTopics = (p: { language: string; level: string; focus: string; pdfText?: string }) =>
  call<{ topics: string[] }>("extract_topics", p);

export const aiGenerateLesson = (p: { language: string; level: string; focus: string; topic: string }) =>
  call<Lesson>("generate_lesson", p);

export const aiGenerateQuiz = (p: { language: string; level: string; focus: string; topic: string }) =>
  call<{ questions: QuizQuestion[] }>("generate_quiz", p);

export const aiGenerateParagraph = (p: { language: string; level: string; focus: string; topic: string }) =>
  call<Paragraph>("generate_paragraph", p);
