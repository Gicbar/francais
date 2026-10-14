"use client";

import Link from "next/link";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { checkForContentUpdates } from "@/lib/content";

// Cuatro destinos. Todo lo demás vive como pestaña dentro de "Leer" o "Practicar".
const sections = [
  { href: "/", label: "Hoy", match: ["/"] },
  { href: "/review", label: "Repasar", match: ["/review"] },
  {
    href: "/leer",
    label: "Leer y escuchar",
    match: ["/leer", "/historias", "/escuchar"],
  },
  {
    href: "/escribir",
    label: "Practicar",
    match: ["/escribir", "/gramatica", "/articulos", "/pronunciacion", "/errores"],
  },
];

const subTabs: Record<string, { href: string; label: string }[]> = {
  "Leer y escuchar": [
    { href: "/leer", label: "Frases" },
    { href: "/historias", label: "Historias" },
    { href: "/escuchar", label: "Diálogos" },
  ],
  Practicar: [
    { href: "/escribir", label: "Escribir" },
    { href: "/gramatica", label: "Gramática" },
    { href: "/articulos", label: "Artículos" },
    { href: "/pronunciacion", label: "Pronunciar" },
    { href: "/errores", label: "Mis errores" },
  ],
};

export default function Nav() {
  const pathname = usePathname();

  useEffect(() => {
    checkForContentUpdates();
  }, []);

  const current = sections.find((s) => s.match.includes(pathname));
  const tabs = current ? subTabs[current.label] : undefined;

  return (
    <header className="border-b border-border bg-bg-soft/85 backdrop-blur sticky top-0 z-10">
      <div className="max-w-2xl lg:max-w-3xl mx-auto px-4 sm:px-6 pt-3 flex items-center gap-4">
        <Link
          href="/"
          className="font-serif text-lg italic text-sage-ink shrink-0 hidden sm:block"
          aria-label="Petit à petit — inicio"
        >
          petit à petit
        </Link>
        <nav className="flex gap-1 min-w-0 -mb-px overflow-x-auto scrollbar-none" aria-label="Secciones">
          {sections.map((s) => {
            const active = s === current;
            return (
              <Link
                key={s.href}
                href={s.href}
                aria-current={active ? "page" : undefined}
                className={`shrink-0 px-3 py-2.5 text-sm whitespace-nowrap border-b-2 transition-colors ${
                  active
                    ? "border-sage text-ink font-semibold"
                    : "border-transparent text-ink-soft hover:text-ink"
                }`}
              >
                {s.label}
              </Link>
            );
          })}
        </nav>
      </div>
      {tabs && (
        <div className="border-t border-border/70">
          <div className="max-w-2xl lg:max-w-3xl mx-auto px-4 sm:px-6 py-2 flex gap-1.5 overflow-x-auto scrollbar-none" role="tablist">
            {tabs.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                aria-current={pathname === t.href ? "page" : undefined}
                className={`shrink-0 px-3 py-1 rounded-full text-[13px] whitespace-nowrap transition-colors ${
                  pathname === t.href
                    ? "bg-sage text-bg"
                    : "text-ink-soft hover:bg-surface hover:text-ink"
                }`}
              >
                {t.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
