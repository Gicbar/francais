export type PronunciationItem = {
  id: string;
  fr: string;
  es: string;
  tip: string; // regla de pronunciación que ilustra esta palabra/frase
};

export const pronunciationItems: PronunciationItem[] = [
  {
    id: "pr1",
    fr: "rouge",
    es: "rojo",
    tip: "La 'r' francesa se pronuncia en la garganta (como una leve raspadura), no con la punta de la lengua como en español.",
  },
  {
    id: "pr2",
    fr: "bonjour",
    es: "hola / buenos días",
    tip: "'on' es una vocal nasal: el aire sale también por la nariz. No se pronuncia la 'n' como consonante separada.",
  },
  {
    id: "pr3",
    fr: "le vin blanc",
    es: "el vino blanco",
    tip: "'in' y 'an' también son nasales, pero distintas entre sí: 'vin' (nasal cerrada) vs 'blanc' (nasal abierta).",
  },
  {
    id: "pr4",
    fr: "tu",
    es: "tú",
    tip: "La 'u' francesa no existe en español: redondea los labios como para decir 'u' pero con la lengua en posición de 'i'.",
  },
  {
    id: "pr5",
    fr: "vous",
    es: "usted / ustedes",
    tip: "'ou' se pronuncia como la 'u' del español ('oo' en inglés) — distinta de la 'u' francesa de arriba.",
  },
  {
    id: "pr6",
    fr: "les légumes",
    es: "las verduras",
    tip: "Liaison: la 's' final de 'les' normalmente muda, se pronuncia como 'z' porque la palabra siguiente empieza en vocal: 'lé-zé-gume'.",
  },
  {
    id: "pr7",
    fr: "petit",
    es: "pequeño",
    tip: "La 't' final casi nunca se pronuncia en francés. 'Petit' termina en sonido vocálico, no en 't'.",
  },
  {
    id: "pr8",
    fr: "deux",
    es: "dos",
    tip: "'eu' es un sonido propio del francés: labios redondeados, lengua a media altura — no es ni 'e' ni 'u' del español.",
  },
  {
    id: "pr9",
    fr: "fille",
    es: "hija / niña",
    tip: "'ille' suena 'y' (como 'fiy'), no 'il-le'. Excepción importante: 'ville' sí se pronuncia con 'l'.",
  },
  {
    id: "pr10",
    fr: "je m'appelle",
    es: "me llamo",
    tip: "La 'e' de 'je' es muy breve (schwa), casi no se pronuncia en habla rápida: 'j'm'appelle'.",
  },
  {
    id: "pr11",
    fr: "merci beaucoup",
    es: "muchas gracias",
    tip: "'eau' siempre suena como 'o' cerrada: 'beau-coup' se dice 'bo-cu', no 'be-a-u'.",
  },
  {
    id: "pr12",
    fr: "j'habite à Paris",
    es: "vivo en París",
    tip: "La 'h' en francés nunca se pronuncia. 'Habite' empieza directo con el sonido de la 'a'.",
  },
  {
    id: "pr13",
    fr: "un croissant",
    es: "un croissant",
    tip: "'un' es nasal (como 'in' pero con labios distintos) y la 'oi' suena 'ua': 'cr-ua-san'.",
  },
  {
    id: "pr14",
    fr: "je ne sais pas",
    es: "no sé",
    tip: "En habla natural, el 'ne' casi desaparece: se escucha más 'j'sais pas' que la frase completa.",
  },
  {
    id: "pr15",
    fr: "il est content",
    es: "él está contento",
    tip: "La 't' final de 'content' es muda, pero si la siguiente palabra empezara en vocal, reaparecería por liaison.",
  },
];
