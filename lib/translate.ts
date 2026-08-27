// Traducción rápida fr→es al tocar una palabra — API pública gratuita, sin
// key. Es solo un punto de partida: el usuario siempre puede corregirla
// antes de guardar la tarjeta.
export async function translateWord(fr: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(fr)}&langpair=fr|es`,
      { signal: AbortSignal.timeout(5000) }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const text: string | undefined = data?.responseData?.translatedText;
    if (!text) return null;
    // La API a veces devuelve la palabra sin traducir si no la conoce.
    if (text.trim().toLowerCase() === fr.trim().toLowerCase()) return null;
    return text;
  } catch {
    return null;
  }
}
