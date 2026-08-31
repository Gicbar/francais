"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { strugglingCards } from "@/lib/deck";
import { setFocusQueue } from "@/lib/storage";
import { getEffectiveGrammarNotes } from "@/lib/content";
import type { GrammarNote } from "@/data/grammar-notes";
import type { Card, CardState } from "@/lib/types";

export default function ErroresPage() {
  const router = useRouter();
  const [items, setItems] = useState<{ card: Card; state: CardState }[] | null>(null);
  const [grammarNotes, setGrammarNotes] = useState<GrammarNote[]>(() => getEffectiveGrammarNotes());

  useEffect(() => {
    setItems(strugglingCards());
    setGrammarNotes(getEffectiveGrammarNotes());
  }, []);

  function reinforce(ids: string[]) {
    setFocusQueue(ids);
    router.push("/review");
  }

  return (
    <div className="max-w-2xl mx-auto w-full px-6 py-14 flex flex-col gap-12 fade-up">
      <div>
        <p className="text-sm text-ink-faint mb-2">Corrección con contexto</p>
        <h1 className="font-serif text-3xl text-ink leading-tight">Mis errores</h1>
        <p className="text-ink-soft mt-3 max-w-md leading-relaxed">
          No solo la respuesta correcta — el porqué. Esto es lo que de verdad
          se te complica, no una lista genérica.
        </p>
      </div>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-xl text-ink">Palabras que se te resisten</h2>
          {items && items.length > 0 && (
            <button
              onClick={() => reinforce(items.map((i) => i.card.id))}
              className="text-sm text-sage-ink hover:underline"
            >
              reforzar todas →
            </button>
          )}
        </div>

        {items === null ? (
          <p className="text-sm text-ink-faint">cargando…</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-ink-faint bg-bg-soft border border-border rounded-xl px-5 py-4">
            Todavía no tienes palabras que falles de forma repetida. Cuando una
            tarjeta se te resista dos veces, aparecerá aquí para reforzarla aparte.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {items.map(({ card, state }) => (
              <div
                key={card.id}
                className="flex items-center justify-between gap-4 rounded-xl border border-border bg-surface px-4 py-3 shadow-soft"
              >
                <div>
                  <p className="text-ink font-medium">
                    {card.fr} <span className="text-ink-faint font-normal">— {card.es}</span>
                  </p>
                  {card.example && <p className="text-xs text-ink-faint mt-0.5 italic">{card.example}</p>}
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs px-2 py-1 rounded-full bg-clay-soft text-clay">
                    fallada {state.lapses}×
                  </span>
                  <button
                    onClick={() => reinforce([card.id])}
                    className="text-xs text-sage-ink hover:underline whitespace-nowrap"
                  >
                    reforzar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="font-serif text-xl text-ink mb-1">Reglas para repasar</h2>
        <p className="text-sm text-ink-soft mb-4">
          Los errores más comunes en tus clases — con la razón, no solo la corrección.
        </p>
        <div className="flex flex-col gap-3">
          {grammarNotes.map((note) => (
            <details key={note.id} className="group rounded-xl border border-border bg-surface px-5 py-4 shadow-soft">
              <summary className="cursor-pointer list-none flex items-center justify-between gap-3">
                <span className="font-medium text-ink">{note.title}</span>
                <span className="text-ink-faint text-sm group-open:rotate-180 transition-transform">⌄</span>
              </summary>
              <div className="mt-3 flex flex-col gap-2 text-sm">
                <p className="text-clay line-through decoration-clay/60">{note.wrong}</p>
                <p className="text-sage-ink">{note.right}</p>
                <p className="text-ink-soft leading-relaxed mt-1">{note.why}</p>
                <button
                  onClick={() => reinforce(note.cardIds)}
                  className="self-start mt-1 text-xs text-dusk hover:underline"
                >
                  practicar esto →
                </button>
              </div>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
