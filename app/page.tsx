"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { dueCount, totalMastered, totalStarted, categoryProgress, strugglingCards, levelProgress } from "@/lib/deck";
import { getStreak, getAudioPlays, lifetimeSentencesRead, getGrammarProgress } from "@/lib/storage";
import { seedSentences } from "@/data/sentences";
import { grammarNotes } from "@/data/grammar-notes";
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
    (ReturnType<typeof categoryProgress> & { audio: number; sentencesRead: number; grammarDone: number }) | null
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
    setCat({ ...categoryProgress(), audio: getAudioPlays(), sentencesRead: lifetimeSentencesRead(), grammarDone });

    const lp = levelProgress();
    const active = LEVELS.find((l) => lp[l].total > 0 && lp[l].started < lp[l].total) ?? LEVELS.find((l) => lp[l].total > 0);
    setCurrentLevel(active ?? "A1");
  }, []);

  return (
    <div className="max-w-2xl mx-auto w-full px-6 py-12 sm:py-16 flex flex-col gap-11 fade-up">
      <div>
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="tricolor"><span /><span /><span /></span>
          <p className="text-xs uppercase tracking-[0.14em] text-ink-faint">Bonjour</p>
          {currentLevel && (
            <Link
              href="/niveles"
              className="ml-auto text-[11px] px-2.5 py-1 rounded-full bg-sage-soft text-sage-ink hover:opacity-80 transition-opacity"
            >
              Nivel {currentLevel} →
            </Link>
          )}
        </div>
        <h1 className="font-serif text-[2rem] sm:text-4xl text-ink leading-[1.15]">
          Un poco cada día,<br />
          <span className="italic text-sage-ink">no todo de golpe.</span>
        </h1>
        <p className="text-ink-soft mt-4 max-w-md leading-relaxed">
          Diez minutos de recuperación activa valen más que una hora de repasar
          pasivamente. Esta página está pensada para eso: sesiones cortas,
          espaciadas y mezcladas por tema.
        </p>
      </div>

      <div className="flex items-stretch gap-3 sm:gap-4">
        <div className="grid grid-cols-2 gap-3 flex-1">
          <StatCard icon="🔥" label="racha" value={stats ? `${stats.streak}` : "–"} sub={stats?.streak === 1 ? "día" : "días"} accent="clay" />
          <StatCard icon="🌿" label="dominadas" value={stats ? `${stats.mastered}` : "–"} sub={`de ${stats?.started ?? 0}`} accent="sage" />
        </div>
        <div className="card px-4 py-3.5 flex flex-col items-center justify-center gap-1.5 shrink-0">
          <GoalRing />
          <span className="text-[10px] text-ink-faint tracking-wide">meta de hoy</span>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Link href="/review" className="card card-hover group p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sage to-sage/30" />
          <div className="w-11 h-11 rounded-2xl bg-sage-soft flex items-center justify-center text-lg mb-4">
            🗂️
          </div>
          <h2 className="font-serif text-xl mb-1.5 text-ink">Repasar</h2>
          <p className="text-sm text-ink-soft leading-relaxed">
            Tarjetas con repetición espaciada. Recuerda antes de revelar — eso
            es lo que fija la memoria.
          </p>
          <span className="inline-flex items-center gap-1 mt-4 text-sm text-sage-ink font-medium">
            {stats ? `${stats.due} tarjetas listas` : "cargando…"}
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </span>
        </Link>

        <Link href="/leer" className="card card-hover group p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-dusk to-dusk/30" />
          <div className="w-11 h-11 rounded-2xl bg-dusk-soft flex items-center justify-center text-lg mb-4">
            📖
          </div>
          <h2 className="font-serif text-xl mb-1.5 text-ink">Leer</h2>
          <p className="text-sm text-ink-soft leading-relaxed">
            Frases reales de tus clases, con audio. Input comprensible: lo
            entiendes casi todo, aprendes lo que falta.
          </p>
          <span className="inline-flex items-center gap-1 mt-4 text-sm text-dusk font-medium">
            frases nuevas cada día
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </span>
        </Link>
      </div>

      {stats && stats.struggling > 0 && (
        <Link
          href="/errores"
          className="card px-5 py-4 text-sm text-clay flex items-center justify-between hover:opacity-90 transition-opacity border-clay/25 bg-clay-soft"
        >
          <span className="flex items-center gap-2.5">
            <span className="text-base">⚠️</span>
            {stats.struggling} palabra{stats.struggling === 1 ? "" : "s"} se te está{stats.struggling === 1 ? "" : "n"} resistiendo
          </span>
          <span className="font-medium">reforzar →</span>
        </Link>
      )}

      <div className="card p-5 sm:p-6">
        <h2 className="font-serif text-lg text-ink mb-5">Tu progreso</h2>
        <div className="flex flex-col gap-4">
          <ProgressRow
            href="/review"
            icon="📚"
            label="Vocabulario"
            detail={cat ? `${cat.vocabulario.mastered} dominadas de ${cat.vocabulario.total}` : "…"}
            pct={cat ? pct(cat.vocabulario.mastered, cat.vocabulario.total) : 0}
            color="sage"
          />
          <ProgressRow
            href="/gramatica"
            icon="✏️"
            label="Gramática"
            detail={cat ? `${cat.grammarDone} reglas dominadas de ${grammarNotes.length}` : "…"}
            pct={cat ? pct(cat.grammarDone, grammarNotes.length) : 0}
            color="dusk"
          />
          <ProgressRow
            href="/leer"
            icon="👂"
            label="Comprensión"
            detail={cat ? `${cat.sentencesRead} frases leídas en total` : "…"}
            pct={cat ? pct(cat.sentencesRead, seedSentences.length) : 0}
            color="sage"
          />
          <ProgressRow
            href="/pronunciacion"
            icon="🗣️"
            label="Pronunciación"
            detail={cat ? `${cat.audio} reproducciones escuchadas` : "…"}
            pct={cat ? pct(cat.audio, 100) : 0}
            color="dusk"
          />
          <div className="flex items-center gap-3.5 py-1 opacity-50">
            <span className="w-8 h-8 rounded-xl bg-border flex items-center justify-center text-sm shrink-0">💬</span>
            <div className="min-w-0">
              <p className="text-sm text-ink">Conversación</p>
              <p className="text-xs text-ink-faint">próximamente — necesita un tutor con IA</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-start gap-3 text-xs text-ink-faint leading-relaxed border-t border-border pt-6">
        <span className="tricolor mt-1 shrink-0"><span /><span /><span /></span>
        <p>
          Método: práctica espaciada, recuperación activa, mezcla de temas
          (interleaving), ejemplos concretos y audio + texto a la vez
          (codificación dual). Sin rachas de fuego ni corazones que se acaban —
          solo lo que la evidencia dice que funciona.
        </p>
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
  icon,
  label,
  detail,
  pct,
  color,
}: {
  href: string;
  icon: string;
  label: string;
  detail: string;
  pct: number;
  color: "sage" | "dusk";
}) {
  return (
    <Link href={href} className="flex items-center gap-3.5 group -mx-2 px-2 py-1.5 rounded-xl hover:bg-bg-soft transition-colors">
      <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm shrink-0 ${color === "sage" ? "bg-sage-soft" : "bg-dusk-soft"}`}>
        {icon}
      </span>
      <div className="w-24 sm:w-28 shrink-0">
        <p className="text-sm text-ink group-hover:underline decoration-dashed underline-offset-4">{label}</p>
        <p className="text-[11px] text-ink-faint">{detail}</p>
      </div>
      <div className="flex-1 h-1.5 rounded-full bg-border overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color === "sage" ? "bg-sage" : "bg-dusk"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-[11px] text-ink-faint w-8 text-right shrink-0 tabular-nums">{pct}%</span>
    </Link>
  );
}

function StatCard({
  icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: string;
  label: string;
  value: string;
  sub?: string;
  accent: "sage" | "clay";
}) {
  return (
    <div className="card px-4 py-4 text-center relative overflow-hidden">
      <div className={`absolute top-0 left-0 right-0 h-1 ${accent === "sage" ? "bg-sage/60" : "bg-clay/60"}`} />
      <div className="text-base mb-1">{icon}</div>
      <div className="font-serif text-2xl text-ink">{value}</div>
      <div className="text-[11px] uppercase tracking-wide text-ink-faint mt-1">{label}</div>
      {sub && <div className="text-[11px] text-ink-faint">{sub}</div>}
    </div>
  );
}
