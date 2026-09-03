"use client";

import Link from "next/link";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { checkForContentUpdates } from "@/lib/content";

const links = [
  { href: "/", label: "Hoy" },
  { href: "/review", label: "Repasar" },
  { href: "/leer", label: "Leer" },
  { href: "/historias", label: "Historias" },
  { href: "/escuchar", label: "Escuchar" },
  { href: "/gramatica", label: "Gramática" },
  { href: "/pronunciacion", label: "Pronunciar" },
  { href: "/errores", label: "Errores" },
  { href: "/niveles", label: "Niveles" },
];

export default function Nav() {
  const pathname = usePathname();

  useEffect(() => {
    checkForContentUpdates();
  }, []);

  return (
    <header className="border-b border-border bg-bg-soft/80 backdrop-blur sticky top-0 z-10">
      <div className="max-w-2xl lg:max-w-3xl mx-auto px-3 sm:px-6 py-3 sm:py-3.5 flex items-center gap-2.5 sm:gap-3.5">
        <Link href="/" className="shrink-0 flex items-center gap-2" aria-label="Petit à petit — inicio">
          <span className="w-7 h-7 rounded-full bg-gradient-to-br from-sage to-dusk flex items-center justify-center text-[13px] shadow-soft">
            🌿
          </span>
          <span className="hidden sm:flex flex-col leading-none">
            <span className="font-serif text-base tracking-tight text-ink">petit à petit</span>
            <span className="tricolor mt-1"><span /><span /><span /></span>
          </span>
        </Link>
        <nav className="flex gap-0.5 sm:gap-1 overflow-x-auto scrollbar-none pr-1 -mr-1">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`shrink-0 px-2 sm:px-3.5 py-1.5 rounded-full text-[11px] sm:text-sm whitespace-nowrap transition-colors ${
                  active
                    ? "bg-sage text-bg shadow-soft"
                    : "text-ink-soft hover:text-ink hover:bg-surface"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
