export type Theme =
  | "salutations"
  | "couleurs"
  | "nourriture"
  | "bureau"
  | "loisirs"
  | "verbes"
  | "possessifs"
  | "phrases"
  | "essentiel"
  | "perso";

// Marco común europeo de referencia (CEFR) — el camino completo hasta
// nivel nativo. El contenido se llena nivel por nivel; el SRS se encarga
// de que los niveles anteriores nunca dejen de repasarse.
export type Level = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export const LEVELS: Level[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

export const LEVEL_LABEL: Record<Level, string> = {
  A1: "Principiante",
  A2: "Elemental",
  B1: "Intermedio",
  B2: "Intermedio alto",
  C1: "Avanzado",
  C2: "Nativo",
};

export type Card = {
  id: string;
  fr: string;
  es: string;
  theme: Theme;
  level: Level;
  example?: string;
  exampleEs?: string;
  gender?: "m" | "f" | "pl" | null;
};

export type Rating = "again" | "hard" | "good" | "easy";

export type CardState = {
  id: string;
  ease: number;
  interval: number; // days
  reps: number;
  lapses: number;
  due: string; // ISO date string (date only)
  lastReviewed?: string; // ISO datetime
};

export type Sentence = {
  id: string;
  fr: string;
  es: string;
  theme: Theme;
  level: Level;
  source: string; // e.g. "Cours 10"
};

export type DailyLog = {
  date: string; // YYYY-MM-DD
  reviews: number;
  newWords: number;
  sentencesRead: number;
};
