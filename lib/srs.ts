import type { CardState, Rating } from "@/lib/types";

// SM-2 simplificado (el algoritmo detrás de Anki), con umbrales suaves para
// no castigar demasiado un "difícil" — evita la frustración que hace que la
// gente abandone las apps de SRS.
const MIN_EASE = 1.3;

export function todayISO(d = new Date()): string {
  return d.toISOString().slice(0, 10);
}

export function addDays(dateISO: string, days: number): string {
  const d = new Date(dateISO + "T00:00:00");
  d.setDate(d.getDate() + Math.round(days));
  return todayISO(d);
}

export function newCardState(id: string): CardState {
  return {
    id,
    ease: 2.5,
    interval: 0,
    reps: 0,
    lapses: 0,
    due: todayISO(),
  };
}

export function isDue(state: CardState, onISO = todayISO()): boolean {
  return state.due <= onISO;
}

export function review(state: CardState, rating: Rating, now = new Date()): CardState {
  const nowISO = todayISO(now);
  let { ease, interval, reps, lapses } = state;

  if (rating === "again") {
    lapses += 1;
    reps = 0;
    ease = Math.max(MIN_EASE, ease - 0.2);
    interval = 0; // vuelve a aparecer en la misma sesión (due hoy)
  } else {
    reps += 1;
    if (rating === "hard") {
      ease = Math.max(MIN_EASE, ease - 0.15);
      interval = interval <= 0 ? 1 : Math.max(1, interval * 1.2);
    } else if (rating === "good") {
      interval = reps === 1 ? 1 : reps === 2 ? 3 : Math.round(interval * ease);
    } else if (rating === "easy") {
      ease = ease + 0.15;
      interval = reps === 1 ? 4 : Math.round(interval * ease * 1.3);
    }
    interval = Math.min(interval, 180); // tope de 6 meses
  }

  return {
    id: state.id,
    ease,
    interval,
    reps,
    lapses,
    due: addDays(nowISO, interval),
    lastReviewed: now.toISOString(),
  };
}
