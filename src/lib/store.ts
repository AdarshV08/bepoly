import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Language =
  | "English" | "French" | "Spanish" | "Arabic" | "German"
  | "Portuguese" | "Japanese" | "Mandarin" | "Italian";

export type Level = "A0" | "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
export type Focus = "Grammar" | "Vocabulary" | "Expressions" | "Reading";

export type LessonExample = { source: string; target: string; note?: string };
export type LessonSection = { heading: string; body: string; examples: LessonExample[] };
export type Lesson = {
  title: string;
  intro: string;
  sections: LessonSection[];
  keyTakeaways: string[];
};

export type QuizQuestion =
  | { type: "mcq"; q: string; options: string[]; answerIndex: number; explain: string }
  | { type: "fill"; sentence: string; answer: string; explain: string }
  | { type: "reorder"; tokens: string[]; correctOrder: number[]; explain: string };

export type Paragraph = { paragraph: string; highlights: string[] };

type State = {
  language: Language | null;
  level: Level | null;
  pdfName: string | null;
  pdfText: string | null;
  durationMinutes: number | null;
  focus: Focus | null;
  topic: string | null;

  lesson: Lesson | null;
  quiz: QuizQuestion[] | null;
  paragraph: Paragraph | null;
  quizScore: number;

  xpTotal: number;
  streak: number;
  lastSessionDate: string | null;

  set: (patch: Partial<State>) => void;
  resetSession: () => void;
  completeSession: (xpEarned: number) => void;
};

export const useApp = create<State>()(
  persist(
    (set, get) => ({
      language: null,
      level: null,
      pdfName: null,
      pdfText: null,
      durationMinutes: null,
      focus: null,
      topic: null,
      lesson: null,
      quiz: null,
      paragraph: null,
      quizScore: 0,
      xpTotal: 0,
      streak: 0,
      lastSessionDate: null,
      set: (patch) => set(patch),
      resetSession: () =>
        set({ lesson: null, quiz: null, paragraph: null, quizScore: 0, topic: null }),
      completeSession: (xpEarned) => {
        const today = new Date().toDateString();
        const last = get().lastSessionDate;
        let streak = get().streak;
        if (last === today) {
          // already counted today
        } else {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          if (last === yesterday.toDateString()) streak += 1;
          else streak = 1;
        }
        set({
          xpTotal: get().xpTotal + xpEarned,
          streak,
          lastSessionDate: today,
        });
      },
    }),
    {
      name: "bepoly-state",
      partialize: (s) => ({
        language: s.language,
        level: s.level,
        pdfName: s.pdfName,
        pdfText: s.pdfText,
        durationMinutes: s.durationMinutes,
        focus: s.focus,
        topic: s.topic,
        lesson: s.lesson,
        quiz: s.quiz,
        paragraph: s.paragraph,
        quizScore: s.quizScore,
        xpTotal: s.xpTotal,
        streak: s.streak,
        lastSessionDate: s.lastSessionDate,
      }),
    }
  )
);
