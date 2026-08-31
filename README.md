# petit à petit — práctica diaria de francés

App personal para llevar el francés de cero a nivel nativo (A1 → C2) sin
depender de los créditos de Duolingo. Next.js (App Router) + TypeScript +
Tailwind v4, 100% client-side (sin backend, sin base de datos), pensada
para deploy gratis en Vercel.

**Objetivo del usuario (explícito): "dominar el idioma como un nativo, de
0 a 100... de lo más básico a lo más complejo, no perdiendo las bases."**
Por eso el contenido está organizado por niveles CEFR (A1-C2, ver
`/niveles`) en vez de ser solo una lista plana de tarjetas A1.

**Estado (2026-08-31): repo en `github.com/Gicbar/francais`, rama `main`,
con un commit inicial ya empujado por el usuario. Desde entonces se
corrigió un bug real de repaso, se agregó Cours 11, y se construyó un
sistema de contenido remoto (ver abajo) — todo compila limpio con
`npm run build` pero **todavía no está commiteado/pusheado**. Pendiente:
revisión visual (no se pudo probar en navegador con Chrome-en-Claude) y
decidir si se agrega la capa con IA.**

## Bug corregido: el repaso no avanzaba (2026-08-31)

El usuario reportó que después de varias sesiones de "Repasar", el
contenido parecía repetirse siempre sin avanzar. Causa real: `dueAndFresh()`
en `lib/deck.ts` llamaba `getOrCreateState()` — que además de leer,
**escribe** un estado nuevo — para cada tarjeta sin repasar, no solo las 8
que se iban a mostrar. Como `dueCount()` (usado en el dashboard) llama a
esa función, con solo abrir la app **todo el mazo completo** quedaba
marcado "vence hoy" desde la primera visita, aunque el usuario nunca las
hubiera visto. A partir de ahí, cada sesión mostraba una muestra al azar de
ese enorme montón de tarjetas "vencidas" — incluyendo vocabulario nunca
antes visto, tratado como si fuera repaso — y las que fallaba (lógico, para
contenido nuevo) volvían a quedar vencidas para hoy, dando la sensación de
que todo se repite sin avanzar.

**Arreglado:**
- `dueAndFresh()` ya no escribe estado — solo lo hace `buildSession()`, y
  solo para las tarjetas que de verdad entran en la sesión.
- Migración de reparación de una sola vez (`runMigrations()` en
  `lib/storage.ts`): borra cualquier estado que nunca haya sido tocado por
  el usuario (sin `lastReviewed`), devolviéndole a esas tarjetas su
  condición real de "nueva, no vista todavía". Corre sola, una vez, la
  próxima vez que el usuario abra la app — no requiere ninguna acción
  manual ni pierde el progreso real (tarjetas sí repasadas se quedan igual).

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

Estado del contenido por nivel ahora mismo (actualizado 2026-08-31):
- **A1** — completo: ~140 tarjetas (curso ARQUITECSOFT cours1-11 + alta
  frecuencia ampliada), 9 reglas gramaticales, 34 frases.
- **A2** — ~45 tarjetas (pasado/futuro, rutina diaria, opiniones,
  conectores, comparativos, pronombres objeto, vocabulario abstracto), 4
  reglas gramaticales (passé composé con avoir/être, futur proche,
  comparativos), 8 frases.
- **B1** — primer lote real: 55 tarjetas (imparfait/conditionnel,
  conectores de matiz, actualidad, medio ambiente, personalidad, viajes,
  trabajo, salud, relaciones, tecnología), 4 reglas gramaticales (imparfait
  vs passé composé, conditionnel, subjonctif con il faut que, pronombres
  relativos qui/que/où), 8 frases.
- **B2-C2** — todavía sin contenido. Aparecen en `/niveles` marcados
  "próximamente". Seguir el mismo patrón (`RawCard[]`/`RawNote[]` +
  `withLevel("B2")`). Temas naturales para B2: voz pasiva, discurso
  indirecto, condicionales avanzados, registro formal/informal, debate y
  argumentación.

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
- `lib/content.ts` — contenido "efectivo": usa lo último descargado de
  GitHub (raw) si existe y es válido, si no cae al contenido del bundle.
  Ver sección "Contenido remoto" abajo.

## Contenido remoto (actualiza sin redeploy)

El usuario pidió explícitamente que el contenido pudiera actualizarse
"conectándose a internet... para que no todo sea local", incluso sin
esperar un redeploy de Vercel. Cómo funciona:

1. **`data/*.ts` sigue siendo la fuente autoral** (donde yo edito, con
   comentarios y agrupación por tema/nivel) — nada cambia en el flujo de
   agregar contenido nuevo.
2. **`scripts/export-content.mjs`** compila esos 4 archivos con `tsc`
   (tienen solo imports `type`, así que no arrastran nada más en runtime),
   los ejecuta, y escribe el resultado como JSON plano en
   `public/content/{cards,sentences,grammar-notes,pronunciation}.json` +
   `meta.json` (con un hash del contenido como `version`). Corre solo
   (`npm run export-content`) o automático antes de cada build
   (`prebuild` en `package.json`).
3. **`lib/content.ts`** expone `getEffectiveCards()`, etc. — leen de
   `localStorage` (`fr.remoteContent.v1`) si hay algo cacheado, si no caen
   al `import` normal de `data/*.ts`.
4. **`checkForContentUpdates()`** se llama una vez al montar `Nav.tsx` (o
   sea, en cada página). Compara `meta.json` remoto contra la versión
   cacheada; si es distinta, descarga los 4 JSON, valida que tengan forma
   de array no vacío, y los guarda en `localStorage`. Todo con timeout
   (4-6s) y try/catch — si falla, no pasa nada, la app sigue con el
   contenido del bundle. El cambio se aplica en la próxima carga/navegación,
   nunca a mitad de una sesión.
5. La URL remota es
   `https://raw.githubusercontent.com/Gicbar/francais/main/public/content`
   (constante en `lib/content.ts`, sobreescribible con la variable de
   entorno `NEXT_PUBLIC_CONTENT_BASE_URL` si el repo cambia de nombre/dueño).

**Cómo publicar una actualización de contenido sin tocar Vercel:** editar
`data/*.ts` → `npm run export-content` (o simplemente hacer `npm run
build`, que lo corre solo) → `git add -A && git commit && git push`. En
cuanto el push llega a GitHub, `raw.githubusercontent.com` sirve el JSON
nuevo casi al instante — los usuarios que abran la app lo reciben aunque
Vercel todavía no haya terminado (o ni haya empezado) su propio redeploy.

## Datos (data/)

- `data/cards.ts` — 275 tarjetas en tres bloques (`a1Cards`, `a2Cards`,
  `b1Cards`), cada uno tipado `RawCard[]` sin `level` y mapeado con
  `withLevel(...)` al exportar `seedCards`). A1: vocabulario real de tus
  cours 1-11 (ARQUITECSOFT: colores, comida, objetos de oficina, aficiones,
  verbos de gusto, être/avoir/aller/faire, vouloir, posesivos, artículos
  contraídos du/de la/des y au/à la/aux, la hora) + alta frecuencia
  ampliada (números, días, familia, preguntas, cortesía, clima, transporte,
  compras, salud, tecnología, emociones). A2: pasado/futuro cercano, verbos
  pronominales, opiniones, conectores avanzados, comparativos, pronombres
  objeto, vocabulario abstracto, expresiones idiomáticas. B1 (2026-08-31):
  imparfait/conditionnel, conectores de matiz, actualidad/medios, medio
  ambiente, personalidad, viajes, trabajo, salud, relaciones, tecnología —
  ids con prefijo `B1-` (mayúscula, para no chocar con los ids `b1..b19`
  ya usados por el tema "bureau").
- `data/sentences.ts` — 50 frases (34 A1 + 8 A2 + 8 B1), mezcla de frases
  reales de tus resúmenes de clase + frases cotidianas genéricas.
- `data/grammar-notes.ts` — 17 reglas gramaticales (9 A1 + 4 A2 + 4 B1,
  mismo patrón `RawNote[]` + `withLevel`) con ejemplo incorrecto/correcto,
  el porqué, y 2-3 drills cada una. B1 agrega: imparfait vs passé composé,
  conditionnel présent, subjonctif con il faut que, pronombres relativos
  qui/que/où. Usado por `/gramatica` (agrupado por nivel) y `/errores`.
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
`arquitecsoft-cours1.html` … `cours11.html` (cours11 agregado el
2026-08-27, incorporado a la app el 2026-08-31: faire completo, vouloir,
artículos contraídos du/de la/des y au/à la/aux, la hora, salir/lugares),
`consejos-vocabulario.html`, `reference-verbes-possessifs-articles.html`,
`conversation-pratique.html`, `paragraphe-prononciation.html`,
`resumen-practica-2026-08-24.md`. **Nota: no existen cours7 ni cours8** —
revisar si es un hueco real o solo un salto de numeración cuando se
agreguen más clases. De esa carpeta sale el vocabulario y las reglas
gramaticales curadas en este proyecto — revisarla en cada sesión nueva por
si hay clases más recientes sin incorporar (así se encontró cours11).

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

**Contenido B2-C2** (lo más importante para el objetivo "0 a 100 / nativo"
del usuario — B1 ya se agregó el 2026-08-31): seguir el mismo patrón en
`data/cards.ts` y `data/grammar-notes.ts` — un bloque `RawCard[]`/
`RawNote[]` nuevo + `withLevel("B2")`, y sumarlo al `export`. No hace falta
tocar `lib/deck.ts` ni ninguna página: en cuanto haya tarjetas con
`level: "B2"`, `/niveles` y el ordenamiento de tarjetas nuevas en
`/review` las recogen solas. Ir nivel por nivel, no todos a la vez — así
cada lote se puede revisar con calma en vez de generar cientos de
tarjetas sin verificar.

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
- **Commit + push pendiente**: los cambios de esta sesión (bug fix,
  Cours 11, sistema de contenido remoto) están en el working tree pero
  no commiteados — confirmar con el usuario antes de subirlos.
- **Ampliar bastante el contenido** ("o hacer que tenga mucho contenido",
  2026-08-31): Cours 11 ya está, pero el usuario también pidió más
  volumen en general, no solo lo que viene de clase — seguir sumando
  vocabulario/gramática/frases A1-A2 más allá de lo estrictamente visto
  en las clases, con el mismo cuidado de no saturar (sesiones cortas,
  interleaving) que ya se definió.
- Más frases/vocabulario a medida que se agreguen nuevas clases —
  revisar `Documentos/Frances/` al inicio de cada sesión.
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
