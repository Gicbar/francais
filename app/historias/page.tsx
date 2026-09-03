"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { getEffectiveStories } from "@/lib/content";
import { STORY_THEME_LABEL, type Story } from "@/data/stories";
import { speakFrench, primeVoices } from "@/lib/speech";
import { addCustomCard, bumpLog, getOrCreateState, markStoryRead } from "@/lib/storage";
import { translateWord } from "@/lib/translate";
import { LEVELS, type Card, type Level } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function HistoriasPage() {
  const all = useMemo(() => shuffle(getEffectiveStories()), []);
  const [levelFilter, setLevelFilter] = useState<Level | "todos">("todos");
  const [i, setI] = useState(0);
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [readCount, setReadCount] = useState(0);
  const [addOpen, setAddOpen] = useState(false);
  const [word, setWord] = useState("");
  const [meaning, setMeaning] = useState("");
  const [meaningLoading, setMeaningLoading] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);
  const translatingFor = useRef<string | null>(null);

  const filtered = useMemo(
    () => (levelFilter === "todos" ? all : all.filter((s) => s.level === levelFilter)),
    [all, levelFilter]
  );
  const story: Story | undefined = filtered[i % Math.max(filtered.length, 1)];

  useEffect(() => {
    primeVoices();
  }, []);

  useEffect(() => {
    setI(0);
    setRevealed({});
  }, [levelFilter]);

  function playSentence(fr: string) {
    speakFrench(fr, { userInitiated: true });
  }

  function toggleReveal(idx: number) {
    setRevealed((r) => ({ ...r, [idx]: !r[idx] }));
  }

  function finishStory() {
    if (!story) return;
    markStoryRead(story.id);
    bumpLog({ sentencesRead: story.sentences.length });
    setReadCount((c) => c + 1);
    setRevealed({});
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
      if (translatingFor.current !== clean) return;
      setMeaningLoading(false);
      if (t) setMeaning(t);
    });
  }

  function saveWord() {
    if (!word.trim() || !meaning.trim() || !story) return;
    const card: Card = {
      id: `perso-${Date.now()}`,
      fr: word.trim(),
      es: meaning.trim(),
      theme: "perso",
      level: story.level,
      example: story.sentences[0]?.fr,
      exampleEs: story.sentences[0]?.es,
    };
    addCustomCard(card);
    getOrCreateState(card.id);
    setWord("");
    setMeaning("");
    setAddOpen(false);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1800);
  }

  if (!story) {
    return (
      <div className="max-w-lg mx-auto w-full px-6 py-10 text-center text-ink-faint">
        No hay historias para este nivel todavía.
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto w-full px-6 py-10 flex-1 flex flex-col">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
        <span className="text-xs uppercase tracking-wide text-ink-faint">
          Historias · {readCount} leídas hoy
        </span>
        <span className="text-[11px] px-2.5 py-1 rounded-full bg-dusk-soft text-dusk">
          {STORY_THEME_LABEL[story.theme]}
        </span>
      </div>

      <div className="flex gap-1.5 flex-wrap mb-8">
        <button
          onClick={() => setLevelFilter("todos")}
          className={`text-[11px] px-2.5 py-1 rounded-full border transition-colors ${
            levelFilter === "todos" ? "bg-ink text-bg border-ink" : "border-border text-ink-soft hover:text-ink"
          }`}
        >
          Todos
        </button>
        {LEVELS.map((lvl) => (
          <button
            key={lvl}
            onClick={() => setLevelFilter(lvl)}
            className={`text-[11px] px-2.5 py-1 rounded-full border transition-colors ${
              levelFilter === lvl ? "bg-ink text-bg border-ink" : "border-border text-ink-soft hover:text-ink"
            }`}
          >
            {lvl}
          </button>
        ))}
      </div>

      <div className="flex-1 flex flex-col gap-6 fade-up" key={story.id}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-sage-soft text-sage-ink">{story.level}</span>
            <h1 className="font-serif text-2xl text-ink leading-tight">{story.title}</h1>
          </div>
          <p className="text-ink-faint text-sm">{story.titleEs}</p>
        </div>

        <div className="flex flex-col gap-3">
          {story.sentences.map((s, idx) => (
            <div key={idx} className="card p-4">
              <div className="flex items-start gap-2">
                <button
                  onClick={() => playSentence(s.fr)}
                  aria-label="Escuchar"
                  className="shrink-0 w-7 h-7 mt-0.5 rounded-full border border-border flex items-center justify-center text-ink-soft hover:bg-surface hover:text-ink transition-colors text-xs"
                >
                  🔊
                </button>
                <p className="text-ink leading-relaxed">
                  {s.fr.split(" ").map((w, wi) => (
                    <span key={wi}>
                      <button
                        onClick={() => tapWord(w)}
                        className="rounded px-0.5 -mx-0.5 hover:bg-clay-soft hover:text-clay transition-colors active:bg-clay-soft"
                      >
                        {w}
                      </button>{" "}
                    </span>
                  ))}
                </p>
              </div>
              {revealed[idx] ? (
                <p className="text-ink-soft text-sm mt-2 ml-9">{s.es}</p>
              ) : (
                <button
                  onClick={() => toggleReveal(idx)}
                  className="text-xs text-dusk underline decoration-dashed underline-offset-4 mt-2 ml-9"
                >
                  traducir
                </button>
              )}
            </div>
          ))}
        </div>

        <p className="text-[11px] text-ink-faint text-center -mt-2">toca una palabra si no la entendiste</p>

        {!addOpen ? (
          <button
            onClick={() => { translatingFor.current = null; setWord(""); setMeaning(""); setMeaningLoading(false); setAddOpen(true); }}
            className="text-xs text-ink-faint hover:text-clay transition-colors self-center"
          >
            o anota una palabra tú mismo →
          </button>
        ) : (
          <div className="w-full bg-bg-soft border border-border rounded-xl p-4 flex flex-col gap-2 text-left">
            <p className="text-xs text-ink-faint mb-1">Anótala — se agrega a tus tarjetas de repaso.</p>
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

        {savedFlash && <p className="text-xs text-sage-ink text-center">Guardada — la verás en “Repasar” 🌿</p>}
      </div>

      <div className="flex items-center justify-between mt-10 pt-6 border-t border-border">
        <Link href="/" className="text-sm text-ink-faint hover:text-ink">
          ← hoy
        </Link>
        <button
          onClick={finishStory}
          className="rounded-full bg-ink text-bg px-6 py-2.5 text-sm font-medium hover:opacity-90 transition-opacity shadow-soft"
        >
          Historia siguiente →
        </button>
      </div>
    </div>
  );
}
