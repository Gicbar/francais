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

  // --- Cours 11 ARQUITECSOFT: faire, vouloir, articles contractés, l'heure ---
  { id: "c11-1", fr: "nous faisons / vous faites / ils font", es: "nosotros hacemos / ustedes hacen / ellos hacen (faire)", theme: "verbes" },
  { id: "c11-2", fr: "je veux / tu veux / il veut", es: "yo quiero / tú quieres / él quiere (vouloir)", theme: "verbes" },
  { id: "c11-3", fr: "nous voulons / vous voulez / ils veulent", es: "nosotros queremos / ustedes quieren / ellos quieren (vouloir)", theme: "verbes" },
  { id: "c11-4", fr: "faire du sport / faire de la musculation", es: "hacer deporte / hacer musculación", theme: "essentiel", example: "Je fais du sport le matin.", exampleEs: "Hago deporte por la mañana." },
  { id: "c11-5", fr: "faire des exercices / faire de l'exercice", es: "hacer ejercicios / hacer ejercicio", theme: "essentiel" },
  { id: "c11-6", fr: "ne pas faire de bruit", es: "no hacer ruido (de/d' en negativo)", theme: "essentiel" },
  { id: "c11-7", fr: "il est midi / il est minuit", es: "es mediodía / es medianoche", theme: "essentiel" },
  { id: "c11-8", fr: "il est neuf heures quinze", es: "son las nueve y cuarto", theme: "essentiel" },
  { id: "c11-9", fr: "il est dix heures moins le quart", es: "son las diez menos cuarto", theme: "essentiel" },
  { id: "c11-10", fr: "le week-end", es: "el fin de semana", theme: "essentiel" },
  { id: "c11-11", fr: "le musée", es: "el museo", theme: "loisirs" },
  { id: "c11-12", fr: "la piscine", es: "la piscina", theme: "loisirs" },
  { id: "c11-13", fr: "le restaurant / le bar", es: "el restaurante / el bar", theme: "loisirs" },
  { id: "c11-14", fr: "aller au cinéma / aller à la piscine", es: "ir al cine / ir a la piscina", theme: "essentiel", example: "Je veux aller au théâtre, tu veux venir ?", exampleEs: "Quiero ir al teatro, ¿quieres venir?" },
  { id: "c11-15", fr: "le fuseau horaire", es: "la zona horaria", theme: "essentiel" },

  // --- Cours 13 ARQUITECSOFT: météo, saisons, venir/habiter/aller + pays ---
  { id: "c13-1", fr: "il fait quel temps ?", es: "¿qué tiempo hace?", theme: "essentiel" },
  { id: "c13-2", fr: "il fait ... degrés", es: "hace ... grados", theme: "essentiel" },
  { id: "c13-3", fr: "il y a du vent / il y a des éclairs", es: "hay viento / hay relámpagos", theme: "essentiel" },
  { id: "c13-4", fr: "l'été / l'automne / l'hiver / le printemps", es: "el verano / el otoño / el invierno / la primavera", theme: "essentiel" },
  { id: "c13-5", fr: "je viens / tu viens / il vient", es: "yo vengo / tú vienes / él viene (venir)", theme: "verbes" },
  { id: "c13-6", fr: "nous venons / vous venez / ils viennent", es: "nosotros venimos / ustedes vienen / ellos vienen (venir)", theme: "verbes" },
  { id: "c13-7", fr: "je viens du Maroc, j'habite au Maroc", es: "vengo de Marruecos, vivo en Marruecos (país masculino: du / au)", theme: "essentiel", example: "Je viens du Maroc. J'habite au Maroc.", exampleEs: "Vengo de Marruecos. Vivo en Marruecos." },
  { id: "c13-8", fr: "je viens de France, j'habite en France", es: "vengo de Francia, vivo en Francia (país femenino: de / en)", theme: "essentiel", example: "Je viens de Turquie. J'habite en Turquie.", exampleEs: "Vengo de Turquía. Vivo en Turquía." },
  { id: "c13-9", fr: "je viens des États-Unis, j'habite aux États-Unis", es: "vengo de Estados Unidos, vivo en Estados Unidos (país plural: des / aux)", theme: "essentiel" },
  { id: "c13-10", fr: "je viens de Paris, j'habite à Paris", es: "vengo de París, vivo en París (ciudad: de / à)", theme: "essentiel" },

  // --- Cours 14 ARQUITECSOFT: organiser une réunion, pouvoir, disponibilités ---
  { id: "c14-1", fr: "je peux / tu peux / il peut", es: "yo puedo / tú puedes / él puede (pouvoir)", theme: "verbes" },
  { id: "c14-2", fr: "nous pouvons / vous pouvez / ils peuvent", es: "nosotros podemos / ustedes pueden / ellos pueden (pouvoir)", theme: "verbes" },
  { id: "c14-3", fr: "jeudi, vendredi, samedi, dimanche", es: "jueves, viernes, sábado, domingo", theme: "essentiel" },
  { id: "c14-4", fr: "vous êtes disponible quand ?", es: "¿cuándo está disponible?", theme: "essentiel" },
  { id: "c14-5", fr: "je suis libre / je ne suis pas disponible", es: "estoy libre / no estoy disponible", theme: "essentiel" },
  { id: "c14-6", fr: "ça vous convient ?", es: "¿le viene bien?", theme: "essentiel", example: "Disons quinze heures, ça vous convient ?", exampleEs: "Digamos las tres, ¿le viene bien?" },
  { id: "c14-7", fr: "un créneau", es: "un espacio de tiempo disponible", theme: "essentiel" },
  { id: "c14-8", fr: "désolé, je ne suis pas disponible", es: "lo siento, no estoy disponible (rechazar con cortesía)", theme: "phrases" },
  { id: "c14-9", fr: "une visioconférence", es: "una videollamada", theme: "essentiel" },
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

// --- Nivel B1: narrar en varios tiempos, matizar una opinión, vocabulario
// de actualidad, trabajo, salud, relaciones y tecnología — el escalón
// "usuario independiente" del CEFR.
const b1Cards: RawCard[] = [
  // Imparfait / conditionnel (marcadores, la mecánica va en grammar-notes)
  { id: "B1-1", fr: "quand j'étais petit(e)", es: "cuando era pequeño/a", theme: "essentiel", example: "Quand j'étais petit, j'habitais à la montagne.", exampleEs: "Cuando era pequeño, vivía en la montaña." },
  { id: "B1-2", fr: "avant, je... / maintenant, je...", es: "antes, yo... / ahora, yo... (contraste de hábitos)", theme: "phrases" },
  { id: "B1-3", fr: "je voudrais / j'aimerais (conditionnel)", es: "quisiera / me gustaría", theme: "verbes" },
  { id: "B1-4", fr: "si j'avais le temps, je...", es: "si tuviera tiempo, yo... (hipótesis)", theme: "phrases" },
  { id: "B1-5", fr: "à ta place, je...", es: "en tu lugar, yo... (consejo)", theme: "phrases" },

  // Conectores de matiz (opinión con nuance)
  { id: "B1-6", fr: "bien que / quoique", es: "aunque (+ subjonctif)", theme: "phrases" },
  { id: "B1-7", fr: "tandis que / alors que", es: "mientras que (contraste)", theme: "phrases" },
  { id: "B1-8", fr: "néanmoins / toutefois", es: "sin embargo / no obstante", theme: "phrases" },
  { id: "B1-9", fr: "malgré tout", es: "a pesar de todo", theme: "phrases" },
  { id: "B1-10", fr: "quant à", es: "en cuanto a", theme: "phrases" },
  { id: "B1-11", fr: "il est vrai que... mais", es: "es verdad que... pero", theme: "phrases" },
  { id: "B1-12", fr: "dans l'ensemble", es: "en general, en conjunto", theme: "phrases" },

  // Actualité / médias
  { id: "B1-13", fr: "les actualités / les informations", es: "las noticias", theme: "essentiel" },
  { id: "B1-14", fr: "un article / une émission", es: "un artículo / un programa (TV/radio)", theme: "essentiel" },
  { id: "B1-15", fr: "selon / d'après", es: "según / de acuerdo con", theme: "phrases" },
  { id: "B1-16", fr: "un sondage", es: "una encuesta", theme: "essentiel" },
  { id: "B1-17", fr: "la société", es: "la sociedad", theme: "essentiel" },

  // Environnement
  { id: "B1-18", fr: "l'environnement / le climat", es: "el medio ambiente / el clima", theme: "essentiel" },
  { id: "B1-19", fr: "polluer / recycler", es: "contaminar / reciclar", theme: "essentiel" },
  { id: "B1-20", fr: "durable / renouvelable", es: "sostenible / renovable", theme: "essentiel" },
  { id: "B1-21", fr: "le réchauffement climatique", es: "el calentamiento global", theme: "essentiel" },
  { id: "B1-22", fr: "économiser l'énergie", es: "ahorrar energía", theme: "essentiel" },

  // Personnalité
  { id: "B1-23", fr: "sociable / timide", es: "sociable / tímido", theme: "essentiel" },
  { id: "B1-24", fr: "ambitieux / paresseux", es: "ambicioso / perezoso", theme: "essentiel" },
  { id: "B1-25", fr: "patient / têtu", es: "paciente / terco", theme: "essentiel" },
  { id: "B1-26", fr: "honnête / franc", es: "honesto / franco", theme: "essentiel" },
  { id: "B1-27", fr: "sensible / généreux", es: "sensible / generoso", theme: "essentiel" },

  // Voyage / logistique
  { id: "B1-28", fr: "réserver un hôtel / un vol", es: "reservar un hotel / un vuelo", theme: "essentiel" },
  { id: "B1-29", fr: "l'hébergement", es: "el alojamiento", theme: "essentiel" },
  { id: "B1-30", fr: "la douane / le passeport", es: "la aduana / el pasaporte", theme: "essentiel" },
  { id: "B1-31", fr: "un itinéraire", es: "un itinerario", theme: "essentiel" },
  { id: "B1-32", fr: "annuler / reporter", es: "cancelar / posponer", theme: "essentiel" },

  // Travail
  { id: "B1-33", fr: "un contrat / le salaire", es: "un contrato / el salario", theme: "essentiel" },
  { id: "B1-34", fr: "une formation / un stage", es: "una capacitación / una pasantía", theme: "essentiel" },
  { id: "B1-35", fr: "un collègue / le patron", es: "un colega / el jefe", theme: "essentiel" },
  { id: "B1-36", fr: "postuler à un emploi", es: "postularse a un empleo", theme: "essentiel" },
  { id: "B1-37", fr: "démissionner / être licencié", es: "renunciar / ser despedido", theme: "essentiel" },

  // Santé
  { id: "B1-38", fr: "une maladie / un symptôme", es: "una enfermedad / un síntoma", theme: "essentiel" },
  { id: "B1-39", fr: "se soigner / guérir", es: "cuidarse / curarse", theme: "essentiel" },
  { id: "B1-40", fr: "prendre rendez-vous chez le médecin", es: "pedir cita con el médico", theme: "essentiel" },
  { id: "B1-41", fr: "une ordonnance", es: "una receta médica", theme: "essentiel" },

  // Relations
  { id: "B1-42", fr: "se disputer / se réconcilier", es: "pelearse / reconciliarse", theme: "essentiel" },
  { id: "B1-43", fr: "la confiance / le respect", es: "la confianza / el respeto", theme: "essentiel" },
  { id: "B1-44", fr: "tomber amoureux de", es: "enamorarse de", theme: "essentiel" },
  { id: "B1-45", fr: "rompre / se marier", es: "romper / casarse", theme: "essentiel" },

  // Technologie / réseaux sociaux
  { id: "B1-46", fr: "télécharger / publier", es: "descargar / publicar", theme: "essentiel" },
  { id: "B1-47", fr: "un réseau social", es: "una red social", theme: "essentiel" },
  { id: "B1-48", fr: "la sécurité en ligne", es: "la seguridad en línea", theme: "essentiel" },
  { id: "B1-49", fr: "partager / commenter", es: "compartir / comentar", theme: "essentiel" },

  // Verbes et expressions B1 de alta frecuencia
  { id: "B1-50", fr: "il paraît que / il semble que", es: "parece que / al parecer", theme: "phrases" },
  { id: "B1-51", fr: "se rendre compte de", es: "darse cuenta de", theme: "essentiel" },
  { id: "B1-52", fr: "avoir tendance à", es: "tender a", theme: "essentiel" },
  { id: "B1-53", fr: "il vaut mieux que (+ subjonctif)", es: "es mejor que", theme: "phrases" },
  { id: "B1-54", fr: "il faut que (+ subjonctif)", es: "hace falta que / hay que", theme: "phrases" },
  { id: "B1-55", fr: "au fur et à mesure", es: "a medida que, poco a poco", theme: "phrases" },
];

function withLevel(level: Level) {
  return (c: RawCard): Card => ({ ...c, level });
}

export const seedCards: Card[] = [
  ...a1Cards.map(withLevel("A1")),
  ...a2Cards.map(withLevel("A2")),
  ...b1Cards.map(withLevel("B1")),
];
