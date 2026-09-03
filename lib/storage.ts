import type { Card, CardState, DailyLog } from "@/lib/types";
import { newCardState, todayISO } from "@/lib/srs";

const KEYS = {
  states: "fr.cardStates.v1",
  custom: "fr.customCards.v1",
  notes: "fr.notes.v1",
  logs: "fr.logs.v1",
  streak: "fr.streak.v1",
  goal: "fr.dailyGoal.v1",
  audioPlays: "fr.audioPlays.v1",
  storiesRead: "fr.storiesRead.v1",
  listeningDone: "fr.listeningDone.v1",
  focus: "fr.focusQueue.v1",
  grammar: "fr.grammarProgress.v1",
  migrations: "fr.migrations.v1",
};

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // almacenamiento lleno o bloqueado: ignorar silenciosamente
  }
}

// --- Estados SRS por tarjeta ---
export function getAllStates(): Record<string, CardState> {
  return read<Record<string, CardState>>(KEYS.states, {});
}

export function getOrCreateState(id: string): CardState {
  const all = getAllStates();
  if (all[id]) return all[id];
  const fresh = newCardState(id);
  all[id] = fresh;
  write(KEYS.states, all);
  return fresh;
}

export function saveState(state: CardState) {
  const all = getAllStates();
  all[state.id] = state;
  write(KEYS.states, all);
}

// --- Tarjetas personalizadas (agregadas por el usuario) ---
export function getCustomCards(): Card[] {
  return read<Card[]>(KEYS.custom, []);
}

export function addCustomCard(card: Card) {
  const all = getCustomCards();
  all.push(card);
  write(KEYS.custom, all);
}

// --- Notas de elaboración: frases propias que el usuario escribe por tarjeta ---
export function getNotes(): Record<string, string[]> {
  return read<Record<string, string[]>>(KEYS.notes, {});
}

export function addNote(cardId: string, sentence: string) {
  const all = getNotes();
  if (!all[cardId]) all[cardId] = [];
  all[cardId].push(sentence);
  write(KEYS.notes, all);
}

// --- Registro diario + racha ---
export function getLogs(): Record<string, DailyLog> {
  return read<Record<string, DailyLog>>(KEYS.logs, {});
}

export function lifetimeSentencesRead(): number {
  return Object.values(getLogs()).reduce((sum, l) => sum + l.sentencesRead, 0);
}

export function bumpLog(patch: Partial<Omit<DailyLog, "date">>) {
  const date = todayISO();
  const logs = getLogs();
  const current = logs[date] ?? { date, reviews: 0, newWords: 0, sentencesRead: 0 };
  logs[date] = {
    date,
    reviews: current.reviews + (patch.reviews ?? 0),
    newWords: current.newWords + (patch.newWords ?? 0),
    sentencesRead: current.sentencesRead + (patch.sentencesRead ?? 0),
  };
  write(KEYS.logs, logs);
  updateStreak(date);
}

function updateStreak(date: string) {
  const streak = read<{ count: number; lastDate: string }>(KEYS.streak, { count: 0, lastDate: "" });
  if (streak.lastDate === date) return; // ya contado hoy
  const yesterday = new Date(date + "T00:00:00");
  yesterday.setDate(yesterday.getDate() - 1);
  const yISO = yesterday.toISOString().slice(0, 10);
  const nextCount = streak.lastDate === yISO ? streak.count + 1 : 1;
  write(KEYS.streak, { count: nextCount, lastDate: date });
}

export function getStreak(): { count: number; lastDate: string } {
  return read<{ count: number; lastDate: string }>(KEYS.streak, { count: 0, lastDate: "" });
}

// --- Meta diaria (patrón Duolingo, sin gamificación agresiva) ---
export function getDailyGoal(): number {
  return read<number>(KEYS.goal, 15);
}

export function setDailyGoal(n: number) {
  write(KEYS.goal, Math.max(5, Math.round(n)));
}

export function getTodayProgress(): number {
  const logs = getLogs();
  const today = logs[todayISO()];
  return today ? today.reviews : 0;
}

// --- Reproducciones de audio (proxy honesto de práctica de pronunciación) ---
export function bumpAudioPlays() {
  const n = read<number>(KEYS.audioPlays, 0);
  write(KEYS.audioPlays, n + 1);
}

export function getAudioPlays(): number {
  return read<number>(KEYS.audioPlays, 0);
}

// --- Historias leídas (módulo /historias) ---
export function getStoriesReadIds(): string[] {
  return read<string[]>(KEYS.storiesRead, []);
}

export function markStoryRead(id: string) {
  const ids = getStoriesReadIds();
  if (!ids.includes(id)) write(KEYS.storiesRead, [...ids, id]);
}

// --- Diálogos de comprensión oral completados (módulo /escuchar) ---
export function getListeningDoneIds(): string[] {
  return read<string[]>(KEYS.listeningDone, []);
}

export function markListeningDone(id: string) {
  const ids = getListeningDoneIds();
  if (!ids.includes(id)) write(KEYS.listeningDone, [...ids, id]);
}

// --- Cola de refuerzo: ids de tarjetas para una sesión enfocada (p.ej. desde "Mis errores") ---
export function setFocusQueue(ids: string[]) {
  write(KEYS.focus, ids);
}

// --- Progreso de reglas gramaticales (módulo /gramatica) ---
export type GrammarProgress = Record<string, { correct: number; total: number; done: boolean }>;

export function getGrammarProgress(): GrammarProgress {
  return read<GrammarProgress>(KEYS.grammar, {});
}

export function saveGrammarResult(ruleId: string, correct: number, total: number) {
  const all = getGrammarProgress();
  const prevDone = all[ruleId]?.done ?? false;
  all[ruleId] = { correct, total, done: prevDone || correct === total };
  write(KEYS.grammar, all);
}

export function popFocusQueue(): string[] {
  const ids = read<string[]>(KEYS.focus, []);
  write(KEYS.focus, []);
  return ids;
}

// --- Migraciones de una sola vez, para reparar datos de versiones con bugs ---
export function runMigrations() {
  const done = read<string[]>(KEYS.migrations, []);

  if (!done.includes("fix-eager-state-creation")) {
    // Bug real: dueAndFresh() creaba estado SRS para cada tarjeta sin
    // repasar con solo abrir el dashboard, marcando todo el mazo como
    // "vence hoy" desde la primera visita. Un estado nunca tocado por el
    // usuario no tiene lastReviewed — se borra para devolverle a la
    // tarjeta su condición real de "nueva, no vista todavía".
    const states = getAllStates();
    let changed = false;
    for (const id of Object.keys(states)) {
      if (!states[id].lastReviewed) {
        delete states[id];
        changed = true;
      }
    }
    if (changed) write(KEYS.states, states);
    write(KEYS.migrations, [...done, "fix-eager-state-creation"]);
  }
}
