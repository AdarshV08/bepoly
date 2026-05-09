import "@tanstack/react-start";
import { createFileRoute } from "@tanstack/react-router";
import { generateText, Output } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway";

const MODEL = "google/gemini-3-flash-preview";

const lessonSchema = z.object({
  title: z.string(),
  intro: z.string(),
  sections: z
    .array(
      z.object({
        heading: z.string(),
        body: z.string(),
        examples: z
          .array(
            z.object({
              source: z.string(),
              target: z.string(),
              note: z.string().optional(),
            })
          )
          .min(1),
      })
    )
    .min(2),
  keyTakeaways: z.array(z.string()).min(2),
});

const quizSchema = z.object({
  questions: z
    .array(
      z.discriminatedUnion("type", [
        z.object({
          type: z.literal("mcq"),
          q: z.string(),
          options: z.array(z.string()).min(3).max(4),
          answerIndex: z.number().int().min(0).max(3),
          explain: z.string(),
        }),
        z.object({
          type: z.literal("fill"),
          sentence: z.string().describe("Sentence with ___ where the blank goes"),
          answer: z.string(),
          explain: z.string(),
        }),
        z.object({
          type: z.literal("reorder"),
          tokens: z.array(z.string()).min(3),
          correctOrder: z.array(z.number().int()).min(3),
          explain: z.string(),
        }),
      ])
    )
    .min(4)
    .max(8),
});

const topicsSchema = z.object({
  topics: z.array(z.string().min(2).max(80)).min(6).max(10),
});

const paragraphSchema = z.object({
  paragraph: z.string(),
  highlights: z.array(z.string()),
});

export const Route = createFileRoute("/api/ai")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const body = (await request.json()) as {
          action: "extract_topics" | "generate_lesson" | "generate_quiz" | "generate_paragraph";
          language?: string;
          level?: string;
          focus?: string;
          topic?: string;
          pdfText?: string;
        };

        const gateway = createLovableAiGatewayProvider(key);
        const model = gateway(MODEL);

        const lvl = body.level ?? "A2";
        const lang = body.language ?? "English";
        const focus = body.focus ?? "Grammar";
        const topic = body.topic ?? "";

        const baseSystem = `You are BePoly, a warm, expert ${lang} tutor.
The learner's CEFR level is ${lvl}. Adapt complexity strictly to that level.
Always respond in clear, structured JSON matching the requested schema.`;

        try {
          if (body.action === "extract_topics") {
            const sample = (body.pdfText ?? "").slice(0, 8000);
            const prompt = sample
              ? `From the following text, extract 6 to 10 distinct learning topics, chapter titles, or sections relevant for studying ${focus} in ${lang} at level ${lvl}. Prefer the actual table of contents or section headings if present. Return concise topic names (3-8 words each).\n\nTEXT:\n${sample}`
              : `Generate 6-8 relevant ${focus} topics in ${lang} suitable for a ${lvl} learner. Concise topic names (3-8 words each).`;
            const { output } = await generateText({
              model,
              system: baseSystem,
              prompt,
              experimental_output: Output.object({ schema: topicsSchema }),
            });
            return Response.json(output);
          }

          if (body.action === "generate_lesson") {
            const prompt = `Create a focused ${focus} lesson in ${lang} on the topic: "${topic}".
Level: ${lvl}. The lesson must:
- Have a short engaging title and a 2-3 sentence intro.
- Contain 2-4 sections with a clear heading, a short explanation (4-6 sentences max — no walls of text), and 2-3 worked examples.
- Each example: "source" is the ${lang} sentence, "target" is the English translation, optional "note" with a tiny grammar hint.
- End with 3-5 crisp keyTakeaways bullet strings.
- Use ${lvl}-appropriate vocabulary and structures.`;
            const { output } = await generateText({
              model,
              system: baseSystem,
              prompt,
              experimental_output: Output.object({ schema: lessonSchema }),
            });
            return Response.json(output);
          }

          if (body.action === "generate_quiz") {
            const prompt = `Create a 5-7 question quiz in ${lang} testing the topic: "${topic}" (focus: ${focus}, level: ${lvl}).
Mix question types: "mcq" (4 options), "fill" (use ___ for the blank), and "reorder" (tokens shuffled — provide correctOrder as indices into the original tokens that produce the correct sentence).
Include a brief, kind "explain" string for each.
Keep it tightly tied to the lesson topic.`;
            const { output } = await generateText({
              model,
              system: baseSystem,
              prompt,
              experimental_output: Output.object({ schema: quizSchema }),
            });
            return Response.json(output);
          }

          if (body.action === "generate_paragraph") {
            const prompt = `Write a single short paragraph in ${lang} (5 to 8 sentences) that heavily uses the grammar/vocabulary from the topic "${topic}" at level ${lvl}.
The paragraph should be natural and read aloud well. Then list 4-8 key words or phrases from the paragraph that exemplify the topic in "highlights".`;
            const { output } = await generateText({
              model,
              system: baseSystem,
              prompt,
              experimental_output: Output.object({ schema: paragraphSchema }),
            });
            return Response.json(output);
          }

          return new Response("Unknown action", { status: 400 });
        } catch (e: unknown) {
          const msg = e instanceof Error ? e.message : "AI request failed";
          console.error("AI error:", msg);
          return new Response(msg, { status: 500 });
        }
      },
    },
  },
});
