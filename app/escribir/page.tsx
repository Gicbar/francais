"use client";

import { useEffect, useRef, useState } from "react";
import { bumpLog, getSpellStrict, getSpelling, recordSpelling, setSpellStrict, type SpellStat } from "@/lib/storage";
import { speakFrench } from "@/lib/speech";
import { charMarks, compare, mask, type Cell, type Comparison, type Verdict } from "@/lib/spelling";
import { isMastered, buildPool, pickSession, MODES, MODE_META, type WriteItem, type WriteMode } from "@/lib/writing";
import { LEVELS, type Level } from "@/lib/types";

const SESSION_SIZE = 10;
const ACCENTS = ["à", "â", "ç", "é", "è", "ê", "ë", "î", "ï", "ô", "œ", "ù", "û", "ü", "«", "»"];

type Pools = Record<WriteMode, WriteItem[]>;
type Run = { mode: WriteMode; items: WriteItem[]; key: number };

export default function EscribirPage() {
  const [pools, setPools] = useState<Pools | null>(null);
  const [stats, setStats] = useState<Record<string, SpellStat>>({});
  const [strict, setStrict] = useState(true);
  const [level, setLevel] = useState<Level | "all">("all");
  const [onlyFails, setOnlyFails] = useState(false);
  const [run, setRun] = useState<Run | null>(null);
  const [empty, setEmpty] = useState<string | null>(null);
  const runCounter = useRef(0);

  useEffect(() => {
    setPools({
      words: buildPool("words"),
      dictWords: buildPool("dictWords"),
      dictSentences: buildPool("dictSentences"),
      connectors: buildPool("connectors"),
    });
    setStats(getSpelling());
    setStrict(getSpellStrict());
  }, []);

  function filtered(mode: WriteMode, st = stats): WriteItem[] {
    if (!pools) return [];
    return pools[mode].filter((it) => {
      if (level !== "all" && it.level !== level) return false;
      if (onlyFails) {
        const s = st[it.id];
        return !!s && s.fail > 0 && !isMastered(s);
      }
      return true;
    });
  }

  function start(mode: WriteMode) {
    const fresh = getSpelling();
    setStats(fresh);
    const pool = filtered(mode, fresh);
    if (pool.length === 0) {
      setEmpty(
        onlyFails
          ? "No tienes fallos pendientes en este modo (con este nivel). ¡Bien! Quita el filtro «solo mis fallos» para seguir."
          : "No hay ejercicios con ese nivel en este modo."
      );
      return;
    }
    setEmpty(null);
    setRun({ mode, items: pickSession(pool, fresh, SESSION_SIZE), key: runCounter.current++ });
  }

  function exit() {
    setRun(null);
    setStats(getSpelling());
  }

  if (run) {
    return (
      <Session
        key={run.key}
        mode={run.mode}
        items={run.items}
        strict={strict}
        onAgain={() => start(run.mode)}
        onRetry={(items) => setRun({ mode: run.mode, items, key: runCounter.current++ })}
        onExit={exit}
      />
    );
  }

  const weak = pools
    ? MODES.flatMap((m) => pools[m])
        .filter((it) => {
          const s = stats[it.id];
          return !!s && s.fail > 0 && !isMastered(s);
        })
        .sort((a, b) => weakScore(stats[b.id]) - weakScore(stats[a.id]))
        .slice(0, 8)
    : [];

  return (
    <div className="max-w-2xl mx-auto w-full px-6 py-14 flex flex-col gap-8 fade-up">
      <div>
        <p className="text-sm text-ink-faint mb-2">La única forma de escribir bien es escribir</p>
        <h1 className="font-serif text-3xl text-ink leading-tight">Escribir</h1>
        <p className="text-ink-soft mt-3 max-w-md leading-relaxed">
          Sesiones de 10 ejercicios. Lo que fallas vuelve más seguido; lo que
          aciertas 3 veces seguidas se da por aprendido. Al equivocarte ves
          letra por letra dónde está el error.
        </p>
      </div>

      <div className="card p-5 flex flex-col gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs uppercase tracking-wide text-ink-faint mr-1">Nivel</span>
          {(["all", ...LEVELS.filter((l) => l === "A1" || l === "A2" || l === "B1")] as (Level | "all")[]).map((l) => (
            <Chip key={l} active={level === l} onClick={() => setLevel(l)}>
              {l === "all" ? "Todos" : l}
            </Chip>
          ))}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Chip active={onlyFails} onClick={() => setOnlyFails(!onlyFails)}>
            Solo mis fallos
          </Chip>
          <Chip
            active={strict}
            onClick={() => {
              setSpellStrict(!strict);
              setStrict(!strict);
            }}
          >
            Acentos estrictos
          </Chip>
          <span className="text-[11px] text-ink-faint">
            {strict ? "una palabra sin sus acentos cuenta como fallo" : "sin acentos se acepta (pero te lo marco)"}
          </span>
        </div>
      </div>

      {empty && <p className="text-sm text-clay bg-clay-soft rounded-xl px-4 py-3">{empty}</p>}

      <div className="grid sm:grid-cols-2 gap-4">
        {MODES.map((m) => {
          const pool = pools?.[m] ?? [];
          const mastered = pool.filter((it) => isMastered(stats[it.id])).length;
          const pct = pool.length ? Math.round((mastered / pool.length) * 100) : 0;
          return (
            <button
              key={m}
              onClick={() => start(m)}
              disabled={!pools}
              className="card card-hover text-left p-5 flex flex-col gap-2 disabled:opacity-60"
            >
              <span className="w-10 h-10 rounded-2xl bg-sage-soft flex items-center justify-center text-lg">{MODE_META[m].icon}</span>
              <span className="font-serif text-lg text-ink">{MODE_META[m].title}</span>
              <span className="text-sm text-ink-soft leading-relaxed">{MODE_META[m].blurb}</span>
              <span className="mt-1 flex items-center gap-2.5">
                <span className="flex-1 h-1.5 rounded-full bg-border overflow-hidden">
                  <span className="block h-full rounded-full bg-sage" style={{ width: `${pct}%` }} />
                </span>
                <span className="text-[11px] text-ink-faint tabular-nums">
                  {mastered}/{pool.length}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {weak.length > 0 && (
        <div className="card p-5">
          <h2 className="font-serif text-lg text-ink mb-1">Lo que más se te resiste escribiendo</h2>
          <p className="text-xs text-ink-faint mb-4">Actívalo con «Solo mis fallos» para practicar justo esto.</p>
          <ul className="flex flex-col gap-2.5">
            {weak.map((it) => {
              const s = stats[it.id];
              return (
                <li key={it.id} className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="min-w-0">
                    <span className="text-ink font-medium">{it.answers[0]}</span>
                    {(it.prompt || it.es) && <span className="text-ink-faint"> · {it.prompt ?? it.es}</span>}
                  </span>
                  <span className="text-[11px] text-clay shrink-0 tabular-nums">
                    {s.fail} fallo{s.fail === 1 ? "" : "s"}
                    {s.accent > 0 ? ` · ${s.accent} de acento` : ""}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

function weakScore(s: SpellStat) {
  return s.fail * 2 + s.accent - s.ok * 0.5;
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
        active ? "bg-sage text-bg border-sage" : "bg-bg-soft border-border text-ink-soft hover:text-ink hover:bg-surface"
      }`}
    >
      {children}
    </button>
  );
}

type LogEntry = { item: WriteItem; input: string; verdict: Verdict; correct: boolean };

function Session({
  mode,
  items,
  strict,
  onAgain,
  onRetry,
  onExit,
}: {
  mode: WriteMode;
  items: WriteItem[];
  strict: boolean;
  onAgain: () => void;
  onRetry: (items: WriteItem[]) => void;
  onExit: () => void;
}) {
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState("");
  const [copy, setCopy] = useState("");
  const [copyMiss, setCopyMiss] = useState(false);
  const [result, setResult] = useState<Comparison | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [log, setLog] = useState<LogEntry[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const item = items[idx] as WriteItem | undefined;
  const isDictation = mode === "dictWords" || mode === "dictSentences";
  const correct = !!result && (result.verdict === "exact" || (result.verdict === "accent" && !strict));

  useEffect(() => {
    if (item && isDictation) speakFrench(item.speak ?? "");
    inputRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx]);

  useEffect(() => {
    if (result) inputRef.current?.focus();
  }, [result]);

  const value = result ? copy : input;
  const setValue = result ? setCopy : setInput;

  function insertAccent(ch: string) {
    const el = inputRef.current;
    const start = el?.selectionStart ?? value.length;
    const end = el?.selectionEnd ?? value.length;
    setValue(value.slice(0, start) + ch + value.slice(end));
    requestAnimationFrame(() => {
      el?.focus();
      el?.setSelectionRange(start + ch.length, start + ch.length);
    });
  }

  function check(force = false) {
    if (!item || result) return;
    if (!force && !input.trim()) return;
    const cmp = compare(input, item.answers);
    const ok = cmp.verdict === "exact" || (cmp.verdict === "accent" && !strict);
    recordSpelling(item.id, ok, cmp.verdict === "accent");
    bumpLog({});
    setResult(cmp);
    setLog((l) => [...l, { item, input, verdict: cmp.verdict, correct: ok }]);
    if (!isDictation && item.speak) speakFrench(item.speak);
  }

  function next() {
    setIdx((i) => i + 1);
    setInput("");
    setCopy("");
    setCopyMiss(false);
    setResult(null);
    setShowHint(false);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!result) return check();
    if (correct || !copy.trim()) return next();
    if (item && compare(copy, item.answers).verdict === "exact") return next();
    setCopyMiss(true);
  }

  // --- Resumen final ---
  if (!item) {
    const right = log.filter((l) => l.correct).length;
    const accentSlips = log.filter((l) => l.verdict === "accent").length;
    const failed = log.filter((l) => !l.correct).map((l) => l.item);
    return (
      <div className="max-w-2xl mx-auto w-full px-6 py-14 flex flex-col gap-6 fade-up">
        <div>
          <p className="text-sm text-ink-faint mb-2">{MODE_META[mode].title}</p>
          <h1 className="font-serif text-3xl text-ink">
            {right} / {log.length}
          </h1>
          <p className="text-ink-soft mt-2">
            {right === log.length
              ? "Sesión perfecta. Mañana vuelve para que se te quede."
              : accentSlips > 0
                ? `${accentSlips} fallo${accentSlips === 1 ? "" : "s"} fueron solo de acentos — se arreglan con la barra de acentos y fijándote en la letra.`
                : "Lo que fallaste vuelve más seguido en las próximas sesiones."}
          </p>
        </div>

        {failed.length > 0 && (
          <div className="card p-5">
            <h2 className="font-serif text-lg text-ink mb-3">Para repasar</h2>
            <ul className="flex flex-col gap-3">
              {log
                .filter((l) => !l.correct)
                .map((l) => (
                  <li key={l.item.id} className="text-sm">
                    <p className="text-ink font-medium">{l.item.sentence ? l.item.sentence.replace("___", `[${l.item.answers[0]}]`) : l.item.answers[0]}</p>
                    <p className="text-ink-faint text-xs">
                      {l.item.prompt ?? l.item.es}
                      {l.input.trim() && <span className="text-clay"> · escribiste: {l.input}</span>}
                    </p>
                  </li>
                ))}
            </ul>
          </div>
        )}

        <div className="flex gap-3 flex-wrap">
          <button onClick={onAgain} className="rounded-full bg-ink text-bg px-5 py-2.5 text-sm font-medium hover:opacity-90 shadow-soft">
            Otra ronda
          </button>
          {failed.length > 0 && (
            <button
              onClick={() => onRetry(failed)}
              className="rounded-full bg-clay-soft text-clay px-5 py-2.5 text-sm font-medium hover:opacity-90"
            >
              Repetir los {failed.length} fallados
            </button>
          )}
          <button onClick={onExit} className="rounded-full border border-border text-ink-soft px-5 py-2.5 text-sm hover:bg-surface">
            Salir
          </button>
        </div>
      </div>
    );
  }

  const [blankBefore, blankAfter] = (item.sentence ?? "").split("___");

  return (
    <div className="max-w-2xl mx-auto w-full px-6 py-10 flex flex-col gap-6 fade-up">
      <div className="flex items-center gap-3">
        <button onClick={onExit} className="text-xs text-ink-faint hover:text-ink">
          ← salir
        </button>
        <div className="flex-1 h-1.5 rounded-full bg-border overflow-hidden">
          <div className="h-full rounded-full bg-sage transition-all" style={{ width: `${(idx / items.length) * 100}%` }} />
        </div>
        <span className="text-xs text-ink-faint tabular-nums">
          {idx + 1}/{items.length}
        </span>
      </div>

      <div className="card p-6 sm:p-8 flex flex-col gap-5">
        <p className="text-xs uppercase tracking-wide text-ink-faint">
          {mode === "words" && "Escríbelo en francés"}
          {mode === "dictWords" && "Escucha y escribe la palabra"}
          {mode === "dictSentences" && "Escucha y escribe la frase"}
          {mode === "connectors" && "Completa con el conector"}
        </p>

        {mode === "words" && <p className="font-serif text-2xl text-ink leading-snug">{item.prompt}</p>}

        {isDictation && (
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => speakFrench(item.speak ?? "", { userInitiated: true })}
              className="rounded-full bg-sage text-bg px-5 py-2.5 text-sm font-medium shadow-soft hover:opacity-90"
            >
              🔊 Escuchar
            </button>
            <button
              onClick={() => speakFrench(item.speak ?? "", { userInitiated: true, rate: 0.6 })}
              className="rounded-full border border-border text-ink-soft px-4 py-2.5 text-sm hover:bg-surface"
            >
              🐢 Más lento
            </button>
          </div>
        )}

        {mode === "connectors" && (
          <div className="flex flex-col gap-2">
            <p className="font-serif text-xl text-ink leading-relaxed">
              {blankBefore}
              <span className="inline-block min-w-16 border-b-2 border-sage mx-1 text-center text-sage-ink">{result ? item.answers[0] : " "}</span>
              {blankAfter}
            </p>
            <p className="text-sm text-ink-soft">{item.es}</p>
            <p className="text-xs text-dusk">pista: {item.hint}</p>
          </div>
        )}

        <form onSubmit={submit} className="flex flex-col gap-3">
          {result && !correct && (
            <p className="text-xs text-ink-soft">
              Ahora escríbela bien una vez para fijarla <span className="text-ink-faint">(o Enter vacío para seguir)</span>
            </p>
          )}
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setCopyMiss(false);
            }}
            lang="fr"
            autoCapitalize="off"
            autoCorrect="off"
            autoComplete="off"
            spellCheck={false}
            readOnly={!!result && correct}
            placeholder={result ? (correct ? "" : "escríbela correctamente…") : mode === "connectors" ? "el conector…" : "escribe aquí…"}
            className={`w-full rounded-xl border px-4 py-3 text-lg bg-bg-soft focus:outline-none focus:ring-2 focus:ring-sage/40 ${
              result ? (correct ? "border-sage text-sage-ink" : "border-clay") : "border-border"
            }`}
          />
          {copyMiss && <p className="text-xs text-clay">Todavía no coincide — compárala con la de arriba.</p>}

          <div className="flex gap-1.5 flex-wrap">
            {ACCENTS.map((ch) => (
              <button
                key={ch}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => insertAccent(ch)}
                className="w-9 h-9 rounded-lg border border-border bg-bg-soft text-ink hover:bg-sage-soft hover:text-sage-ink text-base"
              >
                {ch}
              </button>
            ))}
          </div>

          {!result ? (
            <div className="flex items-center gap-3 flex-wrap mt-1">
              <button type="submit" className="rounded-full bg-ink text-bg px-6 py-2.5 text-sm font-medium hover:opacity-90 shadow-soft">
                Comprobar
              </button>
              <button type="button" onClick={() => setShowHint(true)} className="text-xs text-ink-faint hover:text-ink">
                pista
              </button>
              <button type="button" onClick={() => check(true)} className="text-xs text-ink-faint hover:text-ink ml-auto">
                no sé
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 mt-1">
              <button type="submit" className="rounded-full bg-ink text-bg px-6 py-2.5 text-sm font-medium hover:opacity-90 shadow-soft">
                {idx + 1 === items.length ? "Ver resultado" : "Siguiente →"}
              </button>
              <button
                type="button"
                onClick={() => speakFrench(item.speak ?? "", { userInitiated: true })}
                className="rounded-full border border-border text-ink-soft px-4 py-2.5 text-sm hover:bg-surface"
              >
                🔊
              </button>
            </div>
          )}
          {showHint && !result && <p className="font-mono text-sm text-dusk tracking-widest">{mask(item.answers[0])}</p>}
        </form>
      </div>

      {result && <Feedback item={item} result={result} strict={strict} />}
    </div>
  );
}

function Feedback({ item, result, strict }: { item: WriteItem; result: Comparison; strict: boolean }) {
  const { verdict, cells } = result;

  const banner =
    verdict === "exact"
      ? { text: "¡Perfecto!", cls: "bg-sage-soft text-sage-ink" }
      : verdict === "accent"
        ? strict
          ? { text: "Casi — solo te faltó un acento", cls: "bg-dusk-soft text-dusk" }
          : { text: "Bien, pero revisa los acentos", cls: "bg-dusk-soft text-dusk" }
        : { text: "Revisa la ortografía", cls: "bg-clay-soft text-clay" };

  return (
    <div className="card p-5 flex flex-col gap-4 flip-in">
      <p className={`rounded-xl px-4 py-2.5 text-sm font-medium ${banner.cls}`}>{banner.text}</p>

      {verdict !== "exact" && (
        <div className="flex flex-col gap-3 text-lg leading-relaxed">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-ink-faint mb-0.5">Tú escribiste</p>
            <Words cells={cells} side="typed" />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wide text-ink-faint mb-0.5">Correcto</p>
            <Words cells={cells} side="target" />
          </div>
        </div>
      )}

      {verdict === "exact" && <p className="text-lg text-ink">{item.answers[0]}</p>}

      {item.answers.length > 1 && (
        <p className="text-xs text-ink-faint">También válido: {item.answers.slice(1).join(" · ")}</p>
      )}
      {item.es && <p className="text-sm text-ink-soft">{item.es}</p>}
      {item.example && <p className="text-xs text-ink-faint italic">{item.example}</p>}
    </div>
  );
}

function Words({ cells, side }: { cells: Cell[]; side: "typed" | "target" }) {
  const visible = cells.filter((c) => (side === "typed" ? c.typed !== undefined : c.target !== undefined));
  if (visible.length === 0) return <span className="text-ink-faint">—</span>;
  return (
    <span className="flex flex-wrap gap-x-2.5">
      {visible.map((c, i) => (
        <Word key={i} cell={c} side={side} />
      ))}
    </span>
  );
}

function Word({ cell, side }: { cell: Cell; side: "typed" | "target" }) {
  const word = (side === "typed" ? cell.typed : cell.target) as string;
  if (cell.status === "ok") return <span className="text-sage-ink">{word}</span>;
  if (cell.status === "extra") return <span className="text-clay line-through decoration-clay/60">{word}</span>;
  if (cell.status === "missing") return <span className="text-clay underline decoration-dotted underline-offset-4">{word}</span>;

  // wrong / accent: se marcan las letras que difieren
  const marks = charMarks(cell.typed as string, cell.target as string);
  const flags = side === "typed" ? marks.a : marks.b;
  const markCls = cell.status === "accent" ? "text-dusk bg-dusk-soft rounded px-px" : "text-clay bg-clay-soft rounded px-px";
  return (
    <span className="text-ink">
      {[...word].map((ch, i) => (
        <span key={i} className={flags[i] ? markCls : ""}>
          {ch}
        </span>
      ))}
    </span>
  );
}
