// Genera public/content/*.json a partir de data/*.ts (la fuente autoral,
// con comentarios y agrupación) — para que el contenido sea fetchable desde
// raw.githubusercontent.com sin depender de un redeploy de Vercel. Se
// ejecuta solo (npm run export-content) o automático antes de build
// (prebuild en package.json). data/*.ts solo tiene imports type-only, así
// que compilar esos archivos sueltos con tsc no arrastra nada más.
import { execSync } from "node:child_process";
import { mkdirSync, writeFileSync, rmSync, existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createHash } from "node:crypto";
import path from "node:path";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const tmpDir = path.join(root, ".export-content-tmp");

if (existsSync(tmpDir)) rmSync(tmpDir, { recursive: true, force: true });
mkdirSync(tmpDir, { recursive: true });

const files = ["data/cards.ts", "data/sentences.ts", "data/grammar-notes.ts", "data/pronunciation.ts"];

// tsc en modo archivo suelto no lee tsconfig.json, así que hace falta un
// tsconfig temporal para que resuelva el alias "@/*" (usado en imports
// type-only — se borran al compilar, pero tsc igual necesita resolverlos
// para el chequeo de tipos).
const tmpTsconfig = path.join(root, ".export-content-tsconfig.json");
writeFileSync(
  tmpTsconfig,
  JSON.stringify({
    compilerOptions: {
      target: "es2019",
      module: "commonjs",
      moduleResolution: "node",
      esModuleInterop: true,
      skipLibCheck: true,
      resolveJsonModule: true,
      outDir: tmpDir,
      baseUrl: root,
      paths: { "@/*": [path.join(root, "*")] },
    },
    include: files,
  })
);

execSync(`npx tsc -p "${tmpTsconfig}"`, { cwd: root, stdio: "inherit" });
rmSync(tmpTsconfig, { force: true });

const toURL = (...p) => pathToFileURL(path.join(tmpDir, ...p)).href;

const { seedCards } = await import(toURL("data", "cards.js"));
const { seedSentences } = await import(toURL("data", "sentences.js"));
const { grammarNotes } = await import(toURL("data", "grammar-notes.js"));
const { pronunciationItems } = await import(toURL("data", "pronunciation.js"));

const outDir = path.join(root, "public", "content");
mkdirSync(outDir, { recursive: true });

const files_out = {
  "cards.json": seedCards,
  "sentences.json": seedSentences,
  "grammar-notes.json": grammarNotes,
  "pronunciation.json": pronunciationItems,
};

const hash = createHash("sha256");
for (const [name, data] of Object.entries(files_out)) {
  const json = JSON.stringify(data, null, 2);
  writeFileSync(path.join(outDir, name), json);
  hash.update(json);
}

const version = hash.digest("hex").slice(0, 16);
writeFileSync(
  path.join(outDir, "meta.json"),
  JSON.stringify({ version, updatedAt: new Date().toISOString() }, null, 2)
);

rmSync(tmpDir, { recursive: true, force: true });

console.log(`Contenido exportado a public/content/ — version ${version}`);
console.log(
  `  ${seedCards.length} tarjetas · ${seedSentences.length} frases · ${grammarNotes.length} reglas · ${pronunciationItems.length} pronunciación`
);
