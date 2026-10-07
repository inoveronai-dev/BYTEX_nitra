"use client";

import { useCallback, useEffect, useId, useState } from "react";

const introText =
  "V bytových domoch sa nachádzajú aj spoločné zariadenia (§ 2 ods. 5 zákona č. 182/1993 Z. z.), ktoré si z hľadiska bezpečnosti, prevádzkyschopnosti alebo spoľahlivosti vyžadujú vykonávanie pravidelných odborných prehliadok, revízií, skúšok a overovaní:";

const revisions = [
  {
    id: "elektroinstalacia",
    title: "Rozvody elektroinštalácie",
    interval: "5 rokov",
    detail:
      "Vykonávajú sa každých 5 rokov, v mokrom prostredí (napr. práčovne) každý rok.",
  },
  {
    id: "bleskozvody",
    title: "Sústava bleskozvodov",
    interval: "4 roky / 2 roky",
    detail:
      "Vykonávajú sa každé 4 roky, prípadne každé 2 roky, podľa úrovni ochrany.",
  },
  {
    id: "plyn",
    title: "Plynové rozvody",
    interval: "1 rok / 3 roky",
    detail:
      "Každý rok sa musí uskutočniť kontrola hlavného prívodu plynu až po stúpací rozvod, každé 3 roky sa musí uskutočniť odborná prehliadka plynových rozvodov, pri ktorej sa kontroluje a meria prípadný únik plynu.",
  },
  {
    id: "hydranty",
    title: "Hydranty a hasiace prístroje",
    interval: "1 rok",
    detail:
      "Kontrola funkčnosti hasiacich prístrojov a hydrantov, úplnosť ich vybavenia a tlaková skúška hydrantov sa vykonáva každý rok.",
  },
  {
    id: "poziarna",
    title: "Požiarna ochrana",
    interval: "1 rok",
    detail:
      "Vykonáva sa každý rok. Súčasťou takejto prehliadky je kontrola únikových ciest a východov, ktoré sa musia označovať a udržiavať trvalo voľné, ako aj prístup k uzáverom rozvodných zariadení elektrickej energie, plynu, vody, k požiarnotechnickým zariadeniam a požiarnym vodovodom.",
  },
  {
    id: "kominy",
    title: "Komíny",
    interval: "1 rok / 2× ročne",
    detail:
      "Kontrola ich stavu, spôsobilosti a ich čistenie sa vykonáva taktiež každý rok, v niektorých prípadoch aj 2x ročne.",
  },
  {
    id: "vytahy",
    title: "Výťahy",
    interval: "3 mesiace / 3 roky / 6 rokov",
    detail:
      "Odborné prehliadky každé 3 mesiace, opakované odborné záťažové skúšky každé 3 roky, opakované úradné skúšky každých 6 rokov.",
  },
  {
    id: "vodomer-studena",
    title: "Vodomer studená voda",
    interval: "5 rokov",
    detail:
      "Pri vodomeroch na studenú vodu príslušná právna úprava (zákon č. 142/2000 Z. z. o metrológii ukladá povinnosť vykonávať opakované overovania a repasáciu meradiel každých 5 rokov.",
  },
  {
    id: "vodomer-tepla",
    title: "Vodomer teplá voda",
    interval: "5 rokov",
    detail:
      "Na vodomery na teplú vodu sa vzťahujú ustanovenia jednak zákona o tepelnej energetike č. 657/2004 Z. z. tak aj zákona o metrológii, ktoré ukladajú povinnosť vykonávať opakované overovania a repasáciu meradiel každých 5 rokov.",
  },
];

function FrequencyLabel({
  interval,
  isActive,
}: {
  interval: string;
  isActive: boolean;
}) {
  const parts = interval.split(" / ");
  const isMultiLine = parts.length >= 3;

  return (
    <span
      className={`font-serif shrink-0 self-center transition-colors duration-500 sm:w-40 md:w-44 ${
        isActive ? "text-gold" : "text-charcoal-deep/75"
      } ${
        isMultiLine
          ? "text-lg leading-[1.15] tracking-tight sm:text-xl sm:leading-[1.2] md:text-[1.35rem] md:leading-[1.2]"
          : "text-xl leading-none tracking-tight sm:text-2xl md:text-[1.65rem]"
      }`}
    >
      {isMultiLine ? (
        <span className="flex flex-col justify-center">
          {parts.map((part, index) => (
            <span key={part}>
              {part}
              {index < parts.length - 1 ? " /" : ""}
            </span>
          ))}
        </span>
      ) : (
        interval
      )}
    </span>
  );
}

export default function Revisions() {
  const baseId = useId();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hoverCapable, setHoverCapable] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setHoverCapable(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const openItem = useCallback((id: string) => {
    setActiveId(id);
  }, []);

  const closeItem = useCallback(() => {
    setActiveId(null);
  }, []);

  const toggleItem = useCallback((id: string) => {
    setActiveId((current) => (current === id ? null : id));
  }, []);

  return (
    <section id="revizie" className="section-cream scroll-mt-24 py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-5xl px-6 sm:px-8">
        <p className="text-xs font-light uppercase tracking-[0.3em] text-gold">
          Odborné skúšky a revízie
        </p>
        <h2 className="font-serif mt-5 text-3xl font-light tracking-tight text-charcoal-deep sm:text-4xl lg:text-5xl">
          Odborné skúšky a revízie
        </h2>
        <p className="mt-6 max-w-3xl text-sm font-light leading-relaxed text-charcoal/75 sm:text-base sm:leading-[1.85]">
          {introText}
        </p>

        <ul
          className="revision-list mt-8 border-t border-black/[0.08]"
          onMouseLeave={() => {
            if (hoverCapable) closeItem();
          }}
        >
          {revisions.map((item) => {
            const isActive = activeId === item.id;
            const panelId = `${baseId}-${item.id}-panel`;
            const buttonId = `${baseId}-${item.id}-button`;

            return (
              <li
                key={item.id}
                className={`revision-item group border-b border-black/[0.08] transition-[opacity,background-color] duration-300 ease-out ${
                  activeId && !isActive ? "opacity-55" : "opacity-100"
                } ${isActive ? "bg-black/[0.02]" : "bg-transparent hover:bg-black/[0.015]"}`}
                onMouseEnter={() => {
                  if (hoverCapable) openItem(item.id);
                }}
              >
                <div className="flex w-full items-stretch gap-4 py-2.5 sm:gap-6 sm:py-3 md:gap-8">
                  <FrequencyLabel interval={item.interval} isActive={isActive} />

                  <div className="min-w-0 flex-1">
                    <button
                      type="button"
                      id={buttonId}
                      aria-expanded={isActive}
                      aria-controls={panelId}
                      className="flex w-full cursor-pointer items-center gap-3 py-0.5 text-left sm:gap-4"
                      onClick={() => {
                        if (!hoverCapable) toggleItem(item.id);
                      }}
                      onFocus={() => openItem(item.id)}
                      onKeyDown={(event) => {
                        if (event.key === "Escape") closeItem();
                      }}
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-normal tracking-wide text-charcoal-deep sm:text-[0.95rem]">
                          {item.title}
                        </span>
                        <span
                          className={`mt-1.5 block h-px origin-left bg-gradient-to-r from-amber-500 to-yellow-600 transition-all duration-300 ${
                            isActive ? "w-12 opacity-100" : "w-0 opacity-0"
                          }`}
                          aria-hidden
                        />
                      </span>
                      <span
                        className={`inline-flex shrink-0 self-center text-gold/90 transition-transform duration-300 ${
                          isActive ? "rotate-45" : "rotate-0"
                        }`}
                        aria-hidden
                      >
                        <svg
                          className="h-[1.05rem] w-[1.05rem]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.6}
                        >
                          <path strokeLinecap="round" d="M12 5v14M5 12h14" />
                        </svg>
                      </span>
                    </button>

                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      className={`revision-panel grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                        isActive
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="max-w-xl pb-2.5 pt-1.5 text-xs font-light leading-relaxed text-charcoal/70 sm:max-w-2xl sm:pb-3 sm:text-[0.8125rem] sm:leading-[1.65]">
                          {item.detail}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-7">
          <a
            href="/revizie"
            className="inline-flex items-center gap-2 text-sm font-light tracking-wide text-gold transition-colors duration-300 hover:text-gold-dark"
          >
            Zobraziť všetky revízie →
          </a>
        </div>
      </div>
    </section>
  );
}
