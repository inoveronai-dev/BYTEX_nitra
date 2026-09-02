"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const navItems = [
  { href: "#o-nas", label: "O nás" },
  { href: "#vyhody", label: "Výhody" },
  { href: "#partneri", label: "Partneri" },
  { href: "#kontakt", label: "Kontakt" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > window.innerHeight * 0.75);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const overlay = !scrolled;

  return (
    <header
      className={`absolute inset-x-0 top-0 z-50 transition-all duration-500 ${
        overlay
          ? "bg-transparent"
          : "fixed border-b border-black/5 bg-cream/95 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-6 sm:px-8 lg:px-12">
        <a href="#uvod" className="shrink-0" onClick={() => setOpen(false)}>
          {overlay ? (
            <span className="text-sm font-light uppercase tracking-[0.25em] text-white sm:text-base">
              BYTEX Nitra
            </span>
          ) : (
            <Image
              src="/logo-bytex.png"
              alt="BYTEX Nitra, s.r.o. / BYTEX Nitra SERVIS, s.r.o."
              width={714}
              height={510}
              className="h-10 w-auto md:h-12"
              priority
            />
          )}
        </a>

        <nav className="hidden items-center gap-10 lg:flex" aria-label="Hlavná navigácia">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`text-xs font-light uppercase tracking-[0.2em] transition-colors duration-300 ${
                overlay
                  ? "text-white/90 hover:text-white"
                  : "text-charcoal/70 hover:text-gold"
              }`}
            >
              {item.label}
            </a>
          ))}
          <a
            href="tel:+421907615135"
            className={`text-xs font-light uppercase tracking-[0.15em] transition-colors duration-300 ${
              overlay ? "text-white/90 hover:text-white" : "text-gold hover:text-gold-dark"
            }`}
          >
            +421 907 615 135
          </a>
        </nav>

        <button
          type="button"
          className={`inline-flex h-10 w-10 items-center justify-center lg:hidden ${
            overlay ? "text-white" : "text-charcoal"
          }`}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Zavrieť menu" : "Otvoriť menu"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          )}
        </button>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          className={`px-6 py-6 lg:hidden ${
            overlay ? "bg-black/80 backdrop-blur-md" : "border-t border-black/5 bg-cream"
          }`}
          aria-label="Mobilná navigácia"
        >
          <div className="flex flex-col gap-4">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`text-sm font-light uppercase tracking-[0.2em] ${
                  overlay ? "text-white/90" : "text-charcoal"
                }`}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <a
              href="tel:+421907615135"
              className={`text-sm font-light uppercase tracking-[0.15em] ${
                overlay ? "text-gold-light" : "text-gold"
              }`}
              onClick={() => setOpen(false)}
            >
              +421 907 615 135
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
