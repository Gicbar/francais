"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getEffectiveListening } from "@/lib/content";
import { LISTENING_THEME_LABEL, type Listening } from "@/data/listening";
import {
  primeVoices,
  playDialogue,
  dialoguePause,
  dialogueResume,
  dialogueNext,
  dialoguePrev,
  dialogueStop,
  type DialoguePlayerState,
} from "@/lib/speech";
import { markListeningDone } from "@/lib/storage";
import { LEVELS, type Level } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function EscucharPage() {
  const all = useMemo(() => shuffle(getEffectiveListening()), []);
  const [levelFilter, setLevelFilter] = useState<Level | "todos">("todos");
  const [i, setI] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [doneCount, setDoneCount] = useState(0);
  const [playState, setPlayState] = useState<DialoguePlayerState>("idle");
  const [lineIndex, setLineIndex] = useState(0);

  const filtered = useMemo(
    () => (levelFilter === "todos" ? all : all.filter((l) => l.level === levelFilter)),
    [all, levelFilter]
  );
  const item: Listening | undefined = filtered[i % Math.max(filtered.length, 1)];

  useEffect(() => {
    primeVoices();
    return () => dialogueStop();
  }, []);

  useEffect(() => {
    setI(0);
    resetForNew();
  }, [levelFilter]);

  function resetForNew() {
    dialogueStop();
    setPlayState("idle");
    setLineIndex(0);
    setShowTranscript(false);
    setAnswers({});
  }

  function play() {
    if (!item) return;
    playDialogue(
      item.lines.map((l) => ({ text: l.fr, pitch: l.speaker === "A" ? 1.12 : 0.88 })),
      { userInitiated: true },
      {
        onIndexChange: setLineIndex,
        onStateChange: setPlayState,
        onEnd: () => setPlayState("idle"),
      }
    );
  }

  function togglePlayPause() {
    if (playState === "playing") {
      dialoguePause();
    } else if (playState === "paused") {
      dialogueResume();
    } else {
      play();
    }
  }

  function goPrev() {
    if (playState === "idle") return;
    dialoguePrev();
  }

  function goNext() {
    if (playState === "idle") return;
    dialogueNext();
  }

  function answer(qIdx: number, optIdx: number) {
    setAnswers((a) => ({ ...a, [qIdx]: optIdx }));
  }

  const allAnswered = item ? Object.keys(answers).length === item.questions.length : false;
  const correctCount = item
    ? item.questions.reduce((sum, q, idx) => sum + (answers[idx] === q.correctIndex ? 1 : 0), 0)
    : 0;

  function next() {
    if (item) markListeningDone(item.id);
    setDoneCount((c) => c + 1);
    resetForNew();
    setI((v) => v + 1);
  }

  const playPauseLabel = playState === "playing" ? "⏸" : "▶";

  if (!item) {
    return (
      <div className="max-w-lg mx-auto w-full px-6 py-10 text-center text-ink-faint">
        No hay audios para este nivel todavía.
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto w-full px-6 py-10 flex-1 flex flex-col">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
        <span className="text-xs uppercase tracking-wide text-ink-faint">
          Escuchar · {doneCount} completados hoy
        </span>
        <span className="text-[11px] px-2.5 py-1 rounded-full bg-dusk-soft text-dusk">
          {LISTENING_THEME_LABEL[item.theme]}
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

      <div className="flex-1 flex flex-col gap-6 fade-up" key={item.id}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-sage-soft text-sage-ink">{item.level}</span>
            <h1 className="font-serif text-2xl text-ink leading-tight">{item.title}</h1>
          </div>
          <p className="text-ink-faint text-sm">
            Escucha el diálogo completo, luego responde. Puedes escucharlo varias veces.
          </p>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-3">
            <button
              onClick={goPrev}
              disabled={playState === "idle"}
              aria-label="Línea anterior"
              className="rounded-full border border-border text-ink-soft w-10 h-10 flex items-center justify-center hover:text-ink hover:bg-surface transition-colors disabled:opacity-40"
            >
              ⏮
            </button>
            <button
              onClick={togglePlayPause}
              aria-label={playState === "playing" ? "Pausar" : "Reproducir"}
              className="rounded-full bg-ink text-bg w-14 h-14 flex items-center justify-center text-lg hover:opacity-90 transition-opacity shadow-soft"
            >
              {playPauseLabel}
            </button>
            <button
              onClick={goNext}
              disabled={playState === "idle"}
              aria-label="Línea siguiente"
              className="rounded-full border border-border text-ink-soft w-10 h-10 flex items-center justify-center hover:text-ink hover:bg-surface transition-colors disabled:opacity-40"
            >
              ⏭
            </button>
          </div>
          {playState !== "idle" && (
            <span className="text-[11px] text-ink-faint">
              Línea {lineIndex + 1} / {item.lines.length}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-4">
          {item.questions.map((q, qIdx) => (
            <div key={qIdx} className="card p-4">
              <p className="text-sm text-ink mb-3">{qIdx + 1}. {q.q}</p>
              <div className="flex flex-col gap-2">
                {q.options.map((opt, optIdx) => {
                  const chosen = answers[qIdx] === optIdx;
                  const revealState = answers[qIdx] !== undefined;
                  const isCorrect = optIdx === q.correctIndex;
                  let cls = "border-border text-ink-soft hover:text-ink hover:bg-surface";
                  if (revealState && chosen && isCorrect) cls = "border-sage bg-sage-soft text-sage-ink";
                  else if (revealState && chosen && !isCorrect) cls = "border-clay bg-clay-soft text-clay";
                  else if (revealState && isCorrect) cls = "border-sage bg-sage-soft text-sage-ink";
                  return (
                    <button
                      key={optIdx}
                      onClick={() => answer(qIdx, optIdx)}
                      disabled={revealState}
                      className={`text-left text-sm px-3 py-2 rounded-lg border transition-colors ${cls}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {allAnswered && (
          <p className="text-sm text-center font-medium text-sage-ink">
            {correctCount} / {item.questions.length} correctas
          </p>
        )}

        {!showTranscript ? (
          <button
            onClick={() => setShowTranscript(true)}
            className="text-xs text-dusk underline decoration-dashed underline-offset-4 self-center"
          >
            ver transcripción
          </button>
        ) : (
          <div className="flex flex-col gap-2 bg-bg-soft border border-border rounded-xl p-4">
            {item.lines.map((l, idx) => (
              <div key={idx} className="text-sm">
                <p className="text-ink"><span className="text-ink-faint font-medium">{l.speaker}:</span> {l.fr}</p>
                <p className="text-ink-faint text-xs ml-4">{l.es}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-10 pt-6 border-t border-border">
        <Link href="/" className="text-sm text-ink-faint hover:text-ink">
          ← hoy
        </Link>
        <button
          onClick={next}
          className="rounded-full bg-ink text-bg px-6 py-2.5 text-sm font-medium hover:opacity-90 transition-opacity shadow-soft"
        >
          Diálogo siguiente →
        </button>
      </div>
    </div>
  );
}
