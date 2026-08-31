"use client";

import { useEffect, useState } from "react";
import { levelProgress } from "@/lib/deck";
import { LEVELS, LEVEL_LABEL, type Level } from "@/lib/types";
import type { GrammarNote } from "@/data/grammar-notes";
import { getGrammarProgress } from "@/lib/storage";
import { getEffectiveGrammarNotes } from "@/lib/content";

const LEVEL_BLURB: Record<Level, string> = {
  A1: "Lo básico: presentarte, gustos, objetos cotidianos, verbos esenciales.",
  A2: "Pasado y futuro cercano, opiniones, rutina diaria, comparar cosas.",
  B1: "Contar historias, expresar hipótesis, argumentar una opinión con matices.",
  B2: "Debatir con fluidez, entender medios de comunicación, matices abstractos.",
  C1: "Precisión casi nativa: registro formal/informal, ironía, matices sutiles.",
  C2: "Nivel nativo: dominio completo, sin esfuerzo perceptible al hablar o escribir.",
};

export default function NivelesPage() {
  const [progress, setProgress] = useState<ReturnType<typeof levelProgress> | null>(null);
  const [grammarDone, setGrammarDone] = useState<Record<string, boolean>>({});
  const [grammarNotes, setGrammarNotes] = useState<GrammarNote[]>(() => getEffectiveGrammarNotes());

  useEffect(() => {
    setProgress(levelProgress());
    setGrammarNotes(getEffectiveGrammarNotes());
    const gp = getGrammarProgress();
    const done: Record<string, boolean> = {};
    Object.entries(gp).forEach(([id, p]) => (done[id] = p.done));
    setGrammarDone(done);
  }, []);

  return (
    <div className="max-w-2xl mx-auto w-full px-6 py-14 flex flex-col gap-8 fade-up">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="tricolor"><span /><span /><span /></span>
          <p className="text-xs uppercase tracking-[0.14em] text-ink-faint">A1 → C2</p>
        </div>
        <h1 className="font-serif text-3xl text-ink leading-tight">Tu camino hasta hablar como nativo</h1>
        <p className="text-ink-soft mt-3 max-w-md leading-relaxed">
          El contenido se agrega nivel por nivel, pero nunca dejas de repasar
          los anteriores: el sistema de repetición espaciada sigue trayendo
          palabras y reglas de A1 para siempre, aunque ya estés en B2. No se
          pierden las bases por avanzar.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {LEVELS.map((level, idx) => {
          const p = progress?.[level];
          const notes = grammarNotes.filter((n) => n.level === level);
          const notesDone = notes.filter((n) => grammarDone[n.id]).length;
          const hasContent = (p?.total ?? 0) > 0 || notes.length > 0;
          const pct = p && p.total > 0 ? Math.min(100, Math.round((p.mastered / p.total) * 100)) : 0;

          return (
            <div key={level} className={`card p-5 relative overflow-hidden ${!hasContent ? "opacity-55" : ""}`}>
              <div className={`absolute top-0 left-0 right-0 h-1 ${idx % 2 === 0 ? "bg-sage/60" : "bg-dusk/60"}`} />
              <div className="flex items-center justify-between gap-3 mb-1.5">
                <div className="flex items-center gap-3">
                  <span className="font-serif text-xl text-ink">{level}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-bg-soft text-ink-faint">{LEVEL_LABEL[level]}</span>
                </div>
                {!hasContent && <span className="text-[11px] text-ink-faint">próximamente</span>}
              </div>
              <p className="text-sm text-ink-soft leading-relaxed mb-3">{LEVEL_BLURB[level]}</p>

              {hasContent ? (
                <>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 rounded-full bg-border overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${idx % 2 === 0 ? "bg-sage" : "bg-dusk"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-[11px] text-ink-faint w-10 text-right tabular-nums">{pct}%</span>
                  </div>
                  <p className="text-[11px] text-ink-faint mt-2">
                    {p?.mastered ?? 0} palabras dominadas de {p?.total ?? 0}
                    {notes.length > 0 && ` · ${notesDone} de ${notes.length} reglas gramaticales`}
                  </p>
                </>
              ) : (
                <p className="text-[11px] text-ink-faint">Se irá llenando en próximas actualizaciones de la app.</p>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-xs text-ink-faint leading-relaxed border-t border-border pt-6">
        Las tarjetas nuevas de "Repasar" siempre salen del nivel más bajo que
        aún tengas sin empezar — no vas a ver vocabulario de B1 hasta agotar
        lo nuevo de A2, por ejemplo. Pero una vez aprendida, cualquier
        palabra sigue volviendo a repasarse para siempre según el algoritmo
        de repetición espaciada, sin importar en qué nivel estés ahora.
      </p>
    </div>
  );
}
