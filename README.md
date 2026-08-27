# petit à petit — práctica diaria de francés

App personal para llevar el francés de cero a nivel nativo (A1 → C2) sin
depender de los créditos de Duolingo. Next.js (App Router) + TypeScript +
Tailwind v4, 100% client-side (sin backend, sin base de datos), pensada
para deploy gratis en Vercel.

**Objetivo del usuario (explícito): "dominar el idioma como un nativo, de
0 a 100... de lo más básico a lo más complejo, no perdiendo las bases."**
Por eso el contenido está organizado por niveles CEFR (A1-C2, ver
`/niveles`) en vez de ser solo una lista plana de tarjetas A1.

**Estado: v1 funcional + arquitectura de niveles, probado con `npm run
build` (limpio) y con el dev server respondiendo 200 en las 7 rutas.
Pendiente: revisión visual del usuario (no se pudo probar en navegador con
Chrome-en-Claude en esta sesión) y decidir si se agrega la capa con IA.**

## Por qué existe

Duolingo se queda sin créditos rápido. Investigamos qué dice la evidencia
sobre aprendizaje de idiomas y construimos esto en su lugar: **repetición
espaciada + input comprensible + recuperación activa**, sin las mecánicas de
gamificación agresiva (rachas de fuego, corazones que se acaban).

Fuentes usadas para las decisiones de producto: práctica espaciada,
retrieval practice, interleaving, elaboración, ejemplos concretos y
codificación dual (los "6 strategies for effective learning" de Learning
Scientists / cognitive science — no confundir con la "Programación
Neurolingüística" de Bandler/Grinder, que no tiene sustento científico y
deliberadamente **no** se usó). También se tomaron patrones de apps de
idiomas exitosas: SRS al estilo Anki (atajos de teclado, calificación
1-4), sesiones cortas de duración fija al estilo Duolingo (meta diaria,
selector 5/15/30 min), y texto clicable para traducir al estilo LingQ.

## Páginas

- **`/` (Hoy)** — dashboard: racha, meta diaria (anillo ajustable), progreso
  real por categoría (Vocabulario, Gramática, Comprensión, Pronunciación,
  cada fila es un link directo al módulo correspondiente; Conversación
  aparece atenuada como "próximamente, necesita IA"), aviso si hay palabras
  que se resisten.
- **`/review` (Repasar)** — flashcards con SRS (SM-2 simplificado). Empieza
  con un selector de duración (5 / 15 / 30 min / todo lo pendiente,
  `lib/deck.ts SESSION_LENGTHS`). Atajos de teclado tipo Anki (espacio =
  revelar, 1-4 = calificar). Tarjetas nuevas disparan un paso opcional de
  "elaboración": el usuario escribe su propia frase con la palabra
  (generation effect), guardada en `fr.notes.v1`.
- **`/leer` (Leer)** — input comprensible: frases reales de las clases +
  frases de uso cotidiano, con audio (Web Speech API). Cada palabra de la
  frase es clicable (patrón LingQ): al tocarla se busca automáticamente su
  traducción (API MyMemory, gratis, sin key) y se pre-llena el formulario
  para guardarla como flashcard nueva (tema `perso`) — el usuario puede
  corregir la traducción sugerida antes de guardar. También se puede anotar
  una frase completa a mano.
- **`/gramatica` (Gramática)** — ciclo enseñar → practicar → corregir por
  regla: ejemplo incorrecto/correcto + el porqué, luego 2-3 ejercicios de
  completar con corrección inline (sin IA, checking client-side como los
  `.exo` de los cours HTML originales). Progreso guardado en
  `fr.grammarProgress.v1`.
- **`/pronunciacion` (Pronunciar)** — texto → sonido (TTS) → regla de
  pronunciación con ejemplo → práctica con reconocimiento de voz del
  navegador (`SpeechRecognition`, gratis, solo Chrome/Edge desktop y
  Android). **Limitación real, explicada en la propia UI:**
  `SpeechRecognition` es voz→texto (adivina la palabra más probable con un
  modelo de lenguaje), no un evaluador de fonemas — un "match" no prueba
  que la pronunciación esté bien, solo que el texto adivinado coincidió;
  el reconocedor es tolerante a acentos por diseño. La señal más confiable
  del módulo es al revés: un "mismatch" sí indica que algo sonó lo bastante
  raro como para que ni la máquina lo entendiera. La página lo dice así de
  claro (antes decía "¡Bien pronunciado!" sin base — se corrigió). Una
  evaluación de pronunciación real (nivel fonema) requeriría un servicio
  pago tipo Azure Pronunciation Assessment — mismo tipo de decisión de
  costo/API key que la capa de IA. Se degrada con un mensaje claro si el
  navegador no soporta reconocimiento.
- **`/errores` (Mis errores)** — corrección con el "porqué", no solo la
  respuesta:
  - **Palabras que se te resisten**: derivado automáticamente de
    `CardState.lapses >= 2` (ya lo trackea el SRS, cero tracking nuevo).
  - **Reglas para repasar**: mismas `data/grammar-notes.ts` que usa
    `/gramatica`, curadas a mano a partir de tus errores reales
    documentados en `Documentos/Frances/resumen-practica-2026-08-24.md`
    (et vs est, mon/ma, concordancia de adjetivos, sujeto omitido,
    artículo con verbos de gusto, enchanté, elisión).
  - Botón "reforzar" en cualquiera de las dos secciones arma una sesión
    enfocada (`setFocusQueue` en `lib/storage.ts`) que `/review` recoge al
    montar.
- **`/niveles` (Niveles)** — el mapa completo A1→C2 (CEFR): una tarjeta por
  nivel con descripción, % de vocabulario dominado y reglas gramaticales
  dominadas. Los niveles sin contenido todavía (B1-C2) se muestran
  atenuados con "próximamente" en vez de ocultarse — para que el camino
  completo sea visible desde el día uno. Explica explícitamente que repasar
  niveles avanzados NO significa dejar de repasar los básicos.

## Niveles (CEFR A1 → C2)

Esto es la columna vertebral de "no perder las bases": `Card`, `Sentence` y
`GrammarNote` (`lib/types.ts`) tienen un campo `level: Level` obligatorio
(`"A1"|"A2"|"B1"|"B2"|"C1"|"C2"`). En `lib/deck.ts`:

- `levelOrderedFresh()` decide qué tarjetas **nuevas** se introducen en una
  sesión de `/review`: siempre las del nivel más bajo que aún tenga
  tarjetas sin empezar. No aparece vocabulario de A2 hasta agotar lo nuevo
  de A1, ni de B1 hasta agotar A2, etc. — progresión real, no aleatoria.
- Pero esto **solo afecta tarjetas nuevas**. Las tarjetas `due` (ya
  aprendidas, tocan repaso hoy) se mezclan sin importar su nivel — así es
  como nunca se dejan de repasar los básicos aunque ya estés en B2.
- `levelProgress()` calcula dominio por nivel para `/niveles`.

Estado del contenido por nivel ahora mismo:
- **A1** — completo: ~95 tarjetas, 7 reglas gramaticales, ~30 frases (del
  curso ARQUITECSOFT + ampliado).
- **A2** — primer lote real: ~45 tarjetas (pasado/futuro, rutina diaria,
  opiniones, conectores, comparativos, pronombres objeto, vocabulario
  abstracto), 4 reglas gramaticales (passé composé con avoir/être, futur
  proche, comparativos), 8 frases.
- **B1-C2** — todavía sin contenido. Aparecen en `/niveles` marcados
  "próximamente". Al retomar, seguir el mismo patrón de `data/cards.ts`
  (bloque `RawCard[]` + `withLevel("B1")`) y `data/grammar-notes.ts`.
  Temas naturales para B1: subjonctif básico, imparfait vs passé composé
  a fondo, condicional, discurso indirecto, conectores de argumentación.

## Motor (lib/)

- `lib/srs.ts` — SM-2 simplificado (umbrales suaves para no castigar "difícil").
- `lib/storage.ts` — todo en `localStorage`, namespaced `fr.*.v1`. Guarda:
  estados SRS, tarjetas personalizadas, notas de elaboración, logs diarios,
  racha, meta diaria, reproducciones de audio, cola de refuerzo, progreso
  de gramática.
- `lib/deck.ts` — combina `data/cards.ts` + tarjetas personalizadas,
  interleaving (baraja temas), construcción de sesión por duración o
  enfocada, introducción de tarjetas nuevas ordenada por nivel CEFR
  (`levelOrderedFresh`), cálculo de progreso por categoría y por nivel,
  tarjetas que se resisten.
- `lib/speech.ts` — Web Speech API (`speechSynthesis`, voz `fr-FR`, gratis,
  sin backend). Cuenta reproducciones solo cuando el usuario las dispara
  (no en el autoplay) — proxy honesto de práctica de pronunciación.
- `lib/recognition.ts` — wrapper de `SpeechRecognition`/`webkitSpeechRecognition`
  para el módulo de pronunciación, con normalización de acentos para
  comparar transcripciones.
- `lib/translate.ts` — traducción fr→es al tocar una palabra en `/leer`,
  vía API MyMemory (gratis, sin key, con timeout de 5s y fallback silencioso).

## Datos (data/)

- `data/cards.ts` — ~175 tarjetas en dos bloques (`a1Cards`, `a2Cards`,
  cada uno tipado `RawCard[]` sin `level` y mapeado con `withLevel(...)` al
  exportar `seedCards`). A1: vocabulario real de tus cours 1-10
  (ARQUITECSOFT: colores, comida, objetos de oficina, aficiones, verbos de
  gusto, être/avoir/aller/faire, posesivos) + alta frecuencia ampliada
  (números, días, familia, preguntas, cortesía, clima/hora, transporte,
  compras, salud, tecnología, emociones). A2: pasado/futuro cercano, verbos
  pronominales, opiniones, conectores avanzados, comparativos, pronombres
  objeto, vocabulario abstracto, expresiones idiomáticas.
- `data/sentences.ts` — ~38 frases (30 A1 + 8 A2), mezcla de frases reales
  de tus resúmenes de clase + frases cotidianas genéricas.
- `data/grammar-notes.ts` — 11 reglas gramaticales (7 A1 + 4 A2, mismo
  patrón `RawNote[]` + `withLevel`) con ejemplo incorrecto/correcto, el
  porqué, y 2-3 drills cada una. Usado por `/gramatica` (agrupado por
  nivel) y `/errores`.
- `data/pronunciation.ts` — 15 palabras/frases, cada una ilustrando una
  regla de pronunciación específica (r gutural, vocales nasales, u francesa
  vs ou, liaison, consonantes finales mudas, elisión de "e" muda, etc.).

## Diseño

Paleta calmada a propósito (ver `app/globals.css`): neutros cálidos de
fondo con un wash de gradientes radiales muy sutil (sage/dusk al 8-10% de
opacidad) para dar profundidad sin ruido, verde salvia como acento
principal, azul apagado como secundario, y **terracota suave en vez de
rojo** para "de nuevo/error" — un rojo saturado genera respuesta de estrés
que no ayuda a estudiar. Tipografía: Newsreader (serif, encabezados) +
Inter (sans, cuerpo) vía `next/font/google`. Soporta modo claro/oscuro
automático (`prefers-color-scheme`).

Utilidades reutilizables en `globals.css`: `.card` / `.card-hover` (borde +
sombra + lift al hover, usado en todas las páginas), `.tricolor` (tres
puntitos sage/dusk/clay, una marca sutil de identidad — sin usar
literalmente los colores de la bandera francesa), `.scrollbar-none`.
**Ojo:** `shadow-soft` y `shadow-lift` están registrados como tokens en el
bloque `@theme inline` — si se agregan más sombras custom, hay que
registrarlas ahí también o Tailwind v4 las ignora silenciosamente sin dar
error (bug real que se cometió y corrigió en esta sesión).

Responsive mobile-first: nav con logo 🌿 compacto en pantallas chicas y
scroll horizontal sin scrollbar visible (7 secciones no caben en una fila
en un teléfono), botones de calificar en grid 2×2 en móvil / 4×1 en
desktop, `viewport` configurado explícitamente en `app/layout.tsx`.

## Contenido fuente

Las clases originales (HTML interactivo generado por tu tutor ARQUITECSOFT)
están en `Documentos/Frances/` (fuera de este repo, en
`C:\Users\User\OneDrive - Arquitecsoft S.A.S\Documentos\Frances`):
`arquitecsoft-cours1.html` … `cours10.html`, `consejos-vocabulario.html`,
`reference-verbes-possessifs-articles.html`, `conversation-pratique.html`,
`paragraphe-prononciation.html`, `resumen-practica-2026-08-24.md`. De ahí
salió el vocabulario y las reglas gramaticales curadas en este proyecto.

## Cómo seguir mañana

No se pudo conectar la extensión de Chrome de Claude en esta sesión, así
que **todo el trabajo de esta noche está verificado por build + TypeScript
+ respuesta 200 del servidor, pero no visualmente en un navegador real.**
Antes de dar por bueno el rediseño visual, conviene:
1. `npm run dev` y abrir `http://localhost:3000` en el celular real (no
   solo desktop) — la app se pensó mobile-first pero nunca se vio en un
   dispositivo de verdad.
2. Revisar el modo oscuro (`prefers-color-scheme: dark` del sistema).
3. Probar `/pronunciacion` en Chrome de escritorio o Android (el
   reconocimiento de voz no funciona en Safari/Firefox — eso es esperado,
   revisar que el mensaje de fallback se vea bien).

## Pendiente / próximos pasos

**Contenido B1-C2** (lo más importante para el objetivo "0 a 100 / nativo"
del usuario): seguir el patrón de A1/A2 en `data/cards.ts` y
`data/grammar-notes.ts` — un bloque `RawCard[]`/`RawNote[]` nuevo +
`withLevel("B1")`, y sumarlo al `export`. No hace falta tocar `lib/deck.ts`
ni ninguna página: en cuanto haya tarjetas con `level: "B1"`,
`/niveles` y el ordenamiento de tarjetas nuevas en `/review` las recogen
solas. Ir nivel por nivel, no todos a la vez — así cada lote se puede
revisar con calma en vez de generar cientos de tarjetas sin verificar.

**Capa con IA** (conversación práctica, ejercicios que se adapten a los
errores, generación de ejercicios a partir de lo que se vio en clase
presencial, explicaciones dinámicas): **requiere un backend con LLM (API
key, costo por uso)** — no es gratis como el resto de la app. El usuario
decidió (2026-08-26) posponerlo y seguir con lo gratis primero. Sigue
pendiente decidir, cuando se retome:
1. Qué proveedor/API key usar (Anthropic recomendado, dado el contexto).
2. Si se acepta el costo variable por uso.
3. Prioridad: ¿conversación con IA primero, o generación de ejercicios
   desde apuntes de clase primero?

Otras cosas gratis que quedan por hacer:
- Más frases/vocabulario a medida que se agreguen nuevos `cours11.html`, etc.
- Exportar/importar el progreso (hoy vive solo en `localStorage` del
  navegador — se pierde si se borra caché o se cambia de dispositivo).
- Registro de clases presenciales sin IA: al menos una página simple donde
  el usuario pegue lo que vio en clase y manualmente marque qué tarjetas/
  reglas corresponden (una versión "manual" de lo que pidió automatizar
  con IA).

## Deploy

```bash
npm run build   # verifica antes de subir
```

Conectar el repo a Vercel (plan gratis) — no necesita variables de entorno
mientras no se agregue la parte con IA. El repo ya tiene `git init` hecho
por `create-next-app`, pero **no se ha hecho ningún commit todavía** —
falta decidir con el usuario cuándo commitear y a qué remoto (GitHub) subirlo.

## Desarrollo local

```bash
npm run dev
```

Abre `http://localhost:3000`.
