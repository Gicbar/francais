import type { ReactNode } from "react";

type Row = string[];

function Table({ head, rows }: { head: string[]; rows: Row[] }) {
  return (
    <div className="overflow-x-auto -mx-1">
      <table className="w-full text-sm min-w-[480px]">
        <thead>
          <tr className="text-left text-[11px] uppercase tracking-wide text-ink-faint">
            {head.map((h) => (
              <th key={h} className="px-3 py-2 border-b border-border font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((c, j) => (
                <td
                  key={j}
                  className={`px-3 py-2 border-b border-border align-top ${j === 0 ? "text-ink font-medium" : "text-ink-soft"}`}
                >
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Section({
  id,
  title,
  blurb,
  children,
}: {
  id: string;
  title: string;
  blurb?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="flex flex-col gap-3 scroll-mt-24">
      <h2 className="font-serif text-xl text-ink">{title}</h2>
      {blurb && <p className="text-sm text-ink-soft leading-relaxed">{blurb}</p>}
      <div className="card p-5">{children}</div>
    </section>
  );
}

function Note({ tone = "sage", children }: { tone?: "sage" | "clay"; children: ReactNode }) {
  const bg = tone === "sage" ? "bg-sage-soft" : "bg-clay-soft";
  const text = tone === "sage" ? "text-sage-ink" : "text-clay";
  return <div className={`rounded-xl ${bg} ${text} text-sm px-4 py-3 leading-relaxed`}>{children}</div>;
}

const toc = [
  { id: "resumen", label: "Resumen" },
  { id: "definidos", label: "le/la/les" },
  { id: "indefinidos", label: "un/une/des" },
  { id: "partitivos", label: "du/de la" },
  { id: "demostrativos", label: "ce/cet/cette" },
  { id: "posesivos", label: "mon/ma/mes" },
  { id: "interrogativos", label: "quel" },
  { id: "numerales", label: "números" },
  { id: "indefinidos-adj", label: "quelques" },
  { id: "conectores", label: "conectores" },
];

export default function ArticulosPage() {
  return (
    <div className="max-w-2xl mx-auto w-full px-6 py-14 flex flex-col gap-10 fade-up">
      <div>
        <p className="text-sm text-ink-faint mb-2">Todo lo que acompaña a un sustantivo, en un solo lugar</p>
        <h1 className="font-serif text-3xl text-ink leading-tight">Artículos y conectores</h1>
        <p className="text-ink-soft mt-3 max-w-md leading-relaxed">
          Resumen de repaso de todos los artículos/determinantes vistos hasta
          ahora (definidos, indefinidos, partitivos, demostrativos,
          posesivos, interrogativos, numerales e indefinidos) y los
          conectores más usados, con masculino/femenino y ejemplos.
        </p>
      </div>

      <nav className="flex gap-1.5 flex-wrap">
        {toc.map((t) => (
          <a
            key={t.id}
            href={`#${t.id}`}
            className="shrink-0 px-3 py-1.5 rounded-full text-xs bg-bg-soft border border-border text-ink-soft hover:text-ink hover:bg-surface transition-colors"
          >
            {t.label}
          </a>
        ))}
      </nav>

      <Section id="resumen" title="1. Resumen general">
        <Table
          head={["Tipo", "Palabras", "Ejemplo", "Significado"]}
          rows={[
            ["Definidos", "le, la, l', les", "le café", "el café (cosa precisa/conocida)"],
            ["Indefinidos", "un, une, des", "un café", "un café (se cuenta, no es preciso)"],
            ["Partitivos", "du, de la, de l', des", "du café", "algo de café (cantidad indefinida)"],
            ["Demostrativos", "ce, cet, cette, ces", "ce café", "este café (se señala)"],
            ["Posesivos", "mon/ma/mes, ton/ta/tes, son/sa/ses...", "mon café", "mi café"],
            ["Interrogativos", "quel, quelle, quels, quelles", "quel café ?", "¿qué café? / ¿cuál?"],
            ["Numerales", "un, deux, trois...", "deux cafés", "dos cafés"],
            ["Indefinidos (adj.)", "quelques, plusieurs, chaque...", "quelques cafés", "algunos cafés"],
          ]}
        />
        <div className="mt-4">
          <Note>
            <b>Regla de oro:</b> en francés casi todo sustantivo común lleva un
            determinante delante — a diferencia del español, nunca se deja
            &quot;desnudo&quot;. <i>J&apos;aime le café</i> (no <s>j&apos;aime café</s>).
          </Note>
        </div>
      </Section>

      <Section
        id="definidos"
        title="2. Definidos — le, la, l', les"
        blurb="Para hablar de algo preciso, conocido, o de una categoría en general (gustos)."
      >
        <Table
          head={["Género/número", "Forma", "Ejemplo"]}
          rows={[
            ["Masculino singular", "le", "le café, le riz"],
            ["Femenino singular", "la", "la salade, la maison"],
            ["Singular + vocal / h muda", "l'", "l'ami, l'eau, l'hôtel"],
            ["Plural (m/f)", "les", "les légumes, les livres"],
          ]}
        />
        <div className="mt-4">
          <Note>
            Con verbos de gusto (<b>aimer, adorer, détester, préférer</b>) se
            usa siempre el artículo definido, aunque en español no dirías
            nada: <i>j&apos;aime le riz</i> · <i>je déteste les légumes</i>.
          </Note>
        </div>
      </Section>

      <Section
        id="indefinidos"
        title="3. Indefinidos — un, une, des"
        blurb="Para contar o hablar de algo no específico."
      >
        <Table
          head={["Género/número", "Forma", "Ejemplo"]}
          rows={[
            ["Masculino singular", "un", "un café, un livre"],
            ["Femenino singular", "une", "une salade, une amie"],
            ["Plural (m/f)", "des", "des légumes, des amis"],
          ]}
        />
        <div className="mt-4">
          <Note tone="clay">
            No confundir con el definido: <i>j&apos;ai un livre</i> (tengo un
            libro cualquiera) ≠ <i>j&apos;aime le livre</i> (me gusta la
            lectura en general).
          </Note>
        </div>
      </Section>

      <Section
        id="partitivos"
        title="4. Partitivos — du, de la, de l', des"
        blurb="Para una cantidad indefinida de algo que no se cuenta (comida, bebida)."
      >
        <Table
          head={["Género/número", "Forma", "Ejemplo"]}
          rows={[
            ["Masculino singular", "du", "du café, du pain"],
            ["Femenino singular", "de la", "de la salade, de la musique"],
            ["Singular + vocal / h muda", "de l'", "de l'eau, de l'huile"],
            ["Plural (m/f)", "des", "des légumes"],
          ]}
        />
        <div className="mt-4 flex flex-col gap-3">
          <Note tone="clay">
            <b>Negativo:</b> du/de la/de l&apos;/des (y también un/une/des)
            se reducen a <b>de / d&apos;</b> → <i>je n&apos;ai pas de café</i>.
          </Note>
          <Note tone="clay">
            <b>Cantidad precisa:</b> con un kilo de, une bouteille de,
            beaucoup de, un peu de... el partitivo desaparece → <i>un kilo
            de pommes</i> (no <s>un kilo des pommes</s>).
          </Note>
        </div>
      </Section>

      <Section
        id="demostrativos"
        title="5. Demostrativos — ce, cet, cette, ces"
        blurb="Para señalar algo preciso, con el dedo o con la voz."
      >
        <Table
          head={["Género/número", "Forma", "Ejemplo"]}
          rows={[
            ["Masculino singular (consonante)", "ce", "ce fromage, ce marché"],
            ["Masculino singular (vocal / h muda)", "cet", "cet ananas, cet hôtel"],
            ["Femenino singular", "cette", "cette tarte, cette maison"],
            ["Plural (m/f)", "ces", "ces fruits, ces pommes"],
          ]}
        />
        <div className="mt-4">
          <Note tone="clay">
            No confundir <b>ces</b> (demostrativo plural) con <b>ses</b>
            (posesivo plural) — se pronuncian igual [se] pero se escriben
            distinto.
          </Note>
        </div>
      </Section>

      <Section
        id="posesivos"
        title="6. Posesivos — mon, ma, mes..."
        blurb="Concuerdan con el género/número de lo poseído, no con quién posee."
      >
        <Table
          head={["Posesor", "Masc. sing.", "Fem. sing.", "Plural (m/f)"]}
          rows={[
            ["je", "mon café", "ma couleur", "mes livres"],
            ["tu", "ton café", "ta couleur", "tes livres"],
            ["il / elle", "son café", "sa couleur", "ses livres"],
            ["nous", "notre café / couleur", "—", "nos livres"],
            ["vous", "votre café / couleur", "—", "vos livres"],
            ["ils / elles", "leur café / couleur", "—", "leurs livres"],
          ]}
        />
        <div className="mt-4">
          <Note>
            <b>Excepción:</b> delante de un femenino que empieza por vocal o
            h muda se usa mon/ton/son (no ma/ta/sa) → <i>mon amie, ton
            école, son adresse</i>.
          </Note>
        </div>
      </Section>

      <Section
        id="interrogativos"
        title="7. Interrogativos — quel, quelle, quels, quelles"
        blurb="Para preguntar por algo concreto entre varias opciones."
      >
        <Table
          head={["Género/número", "Forma", "Ejemplo"]}
          rows={[
            ["Masculino singular", "quel", "quel café ?"],
            ["Femenino singular", "quelle", "quelle heure ?"],
            ["Masculino plural", "quels", "quels desserts ?"],
            ["Femenino plural", "quelles", "quelles boissons ?"],
          ]}
        />
        <div className="mt-4">
          <Note>Las 4 formas se pronuncian igual [kɛl] — solo cambia la ortografía según el nombre que sigue.</Note>
        </div>
      </Section>

      <Section id="numerales" title="8. Numerales" blurb="Van delante del sustantivo, como un artículo.">
        <Table
          head={["Rango", "Números"]}
          rows={[
            ["0-10", "zéro, un/une, deux, trois, quatre, cinq, six, sept, huit, neuf, dix"],
            ["11-20", "onze, douze, treize, quatorze, quinze, seize, dix-sept, dix-huit, dix-neuf, vingt"],
            ["Decenas", "vingt et un (21), vingt-deux (22), trente, quarante, cinquante, soixante"],
          ]}
        />
        <div className="mt-4">
          <Note>
            Solo <b>un/une</b> concuerda en género: <i>un café, une salade</i>. Los ordinales
            (premier, deuxième, troisième...) sirven para clasificar: <i>le troisième étage</i>.
          </Note>
        </div>
      </Section>

      <Section
        id="indefinidos-adj"
        title="9. Indefinidos (adjetivos) — quelques, plusieurs, chaque"
        blurb="Para cantidades no exactas."
      >
        <Table
          head={["Palabra", "Significado", "Número", "Ejemplo"]}
          rows={[
            ["quelques", "algunos/as", "siempre plural", "quelques cafés"],
            ["plusieurs", "varios/as", "siempre plural", "plusieurs collègues"],
            ["chaque", "cada", "siempre singular", "chaque café"],
          ]}
        />
        <div className="mt-4">
          <Note tone="clay">
            <b>chaque</b> siempre va con singular, incluso para una idea general → <i>chaque
            client</i> (no <s>chaque clients</s>).
          </Note>
        </div>
      </Section>

      <Section
        id="conectores"
        title="10. Conectores lógicos"
        blurb="Para unir ideas en frases más naturales y completas."
      >
        <Table
          head={["Conector", "Función", "Significado", "Ejemplo"]}
          rows={[
            ["et", "suma", "y", "un café et un croissant"],
            ["ou", "elección", "o", "thé ou café ?"],
            ["mais", "oposición", "pero", "c'est bon mais cher"],
            ["donc", "consecuencia", "entonces / por lo tanto", "j'ai faim, donc je mange"],
            ["car / parce que", "causa", "porque", "je reste parce qu'il pleut"],
            ["puis / ensuite / enfin", "orden en el tiempo", "luego / después / finalmente", "une entrée, puis un plat"],
            ["avec / sans", "acompañamiento", "con / sin", "le café avec du lait, sans sucre"],
            ["dans", "lugar (dentro)", "en, dentro de", "dans le bureau"],
            ["sur / sous", "posición", "sobre / debajo de", "sur la table, sous la chaise"],
            ["chez", "lugar (casa de alguien)", "en casa de", "chez le médecin, chez moi"],
            ["entre", "posición relativa", "entre", "entre la banque et la gare"],
            ["pour", "propósito / destinatario", "para", "un café pour moi"],
            ["avant de / après", "orden en el tiempo", "antes de / después de", "avant de partir, après le travail"],
          ]}
        />
        <div className="mt-4">
          <Note>
            Una frase con al menos un conector siempre suena más natural que
            varias frases cortas seguidas.
          </Note>
        </div>
      </Section>
    </div>
  );
}
