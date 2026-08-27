import { seedCards } from "@/data/cards";
import type { Card, CardState, Theme, Level } from "@/lib/types";
import { LEVELS } from "@/lib/types";
import { getAllStates, getCustomCards, getOrCreateState } from "@/lib/storage";
import { isDue, todayISO } from "@/lib/srs";

function levelRank(level: Level): number {
  return LEVELS.indexOf(level);
}

export function allCards(): Card[] {
  return [...seedCards, ...getCustomCards()];
}

export function cardById(id: string): Card | undefined {
  return allCards().find((c) => c.id === id);
}

// Interleaving: baraja para no repetir el mismo tema seguido, en vez de
// bloquear por categoría (mezclar temas mejora la retención a largo plazo).
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export type SessionCard = { card: Card; state: CardState; isNew: boolean };

const NEW_CARDS_PER_SESSION = 8;

// ~25-30s por tarjeta (recordar + audio + calificar) en promedio.
export const SESSION_LENGTHS = {
  5: 10,
  15: 28,
  30: 55,
} as const;

function dueAndFresh() {
  const cards = allCards();
  const states = getAllStates();
  const today = todayISO();

  const due: SessionCard[] = [];
  const fresh: SessionCard[] = [];

  for (const card of cards) {
    const existing = states[card.id];
    if (existing) {
      if (isDue(existing, today)) due.push({ card, state: existing, isNew: false });
    } else {
      fresh.push({ card, state: getOrCreateState(card.id), isNew: true });
    }
  }
  return { due, fresh };
}

// Introduce tarjetas nuevas nivel por nivel: no aparece ninguna A2 hasta
// que las A1 sin empezar se agoten (y así sucesivamente) — progresión sin
// perder de vista que lo básico va primero. Dentro de un mismo nivel, el
// orden es aleatorio (sort estable sobre un array ya barajado).
function levelOrderedFresh(fresh: SessionCard[]): SessionCard[] {
  return shuffle(fresh).sort((a, b) => levelRank(a.card.level) - levelRank(b.card.level));
}

export function buildSession(limit?: number): SessionCard[] {
  const { due, fresh } = dueAndFresh();
  const shuffledDue = shuffle(due);

  if (limit !== undefined) {
    const dueSlice = shuffledDue.slice(0, limit);
    const remaining = Math.max(0, limit - dueSlice.length);
    const newBatch = levelOrderedFresh(fresh).slice(0, Math.min(remaining, NEW_CARDS_PER_SESSION));
    return shuffle([...dueSlice, ...newBatch]);
  }

  const newBatch = levelOrderedFresh(fresh).slice(0, NEW_CARDS_PER_SESSION);
  return shuffle([...shuffledDue, ...newBatch]);
}

// Sesión enfocada en tarjetas específicas (p.ej. desde "Mis errores").
export function buildFocusedSession(ids: string[]): SessionCard[] {
  const states = getAllStates();
  const cards = allCards();
  const list: SessionCard[] = [];
  for (const id of ids) {
    const card = cards.find((c) => c.id === id);
    if (!card) continue;
    const state = states[id] ?? getOrCreateState(id);
    list.push({ card, state, isNew: !states[id] });
  }
  return shuffle(list);
}

export function dueCount(): number {
  const { due, fresh } = dueAndFresh();
  return due.length + Math.min(fresh.length, NEW_CARDS_PER_SESSION);
}

export function totalMastered(): number {
  const states = getAllStates();
  return Object.values(states).filter((s) => s.interval >= 21).length;
}

export function totalStarted(): number {
  return Object.keys(getAllStates()).length;
}

// Tarjetas que se resisten: han fallado al menos dos veces alguna vez.
export function strugglingCards(): { card: Card; state: CardState }[] {
  const states = getAllStates();
  const cards = allCards();
  return cards
    .map((card) => ({ card, state: states[card.id] }))
    .filter((x): x is { card: Card; state: CardState } => !!x.state && x.state.lapses >= 2)
    .sort((a, b) => b.state.lapses - a.state.lapses);
}

const GRAMMAR_THEMES: Theme[] = ["possessifs", "verbes", "phrases"];

export function categoryProgress() {
  const states = getAllStates();
  const cards = allCards();

  function progressFor(themes: Theme[]) {
    const inTheme = cards.filter((c) => themes.includes(c.theme));
    const started = inTheme.filter((c) => states[c.id]);
    const mastered = started.filter((c) => states[c.id].interval >= 21);
    return { total: inTheme.length, started: started.length, mastered: mastered.length };
  }

  return {
    vocabulario: progressFor(["couleurs", "nourriture", "bureau", "loisirs", "salutations", "essentiel", "perso"]),
    gramatica: progressFor(GRAMMAR_THEMES),
  };
}

// Progreso de vocabulario por nivel CEFR (A1-C2) — para el mapa de niveles.
export function levelProgress(): Record<Level, { total: number; started: number; mastered: number }> {
  const states = getAllStates();
  const cards = allCards();
  const result = {} as Record<Level, { total: number; started: number; mastered: number }>;
  for (const level of LEVELS) {
    const inLevel = cards.filter((c) => c.level === level);
    const started = inLevel.filter((c) => states[c.id]);
    const mastered = started.filter((c) => states[c.id].interval >= 21);
    result[level] = { total: inLevel.length, started: started.length, mastered: mastered.length };
  }
  return result;
}
