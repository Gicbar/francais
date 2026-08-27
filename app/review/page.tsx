"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { buildSession, buildFocusedSession, SESSION_LENGTHS, type SessionCard } from "@/lib/deck";
import { review } from "@/lib/srs";
import { saveState, bumpLog, addNote, popFocusQueue } from "@/lib/storage";
import { speakFrench, primeVoices } from "@/lib/speech";
import type { Card, Rating } from "@/lib/types";

type LengthOption = 5 | 15 | 30 | "todo";

const THEME_LABEL: Record<string, string> = {
  salutations: "Saludos",
  couleurs: "Colores",
  nourriture: "Comida",
  bureau: "Oficina",
  loisirs: "Aficiones",
  verbes: "Verbos",
  possessifs: "Posesivos",
  phrases: "Conectores",
  essentiel: "Esencial",
  perso: "Tuyo",
};

const RATINGS: { key: Rating; label: string; hint: string; cls: string }[] = [
  { key: "again", label: "De nuevo", hint: "no lo recordé", cls: "border-clay/40 bg-clay-soft text-clay" },
  { key: "hard", label: "Difícil", hint: "con esfuerzo", cls: "border-dusk/40 bg-dusk-soft text-dusk" },
  { key: "good", label: "Bien", hint: "lo recordé", cls: "border-sage/40 bg-sage-soft text-sage-ink" },
  { key: "easy", label: "Fácil", hint: "sin pensar", cls: "border-sage/60 bg-sage-soft text-sage-ink" },
];

export default function ReviewPage() {
  const [queue, setQueue] = useState<SessionCard[] | null>(null);
  const [total, setTotal] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [elaborationCard, setElaborationCard] = useState<Card | null>(null);
  const [note, setNote] = useState("");
  const [done, setDone] = useState(0);
  const [focusMode, setFocusMode] = useState(false);
  const [picking, setPicking] = useState(true);

  useEffect(() => {
    primeVoices();
    const focusIds = popFocusQueue();
    if (focusIds.length > 0) {
      const session = buildFocusedSession(focusIds);
      setQueue(session);
      setTotal(session.length);
      setFocusMode(true);
      setPicking(false);
    }
  }, []);

  function start(length: LengthOption) {
    const limit = length === "todo" ? undefined : SESSION_LENGTHS[length];
    const session = buildSession(limit);
    setQueue(session);
    setTotal(session.length);
    setPicking(false);
  }

  const current = queue && queue.length > 0 ? queue[0] : null;

  useEffect(() => {
    if (current && !elaborationCard) speakFrench(current.card.fr);
  }, [current?.card.id, elaborationCard]);

  // Atajos de teclado (patrón Anki): espacio revela, 1-4 califica.
  useEffect(() => {
    if (!current || elaborationCard) return;
    function onKey(e: KeyboardEvent) {
      if (e.repeat) return;
      if (!revealed && (e.code === "Space" || e.key === "Enter")) {
        e.preventDefault();
        setRevealed(true);
        return;
      }
      if (revealed) {
        const idx = { "1": 0, "2": 1, "3": 2, "4": 3 }[e.key];
        if (idx !== undefined) {
          e.preventDefault();
          rate(RATINGS[idx].key);
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current?.card.id, revealed, elaborationCard]);

  function rate(rating: Rating) {
    if (!current || !queue) return;
    const newState = review(current.state, rating);
    saveState(newState);
    bumpLog({ reviews: 1, newWords: current.isNew ? 1 : 0 });
    setDone((d) => d + 1);

    const rest = queue.slice(1);
    let nextQueue = rest;
    if (rating === "again") {
      const insertAt = Math.min(rest.length, 3);
      nextQueue = [
        ...rest.slice(0, insertAt),
        { ...current, state: newState, isNew: false },
        ...rest.slice(insertAt),
      ];
    }
    setQueue(nextQueue);
    setRevealed(false);

    if (current.isNew && rating !== "again") {
      setElaborationCard(current.card);
    }
  }

  function submitElaboration() {
    if (elaborationCard && note.trim()) addNote(elaborationCard.id, note.trim());
    setNote("");
    setElaborationCard(null);
  }

  if (picking) {
    return (
      <div className="max-w-lg mx-auto w-full px-6 py-16 flex-1 flex flex-col items-center justify-center text-center gap-8 fade-up">
        <div>
          <h1 className="font-serif text-2xl text-ink mb-2">¿Cuánto tiempo tienes?</h1>
          <p className="text-sm text-ink-soft">Una sesión corta y constante vale más que una larga de vez en cuando.</p>
        </div>
        <div className="grid grid-cols-3 gap-3 w-full">
          {([5, 15, 30] as const).map((m) => (
            <button
              key={m}
              onClick={() => start(m)}
              className="card card-hover py-6 flex flex-col items-center gap-1 hover:border-sage/50"
            >
              <span className="font-serif text-2xl text-ink">{m}</span>
              <span className="text-xs text-ink-faint">min · ~{SESSION_LENGTHS[m]} tarjetas</span>
            </button>
          ))}
        </div>
        <button onClick={() => start("todo")} className="text-sm text-dusk underline decoration-dashed underline-offset-4">
          repasar todo lo pendiente
        </button>
      </div>
    );
  }

  if (!queue) {
    return <div className="max-w-lg mx-auto w-full px-6 py-20 text-center text-ink-faint">cargando…</div>;
  }

  if (elaborationCard) {
    return (
      <div className="max-w-lg mx-auto w-full px-6 py-14 flex-1 flex flex-col justify-center fade-up">
        <p className="text-xs uppercase tracking-wide text-dusk mb-3">Elaboración · opcional</p>
        <h2 className="font-serif text-2xl text-ink mb-2">
          Escribe una frase propia con <span className="italic">"{elaborationCard.fr}"</span>
        </h2>
        <p className="text-sm text-ink-soft mb-6 leading-relaxed">
          Inventar tu propio ejemplo fija la palabra mejor que solo reconocerla.
          No tiene que ser perfecta.
        </p>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Ex : Ma souris est noire."
          rows={3}
          className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-sage/40 resize-none"
        />
        <div className="flex gap-3 mt-4">
          <button
            onClick={submitElaboration}
            className="flex-1 rounded-full bg-sage text-bg py-3 text-sm font-medium hover:opacity-90 transition-opacity shadow-soft"
          >
            Guardar y continuar
          </button>
          <button
            onClick={() => { setNote(""); setElaborationCard(null); }}
            className="px-5 rounded-full border border-border text-ink-soft text-sm hover:bg-surface"
          >
            Saltar
          </button>
        </div>
      </div>
    );
  }

  if (!current) {
    return (
      <div className="max-w-lg mx-auto w-full px-6 py-20 flex-1 flex flex-col items-center justify-center text-center fade-up">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-sage to-dusk flex items-center justify-center text-bg text-2xl mb-5 shadow-lift">
          ✓
        </div>
        <h1 className="font-serif text-2xl text-ink mb-2">Sesión terminada</h1>
        <p className="text-ink-soft mb-8">
          {done} tarjeta{done === 1 ? "" : "s"} repasada{done === 1 ? "" : "s"}
          {focusMode
            ? ". Reforzaste justo lo que se te resistía."
            : ". Vuelve más tarde por más — la memoria se fija mejor espaciando, no acumulando."}
        </p>
        <div className="flex gap-3">
          <Link href="/" className="rounded-full bg-ink text-bg px-6 py-3 text-sm font-medium hover:opacity-90 transition-opacity shadow-soft">
            Volver a hoy
          </Link>
          {focusMode && (
            <Link href="/errores" className="rounded-full border border-border px-6 py-3 text-sm text-ink-soft hover:bg-surface transition-colors">
              Mis errores
            </Link>
          )}
        </div>
      </div>
    );
  }

  const progress = total > 0 ? Math.min(100, Math.round((done / total) * 100)) : 0;

  return (
    <div className="max-w-lg mx-auto w-full px-6 py-10 flex-1 flex flex-col">
      <div className="w-full h-1 rounded-full bg-border overflow-hidden mb-10">
        <div className="h-full bg-sage transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center gap-6 flip-in" key={current.card.id}>
        <span className="text-xs uppercase tracking-wide text-ink-faint flex items-center gap-2">
          <span className="px-1.5 py-0.5 rounded bg-bg-soft text-ink-faint font-medium">{current.card.level}</span>
          {THEME_LABEL[current.card.theme] ?? current.card.theme}
          {current.isNew && <span className="text-dusk">· nueva</span>}
        </span>

        <div className="flex items-center gap-3 max-w-full px-2">
          <h1 className="font-serif text-[1.75rem] sm:text-4xl text-ink leading-snug break-words">{current.card.fr}</h1>
          <button
            onClick={() => speakFrench(current.card.fr, { userInitiated: true })}
            aria-label="Escuchar"
            className="shrink-0 w-9 h-9 rounded-full border border-border flex items-center justify-center text-ink-soft hover:bg-surface hover:text-ink transition-colors"
          >
            🔊
          </button>
        </div>

        {current.card.gender && (
          <span className="text-xs px-2.5 py-1 rounded-full bg-dusk-soft text-dusk">
            {current.card.gender === "m" ? "masculino" : current.card.gender === "f" ? "femenino" : "plural"}
          </span>
        )}

        {!revealed ? (
          <button
            onClick={() => setRevealed(true)}
            className="mt-4 rounded-full bg-ink text-bg px-7 py-3 text-sm font-medium hover:opacity-90 transition-opacity shadow-soft"
          >
            Recordar → revelar
          </button>
        ) : (
          <div className="mt-2 flex flex-col items-center gap-4 w-full">
            <p className="text-xl text-sage-ink font-medium">{current.card.es}</p>
            {current.card.example && (
              <div className="bg-bg-soft border border-border rounded-xl px-5 py-3.5 text-sm max-w-sm">
                <p className="italic text-ink">{current.card.example}</p>
                {current.card.exampleEs && <p className="text-ink-faint mt-1">{current.card.exampleEs}</p>}
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full mt-3">
              {RATINGS.map((r, idx) => (
                <button
                  key={r.key}
                  onClick={() => rate(r.key)}
                  className={`flex flex-col items-center justify-center gap-0.5 rounded-xl border min-h-[54px] py-2.5 text-sm font-medium transition-transform active:scale-95 hover:-translate-y-0.5 ${r.cls}`}
                >
                  <span>{r.label}</span>
                  <span className="text-[10px] opacity-70 hidden sm:inline">{r.hint} · {idx + 1}</span>
                </button>
              ))}
            </div>
            <p className="hidden sm:block text-[11px] text-ink-faint mt-1">
              espacio para revelar · 1–4 para calificar
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
