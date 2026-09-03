import type { Level } from "@/lib/types";

// Reglas gramaticales explicadas con el "por qué" — extraídas directamente
// de tus resúmenes de práctica reales (ARQUITECSOFT), no genéricas, más
// las reglas nuevas de cada nivel a medida que se agregan.
export type Drill = {
  prompt: string; // frase con un hueco marcado como ___
  answers: string[]; // respuestas aceptadas (normalizadas: minúsculas, sin puntuación final)
};

export type GrammarNote = {
  id: string;
  title: string;
  level: Level;
  wrong: string;
  right: string;
  why: string;
  cardIds: string[]; // tarjetas relacionadas, para "reforzar ahora"
  drills: Drill[];
};

type RawNote = Omit<GrammarNote, "level">;

const a1Notes: RawNote[] = [
  {
    id: "g-et-est",
    title: "« et » vs « est »",
    wrong: "Mon bureau et blanc.",
    right: "Mon bureau est blanc.",
    why: "«et» es la conjunción 'y' (le rouge et le noir). «est» es el verbo être ('es/está'). Si en español dirías 'es' o 'está', en francés siempre va est, nunca et — aunque suenen parecido.",
    cardIds: ["f1", "f2"],
    drills: [
      { prompt: "Le riz ___ bon. (está)", answers: ["est"] },
      { prompt: "J'aime le rouge ___ le noir. (y)", answers: ["et"] },
      { prompt: "Mon plat préféré ___ le riz.", answers: ["est"] },
    ],
  },
  {
    id: "g-mon-ma",
    title: "mon / ma según el género del sustantivo",
    wrong: "Ma travail est intéressant. (travail es masculino)",
    right: "Mon travail est intéressant.",
    why: "El posesivo concuerda con el género de lo poseído, no con quién posee. Antes de elegir mon/ma revisa el género del sustantivo: mon bureau, mon travail, mon plat (masc.) vs ma couleur, ma profession (fem.). Excepción: mon/ton/son también delante de un femenino que empieza en vocal (mon amie, mon école).",
    cardIds: ["p1", "p7"],
    drills: [
      { prompt: "___ couleur préférée est le bleu. (mi, couleur=fem.)", answers: ["ma"] },
      { prompt: "___ bureau est blanc. (mi, bureau=masc.)", answers: ["mon"] },
      { prompt: "___ amie s'appelle Julie. (mi, amie=fem. pero empieza en vocal)", answers: ["mon"] },
    ],
  },
  {
    id: "g-adj-agreement",
    title: "Concordancia del adjetivo con el sustantivo",
    wrong: "Ma couleur préféré est le rouge. (falta la 'e')",
    right: "Ma couleur préférée est le rouge.",
    why: "El adjetivo concuerda en género con el sustantivo que describe: mon plat préféré (masculino, sin e) pero ma couleur préférée (femenino, con e). Es fácil olvidar la 'e' cuando el sustantivo es femenino.",
    cardIds: ["c4"],
    drills: [
      { prompt: "Ma couleur préfér___ est le vert. (fem.)", answers: ["ée", "e"] },
      { prompt: "Mon plat préfér___ est le poulet. (masc.)", answers: ["é"] },
    ],
  },
  {
    id: "g-sujet",
    title: "El sujeto nunca se omite",
    wrong: "Déteste les légumes.",
    right: "Je déteste les légumes.",
    why: "A diferencia del español, donde el verbo ya indica quién habla, en francés siempre hace falta el pronombre sujeto (je, tu, il...). 'Déteste' solo, sin 'je', no es una frase correcta.",
    cardIds: ["v5"],
    drills: [
      { prompt: "___ déteste les légumes. (yo)", answers: ["je"] },
      { prompt: "___ adorons la musique. (nosotros)", answers: ["nous"] },
    ],
  },
  {
    id: "g-article-gout",
    title: "Artículo definido con verbos de gusto",
    wrong: "J'aime des légumes.",
    right: "J'aime les légumes.",
    why: "Con aimer / adorer / détester / préférer siempre se usa el artículo definido (le/la/les), incluso cuando en español no dirías nada o usarías otro artículo. 'un/une/des' es para contar o hablar de algo no específico — no para gustos.",
    cardIds: ["n7", "v1", "v5"],
    drills: [
      { prompt: "J'adore ___ musique.", answers: ["la"] },
      { prompt: "Je déteste ___ légumes.", answers: ["les"] },
      { prompt: "Il aime ___ café.", answers: ["le"] },
    ],
  },
  {
    id: "g-enchante",
    title: "« enchanté » no es 'me encanta'",
    wrong: "Enchanté le riz ! (queriendo decir 'me encanta el arroz')",
    right: "J'adore le riz. / Enchanté, je m'appelle Camilo. (solo al presentarte)",
    why: "Es un falso amigo clásico: enchanté suena a 'encantado' pero solo se usa como 'mucho gusto' al conocer a alguien. Para 'me encanta algo' se usa j'adore o j'aime beaucoup.",
    cardIds: ["s2", "v1"],
    drills: [
      { prompt: "Para decir 'mucho gusto' al presentarte: ___", answers: ["enchanté", "enchantée"] },
      { prompt: "Para decir 'me encanta el arroz': j'___ le riz.", answers: ["adore"] },
    ],
  },
  {
    id: "g-elision",
    title: "Elisión: je→j', ne→n', le/la→l'",
    wrong: "Je aime l'opéra. Je ne aime pas le opéra.",
    right: "J'aime l'opéra. Je n'aime pas l'opéra.",
    why: "Delante de una vocal o una 'h' muda, je/ne/le/la pierden la vocal y se pegan con apóstrofo a la palabra siguiente. Es automático, no una opción de estilo.",
    cardIds: ["f7"],
    drills: [
      { prompt: "___adore l'escalade. (yo, delante de vocal)", answers: ["j'"] },
      { prompt: "Je ___aime pas le ski. (no, delante de vocal)", answers: ["n'"] },
      { prompt: "___opéra est magnifique. (el/la, delante de vocal)", answers: ["l'"] },
    ],
  },
  {
    id: "g-de-contracte",
    title: "du / de la / de l' / des (de + artículo, con faire)",
    wrong: "Je fais le sport. Je fais la musculation.",
    right: "Je fais du sport. Je fais de la musculation.",
    why: "Con faire + actividad, 'de' se combina con el artículo: de+le→du, de+la→de la (no cambia), de+l'→de l', de+les→des. En negativo, todos se reducen a 'de' (o 'd'' delante de vocal): je ne fais pas de sport.",
    cardIds: ["c11-4", "c11-5", "c11-6"],
    drills: [
      { prompt: "Je fais ___ sport. (de+le)", answers: ["du"] },
      { prompt: "Elle fait ___ musculation. (de+la)", answers: ["de la"] },
      { prompt: "Nous ne faisons pas ___ bruit. (negativo)", answers: ["de"] },
    ],
  },
  {
    id: "g-a-contracte",
    title: "au / à la / à l' / aux (à + artículo, con aller)",
    wrong: "Je vais à le cinéma. Je vais à les Tuileries.",
    right: "Je vais au cinéma. Je vais aux Tuileries.",
    why: "Con aller + lugar, 'à' se combina con el artículo: à+le→au, à+la→à la (no cambia), à+l'→à l', à+les→aux. 'à le' y 'à les' nunca existen en francés correcto.",
    cardIds: ["c11-14"],
    drills: [
      { prompt: "Je vais ___ cinéma. (à+le)", answers: ["au"] },
      { prompt: "Je vais ___ piscine. (à+la)", answers: ["à la"] },
      { prompt: "Je vais ___ Tuileries. (à+les, plural)", answers: ["aux"] },
    ],
  },
  {
    id: "g-prepositions-pays",
    title: "Prépositions devant les pays et les villes (venir / habiter)",
    wrong: "Je viens de Maroc. J'habite à France.",
    right: "Je viens du Maroc. J'habite en France.",
    why: "La preposición depende del género del país: masculino → du (venir) / au (habiter, aller); femenino o que empieza por vocal → de/d' (venir) / en (habiter, aller); plural → des (venir) / aux (habiter, aller); ciudad → de/d' (venir) / à (habiter, aller). 'à France' o 'de Maroc' sin artículo son errores típicos.",
    cardIds: ["c13-7", "c13-8", "c13-9", "c13-10"],
    drills: [
      { prompt: "Je viens ___ Maroc. (país masculino)", answers: ["du"] },
      { prompt: "J'habite ___ Maroc. (país masculino)", answers: ["au"] },
      { prompt: "Je viens ___ Turquie. (país femenino)", answers: ["de"] },
      { prompt: "J'habite ___ Turquie. (país femenino)", answers: ["en"] },
      { prompt: "Je viens ___ États-Unis. (país plural)", answers: ["des"] },
      { prompt: "J'habite ___ Bogotá. (ciudad)", answers: ["à"] },
    ],
  },
  {
    id: "g-pouvoir",
    title: "pouvoir (irregular): je peux, nous pouvons",
    wrong: "Nous pouvez venir jeudi.",
    right: "Nous pouvons venir jeudi.",
    why: "pouvoir es irregular: je peux, tu peux, il peut (radical peu-), pero nous pouvons, vous pouvez, ils peuvent (radical pouv-/peuv-). Es un error común mezclar el radical del singular con las terminaciones del plural.",
    cardIds: ["c14-1", "c14-2"],
    drills: [
      { prompt: "Est-ce que tu ___ (pouvoir) te libérer mardi ?", answers: ["peux"] },
      { prompt: "Nous ne ___ (pouvoir) pas nous voir jeudi.", answers: ["pouvons"] },
      { prompt: "Ils ___ (pouvoir) confirmer demain matin.", answers: ["peuvent"] },
    ],
  },
];

// --- Nivel A2 ---
const a2Notes: RawNote[] = [
  {
    id: "g-passe-compose-avoir",
    title: "Passé composé con avoir",
    wrong: "Hier, je regarde un film.",
    right: "Hier, j'ai regardé un film.",
    why: "Para hablar de una acción terminada en el pasado, la mayoría de verbos usan avoir (conjugado en presente) + participio pasado. Regla del participio: verbos en -er → -é (regardé, mangé), en -ir → -i (fini), en -re → -u (vendu). 'Hier' es una pista de que hace falta el pasado, no el presente.",
    cardIds: ["a2-1"],
    drills: [
      { prompt: "Hier, j'___ mangé du riz. (avoir, yo)", answers: ["ai"] },
      { prompt: "Tu ___ regardé un film ? (avoir, tú)", answers: ["as"] },
      { prompt: "Elle ___ fini son travail. (avoir, ella)", answers: ["a"] },
    ],
  },
  {
    id: "g-passe-compose-etre",
    title: "Passé composé con être (verbos de movimiento)",
    wrong: "Elle a allée à Paris.",
    right: "Elle est allée à Paris.",
    why: "Un grupo pequeño de verbos (aller, venir, partir, arriver, entrer, sortir, monter, descendre, naître, mourir, rester, tomber...) usan être en vez de avoir, y el participio concuerda en género/número con el sujeto: il est allé, elle est allée, elles sont allées.",
    cardIds: [],
    drills: [
      { prompt: "Elle ___ allée à Paris. (être, ella)", answers: ["est"] },
      { prompt: "Ils sont arriv___. (participio, ellos = plural masc.)", answers: ["és"] },
      { prompt: "Je ___ né en Colombie. (être, yo, hombre)", answers: ["suis"] },
    ],
  },
  {
    id: "g-futur-proche",
    title: "Futur proche: aller + infinitif",
    wrong: "Demain, je visite Paris. (ambiguo — ¿hoy o mañana?)",
    right: "Demain, je vais visiter Paris.",
    why: "Para hablar de planes cercanos o futuros claros, se usa aller conjugado en presente + el verbo en infinitivo (sin conjugar). Es el equivalente al 'voy a + infinitivo' del español — mucho más común en el habla diaria que el futuro simple.",
    cardIds: ["a2-3"],
    drills: [
      { prompt: "Je ___ visiter Paris la semaine prochaine. (voy a)", answers: ["vais"] },
      { prompt: "Nous ___ manger au restaurant ce soir. (vamos a)", answers: ["allons"] },
      { prompt: "Tu ___ finir bientôt ? (vas a)", answers: ["vas"] },
    ],
  },
  {
    id: "g-comparatifs",
    title: "Comparativos: plus/moins/aussi... que",
    wrong: "Elle est más grande que moi. (mezcla de español)",
    right: "Elle est plus grande que moi.",
    why: "plus...que = más...que · moins...que = menos...que · aussi...que = tan...como. El adjetivo va entre el comparativo y 'que', y concuerda en género/número con el sujeto: il est plus grand, elle est plus grande.",
    cardIds: ["a2-23", "a2-24"],
    drills: [
      { prompt: "Elle est ___ grande que moi. (más)", answers: ["plus"] },
      { prompt: "Je suis ___ rapide que toi. (tan)", answers: ["aussi"] },
      { prompt: "Ce livre est ___ cher que l'autre. (menos)", answers: ["moins"] },
    ],
  },
];

// --- Nivel B1 ---
const b1Notes: RawNote[] = [
  {
    id: "g-imparfait-vs-pc",
    title: "Imparfait vs passé composé",
    wrong: "Hier, je regardais un film quand tu as téléphoné. (mezclado sin criterio)",
    right: "Hier, je regardais un film quand tu as téléphoné.",
    why: "El passé composé cuenta una acción puntual y terminada (tu as téléphoné = pasó una vez). El imparfait describe el fondo, algo en curso o un hábito (je regardais = ya estaba pasando cuando ocurrió lo otro). Truco: si en español dirías '-aba/-ía' (contexto) es imparfait; si dirías un pretérito puntual, es passé composé.",
    cardIds: ["B1-1", "B1-2"],
    drills: [
      { prompt: "Quand j'___ (être) petit, j'habitais à Paris. (descripción de fondo)", answers: ["étais"] },
      { prompt: "Hier, il ___ (pleuvoir) toute la journée. (fondo continuo)", answers: ["pleuvait"] },
      { prompt: "Soudain, elle ___ (partir). (acción puntual)", answers: ["est partie"] },
    ],
  },
  {
    id: "g-conditionnel",
    title: "Conditionnel présent: deseos y consejos corteses",
    wrong: "Je veux un café, s'il vous plaît. (demasiado directo)",
    right: "Je voudrais un café, s'il vous plaît.",
    why: "El conditionnel (radical del futuro + terminaciones del imparfait: -ais, -ais, -ait, -ions, -iez, -aient) suaviza peticiones y expresa deseos o consejos: je voudrais (quisiera), tu devrais (deberías), à ta place je ferais (yo en tu lugar haría). Mucho más cortés que el presente.",
    cardIds: ["B1-3", "B1-5"],
    drills: [
      { prompt: "Je ___ (vouloir) un thé, s'il vous plaît. (cortés)", answers: ["voudrais"] },
      { prompt: "Tu ___ (devoir) dormir plus. (deberías)", answers: ["devrais"] },
      { prompt: "À ta place, je ___ (partir) tôt. (yo en tu lugar)", answers: ["partirais"] },
    ],
  },
  {
    id: "g-subjonctif-il-faut",
    title: "Subjonctif después de il faut que / il vaut mieux que",
    wrong: "Il faut que tu vas au rendez-vous.",
    right: "Il faut que tu ailles au rendez-vous.",
    why: "Después de expresiones de obligación/necesidad como 'il faut que' o 'il vaut mieux que', el verbo va en subjonctif, no en indicativo. Muchos verbos comunes son irregulares en subjonctif: aller→aille, être→sois, avoir→aie, faire→fasse.",
    cardIds: ["B1-53", "B1-54"],
    drills: [
      { prompt: "Il faut que tu ___ (aller) chez le médecin.", answers: ["ailles"] },
      { prompt: "Il faut que je ___ (être) à l'heure.", answers: ["sois"] },
      { prompt: "Il vaut mieux que nous ___ (avoir) un plan B.", answers: ["ayons"] },
    ],
  },
  {
    id: "g-pronoms-relatifs",
    title: "Pronombres relativos: qui / que / où",
    wrong: "Le livre que est sur la table est à moi.",
    right: "Le livre qui est sur la table est à moi.",
    why: "'qui' reemplaza el SUJETO de la frase relativa (le livre qui est... — el libro ES el que está). 'que' reemplaza el COMPLEMENTO directo (le livre que je lis — YO leo el libro). 'où' reemplaza un lugar o momento (la ville où j'habite).",
    cardIds: [],
    drills: [
      { prompt: "C'est le film ___ j'ai vu hier. (complemento: yo vi el film)", answers: ["que"] },
      { prompt: "C'est la personne ___ travaille avec moi. (sujeto: ella trabaja)", answers: ["qui"] },
      { prompt: "C'est la ville ___ je suis né. (lugar)", answers: ["où"] },
    ],
  },
];

function withLevel(level: Level) {
  return (n: RawNote): GrammarNote => ({ ...n, level });
}

export const grammarNotes: GrammarNote[] = [
  ...a1Notes.map(withLevel("A1")),
  ...a2Notes.map(withLevel("A2")),
  ...b1Notes.map(withLevel("B1")),
];
