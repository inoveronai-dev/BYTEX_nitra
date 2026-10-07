"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import Reveal from "@/components/Reveal";

const introText =
  "Pokiaľ ste sa už definitívne rozhodli, že ďalšia zmluvná spolupráca s doterajším správcom už nie je za žiadnych okolností možná, je potrebné zmluvný vzťah ukončiť. Aj v tomto treba byť obozretný a postupovať v súlade jednak s uzatvorenou a stále platnou zmluvou o výkone správy a jednak s príslušnými ustanoveniami Zákona o bytoch. Z hľadiska Zákona o bytoch majte na pamäti nasledujúce ustanovenia:";

const quotes = [
  {
    text: '"Vlastníci bytov a nebytových priestorov v dome uzatvoria so správcom písomnú zmluvu o výkone správy. Zmluva o výkone správy, jej zmena alebo jej zánik sa schvaľuje nadpolovičnou väčšinou hlasov všetkých vlastníkov bytov a nebytových priestorov v dome. Schválená zmluva o výkone správy alebo jej zmena, alebo jej zánik je záväzný pre všetkých vlastníkov bytov a nebytových priestorov v dome, ak je podpísaný nadpolovičnou väčšinou vlastníkov bytov a nebytových priestorov v dome a správcom. Správca je povinný schválenú zmluvu alebo jej zmenu doručiť každému vlastníkovi bytu a nebytového priestoru v dome. Na doručovanie sa vzťahuje osobitný predpis. 12e) Zmluva o výkone správy obsahuje najmä"',
    citation: "(§ 8a ods. 1 Zákona o bytoch).",
  },
  {
    text: '"Zmluva o výkone správy sa uzatvára so správcom písomne na neurčitý čas. Vlastníci bytov a nebytových priestorov v dome môžu vypovedať zmluvu o výkone správy len na základe rozhodnutia podľa § 14. Výpovedná lehota je tri mesiace, ak sa zmluvné strany v zmluve o výkone správy nedohodnú inak. Výpovedná lehota začína plynúť od prvého dňa kalendárneho mesiaca nasledujúceho po doručení výpovede."',
    citation: "(§ 8a ods. 6 Zákona o bytoch).",
  },
  {
    text: '"Vlastník bytu alebo nebytového priestoru v dome má právo a povinnosť zúčastňovať sa na správe domu a hlasovaním rozhodovať ako spoluvlastník o spoločných častiach domu a spoločných zariadeniach domu, spoločných nebytových priestoroch, príslušenstve a pozemku na schôdzi vlastníkov. Oznámenie o schôdzi vlastníkov musí byť v písomnej forme doručené každému vlastníkovi bytu alebo nebytového priestoru v dome minimálne päť pracovných dní pred dňom konania schôdze. Výsledok hlasovania oznamuje ten, kto schôdzu vlastníkov alebo zhromaždenie zvolal, a to do piatich pracovných dní od konania schôdze vlastníkov alebo zhromaždenia spôsobom v dome obvyklým."',
    citation: "(§ 14 ods. 1 Zákona o bytoch).",
  },
] as const;

const downloadHref =
  "https://d9651b25e0.clvaw-cdnwnd.com/751510981f5ea21da00aa9cb8de7515e/200000036-533e4533e7/%C5%BDiados%C5%A5%20o%20zvolanie%20sch%C3%B4dze%20vlastn%C3%ADkov_odvolanie.doc?ph=d9651b25e0";

function getFocusable(container: HTMLElement) {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    )
  ).filter((el) => !el.hasAttribute("disabled") && el.tabIndex !== -1);
}

function DocIcon() {
  return (
    <svg
      className="h-5 w-5 shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.4}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7 3.75h6.75L19.5 9.5v10.75A1.75 1.75 0 0 1 17.75 22H7A1.75 1.75 0 0 1 5.25 20.25V5.5A1.75 1.75 0 0 1 7 3.75Z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.75 3.75V9.5H19.5" />
      <path strokeLinecap="round" d="M8.5 13.5h7M8.5 17h5" />
    </svg>
  );
}

function ChangeManagerModal({
  open,
  onClose,
  titleId,
}: {
  open: boolean;
  onClose: () => void;
  titleId: string;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      setVisible(false);
      return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const show = () => setVisible(true);

    if (reduceMotion) show();
    else {
      const id = requestAnimationFrame(show);
      return () => cancelAnimationFrame(id);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(() => {
      closeRef.current?.focus();
    }, 20);

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusable = getFocusable(dialogRef.current);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-6 lg:p-10"
      role="presentation"
    >
      <button
        type="button"
        aria-label="Zavrieť"
        className={`absolute inset-0 bg-charcoal-deep/55 transition-opacity duration-300 ${
          visible ? "opacity-100" : "opacity-0"
        } motion-reduce:transition-none`}
        onClick={onClose}
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`relative z-10 flex max-h-[100dvh] w-full max-w-3xl flex-col overflow-hidden bg-cream shadow-[0_24px_80px_rgb(0_0_0_/0.28)] transition-[opacity,transform] duration-300 ease-out sm:max-h-[90vh] sm:rounded-2xl ${
          visible
            ? "translate-y-0 opacity-100 sm:scale-100"
            : "translate-y-4 opacity-0 sm:translate-y-2 sm:scale-[0.98]"
        } motion-reduce:transform-none motion-reduce:transition-none`}
        onKeyDown={(event: ReactKeyboardEvent<HTMLDivElement>) => {
          if (event.key === "Escape") onClose();
        }}
      >
        <div className="pointer-events-none absolute -right-10 top-16 select-none opacity-[0.06] sm:-right-6 sm:top-10 sm:opacity-[0.07]">
          <Image
            src="/logo-bytex.png"
            alt=""
            width={714}
            height={510}
            className="h-48 w-auto sm:h-64 lg:h-72"
            aria-hidden
          />
        </div>

        <div className="relative flex shrink-0 items-start justify-between gap-4 border-b border-black/[0.06] px-5 py-4 sm:px-8 sm:py-5">
          <div className="min-w-0 pr-2">
            <p className="section-eyebrow">
              ZMENA SPRÁVCU
            </p>
            <h2
              id={titleId}
              className="font-serif text-2xl font-light tracking-tight text-charcoal-deep sm:text-3xl"
            >
              AKO ZMENIŤ SPRÁVCU?
            </h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/[0.08] text-charcoal/70 transition-colors duration-300 hover:border-gold/30 hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/35"
            aria-label="Zavrieť"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="relative flex-1 overflow-y-auto px-5 py-6 sm:px-8 sm:py-8">
          <div className="relative mx-auto max-w-2xl">
            <p className="text-sm font-light leading-relaxed text-charcoal/80 sm:text-[0.95rem] sm:leading-[1.85]">
              {introText}
            </p>

            <div className="mt-8 space-y-6">
              {quotes.map((quote) => (
                <blockquote
                  key={quote.citation}
                  className="border-l-2 border-gold/40 bg-white/60 py-4 pl-5 pr-4 sm:pl-6"
                >
                  <p className="text-sm font-light leading-relaxed text-charcoal/75 sm:text-[0.9375rem] sm:leading-[1.8]">
                    {quote.text}
                  </p>
                  <cite className="mt-3 block text-xs font-normal not-italic tracking-wide text-gold-dark sm:text-sm">
                    {quote.citation}
                  </cite>
                </blockquote>
              ))}
            </div>

            <div className="mt-10 border-t border-black/[0.08] pt-6">
              <a
                href={downloadHref}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-lg border border-gold/30 bg-white px-5 py-3 text-sm font-light tracking-wide text-charcoal-deep transition-colors duration-300 hover:border-gold/50 hover:bg-gold/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/35 sm:w-auto sm:justify-start"
              >
                <span className="text-gold transition-colors group-hover:text-gold-dark">
                  <DocIcon />
                </span>
                <span>Stiahnuť žiadosť o zvolanie schôdze</span>
                <span className="text-xs font-light tracking-[0.14em] text-charcoal/45 uppercase">
                  .doc
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default function ChangeManagerCta() {
  const [open, setOpen] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const titleId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    window.setTimeout(() => {
      triggerRef.current?.focus();
    }, 0);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return (
    <>
      {/*
        Fixed-background parallax (TRYES-style):
        clip-path on the section confines a position:fixed image layer so the photo
        stays viewport-locked while the section scrolls across it.
      */}
      <section
        id="zmena-spravcu"
        className="relative scroll-mt-28 h-[340px] sm:scroll-mt-32 sm:h-[420px] lg:h-[460px] [clip-path:inset(0)]"
        aria-labelledby="change-manager-heading"
      >
        <div
          className={`pointer-events-none absolute inset-0 z-0 ${
            reduceMotion ? "" : "md:fixed md:inset-0"
          }`}
          aria-hidden
        >
          <div className="absolute inset-0 scale-[1.1]">
            <Image
              src="/change-manager-bg.jpg"
              alt=""
              fill
              priority={false}
              className="object-cover object-center"
              sizes="100vw"
            />
          </div>
          {/* Left-only warm gradient for text contrast; center doorway stays clear */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-[#1a1510]/78 via-[#1a1510]/45 to-transparent sm:from-[#1a1510]/72 sm:via-[#1a1510]/35 sm:to-transparent md:via-[#1a1510]/28 md:to-transparent"
            aria-hidden
          />
        </div>

        <div className="relative z-10 flex h-full items-center justify-start pl-[12%] pr-6 sm:pl-[14%] sm:pr-8 lg:pl-[16%]">
          <Reveal>
            <div className="w-full max-w-[380px] translate-y-2 text-left sm:max-w-[420px] sm:translate-y-3 lg:max-w-[440px]">
              <p className="section-eyebrow section-eyebrow--on-dark [text-shadow:0_1px_18px_rgb(0_0_0_/_0.35)]">
                ZMENA SPRÁVCU
              </p>
              <h2
                id="change-manager-heading"
                className="font-serif text-[2.35rem] font-light leading-[1.15] tracking-tight text-cream sm:text-5xl lg:text-[3.4rem] [text-shadow:0_2px_28px_rgb(0_0_0_/_0.4)]"
              >
                Ako zmeniť správcu?
              </h2>
              <button
                ref={triggerRef}
                type="button"
                onClick={() => setOpen(true)}
                className="group mt-7 inline-flex items-center gap-2 border-b border-gold-light/55 pb-1 text-base font-light tracking-wide text-gold-light transition-colors duration-300 hover:border-gold-light hover:text-gold [text-shadow:0_1px_16px_rgb(0_0_0_/_0.35)] sm:text-[1.05rem]"
              >
                Zobraziť postup
                <span
                  className="inline-block transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden
                >
                  →
                </span>
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      <ChangeManagerModal open={open} onClose={close} titleId={titleId} />
    </>
  );
}
