// Reconocimiento de voz del navegador (Web Speech API) — gratis, sin backend.
// Soporte real solo en Chrome/Edge de escritorio y Android; se degrada con
// un mensaje claro en el resto.

type RecognitionResult = { transcript: string; confidence: number };

export function isRecognitionSupported(): boolean {
  if (typeof window === "undefined") return false;
  return !!(window as any).SpeechRecognition || !!(window as any).webkitSpeechRecognition;
}

export function listenOnce(): Promise<RecognitionResult> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return reject(new Error("no-window"));
    const Ctor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!Ctor) return reject(new Error("unsupported"));

    const recognition = new Ctor();
    recognition.lang = "fr-FR";
    recognition.maxAlternatives = 1;
    recognition.interimResults = false;

    let settled = false;

    recognition.onresult = (event: any) => {
      settled = true;
      const result = event.results[0][0];
      resolve({ transcript: result.transcript, confidence: result.confidence ?? 0 });
    };

    recognition.onerror = (event: any) => {
      if (settled) return;
      settled = true;
      reject(new Error(event.error || "recognition-error"));
    };

    recognition.onend = () => {
      if (!settled) reject(new Error("no-speech"));
    };

    recognition.start();
  });
}

const ACCENTS: Record<string, string> = {
  á: "a", à: "a", â: "a", ä: "a",
  é: "e", è: "e", ê: "e", ë: "e",
  í: "i", ì: "i", î: "i", ï: "i",
  ó: "o", ò: "o", ô: "o", ö: "o",
  ú: "u", ù: "u", û: "u", ü: "u",
  ç: "c", œ: "oe", æ: "ae",
};

// Comparación tolerante: minúsculas, sin acentos ni puntuación, espacios colapsados.
export function normalizeForCompare(s: string): string {
  return s
    .toLowerCase()
    .split("")
    .map((ch) => ACCENTS[ch] ?? ch)
    .join("")
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
