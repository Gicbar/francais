"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { dueCount, totalMastered, totalStarted, categoryProgress, strugglingCards, levelProgress } from "@/lib/deck";
import { getStreak, getAudioPlays, lifetimeSentencesRead, getGrammarProgress } from "@/lib/storage";
import { getEffectiveSentences, getEffectiveGrammarNotes } from "@/lib/content";
import { LEVELS } from "@/lib/types";
import GoalRing from "@/components/GoalRing";

export default function Home() {
  const [stats, setStats] = useState<{
    due: number;
    streak: number;
    started: number;
    mastered: number;
    struggling: number;
  } | null>(null);
  const [cat, setCat] = useState<
    | (ReturnType<typeof categoryProgress> & {
        audio: number;
        sentencesRead: number;
        sentencesTotal: number;
        grammarDone: number;
        grammarTotal: number;
      })
    | null
  >(null);
  const [currentLevel, setCurrentLevel] = useState<string | null>(null);

  useEffect(() => {
    setStats({
      due: dueCount(),
      streak: getStreak().count,
      started: totalStarted(),
      mastered: totalMastered(),
      struggling: strugglingCards().length,
    });
    const grammarDone = Object.values(getGrammarProgress()).filter((p) => p.done).length;
    setCat({
      ...categoryProgress(),
      audio: getAudioPlays(),
      sentencesRead: lifetimeSentencesRead(),
      sentencesTotal: getEffectiveSentences().length,
      grammarDone,
      grammarTotal: getEffectiveGrammarNotes().length,
    });

    const lp = levelProgress();
    const active = LEVELS.find((l) => lp[l].total > 0 && lp[l].started < lp[l].total) ?? LEVELS.find((l) => lp[l].total > 0);
    setCurrentLevel(active ?? "A1");
  }, []);

  const due = stats?.due ?? 0;
  const minutes = Math.max(1, Math.round(Math.min(due, 10) * 0.5));

  return (
    <div className="max-w-2xl mx-auto w-full px-5 sm:px-6 py-10 sm:py-14 flex flex-col gap-8 fade-up">
      <div className="flex items-baseline justify-between gap-3">
        <h1 className="font-serif text-3xl sm:text-4xl text-ink leading-tight">Bonjour.</h1>
        {currentLevel && (
          <Link href="/niveles" className="text-sm text-ink-soft hover:text-ink underline decoration-dotted underline-offset-4">
            Nivel {currentLevel}
          </Link>
        )}
      </div>

      <Link
        href="/review"
        className="card card-hover group p-6 sm:p-8 flex items-center gap-5 border-sage/40"
      >
        <div className="min-w-0 flex-1">
          <p className="text-sm text-ink-soft">Tu práctica de hoy</p>
          <p className="font-serif text-3xl sm:text-4xl text-ink mt-1">
            {stats ? (due > 0 ? `${due} tarjetas` : "Al día") : "…"}
          </p>
          <p className="text-sm text-ink-soft mt-2">
            {stats && due > 0 ? `Unos ${minutes} min. Empieza por aquí y listo.` : "Nada pendiente. Lee una frase o una historia."}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-sage text-bg px-5 py-3 text-sm font-semibold group-hover:opacity-90">
          {due > 0 ? "Empezar" : "Repasar igual"}
        </span>
      </Link>

      <div className="flex items-center gap-5 card px-5 py-4">
        <GoalRing />
        <dl className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm flex-1">
          <dt className="text-ink-soft">Racha</dt>
          <dd className="text-ink font-medium text-right">{stats ? `${stats.streak} ${stats.streak === 1 ? "día" : "días"}` : "–"}</dd>
          <dt className="text-ink-soft">Dominadas</dt>
          <dd className="text-ink font-medium text-right">{stats ? `${stats.mastered} de ${stats.started}` : "–"}</dd>
        </dl>
      </div>

      {stats && stats.struggling > 0 && (
        <Link
          href="/errores"
          className="card px-5 py-3.5 text-sm text-clay flex items-center justify-between hover:opacity-90 transition-opacity border-clay/30 bg-clay-soft"
        >
          <span>
            {stats.struggling} palabra{stats.struggling === 1 ? "" : "s"} se te resiste{stats.struggling === 1 ? "" : "n"}
          </span>
          <span className="font-medium">Reforzar</span>
        </Link>
      )}

      <div className="flex flex-wrap gap-2 text-sm">
        <span className="text-ink-faint w-full">Si te queda tiempo</span>
        {[
          { href: "/leer", label: "Leer frases" },
          { href: "/escuchar", label: "Escuchar un diálogo" },
          { href: "/escribir", label: "Escribir" },
        ].map((l) => (
          <Link key={l.href} href={l.href} className="px-4 py-2 rounded-full border border-border bg-surface text-ink-soft hover:text-ink hover:border-sage/50 transition-colors">
            {l.label}
          </Link>
        ))}
      </div>

      <div className="card p-5 sm:p-6">
        <h2 className="font-serif text-lg text-ink mb-4">Tu progreso</h2>
        <div className="flex flex-col gap-3.5">
          <ProgressRow
            href="/review"
            label="Vocabulario"
            detail={cat ? `${cat.vocabulario.mastered} de ${cat.vocabulario.total}` : "…"}
            pct={cat ? pct(cat.vocabulario.mastered, cat.vocabulario.total) : 0}
            color="sage"
          />
          <ProgressRow
            href="/gramatica"
            label="Gramática"
            detail={cat ? `${cat.grammarDone} de ${cat.grammarTotal} reglas` : "…"}
            pct={cat ? pct(cat.grammarDone, cat.grammarTotal) : 0}
            color="dusk"
          />
          <ProgressRow
            href="/leer"
            label="Lectura"
            detail={cat ? `${cat.sentencesRead} frases` : "…"}
            pct={cat ? pct(cat.sentencesRead, cat.sentencesTotal) : 0}
            color="sage"
          />
        </div>
      </div>
    </div>
  );
}

function pct(n: number, total: number) {
  if (total <= 0) return 0;
  return Math.min(100, Math.round((n / total) * 100));
}

function ProgressRow({
  href,
  label,
  detail,
  pct,
  color,
}: {
  href: string;
  label: string;
  detail: string;
  pct: number;
  color: "sage" | "dusk";
}) {
  return (
    <Link href={href} className="flex items-center gap-4 group -mx-2 px-2 py-1 rounded-lg hover:bg-bg-soft transition-colors">
      <div className="w-32 shrink-0">
        <p className="text-sm text-ink">{label}</p>
        <p className="text-[11px] text-ink-faint">{detail}</p>
      </div>
      <div className="flex-1 h-1.5 rounded-full bg-border overflow-hidden">
        <div className={`h-full rounded-full ${color === "sage" ? "bg-sage" : "bg-dusk"}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[11px] text-ink-faint w-8 text-right shrink-0 tabular-nums">{pct}%</span>
    </Link>
  );
}
