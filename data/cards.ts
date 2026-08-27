import type { Card, Level } from "@/lib/types";

type RawCard = Omit<Card, "level">;

// Vocabulario base extraído de tus cours ARQUITECSOFT (A1) — resúmenes, referencia
// de verbos/posesivos/artículos y consejos de vocabulario.
const a1Cards: RawCard[] = [
  // --- Salutations / présentations ---
  { id: "s1", fr: "bonjour", es: "hola / buenos días", theme: "salutations" },
  { id: "s2", fr: "enchanté(e)", es: "mucho gusto (al presentarse, no 'me encanta')", theme: "salutations" },
  { id: "s3", fr: "je m'appelle...", es: "me llamo...", theme: "salutations" },
  { id: "s4", fr: "je suis colombien(ne)", es: "soy colombiano/a", theme: "salutations", example: "Je suis colombien, mais j'adore Paris.", exampleEs: "Soy colombiano, pero amo París." },

  // --- Couleurs ---
  { id: "c1", fr: "le rouge", es: "el rojo", theme: "couleurs", gender: "m" },
  { id: "c2", fr: "le noir", es: "el negro", theme: "couleurs", gender: "m" },
  { id: "c3", fr: "le blanc", es: "el blanco", theme: "couleurs", gender: "m" },
  { id: "c4", fr: "la couleur", es: "el color", theme: "couleurs", gender: "f", example: "Ma couleur préférée est le noir et le rouge.", exampleEs: "Mi color favorito es el negro y el rojo." },
  { id: "c5", fr: "mon bureau est blanc", es: "mi escritorio es blanco", theme: "couleurs" },

  // --- Nourriture ---
  { id: "n1", fr: "le riz", es: "el arroz", theme: "nourriture", gender: "m" },
  { id: "n2", fr: "le poulet", es: "el pollo", theme: "nourriture", gender: "m" },
  { id: "n3", fr: "les légumes", es: "las verduras", theme: "nourriture", gender: "pl" },
  { id: "n4", fr: "le café", es: "el café", theme: "nourriture", gender: "m" },
  { id: "n5", fr: "l'eau", es: "el agua", theme: "nourriture", gender: "f" },
  { id: "n6", fr: "j'aime le riz avec du poulet", es: "me gusta el arroz con pollo", theme: "nourriture" },
  { id: "n7", fr: "je déteste les légumes", es: "odio las verduras", theme: "nourriture" },

  // --- Bureau / objets ---
  { id: "b1", fr: "le bureau", es: "el escritorio / la oficina", theme: "bureau", gender: "m" },
  { id: "b2", fr: "la chaise", es: "la silla", theme: "bureau", gender: "f" },
  { id: "b3", fr: "l'ordinateur", es: "el computador", theme: "bureau", gender: "m" },
  { id: "b4", fr: "la souris", es: "el mouse", theme: "bureau", gender: "f" },
  { id: "b5", fr: "le téléphone portable", es: "el celular", theme: "bureau", gender: "m" },
  { id: "b6", fr: "les documents", es: "los documentos", theme: "bureau", gender: "pl" },
  { id: "b7", fr: "la tasse", es: "la taza", theme: "bureau", gender: "f" },
  { id: "b8", fr: "l'agenda", es: "la agenda", theme: "bureau", gender: "m" },
  { id: "b9", fr: "les écouteurs", es: "los audífonos", theme: "bureau", gender: "pl" },
  { id: "b10", fr: "l'imprimante", es: "la impresora", theme: "bureau", gender: "f" },
  { id: "b11", fr: "le stylo", es: "el lapicero", theme: "bureau", gender: "m" },
  { id: "b12", fr: "le cahier", es: "el cuaderno", theme: "bureau", gender: "m" },
  { id: "b13", fr: "la clé USB", es: "la memoria USB", theme: "bureau", gender: "f" },
  { id: "b14", fr: "les lunettes", es: "las gafas", theme: "bureau", gender: "pl" },
  { id: "b15", fr: "le casque", es: "los audífonos (de diadema)", theme: "bureau", gender: "m" },
  { id: "b16", fr: "la calculatrice", es: "la calculadora", theme: "bureau", gender: "f" },
  { id: "b17", fr: "le livre", es: "el libro", theme: "bureau", gender: "m" },
  { id: "b18", fr: "le chargeur", es: "el cargador", theme: "bureau", gender: "m" },
  { id: "b19", fr: "la profession", es: "la profesión", theme: "bureau", gender: "f" },

  // --- Loisirs / goûts ---
  { id: "l1", fr: "la danse", es: "el baile", theme: "loisirs", gender: "f" },
  { id: "l2", fr: "la peinture", es: "la pintura", theme: "loisirs", gender: "f" },
  { id: "l3", fr: "le théâtre", es: "el teatro", theme: "loisirs", gender: "m" },
  { id: "l4", fr: "l'opéra", es: "la ópera", theme: "loisirs", gender: "m" },
  { id: "l5", fr: "la lecture", es: "la lectura", theme: "loisirs", gender: "f" },
  { id: "l6", fr: "la musique", es: "la música", theme: "loisirs", gender: "f" },
  { id: "l7", fr: "le cinéma", es: "el cine", theme: "loisirs", gender: "m" },
  { id: "l8", fr: "la cuisine", es: "la cocina", theme: "loisirs", gender: "f" },
  { id: "l9", fr: "les voyages", es: "los viajes", theme: "loisirs", gender: "pl" },
  { id: "l10", fr: "le sport", es: "el deporte", theme: "loisirs", gender: "m" },
  { id: "l11", fr: "la photographie", es: "la fotografía", theme: "loisirs", gender: "f" },
  { id: "l12", fr: "le yoga", es: "el yoga", theme: "loisirs", gender: "m" },
  { id: "l13", fr: "la randonnée", es: "la caminata / senderismo", theme: "loisirs", gender: "f" },
  { id: "l14", fr: "les jeux vidéo", es: "los videojuegos", theme: "loisirs", gender: "pl" },
  { id: "l15", fr: "le jardinage", es: "la jardinería", theme: "loisirs", gender: "m" },
  { id: "l16", fr: "la natation", es: "la natación", theme: "loisirs", gender: "f" },
  { id: "l17", fr: "le ski", es: "el esquí", theme: "loisirs", gender: "m" },
  { id: "l18", fr: "le tennis", es: "el tenis", theme: "loisirs", gender: "m" },
  { id: "l19", fr: "l'escalade", es: "la escalada", theme: "loisirs", gender: "f" },
  { id: "l20", fr: "le football", es: "el fútbol", theme: "loisirs", gender: "m" },

  // --- Verbes de goût ---
  { id: "v1", fr: "adorer", es: "adorar / encantar", theme: "verbes", example: "J'adore la danse.", exampleEs: "Amo el baile." },
  { id: "v2", fr: "aimer bien", es: "gustar (algo, moderado)", theme: "verbes" },
  { id: "v3", fr: "aimer", es: "gustar", theme: "verbes" },
  { id: "v4", fr: "ne pas aimer", es: "no gustar", theme: "verbes" },
  { id: "v5", fr: "détester", es: "odiar / detestar", theme: "verbes", example: "Je déteste danser.", exampleEs: "Odio bailar." },

  // --- Verbes être / avoir / aller / faire (presente) ---
  { id: "v6", fr: "je suis / tu es / il est", es: "yo soy-estoy / tú eres-estás / él es-está (être)", theme: "verbes" },
  { id: "v7", fr: "nous sommes / vous êtes / ils sont", es: "nosotros somos / ustedes son / ellos son (être)", theme: "verbes" },
  { id: "v8", fr: "j'ai / tu as / il a", es: "yo tengo / tú tienes / él tiene (avoir)", theme: "verbes" },
  { id: "v9", fr: "nous avons / vous avez / ils ont", es: "nosotros tenemos / ustedes tienen / ellos tienen (avoir)", theme: "verbes" },
  { id: "v10", fr: "je vais / tu vas / il va", es: "yo voy / tú vas / él va (aller)", theme: "verbes" },
  { id: "v11", fr: "je fais / tu fais / il fait", es: "yo hago / tú haces / él hace (faire)", theme: "verbes" },

  // --- Verbes -ER réguliers ---
  { id: "v12", fr: "parler", es: "hablar", theme: "verbes" },
  { id: "v13", fr: "habiter", es: "vivir (en un lugar)", theme: "verbes" },
  { id: "v14", fr: "travailler", es: "trabajar", theme: "verbes" },
  { id: "v15", fr: "écouter", es: "escuchar", theme: "verbes" },
  { id: "v16", fr: "regarder", es: "mirar", theme: "verbes" },
  { id: "v17", fr: "manger", es: "comer", theme: "verbes" },
  { id: "v18", fr: "jouer", es: "jugar", theme: "verbes" },

  // --- Possessifs ---
  { id: "p1", fr: "mon / ma / mes", es: "mi / mi / mis (posesivo, según género y número)", theme: "possessifs", example: "mon plat préféré, ma couleur préférée", exampleEs: "mi plato favorito, mi color favorito" },
  { id: "p2", fr: "ton / ta / tes", es: "tu / tu / tus", theme: "possessifs" },
  { id: "p3", fr: "son / sa / ses", es: "su / su / sus (de él/ella)", theme: "possessifs" },
  { id: "p4", fr: "notre / nos", es: "nuestro / nuestros", theme: "possessifs" },
  { id: "p5", fr: "votre / vos", es: "su / sus (formal, de ustedes)", theme: "possessifs" },
  { id: "p6", fr: "leur / leurs", es: "su / sus (de ellos/ellas)", theme: "possessifs" },
  { id: "p7", fr: "mon amie / mon école", es: "mi amiga / mi escuela (excepción: fem. + vocal → mon)", theme: "possessifs" },

  // --- Phrases / connecteurs / erreurs comunes ---
  { id: "f1", fr: "et", es: "y", theme: "phrases", example: "le rouge et le noir" },
  { id: "f2", fr: "est (verbe être)", es: "es / está (¡no confundir con 'et'!)", theme: "phrases", example: "mon bureau est blanc" },
  { id: "f3", fr: "mais", es: "pero", theme: "phrases", example: "J'aime la natation mais je n'aime pas le ski.", exampleEs: "Me gusta la natación pero no me gusta el esquí." },
  { id: "f4", fr: "parce que", es: "porque", theme: "phrases" },
  { id: "f5", fr: "aussi", es: "también", theme: "phrases" },
  { id: "f6", fr: "donc", es: "entonces / por lo tanto", theme: "phrases" },
  { id: "f7", fr: "je → j' / ne → n' / le,la → l'", es: "elisión: delante de vocal o 'h' muda", theme: "phrases", example: "j'aime, je n'aime pas, l'opéra", exampleEs: "me gusta, no me gusta, la ópera" },

  // --- Essentiel : lo más frecuente del francés cotidiano (no solo del curso) ---
  // Números, días, preguntas y frases de cortesía: son las palabras de mayor
  // frecuencia de uso real, base de cualquier lista de vocabulario A1/A2.
  { id: "e1", fr: "merci / merci beaucoup", es: "gracias / muchas gracias", theme: "essentiel" },
  { id: "e2", fr: "s'il vous plaît", es: "por favor (formal)", theme: "essentiel" },
  { id: "e3", fr: "excusez-moi / pardon", es: "disculpe / perdón", theme: "essentiel" },
  { id: "e4", fr: "comment ça va ?", es: "¿cómo estás?", theme: "essentiel" },
  { id: "e5", fr: "à bientôt / à demain", es: "hasta pronto / hasta mañana", theme: "essentiel" },
  { id: "e6", fr: "je ne comprends pas", es: "no entiendo", theme: "essentiel" },
  { id: "e7", fr: "vous pouvez répéter ?", es: "¿puede repetir?", theme: "essentiel" },
  { id: "e8", fr: "qui / quoi / où", es: "quién / qué / dónde", theme: "essentiel" },
  { id: "e9", fr: "quand / comment / pourquoi", es: "cuándo / cómo / por qué", theme: "essentiel" },
  { id: "e10", fr: "combien", es: "cuánto", theme: "essentiel" },
  { id: "e11", fr: "aujourd'hui / demain / hier", es: "hoy / mañana / ayer", theme: "essentiel" },
  { id: "e12", fr: "maintenant / plus tard", es: "ahora / más tarde", theme: "essentiel" },
  { id: "e13", fr: "lundi, mardi, mercredi", es: "lunes, martes, miércoles", theme: "essentiel" },
  { id: "e14", fr: "jeudi, vendredi", es: "jueves, viernes", theme: "essentiel" },
  { id: "e15", fr: "samedi, dimanche", es: "sábado, domingo", theme: "essentiel" },
  { id: "e16", fr: "un, deux, trois", es: "uno, dos, tres", theme: "essentiel" },
  { id: "e17", fr: "quatre, cinq, six", es: "cuatro, cinco, seis", theme: "essentiel" },
  { id: "e18", fr: "sept, huit, neuf, dix", es: "siete, ocho, nueve, diez", theme: "essentiel" },
  { id: "e19", fr: "vingt, trente, cent", es: "veinte, treinta, cien", theme: "essentiel" },
  { id: "e20", fr: "la famille", es: "la familia", theme: "essentiel", gender: "f" },
  { id: "e21", fr: "la mère / le père", es: "la madre / el padre", theme: "essentiel" },
  { id: "e22", fr: "le frère / la sœur", es: "el hermano / la hermana", theme: "essentiel" },
  { id: "e23", fr: "un ami / une amie", es: "un amigo / una amiga", theme: "essentiel" },
  { id: "e24", fr: "la maison", es: "la casa", theme: "essentiel", gender: "f" },
  { id: "e25", fr: "pouvoir / vouloir / devoir", es: "poder / querer / deber", theme: "essentiel" },
  { id: "e26", fr: "je voudrais...", es: "quisiera... (pedir algo con cortesía)", theme: "essentiel" },
  { id: "e27", fr: "il y a", es: "hay", theme: "essentiel" },
  { id: "e28", fr: "beaucoup / un peu", es: "mucho / un poco", theme: "essentiel" },
  { id: "e29", fr: "toujours / jamais", es: "siempre / nunca", theme: "essentiel" },
  { id: "e30", fr: "aujourd'hui, il fait beau", es: "hoy hace buen tiempo", theme: "essentiel" },

  // --- Adjectifs, prépositions y verbos de alta frecuencia (uso diario) ---
  { id: "e31", fr: "grand / petit", es: "grande / pequeño", theme: "essentiel" },
  { id: "e32", fr: "bon / mauvais", es: "bueno / malo", theme: "essentiel" },
  { id: "e33", fr: "nouveau / vieux", es: "nuevo / viejo", theme: "essentiel" },
  { id: "e34", fr: "facile / difficile", es: "fácil / difícil", theme: "essentiel" },
  { id: "e35", fr: "content / fatigué", es: "contento / cansado", theme: "essentiel" },
  { id: "e36", fr: "avec / sans", es: "con / sin", theme: "essentiel" },
  { id: "e37", fr: "dans / sur / sous", es: "dentro de / sobre / debajo de", theme: "essentiel" },
  { id: "e38", fr: "pour / avant / après", es: "para / antes / después", theme: "essentiel" },
  { id: "e39", fr: "prendre / venir / voir", es: "tomar / venir / ver", theme: "essentiel" },
  { id: "e40", fr: "savoir / connaître", es: "saber (un hecho) / conocer (a alguien, un lugar)", theme: "essentiel" },

  // --- Temps, météo, heure — más allá del curso, uso diario ---
  { id: "e41", fr: "il pleut / il neige", es: "está lloviendo / está nevando", theme: "essentiel" },
  { id: "e42", fr: "il fait chaud / il fait froid", es: "hace calor / hace frío", theme: "essentiel" },
  { id: "e43", fr: "le soleil / les nuages", es: "el sol / las nubes", theme: "essentiel" },
  { id: "e44", fr: "quelle heure est-il ?", es: "¿qué hora es?", theme: "essentiel" },
  { id: "e45", fr: "il est trois heures", es: "son las tres", theme: "essentiel" },
  { id: "e46", fr: "le matin / l'après-midi / le soir", es: "la mañana / la tarde / la noche", theme: "essentiel" },
  { id: "e47", fr: "la semaine / le mois / l'année", es: "la semana / el mes / el año", theme: "essentiel" },

  // --- Transport / voyage ---
  { id: "e48", fr: "la voiture / le bus / le train", es: "el carro / el bus / el tren", theme: "essentiel" },
  { id: "e49", fr: "l'avion / l'aéroport", es: "el avión / el aeropuerto", theme: "essentiel" },
  { id: "e50", fr: "à gauche / à droite / tout droit", es: "a la izquierda / a la derecha / derecho", theme: "essentiel" },
  { id: "e51", fr: "où est la gare ?", es: "¿dónde está la estación?", theme: "essentiel" },
  { id: "e52", fr: "un billet, s'il vous plaît", es: "un tiquete, por favor", theme: "essentiel" },
  { id: "e53", fr: "loin / près", es: "lejos / cerca", theme: "essentiel" },

  // --- Achats / argent ---
  { id: "e54", fr: "ça coûte combien ?", es: "¿cuánto cuesta?", theme: "essentiel" },
  { id: "e55", fr: "c'est cher / c'est pas cher", es: "es caro / es barato", theme: "essentiel" },
  { id: "e56", fr: "l'argent / payer", es: "el dinero / pagar", theme: "essentiel" },
  { id: "e57", fr: "la carte / en espèces", es: "la tarjeta / en efectivo", theme: "essentiel" },
  { id: "e58", fr: "le magasin / le marché", es: "la tienda / el mercado", theme: "essentiel" },

  // --- Corps / santé básico ---
  { id: "e59", fr: "la tête / le ventre / le dos", es: "la cabeza / el estómago / la espalda", theme: "essentiel" },
  { id: "e60", fr: "j'ai mal à la tête", es: "me duele la cabeza", theme: "essentiel" },
  { id: "e61", fr: "je suis malade / je vais bien", es: "estoy enfermo / estoy bien", theme: "essentiel" },
  { id: "e62", fr: "le médecin / la pharmacie", es: "el médico / la farmacia", theme: "essentiel" },

  // --- Technologie / trabajo (más allá del vocabulario de oficina del curso) ---
  { id: "e63", fr: "envoyer un message", es: "enviar un mensaje", theme: "essentiel" },
  { id: "e64", fr: "chercher / trouver", es: "buscar / encontrar", theme: "essentiel" },
  { id: "e65", fr: "commencer / finir", es: "empezar / terminar", theme: "essentiel" },
  { id: "e66", fr: "le mot de passe", es: "la contraseña", theme: "essentiel" },
  { id: "e67", fr: "internet / le wifi", es: "internet / el wifi", theme: "essentiel" },
  { id: "e68", fr: "une réunion", es: "una reunión", theme: "essentiel" },

  // --- Emociones / adjetivos extra ---
  { id: "e69", fr: "heureux / triste", es: "feliz / triste", theme: "essentiel" },
  { id: "e70", fr: "occupé / libre", es: "ocupado / libre", theme: "essentiel" },
  { id: "e71", fr: "important / inutile", es: "importante / inútil", theme: "essentiel" },

  // --- Conectores extra (más allá de mais/et/parce que/aussi/donc) ---
  { id: "e72", fr: "si / alors", es: "si / entonces", theme: "essentiel" },
  { id: "e73", fr: "d'abord / ensuite / enfin", es: "primero / luego / finalmente", theme: "essentiel" },
];

// --- Nivel A2: vocabulario para hablar de pasado, futuro, opiniones y
// rutina diaria — el siguiente escalón después de dominar lo básico de A1.
const a2Cards: RawCard[] = [
  // Marcadores de tiempo (pasado/futuro) — para passé composé y futur proche
  { id: "a2-1", fr: "hier soir / la semaine dernière", es: "anoche / la semana pasada", theme: "essentiel" },
  { id: "a2-2", fr: "il y a deux jours", es: "hace dos días", theme: "essentiel" },
  { id: "a2-3", fr: "demain / la semaine prochaine", es: "mañana / la próxima semana", theme: "essentiel" },
  { id: "a2-4", fr: "bientôt / dans un mois", es: "pronto / en un mes", theme: "essentiel" },
  { id: "a2-5", fr: "déjà / pas encore", es: "ya / todavía no", theme: "essentiel" },
  { id: "a2-6", fr: "pendant / depuis", es: "durante / desde", theme: "essentiel" },

  // Verbos pronominales (rutina diaria)
  { id: "a2-7", fr: "se réveiller / se lever", es: "despertarse / levantarse", theme: "essentiel" },
  { id: "a2-8", fr: "se doucher / s'habiller", es: "ducharse / vestirse", theme: "essentiel" },
  { id: "a2-9", fr: "se coucher / se reposer", es: "acostarse / descansar", theme: "essentiel" },
  { id: "a2-10", fr: "se dépêcher", es: "apurarse", theme: "essentiel" },
  { id: "a2-11", fr: "s'appeler / se souvenir de", es: "llamarse / acordarse de", theme: "essentiel" },

  // Opiniones y matices
  { id: "a2-12", fr: "je pense que / je crois que", es: "pienso que / creo que", theme: "essentiel" },
  { id: "a2-13", fr: "je trouve que / à mon avis", es: "me parece que / en mi opinión", theme: "essentiel" },
  { id: "a2-14", fr: "je suis d'accord / pas d'accord", es: "estoy de acuerdo / en desacuerdo", theme: "essentiel" },
  { id: "a2-15", fr: "ça dépend", es: "depende", theme: "essentiel" },
  { id: "a2-16", fr: "je préfère / je préférerais", es: "prefiero / preferiría", theme: "essentiel" },

  // Conectores más avanzados
  { id: "a2-17", fr: "cependant / pourtant", es: "sin embargo", theme: "phrases" },
  { id: "a2-18", fr: "par contre", es: "en cambio", theme: "phrases" },
  { id: "a2-19", fr: "en fait", es: "de hecho", theme: "phrases" },
  { id: "a2-20", fr: "par exemple", es: "por ejemplo", theme: "phrases" },
  { id: "a2-21", fr: "grâce à / à cause de", es: "gracias a / por culpa de", theme: "phrases" },
  { id: "a2-22", fr: "malgré", es: "a pesar de", theme: "phrases" },

  // Comparativos y superlativos
  { id: "a2-23", fr: "plus... que / moins... que", es: "más... que / menos... que", theme: "essentiel" },
  { id: "a2-24", fr: "aussi... que", es: "tan... como", theme: "essentiel" },
  { id: "a2-25", fr: "le plus / le meilleur", es: "el más / el mejor", theme: "essentiel" },

  // Pronombres objeto (en frase, para verlos en contexto)
  { id: "a2-26", fr: "je le connais / je la connais", es: "lo conozco / la conozco", theme: "essentiel", example: "Ce livre, je le connais bien.", exampleEs: "Ese libro, lo conozco bien." },
  { id: "a2-27", fr: "je lui parle / je leur parle", es: "le hablo (a él/ella) / les hablo (a ellos)", theme: "essentiel" },
  { id: "a2-28", fr: "j'en ai besoin", es: "lo necesito (de eso)", theme: "essentiel" },
  { id: "a2-29", fr: "j'y pense", es: "pienso en eso", theme: "essentiel" },

  // Vocabulario abstracto de uso frecuente
  { id: "a2-30", fr: "le problème / la solution", es: "el problema / la solución", theme: "essentiel" },
  { id: "a2-31", fr: "le changement / l'expérience", es: "el cambio / la experiencia", theme: "essentiel" },
  { id: "a2-32", fr: "la raison / le but", es: "la razón / el objetivo", theme: "essentiel" },
  { id: "a2-33", fr: "l'avantage / l'inconvénient", es: "la ventaja / la desventaja", theme: "essentiel" },
  { id: "a2-34", fr: "la décision / le choix", es: "la decisión / la elección", theme: "essentiel" },

  // Expresiones idiomáticas comunes
  { id: "a2-35", fr: "ça vaut la peine", es: "vale la pena", theme: "phrases" },
  { id: "a2-36", fr: "ça marche", es: "funciona / está bien (coloquial)", theme: "phrases" },
  { id: "a2-37", fr: "avoir raison / avoir tort", es: "tener razón / estar equivocado", theme: "essentiel" },
  { id: "a2-38", fr: "avoir envie de", es: "tener ganas de", theme: "essentiel" },
  { id: "a2-39", fr: "avoir besoin de", es: "tener necesidad de / necesitar", theme: "essentiel" },
  { id: "a2-40", fr: "tomber amoureux / tomber malade", es: "enamorarse / enfermarse", theme: "essentiel" },

  // Verbos frecuentes adicionales
  { id: "a2-41", fr: "devenir / rester", es: "convertirse en / quedarse", theme: "essentiel" },
  { id: "a2-42", fr: "essayer / réussir à", es: "intentar / lograr", theme: "essentiel" },
  { id: "a2-43", fr: "décider de / oublier de", es: "decidir / olvidar", theme: "essentiel" },
  { id: "a2-44", fr: "s'inquiéter / se détendre", es: "preocuparse / relajarse", theme: "essentiel" },
  { id: "a2-45", fr: "améliorer / empirer", es: "mejorar / empeorar", theme: "essentiel" },
];

function withLevel(level: Level) {
  return (c: RawCard): Card => ({ ...c, level });
}

export const seedCards: Card[] = [...a1Cards.map(withLevel("A1")), ...a2Cards.map(withLevel("A2"))];
