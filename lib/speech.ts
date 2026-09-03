// Codificación dual (texto + audio) vía Web Speech API — gratis, sin backend.
import { bumpAudioPlays } from "@/lib/storage";

let cachedVoice: SpeechSynthesisVoice | null = null;

function pickFrenchVoice(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find((v) => v.lang?.toLowerCase().startsWith("fr")) ??
    voices.find((v) => v.lang?.toLowerCase().includes("fr")) ??
    null
  );
}

export function speakFrench(text: string, opts: { userInitiated?: boolean } = {}) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "fr-FR";
  utter.rate = 0.92;
  const voice = cachedVoice ?? pickFrenchVoice();
  if (voice) {
    utter.voice = voice;
    cachedVoice = voice;
  }
  window.speechSynthesis.speak(utter);
  if (opts.userInitiated) bumpAudioPlays();
}

// Reproduce varias líneas en secuencia (p.ej. un diálogo de comprensión
// oral), alternando un poco el tono por interlocutor para que se distingan
// al oído. speechSynthesis encola las utterances automáticamente si no se
// llama a cancel() entre medio.
export function speakSequence(lines: { text: string; pitch?: number }[], opts: { userInitiated?: boolean } = {}) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const voice = cachedVoice ?? pickFrenchVoice();
  lines.forEach((line) => {
    const utter = new SpeechSynthesisUtterance(line.text);
    utter.lang = "fr-FR";
    utter.rate = 0.92;
    utter.pitch = line.pitch ?? 1;
    if (voice) utter.voice = voice;
    window.speechSynthesis.speak(utter);
  });
  if (opts.userInitiated) bumpAudioPlays();
}

export function primeVoices() {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  // Algunos navegadores cargan las voces de forma asíncrona.
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoice = pickFrenchVoice();
  };
}
