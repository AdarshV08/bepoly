
# BePoly — Implementation Plan

A grammar-first language learning web app. No accounts, fully client-side state (localStorage), AI-powered lessons via Lovable AI Gateway, in-browser PDF parsing.

## Design system

- **Palette (Terracotta & Sage)**: terracotta `#c4654a` (primary), peach `#e8a87c` (accent), sage `#87a878` (success), forest `#4a6741` (deep), warm cream background `#fbf7f2`, ink `#2a2420`.
- **Typography**: Outfit (headings, bold/black weights) + Figtree (body). Loaded via Google Fonts in `__root.tsx`.
- **Feel**: warm cream surfaces, generous radius (16–24px), soft warm shadows, bold display headings, smooth Framer Motion transitions, button micro-interactions (scale on press, subtle lift on hover).
- All tokens defined in `src/styles.css` as oklch. Light mode only.

## Routes (TanStack Start)

Single-flow app — each step is its own route for clean transitions and shareable progress, wrapped in a session layout that renders the persistent progress bar.

```
src/routes/
  __root.tsx                  → fonts, head meta
  index.tsx                   → landing/hero → "Start learning" → /onboarding/language
  onboarding/
    language.tsx              → flag grid (9 languages)
    level.tsx                 → 6 A0–C2 cards
    books.tsx                 → 2–3 hardcoded recommendations
    upload.tsx                → PDF dropzone (in-browser)
    duration.tsx              → 5/10/15/30/45/60 pill buttons
    focus.tsx                 → Grammar/Vocab/Expressions/Reading
    topic.tsx                 → AI-extracted topics from PDF
  session/
    lesson.tsx                → Part 1 (50%)
    quiz.tsx                  → Part 2 (25%)
    read.tsx                  → Part 3 (25%)
    done.tsx                  → XP + streak summary
  api/
    ai.ts                     → server route: lesson/quiz/topics/paragraph generation
```

`__root.tsx` keeps shell. An onboarding layout shows a step indicator (1/7 → 7/7). The session layout shows a 3-segment progress bar (Lesson → Quiz → Read).

## State management

A single Zustand store (`src/lib/store.ts`) persisted to localStorage:

- Onboarding: `language`, `level`, `pdfText` (extracted text, not the file), `pdfName`, `durationMinutes`, `focus`, `topic`
- Session: `currentPart`, generated `lesson`, `quiz`, `paragraph`, `quizScore`
- Persistent: `streak`, `lastSessionDate`, `xpTotal`

Each new session resets the session-scoped fields. Streak/XP persist forever.

## PDF handling (client-side only)

- Use `pdfjs-dist` to extract text in the browser. No upload, no Supabase.
- Send first ~6000 chars + detected TOC-like lines to AI for topic extraction.
- Fallback: if no chapters detected, AI generates 6–8 topics from `{language, level, focus}`.

## AI integration (Lovable AI Gateway)

Server route `src/routes/api/ai.ts` (POST) using `@ai-sdk/openai-compatible` + `ai` SDK with `google/gemini-3-flash-preview`. Action-based dispatch:

- `extract_topics` → returns `{ topics: string[] }` via `Output.object` (Zod)
- `generate_lesson` → returns structured lesson: `{ title, intro, sections: [{heading, body, examples:[{source,target,note}]}], keyTakeaways: string[] }`
- `generate_quiz` → returns 5–10 questions: union of `{type:'mcq', q, options, answerIndex, explain}`, `{type:'fill', sentence, blank, answer, explain}`, `{type:'reorder', tokens, correctOrder, explain}`
- `generate_paragraph` → returns `{ paragraph, highlights: string[] }`

All prompts include language, level, focus, topic. System prompt enforces level-appropriate complexity. Lovable Cloud will be auto-enabled to provision `LOVABLE_API_KEY`.

## Hardcoded book recommendations

`src/lib/books.ts` — map of `${language}_${level}` → array of `{ title, author, why }`. Well-known, easy-to-find titles per language/level (e.g., French A1: "Easy French Step-by-Step" by Myrna Bell Rochester; Spanish B1: "Practice Makes Perfect: Spanish Conversation"; etc.). Covers all 9 languages × 7 levels with sensible fallbacks.

## Onboarding screens (key UX details)

1. **Language**: 3-col grid on mobile, animated flag emojis on cards, hover lift, tap scale.
2. **Level**: vertical stack of cards, badge `A0..C2`, tap selects + auto-advance after 250ms.
3. **Books**: cards with title/author/why, "Choose this one" or "I have my own" → upload.
4. **Upload**: drag-drop + file picker, in-browser parse with progress, shows page count. "Skip" allowed (uses AI-only topics).
5. **Duration**: 6 pills, single select, big "Start" CTA.
6. **Focus**: 4 large cards with Lucide icons (BookOpen, Sparkles, MessagesSquare, ScrollText).
7. **Topic**: scrollable list, single select, "Begin session" CTA. Shows skeleton while AI loads.

## Session screens

- **Persistent progress bar** (sticky top): 3 segments filled by part progress, with time remaining.
- **Lesson**: rendered sections with color-coded grammar (terracotta=verb, sage=noun, peach=modifier, etc.), example cards with source/target side-by-side, "Got it →" advances.
- **Quiz**: one question per screen, framer-motion transitions, correct answer triggers `canvas-confetti` + sage flash; wrong shows explanation card. XP +10 per correct.
- **Read aloud**: paragraph with highlighted target words, big circular countdown timer, "Done reading" early-finish button.
- **Done**: confetti, big XP number animated count-up, streak flame with current count, motivational message rotating from a small pool, "Start a new session" → resets session state, returns to `/onboarding/focus` (keeps language/level/PDF/duration).

## Streak logic

On session completion: if `lastSessionDate === today` no change; if `=== yesterday` increment; else reset to 1. Stored in localStorage.

## Dependencies to add

- `pdfjs-dist` — client PDF text extraction
- `framer-motion` — page/section transitions
- `canvas-confetti` + `@types/canvas-confetti` — celebration
- `zustand` — state with persist middleware
- `ai`, `@ai-sdk/openai-compatible`, `zod` — AI server route

## Technical notes

- Lovable Cloud enabled solely to provision `LOVABLE_API_KEY` (no DB, no storage).
- All AI calls go through `/api/ai` server route; key never exposed to client.
- pdf.js worker loaded from CDN-style URL via Vite `?url` import to avoid worker bundling issues in the Worker SSR runtime (parsing only runs in browser, guarded by `typeof window !== 'undefined'`).
- No SSR loaders fetch AI — all AI fetches happen from client `useQuery` to keep prerender clean.
- Light mode only: do not include `.dark` overrides in new tokens.

## Out of scope

- No auth, no Supabase tables, no storage buckets, no analytics, no upsell, no dark mode, no multi-session memory.
