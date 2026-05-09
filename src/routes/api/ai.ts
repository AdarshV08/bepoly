import "@tanstack/react-start";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { lovableChat } from "@/lib/ai-gateway";

const MODEL = "google/gemini-2.5-flash";

const lessonSchema = z.object({
  title: z.string(),
  intro: z.string(),
  sections: z.array(
    z.object({
      heading: z.string(),
      body: z.string(),
      examples: z.array(
        z.object({
          source: z.string(),
          target: z.string(),
          note: z.string().optional(),
        })
      ),
    })
  ),
  keyTakeaways: z.array(z.string()),
});

const quizSchema = z.object({
  questions: z.array(
    z.discriminatedUnion("type", [
      z.object({
        type: z.literal("mcq"),
        q: z.string(),
        options: z.array(z.string()),
        answerIndex: z.number().int(),
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
        tokens: z.array(z.string()),
        correctOrder: z.array(z.number().int()),
        explain: z.string(),
      }),
    ])
  ),
});

const topicsSchema = z.object({
  topics: z.array(z.string()),
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

        const lvl = body.level ?? "A2";
        const lang = body.language ?? "English";
        const focus = body.focus ?? "Grammar";
        const topic = body.topic ?? "";

        const baseSystem = `You are BePoly, a warm, expert ${lang} tutor.
The learner's CEFR level is ${lvl}. Adapt complexity strictly to that level.
Always respond with ONLY valid JSON (no prose, no markdown fences) matching the requested schema exactly.`;

        async function gen<T>(prompt: string, schema: z.ZodType<T>): Promise<T> {
          const text = await lovableChat({
            apiKey: key!,
            model: MODEL,
            messages: [
              { role: "system", content: baseSystem },
              { role: "user", content: prompt },
            ],
          });
          const cleaned = text.trim().replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "");
          const start = cleaned.indexOf("{");
          const end = cleaned.lastIndexOf("}");
          const jsonStr = start >= 0 && end > start ? cleaned.slice(start, end + 1) : cleaned;
          const parsed = JSON.parse(jsonStr);
          return schema.parse(parsed);
        }


        try {
          if (body.action === "extract_topics") {
            const sample = (body.pdfText ?? "").slice(0, 8000);
            const prompt = sample
              ? `From the following text, extract 6 to 10 distinct learning topics, chapter titles, or sections relevant for studying ${focus} in ${lang} at level ${lvl}. Prefer the actual table of contents or section headings if present. Return concise topic names (3-8 words each).\n\nReturn JSON: { "topics": string[] }\n\nTEXT:\n${sample}`
              : `Generate 6-8 relevant ${focus} topics in ${lang} suitable for a ${lvl} learner. Concise topic names (3-8 words each).\n\nReturn JSON: { "topics": string[] }`;
            return Response.json(await gen(prompt, topicsSchema));
          }

          if (body.action === "generate_lesson") {
            const prompt = `Create a focused ${focus} lesson in ${lang} on the topic: "${topic}". Level: ${lvl}.
Return JSON shape:
{
  "title": string,
  "intro": string (2-3 sentences),
  "sections": [{ "heading": string, "body": string (4-6 sentences), "examples": [{ "source": string, "target": string, "note"?: string }] }],
  "keyTakeaways": string[] (3-5 bullets)
}
Include 2-4 sections, each with 2-3 examples. Use ${lvl}-appropriate vocabulary.`;
            return Response.json(await gen(prompt, lessonSchema));
          }

          if (body.action === "generate_quiz") {
            const prompt = `Create a 5-7 question quiz in ${lang} on topic "${topic}" (focus: ${focus}, level: ${lvl}).
Return JSON: { "questions": Question[] } where Question is one of:
- { "type": "mcq", "q": string, "options": string[] (4 items), "answerIndex": number, "explain": string }
- { "type": "fill", "sentence": string (use ___ for blank), "answer": string, "explain": string }
- { "type": "reorder", "tokens": string[], "correctOrder": number[], "explain": string }
Mix all three types. Keep it tied to the topic.`;
            return Response.json(await gen(prompt, quizSchema));
          }

          if (body.action === "generate_paragraph") {
            const prompt = `Write a single short paragraph in ${lang} (5-8 sentences) heavily using the grammar/vocabulary from "${topic}" at level ${lvl}.
Return JSON: { "paragraph": string, "highlights": string[] (4-8 key words/phrases from the paragraph) }`;
            return Response.json(await gen(prompt, paragraphSchema));
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
