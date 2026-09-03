import type { Level } from "@/lib/types";

// Historias cortas para input comprensible extendido: más contexto que una
// frase suelta de data/sentences.ts, pensadas para ampliar vocabulario con
// variedad de temas y niveles (A1 → B2).
export type StoryTheme =
  | "quotidien"
  | "travail"
  | "voyage"
  | "amitie"
  | "mystere"
  | "aventure"
  | "culture"
  | "reflexion";

export const STORY_THEME_LABEL: Record<StoryTheme, string> = {
  quotidien: "Vida cotidiana",
  travail: "Trabajo",
  voyage: "Viajes",
  amitie: "Amistad",
  mystere: "Misterio",
  aventure: "Aventura",
  culture: "Cultura",
  reflexion: "Reflexión",
};

export type StorySentence = { fr: string; es: string };

export type Story = {
  id: string;
  title: string;
  titleEs: string;
  level: Level;
  theme: StoryTheme;
  sentences: StorySentence[];
};

type RawStory = Omit<Story, "level">;

// --- Nivel A1 ---
const a1Stories: RawStory[] = [
  {
    id: "hist-a1-1",
    title: "Une journée ordinaire",
    titleEs: "Un día común",
    theme: "quotidien",
    sentences: [
      { fr: "Je m'appelle Sofia et j'habite à Bogotá.", es: "Me llamo Sofía y vivo en Bogotá." },
      { fr: "Je me réveille à six heures et demie.", es: "Me despierto a las seis y media." },
      { fr: "Je prends un café et je mange du pain.", es: "Tomo un café y como pan." },
      { fr: "Je travaille dans un bureau avec mon ordinateur.", es: "Trabajo en una oficina con mi computador." },
      { fr: "Le midi, je mange avec mes collègues.", es: "Al mediodía, como con mis colegas." },
      { fr: "Le soir, j'écoute de la musique et je lis un livre.", es: "Por la noche, escucho música y leo un libro." },
      { fr: "Je suis fatiguée, mais je suis contente de ma journée.", es: "Estoy cansada, pero estoy contenta con mi día." },
    ],
  },
  {
    id: "hist-a1-2",
    title: "Le nouveau collègue",
    titleEs: "El nuevo colega",
    theme: "travail",
    sentences: [
      { fr: "Aujourd'hui, il y a un nouveau collègue dans l'équipe.", es: "Hoy hay un nuevo colega en el equipo." },
      { fr: "Il s'appelle Marc et il vient de Lyon.", es: "Se llama Marc y viene de Lyon." },
      { fr: "Il parle français et un peu espagnol.", es: "Habla francés y un poco de español." },
      { fr: "Marc n'a pas d'ordinateur, alors je lui donne le mien.", es: "Marc no tiene computador, así que le doy el mío." },
      { fr: "Nous mangeons ensemble à midi et nous parlons de nos pays.", es: "Comemos juntos al mediodía y hablamos de nuestros países." },
      { fr: "Marc adore le café colombien et moi, j'adore le fromage français.", es: "A Marc le encanta el café colombiano y a mí me encanta el queso francés." },
      { fr: "À la fin de la journée, Marc dit : « Merci pour votre accueil ! »", es: "Al final del día, Marc dice: «¡Gracias por su bienvenida!»" },
    ],
  },
  {
    id: "hist-a1-3",
    title: "Un café à Paris",
    titleEs: "Un café en París",
    theme: "voyage",
    sentences: [
      { fr: "Camilo est en voyage à Paris pour son travail.", es: "Camilo está de viaje en París por su trabajo." },
      { fr: "Il fait froid, alors il entre dans un petit café.", es: "Hace frío, así que entra a un pequeño café." },
      { fr: "« Bonjour, je voudrais un café, s'il vous plaît », dit-il.", es: "«Buenos días, quisiera un café, por favor», dice él." },
      { fr: "Le serveur est très gentil et parle lentement.", es: "El mesero es muy amable y habla lento." },
      { fr: "Camilo regarde par la fenêtre : il y a beaucoup de monde dans la rue.", es: "Camilo mira por la ventana: hay mucha gente en la calle." },
      { fr: "Il pense : « J'aime beaucoup cette ville, elle est belle. »", es: "Piensa: «Me gusta mucho esta ciudad, es hermosa»." },
      { fr: "Après le café, il retourne à l'hôtel, content de sa journée.", es: "Después del café, regresa al hotel, contento con su día." },
    ],
  },
];

// --- Nivel A2 ---
const a2Stories: RawStory[] = [
  {
    id: "hist-a2-1",
    title: "Le voyage à Lyon",
    titleEs: "El viaje a Lyon",
    theme: "voyage",
    sentences: [
      { fr: "La semaine dernière, je suis allé à Lyon pour une réunion importante.", es: "La semana pasada, fui a Lyon para una reunión importante." },
      { fr: "J'ai pris l'avion tôt le matin et je suis arrivé fatigué.", es: "Tomé el avión temprano en la mañana y llegué cansado." },
      { fr: "À l'hôtel, j'ai rencontré deux collègues de l'équipe française.", es: "En el hotel, conocí a dos colegas del equipo francés." },
      { fr: "Le soir, nous avons mangé dans un petit restaurant près du fleuve.", es: "Por la noche, comimos en un pequeño restaurante cerca del río." },
      { fr: "Le lendemain, la réunion s'est très bien passée.", es: "Al día siguiente, la reunión salió muy bien." },
      { fr: "Avant de partir, j'ai acheté un cadeau pour ma famille.", es: "Antes de irme, compré un regalo para mi familia." },
      { fr: "Je vais bientôt retourner à Lyon pour un autre projet.", es: "Pronto voy a regresar a Lyon para otro proyecto." },
    ],
  },
  {
    id: "hist-a2-2",
    title: "La réunion difficile",
    titleEs: "La reunión difícil",
    theme: "travail",
    sentences: [
      { fr: "Hier, nous avons eu une réunion difficile avec un client.", es: "Ayer tuvimos una reunión difícil con un cliente." },
      { fr: "Le client n'était pas content parce que le projet avait du retard.", es: "El cliente no estaba contento porque el proyecto tenía retraso." },
      { fr: "Ma collègue a expliqué calmement les raisons du problème.", es: "Mi colega explicó con calma las razones del problema." },
      { fr: "Nous avons proposé un nouveau plan pour finir le travail plus vite.", es: "Propusimos un nuevo plan para terminar el trabajo más rápido." },
      { fr: "À la fin, le client a accepté notre solution.", es: "Al final, el cliente aceptó nuestra solución." },
      { fr: "Après la réunion, toute l'équipe était soulagée.", es: "Después de la reunión, todo el equipo se sintió aliviado." },
      { fr: "Nous allons travailler plus fort la semaine prochaine.", es: "Vamos a trabajar más duro la próxima semana." },
    ],
  },
  {
    id: "hist-a2-3",
    title: "Une surprise pour l'équipe",
    titleEs: "Una sorpresa para el equipo",
    theme: "amitie",
    sentences: [
      { fr: "C'était l'anniversaire de notre chef d'équipe, Ana.", es: "Era el cumpleaños de nuestra jefa de equipo, Ana." },
      { fr: "Nous avons organisé une surprise sans qu'elle le sache.", es: "Organizamos una sorpresa sin que ella lo supiera." },
      { fr: "Chacun a apporté quelque chose : un gâteau, des ballons, de la musique.", es: "Cada uno trajo algo: un pastel, globos, música." },
      { fr: "Quand Ana est entrée dans le bureau, tout le monde a crié « Surprise ! »", es: "Cuando Ana entró a la oficina, todos gritaron «¡Sorpresa!»" },
      { fr: "Elle était très émue et elle a même pleuré un peu.", es: "Ella estaba muy emocionada e incluso lloró un poco." },
      { fr: "Nous avons passé un excellent après-midi ensemble.", es: "Pasamos una excelente tarde juntos." },
      { fr: "Ana a dit que c'était la meilleure surprise de sa vie.", es: "Ana dijo que fue la mejor sorpresa de su vida." },
    ],
  },
];

// --- Nivel B1 ---
const b1Stories: RawStory[] = [
  {
    id: "hist-b1-1",
    title: "Le mystère du bureau vide",
    titleEs: "El misterio de la oficina vacía",
    theme: "mystere",
    sentences: [
      { fr: "Ce matin-là, quand je suis arrivé au bureau, quelque chose n'allait pas.", es: "Esa mañana, cuando llegué a la oficina, algo no andaba bien." },
      { fr: "La porte était ouverte, mais il n'y avait personne à l'intérieur.", es: "La puerta estaba abierta, pero no había nadie adentro." },
      { fr: "Les ordinateurs étaient allumés, comme si quelqu'un venait de partir.", es: "Los computadores estaban encendidos, como si alguien acabara de irse." },
      { fr: "J'ai appelé mes collègues, mais personne ne répondait.", es: "Llamé a mis colegas, pero nadie respondía." },
      { fr: "Finalement, j'ai trouvé un mot sur la table : « Réunion d'urgence, salle 3. »", es: "Finalmente, encontré una nota sobre la mesa: «Reunión de emergencia, sala 3»." },
      { fr: "Il fallait que je me dépêche, car la réunion avait déjà commencé.", es: "Tenía que apurarme, porque la reunión ya había comenzado." },
      { fr: "Ce n'était pas un mystère, seulement une matinée un peu chaotique.", es: "No era un misterio, solo una mañana un poco caótica." },
    ],
  },
  {
    id: "hist-b1-2",
    title: "Changer de vie",
    titleEs: "Cambiar de vida",
    theme: "reflexion",
    sentences: [
      { fr: "Depuis quelque temps, je me demandais si mon travail me rendait vraiment heureux.", es: "Desde hace un tiempo, me preguntaba si mi trabajo realmente me hacía feliz." },
      { fr: "Je gagnais bien ma vie, mais je n'avais plus de temps pour mes passions.", es: "Ganaba bien, pero ya no tenía tiempo para mis pasiones." },
      { fr: "Un jour, j'ai décidé de parler à mon patron de mes envies de changement.", es: "Un día, decidí hablar con mi jefe sobre mis ganas de cambio." },
      { fr: "À ma grande surprise, il m'a proposé de travailler à temps partiel.", es: "Para mi gran sorpresa, me propuso trabajar medio tiempo." },
      { fr: "Depuis, je peins le week-end et je me sens beaucoup plus équilibré.", es: "Desde entonces, pinto los fines de semana y me siento mucho más equilibrado." },
      { fr: "Il vaut mieux que je vive selon mes valeurs, même si je gagne un peu moins.", es: "Es mejor que viva según mis valores, aunque gane un poco menos." },
      { fr: "Ce choix a changé ma façon de voir le travail.", es: "Esta decisión cambió mi forma de ver el trabajo." },
    ],
  },
  {
    id: "hist-b1-3",
    title: "Les vacances qui ont mal commencé",
    titleEs: "Las vacaciones que empezaron mal",
    theme: "aventure",
    sentences: [
      { fr: "Nous étions tellement excités de partir en vacances au bord de la mer.", es: "Estábamos tan emocionados de irnos de vacaciones a la orilla del mar." },
      { fr: "Mais le matin du départ, notre vol a été annulé à cause d'une tempête.", es: "Pero la mañana de la salida, nuestro vuelo fue cancelado por una tormenta." },
      { fr: "Nous avons attendu six heures à l'aéroport sans savoir quoi faire.", es: "Esperamos seis horas en el aeropuerto sin saber qué hacer." },
      { fr: "Finalement, nous avons trouvé un vol pour le lendemain matin.", es: "Finalmente, encontramos un vuelo para la mañana siguiente." },
      { fr: "Une fois arrivés, il faisait un temps magnifique et la mer était calme.", es: "Una vez llegados, hacía un tiempo espléndido y el mar estaba calmado." },
      { fr: "Malgré ce début compliqué, ce sont devenues les meilleures vacances de l'année.", es: "A pesar de ese comienzo complicado, se convirtieron en las mejores vacaciones del año." },
      { fr: "On dit souvent qu'un mauvais départ n'annonce pas toujours une mauvaise fin.", es: "A menudo se dice que un mal comienzo no siempre anuncia un mal final." },
    ],
  },
];

// --- Nivel B2 ---
const b2Stories: RawStory[] = [
  {
    id: "hist-b2-1",
    title: "Le débat sur le télétravail",
    titleEs: "El debate sobre el teletrabajo",
    theme: "travail",
    sentences: [
      { fr: "Depuis la généralisation du télétravail, les entreprises sont divisées sur son avenir.", es: "Desde la generalización del teletrabajo, las empresas están divididas sobre su futuro." },
      { fr: "Certains employeurs estiment qu'il est essentiel que les équipes se retrouvent au bureau pour rester soudées.", es: "Algunos empleadores consideran esencial que los equipos se reúnan en la oficina para mantenerse unidos." },
      { fr: "D'autres pensent, au contraire, que la productivité n'a jamais été aussi élevée qu'en travaillant de chez soi.", es: "Otros piensan, por el contrario, que la productividad nunca ha sido tan alta como trabajando desde casa." },
      { fr: "Bien que les avis divergent, tout le monde s'accorde sur un point : la flexibilité est devenue indispensable.", es: "Aunque las opiniones difieren, todos coinciden en un punto: la flexibilidad se ha vuelto indispensable." },
      { fr: "Il n'est pas rare que les salariés eux-mêmes préfèrent un modèle hybride, ni tout à fait au bureau ni tout à fait chez eux.", es: "No es raro que los propios empleados prefieran un modelo híbrido, ni del todo en la oficina ni del todo en casa." },
      { fr: "Quoi qu'il en soit, il semble peu probable que l'on revienne un jour au bureau à temps plein pour tous.", es: "En cualquier caso, parece poco probable que algún día se vuelva a la oficina a tiempo completo para todos." },
      { fr: "Le débat, lui, est loin d'être terminé.", es: "El debate, por su parte, está lejos de terminar." },
    ],
  },
  {
    id: "hist-b2-2",
    title: "Une lettre à mon ancien moi",
    titleEs: "Una carta a mi antiguo yo",
    theme: "reflexion",
    sentences: [
      { fr: "Cher moi d'il y a dix ans, j'aimerais te dire quelques mots avant que tu ne partes étudier à l'étranger.", es: "Querido yo de hace diez años, quisiera decirte unas palabras antes de que te vayas a estudiar al extranjero." },
      { fr: "Tu vas avoir peur, et c'est tout à fait normal ; personne ne réussit sans douter un peu.", es: "Vas a tener miedo, y es completamente normal; nadie triunfa sin dudar un poco." },
      { fr: "Ne t'inquiète pas si tu ne comprends pas tout ce qu'on te dit au début, cela viendra avec le temps.", es: "No te preocupes si no entiendes todo lo que te dicen al principio, eso vendrá con el tiempo." },
      { fr: "Profite de chaque erreur pour apprendre, plutôt que de la voir comme un échec.", es: "Aprovecha cada error para aprender, en lugar de verlo como un fracaso." },
      { fr: "Un jour, tu seras fier du chemin parcouru, même si la route t'aura paru longue.", es: "Un día, estarás orgulloso del camino recorrido, aunque el trayecto te haya parecido largo." },
      { fr: "Continue à croire en toi, quoi qu'en pensent les autres.", es: "Sigue creyendo en ti mismo, pase lo que piensen los demás." },
      { fr: "Avec toute mon affection, ton toi du futur.", es: "Con todo mi cariño, tu yo del futuro." },
    ],
  },
  {
    id: "hist-b2-3",
    title: "L'entretien qui a tout changé",
    titleEs: "La entrevista que lo cambió todo",
    theme: "aventure",
    sentences: [
      { fr: "Je me souviens encore de la nervosité que j'ai ressentie avant cet entretien décisif.", es: "Todavía recuerdo el nerviosismo que sentí antes de aquella entrevista decisiva." },
      { fr: "J'avais préparé mes réponses pendant des semaines, sans imaginer à quel point tout allait changer.", es: "Había preparado mis respuestas durante semanas, sin imaginar cuánto iba a cambiar todo." },
      { fr: "Le recruteur m'a posé une question à laquelle je ne m'attendais absolument pas.", es: "El reclutador me hizo una pregunta que en absoluto esperaba." },
      { fr: "Plutôt que de paniquer, j'ai pris une grande respiration et j'ai répondu avec honnêteté.", es: "En vez de entrar en pánico, respiré hondo y respondí con honestidad." },
      { fr: "À ma grande surprise, c'est justement cette réponse spontanée qui a convaincu l'équipe.", es: "Para mi gran sorpresa, fue justamente esa respuesta espontánea la que convenció al equipo." },
      { fr: "Deux jours plus tard, j'ai reçu l'appel qui allait changer le cours de ma carrière.", es: "Dos días después, recibí la llamada que iba a cambiar el rumbo de mi carrera." },
      { fr: "Depuis, je crois fermement que les meilleurs moments naissent souvent de l'imprévu.", es: "Desde entonces, creo firmemente que los mejores momentos suelen nacer de lo imprevisto." },
    ],
  },
];

function withLevel(level: Level) {
  return (s: RawStory): Story => ({ ...s, level });
}

export const seedStories: Story[] = [
  ...a1Stories.map(withLevel("A1")),
  ...a2Stories.map(withLevel("A2")),
  ...b1Stories.map(withLevel("B1")),
  ...b2Stories.map(withLevel("B2")),
];
