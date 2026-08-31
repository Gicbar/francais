"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getEffectivePronunciation } from "@/lib/content";
import { speakFrench, primeVoices } from "@/lib/speech";
import { isRecognitionSupported, listenOnce, normalizeForCompare } from "@/lib/recognition";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type Status = "idle" | "listening" | "match" | "mismatch" | "error";

export default function PronunciacionPage() {
  const order = useMemo(() => shuffle(getEffectivePronunciation()), []);
  const [i, setI] = useState(0);
  const [status, setStatus] = useState<Status>("idle");
  const [heard, setHeard] = useState("");
  const [confidence, setConfidence] = useState<number | null>(null);
  const [supported, setSupported] = useState(true);

  const item = order[i % order.length];

  useEffect(() => {
    primeVoices();
    setSupported(isRecognitionSupported());
  }, []);

  useEffect(() => {
    if (item) speakFrench(item.fr);
    setStatus("idle");
    setHeard("");
    setConfidence(null);
  }, [item?.id]);

  async function practice() {
    setStatus("listening");
    try {
      const { transcript, confidence: c } = await listenOnce();
      setHeard(transcript);
      setConfidence(c > 0 ? c : null); // Chrome a veces devuelve 0 siempre — no confiable en ese caso
      const ok = normalizeForCompare(transcript) === normalizeForCompare(item.fr);
      setStatus(ok ? "match" : "mismatch");
    } catch {
      setStatus("error");
    }
  }

  function next() {
    setI((v) => v + 1);
  }

  return (
    <div className="max-w-lg mx-auto w-full px-6 py-10 flex-1 flex flex-col">
      <div className="mb-10">
        <span className="text-xs uppercase tracking-wide text-ink-faint">Pronunciación</span>
        <p className="text-[11px] text-ink-faint mt-1.5 max-w-sm">
          El micrófono usa reconocimiento de voz (voz→texto), no mide tus
          fonemas. Sirve para practicar en voz alta y detectar cuando algo
          suena tan distinto que ni la máquina te entiende — no como nota
          de pronunciación exacta.
        </p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center gap-6 flip-in" key={item.id}>
        <div className="flex items-center gap-3">
          <h1 className="font-serif text-[1.75rem] sm:text-4xl text-ink leading-snug">{item.fr}</h1>
          <button
            onClick={() => speakFrench(item.fr, { userInitiated: true })}
            aria-label="Escuchar"
            className="shrink-0 w-9 h-9 rounded-full border border-border flex items-center justify-center text-ink-soft hover:bg-surface hover:text-ink transition-colors"
          >
            🔊
          </button>
        </div>
        <p className="text-ink-faint text-sm">{item.es}</p>

        <div className="bg-dusk-soft border border-dusk/20 rounded-xl px-5 py-3.5 text-sm text-left max-w-sm">
          <p className="text-dusk font-medium mb-1">Regla</p>
          <p className="text-ink-soft leading-relaxed">{item.tip}</p>
        </div>

        {!supported ? (
          <p className="text-xs text-ink-faint max-w-xs">
            Tu navegador no soporta reconocimiento de voz. Escucha y repite en
            voz alta igual — el shadowing funciona sin verificación automática.
          </p>
        ) : (
          <div className="flex flex-col items-center gap-3 w-full">
            <button
              onClick={practice}
              disabled={status === "listening"}
              className="rounded-full bg-ink text-bg px-7 py-3 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60 shadow-soft"
            >
              {status === "listening" ? "Escuchando… 🎙️" : "Practicar en voz alta 🎙️"}
            </button>

            {status === "match" && (
              <div className="text-sm bg-sage-soft border border-sage/25 rounded-xl px-4 py-3 max-w-sm text-left">
                <p className="text-sage-ink font-medium">El reconocedor entendió exactamente "{item.fr}" ✓</p>
                <p className="text-[11px] text-ink-faint mt-1.5 leading-relaxed">
                  Eso no garantiza que la pronunciación esté perfecta — el
                  reconocimiento de voz adivina la palabra más probable y es
                  tolerante con el acento. Es una señal de que se entendió,
                  no una nota de pronunciación.
                </p>
                {confidence !== null && (
                  <p className="text-[11px] text-ink-faint mt-1">confianza del reconocedor: {Math.round(confidence * 100)}%</p>
                )}
              </div>
            )}
            {status === "mismatch" && (
              <div className="text-sm bg-clay-soft border border-clay/25 rounded-xl px-4 py-3 max-w-sm text-left">
                <p className="text-clay font-medium mb-1">El reconocedor entendió algo distinto</p>
                <p className="text-ink-faint">dijiste: <span className="text-ink">{heard || "(no se entendió nada)"}</span></p>
                <p className="text-ink-faint mt-1">objetivo: <span className="text-ink">{item.fr}</span></p>
                <p className="text-[11px] text-ink-faint mt-2">
                  Esta es la señal más confiable del módulo: si ni la
                  máquina te entendió, vale la pena escuchar el audio 🔊 de
                  nuevo y repetir más despacio.
                </p>
              </div>
            )}
            {status === "error" && (
              <p className="text-xs text-clay">no se pudo escuchar el micrófono — revisa el permiso del navegador.</p>
            )}
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
          Siguiente →
        </button>
      </div>
    </div>
  );
}
