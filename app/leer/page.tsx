"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { getEffectiveSentences } from "@/lib/content";
import { speakFrench, primeVoices } from "@/lib/speech";
import { addCustomCard, bumpLog, getOrCreateState } from "@/lib/storage";
import { translateWord } from "@/lib/translate";
import type { Card } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function LeerPage() {
  const order = useMemo(() => shuffle(getEffectiveSentences()), []);
  const [i, setI] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [readCount, setReadCount] = useState(0);
  const [addOpen, setAddOpen] = useState(false);
  const [word, setWord] = useState("");
  const [meaning, setMeaning] = useState("");
  const [meaningLoading, setMeaningLoading] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);
  const translatingFor = useRef<string | null>(null);

  const sentence = order[i % order.length];

  useEffect(() => {
    primeVoices();
  }, []);

  useEffect(() => {
    if (sentence) speakFrench(sentence.fr);
  }, [sentence?.id]);

  function next() {
    bumpLog({ sentencesRead: 1 });
    setReadCount((c) => c + 1);
    setRevealed(false);
    setAddOpen(false);
    setI((v) => v + 1);
  }

  function tapWord(raw: string) {
    const clean = raw.replace(/^[«»"“”.,!?;:()]+|[«»"“”.,!?;:()]+$/g, "");
    if (!clean) return;
    setWord(clean);
    setMeaning("");
    setAddOpen(true);
    setMeaningLoading(true);
    translatingFor.current = clean;
    translateWord(clean).then((t) => {
      if (translatingFor.current !== clean) return; // el usuario ya tocó otra palabra
      setMeaningLoading(false);
      if (t) setMeaning(t);
    });
  }

  function saveWord() {
    if (!word.trim() || !meaning.trim()) return;
    const card: Card = {
      id: `perso-${Date.now()}`,
      fr: word.trim(),
      es: meaning.trim(),
      theme: "perso",
      level: sentence.level,
      example: sentence.fr,
      exampleEs: sentence.es,
    };
    addCustomCard(card);
    getOrCreateState(card.id);
    setWord("");
    setMeaning("");
    setAddOpen(false);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1800);
  }

  return (
    <div className="max-w-lg mx-auto w-full px-6 py-10 flex-1 flex flex-col">
      <div className="flex items-center justify-between mb-10">
        <span className="text-xs uppercase tracking-wide text-ink-faint">
          Input comprensible · {readCount} leídas hoy
        </span>
        <span className="text-[11px] px-2.5 py-1 rounded-full bg-dusk-soft text-dusk">
          {sentence.source}
        </span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center gap-6 flip-in" key={sentence.id}>
        <div className="flex items-center gap-3 justify-center px-2">
          <h1 className="font-serif text-2xl sm:text-3xl text-ink leading-snug max-w-md">
            {sentence.fr.split(" ").map((w, idx) => (
              <span key={idx}>
                <button
                  onClick={() => tapWord(w)}
                  className="rounded px-0.5 -mx-0.5 hover:bg-clay-soft hover:text-clay transition-colors active:bg-clay-soft"
                >
                  {w}
                </button>{" "}
              </span>
            ))}
          </h1>
        </div>
        <p className="text-[11px] text-ink-faint -mt-4">toca una palabra si no la entendiste</p>
        <button
          onClick={() => speakFrench(sentence.fr, { userInitiated: true })}
          aria-label="Escuchar"
          className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-ink-soft hover:bg-surface hover:text-ink transition-colors"
        >
          🔊
        </button>

        {revealed ? (
          <p className="text-ink-soft text-lg">{sentence.es}</p>
        ) : (
          <button
            onClick={() => setRevealed(true)}
            className="text-sm text-dusk underline decoration-dashed underline-offset-4"
          >
            Mostrar traducción
          </button>
        )}

        {!addOpen ? (
          <button
            onClick={() => { translatingFor.current = null; setWord(""); setMeaning(""); setMeaningLoading(false); setAddOpen(true); }}
            className="text-xs text-ink-faint hover:text-clay transition-colors mt-2"
          >
            o anota una frase completa →
          </button>
        ) : (
          <div className="w-full max-w-sm bg-bg-soft border border-border rounded-xl p-4 flex flex-col gap-2 text-left">
            <p className="text-xs text-ink-faint mb-1">
              Anótala — se agrega a tus tarjetas de repaso.
            </p>
            <input
              value={word}
              onChange={(e) => setWord(e.target.value)}
              placeholder="palabra en francés"
              className="rounded-lg border border-border bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sage/40"
            />
            <input
              value={meaning}
              onChange={(e) => setMeaning(e.target.value)}
              placeholder={meaningLoading ? "buscando significado…" : "qué significa"}
              className="rounded-lg border border-border bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sage/40"
            />
            {meaning && !meaningLoading && (
              <p className="text-[11px] text-ink-faint -mt-1">sugerido automáticamente — corrígelo si hace falta</p>
            )}
            <div className="flex gap-2 mt-1">
              <button onClick={saveWord} className="flex-1 rounded-full bg-sage text-bg text-xs py-2 hover:opacity-90 shadow-soft">
                Guardar
              </button>
              <button onClick={() => setAddOpen(false)} className="px-4 rounded-full border border-border text-ink-soft text-xs">
                Cancelar
              </button>
            </div>
          </div>
        )}

        {savedFlash && <p className="text-xs text-sage-ink">Guardada — la verás en "Repasar" 🌿</p>}
      </div>

      <div className="flex items-center justify-between mt-10 pt-6 border-t border-border">
        <Link href="/" className="text-sm text-ink-faint hover:text-ink">
          ← hoy
        </Link>
        <button
          onClick={next}
          className="rounded-full bg-ink text-bg px-6 py-2.5 text-sm font-medium hover:opacity-90 transition-opacity shadow-soft"
        >
          Siguiente frase →
        </button>
      </div>
    </div>
  );
}
