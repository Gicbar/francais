// Corrección gramatical de la frase que el usuario escribe en el paso de
// "elaboración" — API pública de LanguageTool, gratis, sin key (mismo
// patrón que lib/translate.ts). Sujeta a límite de uso razonable; si falla
// o se agota, no rompe nada — solo no se muestra retroalimentación.
export type GrammarIssue = {
  message: string;
  badText: string;
  suggestions: string[];
};

// null = no se pudo verificar (sin internet, timeout, rate limit).
// []   = se verificó y no se encontraron errores.
// [...] = errores encontrados.
export async function checkGrammar(text: string): Promise<GrammarIssue[] | null> {
  if (!text.trim()) return [];
  try {
    const res = await fetch("https://api.languagetool.org/v2/check", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ text, language: "fr" }).toString(),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const matches = Array.isArray(data?.matches) ? data.matches : [];
    return matches.map(
      (m: { message: string; offset: number; length: number; replacements?: { value: string }[] }) => ({
        message: m.message,
        badText: text.slice(m.offset, m.offset + m.length),
        suggestions: (m.replacements ?? []).slice(0, 3).map((r) => r.value),
      })
    );
  } catch {
    return null;
  }
}
