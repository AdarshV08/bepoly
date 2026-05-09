import type { Language, Level } from "./store";

export type Book = { title: string; author: string; why: string };

const BOOKS: Record<string, Book[]> = {
  // French
  French_A0: [
    { title: "Easy French Step-by-Step", author: "Myrna Bell Rochester", why: "Gentle introduction with no prior knowledge required." },
    { title: "Living Language French Essential", author: "Living Language", why: "Builds first phrases and simple grammar from zero." },
  ],
  French_A1: [
    { title: "Easy French Step-by-Step", author: "Myrna Bell Rochester", why: "Clear progression of grammar with everyday vocabulary." },
    { title: "Practice Makes Perfect: Basic French", author: "Eliane Kurbegov", why: "Tons of exercises matched to your level." },
  ],
  French_A2: [
    { title: "Le Petit Nicolas", author: "René Goscinny", why: "Simple sentences and humor make A2 grammar stick." },
    { title: "Practice Makes Perfect: Complete French Grammar", author: "Annie Heminway", why: "All core grammar with examples and drills." },
  ],
  French_B1: [
    { title: "Le Petit Prince", author: "Antoine de Saint-Exupéry", why: "Iconic, accessible French with rich expressions." },
    { title: "Schaum's Outline of French Grammar", author: "Mary Crocker", why: "Clear explanations for intermediate grammar." },
  ],
  French_B2: [
    { title: "L'Étranger", author: "Albert Camus", why: "Short novel with clean prose to push your fluency." },
    { title: "Bescherelle La Conjugaison pour Tous", author: "Bescherelle", why: "The reference for mastering verb tenses." },
  ],
  French_C1: [
    { title: "Madame Bovary", author: "Gustave Flaubert", why: "Rich literary French to expand vocabulary and style." },
  ],
  French_C2: [
    { title: "À la recherche du temps perdu", author: "Marcel Proust", why: "Highly nuanced French for near-native readers." },
  ],
  // Spanish
  Spanish_A0: [
    { title: "Madrigal's Magic Key to Spanish", author: "Margarita Madrigal", why: "Classic beginner book — start speaking from page one." },
  ],
  Spanish_A1: [
    { title: "Practice Makes Perfect: Basic Spanish", author: "Dorothy Richmond", why: "Grammar-first practice for total beginners." },
    { title: "Easy Spanish Step-by-Step", author: "Barbara Bregstein", why: "Progressive grammar with example sentences." },
  ],
  Spanish_A2: [
    { title: "Short Stories in Spanish for Beginners", author: "Olly Richards", why: "Stories engineered for A2 grammar exposure." },
  ],
  Spanish_B1: [
    { title: "Practice Makes Perfect: Spanish Conversation", author: "Jean Yates", why: "Real-world dialogues using B1 structures." },
    { title: "El Principito", author: "Antoine de Saint-Exupéry (trans.)", why: "Beloved short novel at an accessible level." },
  ],
  Spanish_B2: [
    { title: "Crónica de una muerte anunciada", author: "Gabriel García Márquez", why: "Compact masterpiece — vivid grammar and idioms." },
  ],
  Spanish_C1: [
    { title: "Cien años de soledad", author: "Gabriel García Márquez", why: "Rich vocabulary and complex tenses to stretch you." },
  ],
  Spanish_C2: [
    { title: "Don Quijote de la Mancha", author: "Miguel de Cervantes", why: "The pinnacle of Spanish literature for advanced readers." },
  ],
  // English
  English_A0: [
    { title: "Oxford Picture Dictionary", author: "Jayme Adelson-Goldstein", why: "Visual vocabulary for absolute beginners." },
  ],
  English_A1: [
    { title: "English Grammar in Use (Essential)", author: "Raymond Murphy", why: "The gold standard for first-grammar reference." },
  ],
  English_A2: [
    { title: "Short Stories in English for Beginners", author: "Olly Richards", why: "Designed to reinforce A2 grammar through reading." },
  ],
  English_B1: [
    { title: "English Grammar in Use", author: "Raymond Murphy", why: "Intermediate grammar with quick exercises." },
    { title: "Animal Farm", author: "George Orwell", why: "Short, clear prose for intermediate readers." },
  ],
  English_B2: [
    { title: "Advanced Grammar in Use", author: "Martin Hewings", why: "Tackles the harder structures clearly." },
    { title: "The Great Gatsby", author: "F. Scott Fitzgerald", why: "Compact novel, beautiful B2-friendly English." },
  ],
  English_C1: [
    { title: "1984", author: "George Orwell", why: "Powerful prose with rich vocabulary." },
  ],
  English_C2: [
    { title: "Ulysses", author: "James Joyce", why: "Stylistically demanding for true mastery." },
  ],
  // German
  German_A0: [
    { title: "German Made Simple", author: "Arnold Leitner", why: "Self-study from absolute zero with clear grammar." },
  ],
  German_A1: [
    { title: "Hammer's German Grammar and Usage", author: "Martin Durrell", why: "Reliable companion for grammar foundations." },
    { title: "Practice Makes Perfect: Basic German", author: "Ed Swick", why: "A1 grammar drills." },
  ],
  German_A2: [
    { title: "Short Stories in German for Beginners", author: "Olly Richards", why: "A2 grammar embedded in approachable stories." },
  ],
  German_B1: [
    { title: "Emil und die Detektive", author: "Erich Kästner", why: "Classic short novel at an intermediate level." },
  ],
  German_B2: [
    { title: "Der Vorleser", author: "Bernhard Schlink", why: "Modern German prose with rich grammar." },
  ],
  German_C1: [
    { title: "Die Verwandlung", author: "Franz Kafka", why: "Dense literary German to push you forward." },
  ],
  German_C2: [
    { title: "Der Zauberberg", author: "Thomas Mann", why: "Sophisticated German for advanced learners." },
  ],
  // Italian
  Italian_A0: [
    { title: "Italian Made Simple", author: "Cristina Mazzoni", why: "Crystal-clear introduction for beginners." },
  ],
  Italian_A1: [
    { title: "Practice Makes Perfect: Basic Italian", author: "Alessandra Visconti", why: "First grammar drills with vocabulary." },
  ],
  Italian_A2: [
    { title: "Short Stories in Italian for Beginners", author: "Olly Richards", why: "A2 grammar absorbed through stories." },
  ],
  Italian_B1: [
    { title: "Il Piccolo Principe", author: "Antoine de Saint-Exupéry (trans.)", why: "Approachable Italian with timeless charm." },
  ],
  Italian_B2: [
    { title: "Se questo è un uomo", author: "Primo Levi", why: "Powerful, clear Italian to deepen comprehension." },
  ],
  Italian_C1: [
    { title: "Il nome della rosa", author: "Umberto Eco", why: "Dense, rich Italian for advanced learners." },
  ],
  Italian_C2: [
    { title: "La Divina Commedia", author: "Dante Alighieri", why: "The summit of Italian literature." },
  ],
  // Portuguese
  Portuguese_A0: [
    { title: "Portuguese: An Essential Grammar", author: "Amélia P. Hutchinson", why: "Solid grammar overview from zero." },
  ],
  Portuguese_A1: [
    { title: "Modern Brazilian Portuguese Grammar", author: "John Whitlam", why: "Friendly first grammar reference." },
  ],
  Portuguese_A2: [
    { title: "Short Stories in Brazilian Portuguese for Beginners", author: "Olly Richards", why: "A2 stories with built-in grammar reinforcement." },
  ],
  Portuguese_B1: [
    { title: "O Pequeno Príncipe", author: "Antoine de Saint-Exupéry (trans.)", why: "Lovely intermediate read." },
  ],
  Portuguese_B2: [
    { title: "Capitães da Areia", author: "Jorge Amado", why: "Vivid Brazilian Portuguese for B2." },
  ],
  Portuguese_C1: [
    { title: "Memórias Póstumas de Brás Cubas", author: "Machado de Assis", why: "Sophisticated style and vocabulary." },
  ],
  Portuguese_C2: [
    { title: "Os Lusíadas", author: "Luís de Camões", why: "Pinnacle of the Portuguese language." },
  ],
  // Arabic
  Arabic_A0: [
    { title: "Alif Baa: Introduction to Arabic Letters and Sounds", author: "Kristen Brustad", why: "Essential first step — learn the script." },
  ],
  Arabic_A1: [
    { title: "Al-Kitaab fii Tacallum al-cArabiyya Part One", author: "Kristen Brustad", why: "The standard A1 textbook worldwide." },
  ],
  Arabic_A2: [
    { title: "Al-Kitaab Part Two", author: "Kristen Brustad", why: "Continues with A2 grammar and vocabulary." },
  ],
  Arabic_B1: [
    { title: "Media Arabic", author: "Julia Ashtiany Bray", why: "Builds B1 reading via news Arabic." },
  ],
  Arabic_B2: [
    { title: "Modern Arabic Short Stories", author: "Ronak Husni & Daniel Newman", why: "Bilingual stories for B2 reading." },
  ],
  Arabic_C1: [
    { title: "Mawsim al-Hijra ila al-Shamal", author: "Tayeb Salih", why: "Modern literary Arabic classic." },
  ],
  Arabic_C2: [
    { title: "The Cairo Trilogy", author: "Naguib Mahfouz", why: "Master the finest literary Arabic." },
  ],
  // Japanese
  Japanese_A0: [
    { title: "Japanese From Zero! 1", author: "George Trombley", why: "Introduces hiragana and first phrases." },
  ],
  Japanese_A1: [
    { title: "Genki I", author: "Eri Banno", why: "The most popular A1 Japanese textbook." },
  ],
  Japanese_A2: [
    { title: "Genki II", author: "Eri Banno", why: "Builds on Genki I with A2 grammar." },
  ],
  Japanese_B1: [
    { title: "Tobira: Gateway to Advanced Japanese", author: "Mayumi Oka", why: "Bridges intermediate Japanese cleanly." },
  ],
  Japanese_B2: [
    { title: "Read Real Japanese: Short Stories", author: "Janet Ashby", why: "Authentic stories with translations." },
  ],
  Japanese_C1: [
    { title: "Kitchen", author: "Banana Yoshimoto", why: "Modern literary Japanese, accessible at C1." },
  ],
  Japanese_C2: [
    { title: "Norwegian Wood (ノルウェイの森)", author: "Haruki Murakami", why: "Beautiful literary Japanese for mastery." },
  ],
  // Mandarin
  Mandarin_A0: [
    { title: "Integrated Chinese Level 1 Part 1", author: "Yuehua Liu", why: "Standard textbook for A0/A1 Chinese." },
  ],
  Mandarin_A1: [
    { title: "HSK Standard Course 1", author: "Jiang Liping", why: "Aligned to HSK 1; great structured start." },
  ],
  Mandarin_A2: [
    { title: "HSK Standard Course 2", author: "Jiang Liping", why: "A2 vocabulary and grammar." },
  ],
  Mandarin_B1: [
    { title: "Mandarin Companion: The Sixty Year Dream", author: "John Pasden", why: "Graded reader at the B1 sweet spot." },
  ],
  Mandarin_B2: [
    { title: "Modern Chinese Short Stories", author: "Various", why: "Builds B2 reading with authentic prose." },
  ],
  Mandarin_C1: [
    { title: "活着 (To Live)", author: "余华 Yu Hua", why: "Modern literary Chinese, accessible at C1." },
  ],
  Mandarin_C2: [
    { title: "红楼梦 (Dream of the Red Chamber)", author: "曹雪芹 Cao Xueqin", why: "Pinnacle of classical Chinese literature." },
  ],
};

export function booksFor(language: Language, level: Level): Book[] {
  return (
    BOOKS[`${language}_${level}`] ?? [
      { title: `Practical ${language} Grammar`, author: "Various", why: `A balanced grammar reference suitable for ${level}.` },
      { title: `Short Stories in ${language}`, author: "Olly Richards", why: `Story-based reading helps reinforce ${level} structures.` },
    ]
  );
}
