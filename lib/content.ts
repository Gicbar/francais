// Contenido "efectivo": usa lo último descargado de GitHub si existe y es
// válido, si no cae de vuelta al contenido incluido en el bundle (data/*.ts,
// exportado a public/content/*.json vía scripts/export-content.mjs). Así
// el contenido nuevo (nuevas clases, más vocabulario) puede llegar a
// usuarios ya instalados con solo un `git push` — sin esperar ni depender
// de que Vercel redespliegue la app completa.
import { seedCards as bundledCards } from "@/data/cards";
import { seedSentences as bundledSentences } from "@/data/sentences";
import { grammarNotes as bundledGrammarNotes, type GrammarNote } from "@/data/grammar-notes";
import { pronunciationItems as bundledPronunciation, type PronunciationItem } from "@/data/pronunciation";
import { seedStories as bundledStories, type Story } from "@/data/stories";
import { seedListening as bundledListening, type Listening } from "@/data/listening";
import type { Card, Sentence } from "@/lib/types";

const REMOTE_BASE =
  process.env.NEXT_PUBLIC_CONTENT_BASE_URL ??
  "https://raw.githubusercontent.com/Gicbar/francais/main/public/content";

const CACHE_KEY = "fr.remoteContent.v1";

type CachedContent = {
  version: string;
  cards: Card[];
  sentences: Sentence[];
  grammarNotes: GrammarNote[];
  pronunciation: PronunciationItem[];
  stories?: Story[];
  listening?: Listening[];
};

function readCache(): CachedContent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as CachedContent) : null;
  } catch {
    return null;
  }
}

export function getEffectiveCards(): Card[] {
  return readCache()?.cards ?? bundledCards;
}

export function getEffectiveSentences(): Sentence[] {
  return readCache()?.sentences ?? bundledSentences;
}

export function getEffectiveGrammarNotes(): GrammarNote[] {
  return readCache()?.grammarNotes ?? bundledGrammarNotes;
}

export function getEffectivePronunciation(): PronunciationItem[] {
  return readCache()?.pronunciation ?? bundledPronunciation;
}

export function getEffectiveStories(): Story[] {
  return readCache()?.stories ?? bundledStories;
}

export function getEffectiveListening(): Listening[] {
  return readCache()?.listening ?? bundledListening;
}

export function contentSource(): "remote" | "bundled" {
  return readCache() ? "remote" : "bundled";
}

// Se llama una vez al montar la app (ver components/Nav.tsx). No bloquea
// nada — si no hay internet, el fetch falla, hay CORS, o el JSON viene mal
// formado, la app sigue funcionando con el contenido del bundle sin que el
// usuario note nada. El resultado solo se aplica en la próxima lectura
// (recarga o navegación), nunca a mitad de una sesión en curso.
export async function checkForContentUpdates(): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    const metaRes = await fetch(`${REMOTE_BASE}/meta.json`, {
      signal: AbortSignal.timeout(4000),
      cache: "no-store",
    });
    if (!metaRes.ok) return;
    const meta: { version?: string } = await metaRes.json();
    if (!meta.version) return;

    const cached = readCache();
    if (cached && cached.version === meta.version) return; // ya está al día

    const [cardsRes, sentencesRes, grammarRes, pronRes, storiesRes, listeningRes] = await Promise.all([
      fetch(`${REMOTE_BASE}/cards.json`, { signal: AbortSignal.timeout(6000), cache: "no-store" }),
      fetch(`${REMOTE_BASE}/sentences.json`, { signal: AbortSignal.timeout(6000), cache: "no-store" }),
      fetch(`${REMOTE_BASE}/grammar-notes.json`, { signal: AbortSignal.timeout(6000), cache: "no-store" }),
      fetch(`${REMOTE_BASE}/pronunciation.json`, { signal: AbortSignal.timeout(6000), cache: "no-store" }),
      fetch(`${REMOTE_BASE}/stories.json`, { signal: AbortSignal.timeout(6000), cache: "no-store" }),
      fetch(`${REMOTE_BASE}/listening.json`, { signal: AbortSignal.timeout(6000), cache: "no-store" }),
    ]);
    if (!cardsRes.ok || !sentencesRes.ok || !grammarRes.ok || !pronRes.ok || !storiesRes.ok || !listeningRes.ok) return;

    const [cards, sentences, grammarNotes, pronunciation, stories, listening] = (await Promise.all([
      cardsRes.json(),
      sentencesRes.json(),
      grammarRes.json(),
      pronRes.json(),
      storiesRes.json(),
      listeningRes.json(),
    ])) as [Card[], Sentence[], GrammarNote[], PronunciationItem[], Story[], Listening[]];

    // Validación mínima: si algo viene vacío o con forma rara, es más
    // seguro no pisar el contenido bundleado que confiar ciegamente.
    if (!Array.isArray(cards) || cards.length === 0) return;
    if (!Array.isArray(sentences) || sentences.length === 0) return;
    if (!Array.isArray(grammarNotes) || grammarNotes.length === 0) return;
    if (!Array.isArray(pronunciation) || pronunciation.length === 0) return;
    if (!Array.isArray(stories) || stories.length === 0) return;
    if (!Array.isArray(listening) || listening.length === 0) return;
    if (!cards.every((c) => typeof c.id === "string" && typeof c.fr === "string")) return;

    const next: CachedContent = { version: meta.version, cards, sentences, grammarNotes, pronunciation, stories, listening };
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(next));
  } catch {
    // sin internet, timeout, JSON inválido — la app sigue con lo local.
  }
}
