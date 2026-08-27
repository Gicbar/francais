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

export function primeVoices() {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  // Algunos navegadores cargan las voces de forma asíncrona.
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoice = pickFrenchVoice();
  };
}
