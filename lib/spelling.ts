// Comparación de lo que el usuario escribe contra la respuesta correcta,
// pensada para practicar ORTOGRAFÍA: distingue "perfecto", "casi (solo
// acentos)" y "mal", y devuelve un diff palabra por palabra / letra por
// letra para mostrar exactamente dónde está el error.
//
// Se ignoran mayúsculas, puntuación (. , ? ! / …) y espacios sobrantes: lo
// que se evalúa son las letras, los acentos, los apóstrofes y los guiones.

export type Verdict = "exact" | "accent" | "wrong";

export type Cell = {
  target?: string;
  typed?: string;
  status: "ok" | "accent" | "wrong" | "missing" | "extra";
};

export type Comparison = { verdict: Verdict; cells: Cell[] };

export function clean(s: string): string {
  return s
    .normalize("NFC")
    .toLowerCase()
    .replace(/[’‘`´]/g, "'")
    .replace(/\((\w{1,3})\)/g, "$1") // enchanté(e) → enchantée
    .replace(/\.{3}|[.,;:!?…«»"“”()[\]/→+]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function stripAccents(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/œ/g, "oe")
    .replace(/æ/g, "ae");
}

// "enchanté(e)" → ["enchanté", "enchantée"]; "est (verbe être)" → con y sin
// el paréntesis (lo de paréntesis separado por espacio es opcional).
export function expand(s: string): string[] {
  const m = s.match(/(\s?)\(([^)]*)\)/);
  if (!m || m.index === undefined) return [s];
  const [full, space, inner] = m;
  const before = s.slice(0, m.index);
  const after = s.slice(m.index + full.length);
  const opts = space ? [before + after, before + space + inner + after] : [before + after, before + inner + after];
  return opts.flatMap(expand);
}

function lcsPairs<T>(a: T[], b: T[], eq: (x: T, y: T) => boolean): [number, number][] {
  const n = a.length;
  const m = b.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] = eq(a[i], b[j]) ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const pairs: [number, number][] = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (eq(a[i], b[j])) {
      pairs.push([i, j]);
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) i++;
    else j++;
  }
  return pairs;
}

function gapCells(t: string[], u: string[]): Cell[] {
  const cells: Cell[] = [];
  const n = Math.max(t.length, u.length);
  for (let i = 0; i < n; i++) {
    if (i < t.length && i < u.length) cells.push({ target: t[i], typed: u[i], status: "wrong" });
    else if (i < t.length) cells.push({ target: t[i], status: "missing" });
    else cells.push({ typed: u[i], status: "extra" });
  }
  return cells;
}

function alignTokens(target: string[], typed: string[]): Cell[] {
  const pairs = lcsPairs(target, typed, (a, b) => stripAccents(a) === stripAccents(b));
  const cells: Cell[] = [];
  let ti = 0;
  let ui = 0;
  for (const [pt, pu] of pairs) {
    cells.push(...gapCells(target.slice(ti, pt), typed.slice(ui, pu)));
    cells.push({ target: target[pt], typed: typed[pu], status: target[pt] === typed[pu] ? "ok" : "accent" });
    ti = pt + 1;
    ui = pu + 1;
  }
  cells.push(...gapCells(target.slice(ti), typed.slice(ui)));
  return cells;
}

function score(cells: Cell[]): number {
  return cells.reduce((s, c) => s + (c.status === "ok" ? 2 : c.status === "accent" ? 1 : 0), 0);
}

export function compare(input: string, answers: string[]): Comparison {
  const typed = clean(input);
  const variants = answers.flatMap(expand).map(clean);

  if (typed && variants.includes(typed)) {
    const t = typed.split(" ");
    return { verdict: "exact", cells: t.map((w) => ({ target: w, typed: w, status: "ok" as const })) };
  }

  const typedTokens = typed ? typed.split(" ") : [];
  let best: Cell[] = [];
  let bestScore = -1;
  for (const v of variants) {
    const cells = alignTokens(v.split(" ").filter(Boolean), typedTokens);
    const sc = score(cells);
    if (sc > bestScore) {
      best = cells;
      bestScore = sc;
    }
  }

  const accentOnly = !!typed && variants.some((v) => stripAccents(v) === stripAccents(typed));
  return { verdict: accentOnly ? "accent" : "wrong", cells: best };
}

// Marca las letras de `a` y `b` que no están en la subsecuencia común:
// sirven para resaltar exactamente qué letra falta, sobra o está mal.
export function charMarks(a: string, b: string): { a: boolean[]; b: boolean[] } {
  const ca = [...a];
  const cb = [...b];
  const pairs = lcsPairs(ca, cb, (x, y) => x === y);
  const ma = new Array(ca.length).fill(true);
  const mb = new Array(cb.length).fill(true);
  for (const [i, j] of pairs) {
    ma[i] = false;
    mb[j] = false;
  }
  return { a: ma, b: mb };
}

// Pista: primera letra de cada palabra + guiones bajos del resto.
export function mask(answer: string): string {
  return clean(expand(answer)[0])
    .split(" ")
    .map((w) => [...w].map((ch, i) => (i === 0 || ch === "'" || ch === "-" ? ch : "_")).join(""))
    .join("   ");
}
