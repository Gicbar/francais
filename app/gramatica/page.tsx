"use client";

import { useEffect, useState } from "react";
import type { GrammarNote, Drill } from "@/data/grammar-notes";
import { getGrammarProgress, saveGrammarResult, type GrammarProgress } from "@/lib/storage";
import { getEffectiveGrammarNotes } from "@/lib/content";
import { LEVELS, LEVEL_LABEL } from "@/lib/types";

function normalize(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/[’]/g, "'")
    .replace(/[.!]+$/, "");
}

export default function GramaticaPage() {
  const [progress, setProgress] = useState<GrammarProgress>({});
  const [open, setOpen] = useState<string | null>(null);
  const [grammarNotes, setGrammarNotes] = useState<GrammarNote[]>(() => getEffectiveGrammarNotes());

  useEffect(() => {
    setProgress(getGrammarProgress());
    setGrammarNotes(getEffectiveGrammarNotes());
  }, []);

  const doneCount = Object.values(progress).filter((p) => p.done).length;

  return (
    <div className="max-w-2xl mx-auto w-full px-6 py-14 flex flex-col gap-8 fade-up">
      <div>
        <p className="text-sm text-ink-faint mb-2">Enseñar → practicar → corregir</p>
        <h1 className="font-serif text-3xl text-ink leading-tight">Gramática</h1>
        <p className="text-ink-soft mt-3 max-w-md leading-relaxed">
          Cada regla se explica con un ejemplo antes/después, luego la
          practicas. Si te equivocas, te explico por qué — no solo la
          respuesta correcta.
        </p>
        <p className="text-xs text-ink-faint mt-4">{doneCount} de {grammarNotes.length} reglas dominadas</p>
      </div>

      <div className="flex flex-col gap-8">
        {LEVELS.map((level) => {
          const notes = grammarNotes.filter((n) => n.level === level);
          if (notes.length === 0) return null;
          const levelDone = notes.filter((n) => progress[n.id]?.done).length;
          return (
            <div key={level} className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="font-serif text-lg text-ink">{level}</span>
                <span className="text-xs text-ink-faint">{LEVEL_LABEL[level]} · {levelDone}/{notes.length}</span>
              </div>
              {notes.map((note) => (
                <RuleCard
                  key={note.id}
                  note={note}
                  isOpen={open === note.id}
                  onToggle={() => setOpen(open === note.id ? null : note.id)}
                  done={progress[note.id]?.done ?? false}
                  onResult={(correct, total) => {
                    saveGrammarResult(note.id, correct, total);
                    setProgress(getGrammarProgress());
                  }}
                />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RuleCard({
  note,
  isOpen,
  onToggle,
  done,
  onResult,
}: {
  note: GrammarNote;
  isOpen: boolean;
  onToggle: () => void;
  done: boolean;
  onResult: (correct: number, total: number) => void;
}) {
  const [answers, setAnswers] = useState<string[]>(() => note.drills.map(() => ""));
  const [checked, setChecked] = useState(false);
  const [results, setResults] = useState<boolean[]>([]);

  function check() {
    const res = note.drills.map((d, idx) => d.answers.some((a) => normalize(a) === normalize(answers[idx] ?? "")));
    setResults(res);
    setChecked(true);
    onResult(res.filter(Boolean).length, note.drills.length);
  }

  return (
    <div className="rounded-2xl border border-border bg-surface overflow-hidden shadow-soft">
      <button onClick={onToggle} className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left">
        <span className="font-medium text-ink flex items-center gap-2">
          {note.title}
          {done && <span className="text-xs text-sage-ink">✓</span>}
        </span>
        <span className={`text-ink-faint text-sm transition-transform ${isOpen ? "rotate-180" : ""}`}>⌄</span>
      </button>

      {isOpen && (
        <div className="px-5 pb-5 flex flex-col gap-4 border-t border-border pt-4">
          <div className="flex flex-col gap-1.5 text-sm">
            <p className="text-clay line-through decoration-clay/60">{note.wrong}</p>
            <p className="text-sage-ink">{note.right}</p>
            <p className="text-ink-soft leading-relaxed mt-1">{note.why}</p>
          </div>

          <div className="flex flex-col gap-2.5">
            <p className="text-xs uppercase tracking-wide text-ink-faint">Practica</p>
            {note.drills.map((drill, idx) => (
              <DrillRow
                key={idx}
                drill={drill}
                value={answers[idx] ?? ""}
                onChange={(v) => setAnswers((a) => a.map((x, i) => (i === idx ? v : x)))}
                checked={checked}
                correct={results[idx]}
              />
            ))}
            <div className="flex items-center gap-3 mt-1">
              <button
                onClick={check}
                className="rounded-full bg-ink text-bg px-5 py-2 text-xs font-medium hover:opacity-90 transition-opacity shadow-soft"
              >
                Corregir
              </button>
              {checked && (
                <span className="text-xs text-ink-soft">
                  {results.filter(Boolean).length} / {note.drills.length} correctas
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DrillRow({
  drill,
  value,
  onChange,
  checked,
  correct,
}: {
  drill: Drill;
  value: string;
  onChange: (v: string) => void;
  checked: boolean;
  correct?: boolean;
}) {
  const [before, after] = drill.prompt.split("___");
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1.5 flex-wrap text-sm text-ink">
        <span>{before}</span>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-24 rounded-md border px-2 py-1 text-sm bg-bg-soft focus:outline-none focus:ring-2 focus:ring-sage/40 ${
            checked ? (correct ? "border-sage text-sage-ink" : "border-clay text-clay") : "border-border"
          }`}
        />
        <span>{after}</span>
      </div>
      {checked && !correct && (
        <p className="text-[11px] text-clay">respuesta: {drill.answers[0]}</p>
      )}
    </div>
  );
}
