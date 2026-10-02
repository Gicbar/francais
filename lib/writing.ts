// Arma los ejercicios de escritura (módulo /escribir) a partir del contenido
// que ya existe: tarjetas, frases, ejemplos y los conectores de
// data/connectors.ts. Cada ejercicio tiene un id estable para poder llevar
// estadística de aciertos/fallos por palabra.
import type { Level } from "@/lib/types";
import { allCards } from "@/lib/deck";
import { getEffectiveSentences } from "@/lib/content";
import { connectorExercises } from "@/data/connectors";
import type { SpellStat } from "@/lib/storage";

export type WriteMode = "words" | "dictWords" | "dictSentences" | "connectors";

export type WriteItem = {
  id: string;
  mode: WriteMode;
  level: Level;
  answers: string[]; // formas válidas; la primera es la que se muestra
  prompt?: string; // pista en español (modo words)
  speak?: string; // texto a reproducir (dictado) o a leer al corregir
  es?: string; // traducción, se muestra después de corregir
  sentence?: string; // conectores: frase con "___"
  hint?: string; // conectores: función del hueco
  example?: string;
};

export const MODE_META: Record<WriteMode, { title: string; blurb: string; icon: string }> = {
  words: {
    title: "Escribir palabras",
    blurb: "Ves el significado en español y escribes la palabra en francés, con su artículo y sus acentos.",
    icon: "✍️",
  },
  dictWords: {
    title: "Dictado de palabras",
    blurb: "Escuchas la palabra y la escribes. Entrena el oído y la ortografía a la vez.",
    icon: "🎧",
  },
  dictSentences: {
    title: "Dictado de frases",
    blurb: "Escuchas una frase completa y la escribes entera: concordancias, apóstrofes, et vs est…",
    icon: "📝",
  },
  connectors: {
    title: "Conectores",
    blurb: "Completa la frase con el conector o la preposición correcta: mais, donc, parce que, chez, depuis…",
    icon: "🔗",
  },
};

export const MODES: WriteMode[] = ["words", "dictWords", "dictSentences", "connectors"];

// El texto que se reproduce no debe incluir "(e)" ni "...".
function speakable(s: string): string {
  return s.replace(/\([^)]*\)/g, "").replace(/\.{3}/g, "").replace(/\s+/g, " ").trim();
}

export function buildPool(mode: WriteMode): WriteItem[] {
  if (mode === "words") {
    return allCards().map((c) => ({
      id: `w:${c.id}`,
      mode,
      level: c.level,
      answers: [c.fr],
      prompt: c.es,
      speak: speakable(c.fr),
      example: c.example,
    }));
  }

  if (mode === "dictWords") {
    return allCards()
      .filter((c) => !/[/()→]|\.\.\./.test(c.fr) && c.fr.split(/\s+/).length <= 4)
      .map((c) => ({
        id: `dw:${c.id}`,
        mode,
        level: c.level,
        answers: [c.fr],
        speak: c.fr,
        es: c.es,
      }));
  }

  if (mode === "dictSentences") {
    const fromSentences: WriteItem[] = getEffectiveSentences().map((s) => ({
      id: `ds:${s.id}`,
      mode,
      level: s.level,
      answers: [s.fr],
      speak: s.fr,
      es: s.es,
    }));
    const fromExamples: WriteItem[] = allCards()
      .filter((c) => c.example)
      .map((c) => ({
        id: `de:${c.id}`,
        mode,
        level: c.level,
        answers: [c.example as string],
        speak: c.example as string,
        es: c.exampleEs,
      }));
    return [...fromSentences, ...fromExamples];
  }

  return connectorExercises.map((k) => ({
    id: `c:${k.id}`,
    mode,
    level: k.level,
    answers: k.answers,
    sentence: k.sentence,
    es: k.es,
    hint: k.hint,
    speak: k.sentence.replace("___", k.answers[0]),
  }));
}

export const MASTERED_STREAK = 3;

export function isMastered(stat: SpellStat | undefined): boolean {
  return !!stat && stat.streak >= MASTERED_STREAK;
}

// Muestreo ponderado sin reemplazo: lo nuevo y lo que más se falla sale más
// seguido; lo ya dominado (3 aciertos seguidos) casi no vuelve.
export function pickSession(pool: WriteItem[], stats: Record<string, SpellStat>, n: number): WriteItem[] {
  const weight = (it: WriteItem) => {
    const s = stats[it.id];
    if (!s) return 1.5;
    const failRate = s.fail / Math.max(1, s.ok + s.fail);
    return 0.25 + 3 * failRate + (s.streak < MASTERED_STREAK ? 0.75 : 0);
  };
  const left = pool.map((item) => ({ item, w: weight(item) }));
  const picked: WriteItem[] = [];
  while (picked.length < n && left.length > 0) {
    const total = left.reduce((sum, x) => sum + x.w, 0);
    let r = Math.random() * total;
    let idx = 0;
    for (; idx < left.length - 1; idx++) {
      r -= left[idx].w;
      if (r <= 0) break;
    }
    picked.push(left[idx].item);
    left.splice(idx, 1);
  }
  return picked;
}
