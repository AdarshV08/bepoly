import type { Language, Level } from "./store";

export const LANGUAGES: { name: Language; flag: string; native: string }[] = [
  { name: "English", flag: "🇬🇧", native: "English" },
  { name: "French", flag: "🇫🇷", native: "Français" },
  { name: "Spanish", flag: "🇪🇸", native: "Español" },
  { name: "Arabic", flag: "🇸🇦", native: "العربية" },
  { name: "German", flag: "🇩🇪", native: "Deutsch" },
  { name: "Portuguese", flag: "🇵🇹", native: "Português" },
  { name: "Japanese", flag: "🇯🇵", native: "日本語" },
  { name: "Mandarin", flag: "🇨🇳", native: "中文" },
  { name: "Italian", flag: "🇮🇹", native: "Italiano" },
];

export const LEVELS: { code: Level; description: string }[] = [
  { code: "A0", description: "I cannot say anything yet in this language" },
  { code: "A1", description: "I can introduce myself, greet people and ask very simple questions" },
  { code: "A2", description: "I can order food, ask for directions and handle basic daily situations" },
  { code: "B1", description: "I can have conversations about work, travel and familiar topics" },
  { code: "B2", description: "I can debate opinions, understand news and write detailed messages" },
  { code: "C1", description: "I can express ideas fluently and understand complex texts with ease" },
  { code: "C2", description: "I am near-native, I can understand everything and speak spontaneously" },
];
