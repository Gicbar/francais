import type { Level } from "@/lib/types";

// Ejercicios de completar con conectores y palabras de enlace (preposiciones,
// orden temporal, causa, oposición...). Vienen de Cours 19 (connecteurs
// logiques), 15, 17, 18 y de los errores reales de resumen-practica-2026-08-24
// (et vs est). `hint` dice la función del hueco; `answers` lista todas las
// opciones válidas.
export type ConnectorExercise = {
  id: string;
  level: Level;
  sentence: string; // el hueco es "___"
  es: string;
  hint: string;
  answers: string[];
};

export const connectorExercises: ConnectorExercise[] = [
  // --- A1: conectores básicos (Cours 19) ---
  { id: "k1", level: "A1", sentence: "Je voudrais un café ___ un croissant.", es: "Quisiera un café y un croissant.", hint: "suma (y)", answers: ["et"] },
  { id: "k2", level: "A1", sentence: "Tu préfères le thé ___ le café ?", es: "¿Prefieres el té o el café?", hint: "elección (o)", answers: ["ou"] },
  { id: "k3", level: "A1", sentence: "C'est bon ___ un peu cher.", es: "Es bueno pero un poco caro.", hint: "oposición (pero)", answers: ["mais"] },
  { id: "k4", level: "A1", sentence: "J'ai faim, ___ je mange.", es: "Tengo hambre, entonces como.", hint: "consecuencia (entonces)", answers: ["donc", "alors"] },
  { id: "k5", level: "A1", sentence: "Je prends de l'eau ___ je ne bois pas de vin.", es: "Tomo agua porque no bebo vino.", hint: "causa (porque)", answers: ["parce que", "car"] },
  { id: "k6", level: "A1", sentence: "Une entrée, ___ un plat.", es: "Una entrada, luego un plato.", hint: "orden en el tiempo (luego)", answers: ["puis", "ensuite"] },
  { id: "k7", level: "A1", sentence: "Je prends le poisson ___ du riz.", es: "Tomo el pescado con arroz.", hint: "acompañamiento (con)", answers: ["avec"] },
  { id: "k8", level: "A1", sentence: "Un café ___ sucre, s'il vous plaît.", es: "Un café sin azúcar, por favor.", hint: "acompañamiento (sin)", answers: ["sans"] },
  { id: "k9", level: "A1", sentence: "Il y a une table ___ le jardin.", es: "Hay una mesa en el jardín.", hint: "lugar (dentro de)", answers: ["dans"] },
  { id: "k10", level: "A1", sentence: "Le livre est ___ la table.", es: "El libro está sobre la mesa.", hint: "posición (sobre)", answers: ["sur"] },
  { id: "k11", level: "A1", sentence: "Le chat est ___ la chaise.", es: "El gato está debajo de la silla.", hint: "posición (debajo de)", answers: ["sous"] },
  { id: "k12", level: "A1", sentence: "Je vais ___ le médecin.", es: "Voy donde el médico.", hint: "lugar (en casa de alguien)", answers: ["chez"] },
  { id: "k13", level: "A1", sentence: "La banque est ___ la pharmacie et la gare.", es: "El banco está entre la farmacia y la estación.", hint: "posición relativa (entre)", answers: ["entre"] },
  { id: "k14", level: "A1", sentence: "Un café ___ moi, s'il vous plaît.", es: "Un café para mí, por favor.", hint: "destinatario (para)", answers: ["pour"] },
  { id: "k15", level: "A1", sentence: "___ partir, je ferme la fenêtre.", es: "Antes de irme, cierro la ventana.", hint: "orden (antes de)", answers: ["avant de"] },
  { id: "k16", level: "A1", sentence: "___ le travail, je fais du sport.", es: "Después del trabajo, hago deporte.", hint: "orden (después de)", answers: ["après"] },
  { id: "k17", level: "A1", sentence: "___ je travaille, ensuite je fais du sport.", es: "Primero trabajo, luego hago deporte.", hint: "orden (primero)", answers: ["d'abord"] },
  { id: "k18", level: "A1", sentence: "D'abord je travaille, ensuite je mange et ___ je dors.", es: "Primero trabajo, luego como y finalmente duermo.", hint: "orden (finalmente)", answers: ["enfin"] },
  { id: "k19", level: "A1", sentence: "Je suis colombien, ___ j'adore Paris.", es: "Soy colombiano, pero amo París.", hint: "oposición (pero)", answers: ["mais"] },
  { id: "k20", level: "A1", sentence: "___ tu es fatigué, repose-toi.", es: "Si estás cansado, descansa.", hint: "condición (si)", answers: ["si"] },
  { id: "k21", level: "A1", sentence: "Tu es fatigué ? ___ repose-toi.", es: "¿Estás cansado? Entonces descansa.", hint: "consecuencia (entonces)", answers: ["alors"] },

  // --- A1: el error más repetido — et vs est ---
  { id: "k22", level: "A1", sentence: "Mon bureau ___ blanc.", es: "Mi escritorio es blanco.", hint: "verbo être (es/está) — ¡no es «et»!", answers: ["est"] },
  { id: "k23", level: "A1", sentence: "Ma couleur préférée est le noir ___ le rouge.", es: "Mi color favorito es el negro y el rojo.", hint: "suma (y) — no el verbo", answers: ["et"] },
  { id: "k24", level: "A1", sentence: "Mon plat préféré ___ le riz.", es: "Mi plato favorito es el arroz.", hint: "verbo être (es/está)", answers: ["est"] },
  { id: "k25", level: "A1", sentence: "J'aime le riz ___ le poulet.", es: "Me gusta el arroz y el pollo.", hint: "suma (y)", answers: ["et"] },

  // --- A1: lugares y de dónde vienes (Cours 13 y 15) ---
  { id: "k26", level: "A1", sentence: "J'habite ___ Paris.", es: "Vivo en París.", hint: "ciudad (en)", answers: ["à"] },
  { id: "k27", level: "A1", sentence: "J'habite ___ France.", es: "Vivo en Francia.", hint: "país femenino (en)", answers: ["en"] },
  { id: "k28", level: "A1", sentence: "Je viens ___ Maroc.", es: "Vengo de Marruecos.", hint: "país masculino (de + le)", answers: ["du"] },
  { id: "k29", level: "A1", sentence: "Je viens ___ France.", es: "Vengo de Francia.", hint: "país femenino (de)", answers: ["de"] },
  { id: "k30", level: "A1", sentence: "Je voudrais un kilo ___ pommes.", es: "Quisiera un kilo de manzanas.", hint: "cantidad precisa (de)", answers: ["de"] },

  // --- A2 ---
  { id: "k31", level: "A2", sentence: "Il fait beau, ___ je reste à la maison.", es: "Hace buen tiempo, sin embargo me quedo en casa.", hint: "contraste (sin embargo)", answers: ["pourtant", "cependant"] },
  { id: "k32", level: "A2", sentence: "___ la pluie, je suis arrivé en retard.", es: "Por culpa de la lluvia, llegué tarde.", hint: "causa negativa (por culpa de)", answers: ["à cause de"] },
  { id: "k33", level: "A2", sentence: "___ ton aide, j'ai fini à l'heure.", es: "Gracias a tu ayuda, terminé a tiempo.", hint: "causa positiva (gracias a)", answers: ["grâce à"] },
  { id: "k34", level: "A2", sentence: "J'habite à Paris ___ trois ans.", es: "Vivo en París desde hace tres años.", hint: "tiempo (desde)", answers: ["depuis"] },
  { id: "k35", level: "A2", sentence: "J'ai dormi ___ huit heures.", es: "Dormí durante ocho horas.", hint: "duración (durante)", answers: ["pendant"] },
  { id: "k36", level: "A2", sentence: "J'ai ___ fini mon travail.", es: "Ya terminé mi trabajo.", hint: "tiempo (ya)", answers: ["déjà"] },
  { id: "k37", level: "A2", sentence: "Je n'ai pas ___ mangé.", es: "Todavía no he comido.", hint: "tiempo (todavía no)", answers: ["encore"] },
  { id: "k38", level: "A2", sentence: "Je pense ___ c'est une bonne idée.", es: "Pienso que es una buena idea.", hint: "opinión (que)", answers: ["que"] },
  { id: "k39", level: "A2", sentence: "Elle est plus grande ___ moi.", es: "Ella es más alta que yo.", hint: "comparación (que)", answers: ["que"] },
  { id: "k40", level: "A2", sentence: "Il est aussi grand ___ son frère.", es: "Él es tan alto como su hermano.", hint: "comparación (como)", answers: ["que"] },

  // --- B1 ---
  { id: "k41", level: "B1", sentence: "___ je sois fatigué, je continue à travailler.", es: "Aunque estoy cansado, sigo trabajando.", hint: "concesión (aunque, + subjuntivo)", answers: ["bien que", "quoique"] },
  { id: "k42", level: "B1", sentence: "Il adore le sport, ___ sa sœur préfère lire.", es: "A él le encanta el deporte, mientras que su hermana prefiere leer.", hint: "contraste (mientras que)", answers: ["tandis que", "alors que"] },
  { id: "k43", level: "B1", sentence: "Le projet est difficile ; ___, nous allons le terminer.", es: "El proyecto es difícil; no obstante, lo vamos a terminar.", hint: "contraste (no obstante)", answers: ["néanmoins", "toutefois", "cependant", "pourtant"] },
  { id: "k44", level: "B1", sentence: "___ le médecin, il faut se reposer.", es: "Según el médico, hay que descansar.", hint: "fuente (según)", answers: ["selon", "d'après"] },
  { id: "k45", level: "B1", sentence: "Il est vrai que c'est cher, ___ c'est de bonne qualité.", es: "Es verdad que es caro, pero es de buena calidad.", hint: "concesión + oposición (pero)", answers: ["mais"] },
  { id: "k46", level: "B1", sentence: "Il faut ___ tu viennes demain.", es: "Hace falta que vengas mañana.", hint: "il faut + que + subjuntivo", answers: ["que"] },
];
