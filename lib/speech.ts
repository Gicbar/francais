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

// --- Reproductor de diálogo controlable (play/pause/anterior/siguiente) ---
// speechSynthesis no tiene una línea de tiempo real que se pueda buscar, así
// que "adelantar/atrasar" se implementa saltando a la línea anterior/siguiente
// del diálogo, y "pausa" usa el pause()/resume() nativo del navegador.
export type DialoguePlayerState = "idle" | "playing" | "paused";

interface DialoguePlayerCallbacks {
  onIndexChange?: (index: number) => void;
  onStateChange?: (state: DialoguePlayerState) => void;
  onEnd?: () => void;
}

let dialogueLines: { text: string; pitch?: number }[] = [];
let dialogueIndex = 0;
let dialogueState: DialoguePlayerState = "idle";
let dialogueGeneration = 0;
let dialogueCallbacks: DialoguePlayerCallbacks = {};

function setDialogueState(s: DialoguePlayerState) {
  dialogueState = s;
  dialogueCallbacks.onStateChange?.(s);
}

function speakDialogueFrom(idx: number) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  dialogueGeneration++;
  const gen = dialogueGeneration;

  if (idx >= dialogueLines.length) {
    dialogueIndex = Math.max(0, dialogueLines.length - 1);
    setDialogueState("idle");
    dialogueCallbacks.onEnd?.();
    return;
  }

  dialogueIndex = idx;
  dialogueCallbacks.onIndexChange?.(idx);

  const voice = cachedVoice ?? pickFrenchVoice();
  const line = dialogueLines[idx];
  const utter = new SpeechSynthesisUtterance(line.text);
  utter.lang = "fr-FR";
  utter.rate = 0.92;
  utter.pitch = line.pitch ?? 1;
  if (voice) utter.voice = voice;
  utter.onend = () => {
    if (gen !== dialogueGeneration) return;
    speakDialogueFrom(idx + 1);
  };
  setDialogueState("playing");
  window.speechSynthesis.speak(utter);
}

export function playDialogue(
  lines: { text: string; pitch?: number }[],
  opts: { userInitiated?: boolean } = {},
  callbacks: DialoguePlayerCallbacks = {}
) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  dialogueLines = lines;
  dialogueCallbacks = callbacks;
  speakDialogueFrom(0);
  if (opts.userInitiated) bumpAudioPlays();
}

export function dialoguePause() {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  if (dialogueState !== "playing") return;
  window.speechSynthesis.pause();
  setDialogueState("paused");
}

export function dialogueResume() {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  if (dialogueState !== "paused") return;
  window.speechSynthesis.resume();
  setDialogueState("playing");
}

export function dialogueNext() {
  if (dialogueIndex + 1 < dialogueLines.length) speakDialogueFrom(dialogueIndex + 1);
}

export function dialoguePrev() {
  speakDialogueFrom(Math.max(0, dialogueIndex - 1));
}

export function dialogueStop() {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  dialogueGeneration++;
  window.speechSynthesis.cancel();
  dialogueIndex = 0;
  setDialogueState("idle");
}

export function getDialogueLength() {
  return dialogueLines.length;
}
