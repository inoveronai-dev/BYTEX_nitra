"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

const primaryItems = [
  { href: "/#o-nas", label: "O nás" },
  { href: "/#sluzby", label: "Služby" },
  { href: "/#referencie", label: "Referencie" },
] as const;

const infoItems = [
  { href: "/#revizie", label: "Revízie" },
  { href: "/na-stiahnutie", label: "Na stiahnutie" },
  { href: "/cennik", label: "Cenník" },
  { href: "/dolezite-telefonne-cisla", label: "Dôležité telefónne čísla" },
] as const;

const contactItem = { href: "/#kontakt", label: "Kontakt" } as const;

function Chevron({ open, className = "" }: { open: boolean; className?: string }) {
  return (
    <svg
      className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""} ${className}`}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.24a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [open, setOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [mobileInfoOpen, setMobileInfoOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const infoMenuId = useId();
  const desktopInfoRef = useRef<HTMLDivElement>(null);
  const infoButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isHome) {
      setScrolled(true);
      return;
    }

    const onScroll = () => {
      setScrolled(window.scrollY > window.innerHeight * 0.75);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  useEffect(() => {
    if (!infoOpen) return;

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (desktopInfoRef.current && !desktopInfoRef.current.contains(target)) {
        setInfoOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setInfoOpen(false);
        infoButtonRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [infoOpen]);

  useEffect(() => {
    setOpen(false);
    setInfoOpen(false);
    setMobileInfoOpen(false);
  }, [pathname]);

  const overlay = isHome && !scrolled;

  const resolveHref = (href: string) => {
    if (isHome && href.startsWith("/#")) return href.slice(1);
    return href;
  };

  const closeAll = () => {
    setOpen(false);
    setInfoOpen(false);
    setMobileInfoOpen(false);
  };

  const navLinkClass = (active = false) =>
    `whitespace-nowrap text-[13px] font-light uppercase tracking-[0.18em] transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 ${
      overlay
        ? "text-white/90 hover:text-white focus-visible:outline-white"
        : active
          ? "text-gold focus-visible:outline-gold"
          : "text-charcoal/75 hover:text-gold focus-visible:outline-gold"
    }`;

  const infoRouteActive = infoItems.some(
    (item) => !item.href.startsWith("/#") && pathname === item.href
  );

  return (
    <header
      className={`absolute inset-x-0 top-0 z-50 transition-all duration-500 ${
        overlay
          ? "bg-transparent"
          : "fixed border-b border-black/5 bg-cream/95 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-5 sm:px-8 lg:px-12">
        <Link
          href={resolveHref("/#uvod")}
          className="shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
          onClick={closeAll}
        >
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
        </Link>

        <nav
          className="hidden items-center gap-7 lg:flex xl:gap-9"
          aria-label="Hlavná navigácia"
        >
          {primaryItems.map((item) => (
            <Link
              key={item.href}
              href={resolveHref(item.href)}
              className={navLinkClass()}
            >
              {item.label}
            </Link>
          ))}

          <div ref={desktopInfoRef} className="relative">
            <button
              ref={infoButtonRef}
              type="button"
              className={`${navLinkClass(infoRouteActive)} inline-flex items-center gap-1.5`}
              aria-expanded={infoOpen}
              aria-controls={infoMenuId}
              aria-haspopup="true"
              onClick={() => setInfoOpen((value) => !value)}
            >
              Informácie
              <Chevron open={infoOpen} />
            </button>

            {infoOpen && (
              <div
                id={infoMenuId}
                role="menu"
                aria-label="Informácie"
                className="absolute left-1/2 top-full z-50 mt-3 w-72 -translate-x-1/2 rounded-sm border border-black/8 bg-cream py-2 shadow-[0_12px_40px_rgba(0,0,0,0.12)]"
              >
                {infoItems.map((item) => (
                  <Link
                    key={item.href}
                    role="menuitem"
                    href={resolveHref(item.href)}
                    className={`flex min-h-12 items-center px-5 text-[13px] font-light uppercase tracking-[0.14em] transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-gold ${
                      pathname === item.href
                        ? "bg-gold/10 text-gold"
                        : "text-charcoal/80 hover:bg-gold/10 hover:text-gold"
                    }`}
                    onClick={() => setInfoOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href={resolveHref(contactItem.href)} className={navLinkClass()}>
            {contactItem.label}
          </Link>

          <a
            href="tel:+421907615135"
            className={`whitespace-nowrap text-[13px] font-light uppercase tracking-[0.12em] transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 ${
              overlay
                ? "text-white/90 hover:text-white focus-visible:outline-white"
                : "text-gold hover:text-gold-dark focus-visible:outline-gold"
            }`}
          >
            +421 907 615 135
          </a>
        </nav>

        <button
          type="button"
          className={`inline-flex h-11 w-11 items-center justify-center lg:hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
            overlay
              ? "text-white focus-visible:outline-white"
              : "text-charcoal focus-visible:outline-gold"
          }`}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Zavrieť menu" : "Otvoriť menu"}
          onClick={() => {
            setOpen((value) => !value);
            setInfoOpen(false);
          }}
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
          className={`max-h-[min(80vh,640px)] overflow-y-auto px-6 py-4 lg:hidden ${
            overlay ? "bg-black/85 backdrop-blur-md" : "border-t border-black/5 bg-cream"
          }`}
          aria-label="Mobilná navigácia"
        >
          <div className="flex flex-col">
            {primaryItems.map((item) => (
              <Link
                key={item.href}
                href={resolveHref(item.href)}
                className={`flex min-h-14 items-center text-base font-light uppercase tracking-[0.16em] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  overlay
                    ? "text-white/95 focus-visible:outline-white"
                    : "text-charcoal focus-visible:outline-gold"
                }`}
                onClick={closeAll}
              >
                {item.label}
              </Link>
            ))}

            <div
              className={`border-y ${
                overlay ? "border-white/15" : "border-black/8"
              }`}
            >
              <button
                type="button"
                className={`flex min-h-14 w-full items-center justify-between text-left text-base font-light uppercase tracking-[0.16em] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  overlay
                    ? "text-white/95 focus-visible:outline-white"
                    : "text-charcoal focus-visible:outline-gold"
                }`}
                aria-expanded={mobileInfoOpen}
                aria-controls="mobile-info-menu"
                onClick={() => setMobileInfoOpen((value) => !value)}
              >
                Informácie
                <Chevron open={mobileInfoOpen} />
              </button>

              {mobileInfoOpen && (
                <div id="mobile-info-menu" className="pb-3 pl-4">
                  {infoItems.map((item) => (
                    <Link
                      key={item.href}
                      href={resolveHref(item.href)}
                      className={`flex min-h-12 items-center border-l-2 pl-4 text-[15px] font-light uppercase tracking-[0.12em] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                        overlay
                          ? "border-gold/50 text-white/85 focus-visible:outline-white"
                          : "border-gold/40 text-charcoal/80 focus-visible:outline-gold"
                      }`}
                      onClick={closeAll}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href={resolveHref(contactItem.href)}
              className={`flex min-h-14 items-center text-base font-light uppercase tracking-[0.16em] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                overlay
                  ? "text-white/95 focus-visible:outline-white"
                  : "text-charcoal focus-visible:outline-gold"
              }`}
              onClick={closeAll}
            >
              {contactItem.label}
            </Link>

            <a
              href="tel:+421907615135"
              className={`flex min-h-14 items-center text-base font-light uppercase tracking-[0.12em] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                overlay
                  ? "text-gold-light focus-visible:outline-white"
                  : "text-gold focus-visible:outline-gold"
              }`}
              onClick={closeAll}
            >
              +421 907 615 135
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
