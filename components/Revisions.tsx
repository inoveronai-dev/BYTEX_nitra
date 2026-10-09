"use client";

import { useCallback, useEffect, useId, useState } from "react";

type RevisionItem = {
  id: number | string;
  title: string;
  frequency: string;
  body: string;
};

const PREVIEW_COUNT = 3;

function FrequencyLabel({ interval }: { interval: string }) {
  const parts = interval.split(" / ");
  const isMultiLine = parts.length >= 3;

  return (
    <span className="h-auto w-[7.5rem] shrink-0 self-start text-sm font-normal leading-snug tracking-wide text-charcoal-deep sm:w-36 sm:text-[0.9375rem] md:w-40">
      {isMultiLine ? (
        <span className="flex flex-col">
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

function RevisionRow({
  item,
  baseId,
  isActive,
  hoverCapable,
  openItem,
  closeItem,
  toggleItem,
  dimmed,
}: {
  item: RevisionItem;
  baseId: string;
  isActive: boolean;
  hoverCapable: boolean;
  openItem: (id: string) => void;
  closeItem: () => void;
  toggleItem: (id: string) => void;
  dimmed: boolean;
}) {
  const id = String(item.id);
  const panelId = `${baseId}-${id}-panel`;
  const buttonId = `${baseId}-${id}-button`;

  return (
    <li
      className={`revision-item group h-auto border-b border-black/[0.08] transition-[opacity,background-color] duration-300 ease-out ${
        dimmed ? "opacity-55" : "opacity-100"
      } ${isActive ? "bg-black/[0.02]" : "bg-transparent hover:bg-black/[0.015]"}`}
      onMouseEnter={() => {
        if (hoverCapable) openItem(id);
      }}
    >
      <div className="flex h-auto w-full items-start gap-3 py-1.5 sm:gap-5 sm:py-2 md:gap-7">
        <FrequencyLabel interval={item.frequency} />

        <div className="min-h-0 min-w-0 flex-1 self-start">
          <button
            type="button"
            id={buttonId}
            aria-expanded={isActive}
            aria-controls={panelId}
            className="flex w-full cursor-pointer items-center gap-3 py-0 text-left sm:gap-4"
            onClick={() => {
              if (!hoverCapable) toggleItem(id);
            }}
            onFocus={() => openItem(id)}
            onKeyDown={(event) => {
              if (event.key === "Escape") closeItem();
            }}
          >
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-normal leading-snug tracking-wide text-charcoal-deep sm:text-[0.9375rem]">
                {item.title}
              </span>
              <span
                className={`mt-1 block h-px origin-left bg-gradient-to-r from-amber-500 to-yellow-600 transition-all duration-300 ${
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
                className="h-4 w-4"
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
            className={`revision-panel grid min-h-0 transition-[grid-template-rows,opacity] duration-300 ease-out ${
              isActive ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="min-h-0 overflow-hidden">
              <p className="max-w-xl pb-2 pt-1 text-xs font-light leading-snug text-charcoal/70 sm:max-w-2xl sm:pb-2.5 sm:text-[0.8125rem] sm:leading-[1.55]">
                {item.body}
              </p>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

export default function Revisions({
  intro = "",
  items = [],
}: {
  intro?: string;
  items?: RevisionItem[];
}) {
  const baseId = useId();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hoverCapable, setHoverCapable] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  const visibleByDefault = items.slice(0, PREVIEW_COUNT);
  const hiddenByDefault = items.slice(PREVIEW_COUNT);

  useEffect(() => {
    const hoverMedia = window.matchMedia("(hover: hover) and (pointer: fine)");
    const motionMedia = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateHover = () => setHoverCapable(hoverMedia.matches);
    const updateMotion = () => setReduceMotion(motionMedia.matches);
    updateHover();
    updateMotion();
    hoverMedia.addEventListener("change", updateHover);
    motionMedia.addEventListener("change", updateMotion);
    return () => {
      hoverMedia.removeEventListener("change", updateHover);
      motionMedia.removeEventListener("change", updateMotion);
    };
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

  const toggleShowAll = useCallback(() => {
    setShowAll((current) => {
      const next = !current;
      if (!next) {
        setActiveId((active) =>
          active && hiddenByDefault.some((item) => String(item.id) === active) ? null : active
        );
      }
      return next;
    });
  }, [hiddenByDefault]);

  return (
    <section id="revizie" className="section-cream scroll-mt-24 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-5xl px-6 sm:px-8">
        <h2 className="font-serif text-3xl font-light tracking-tight sm:text-4xl lg:text-5xl">
          <span className="text-charcoal-deep">Odborné skúšky</span>{" "}
          <span className="text-gold-eyebrow">a revízie</span>
        </h2>
        <p className="mt-5 max-w-3xl text-sm font-light leading-relaxed text-charcoal/75 sm:text-base sm:leading-[1.75]">
          {intro}
        </p>

        <ul
          className="revision-list mt-6 border-t border-black/[0.08]"
          onMouseLeave={() => {
            if (hoverCapable) closeItem();
          }}
        >
          {visibleByDefault.map((item) => (
            <RevisionRow
              key={item.id}
              item={item}
              baseId={baseId}
              isActive={activeId === String(item.id)}
              hoverCapable={hoverCapable}
              openItem={openItem}
              closeItem={closeItem}
              toggleItem={toggleItem}
              dimmed={Boolean(activeId && activeId !== String(item.id))}
            />
          ))}

          <li className="list-none">
            <div
              className={`grid ${
                reduceMotion
                  ? ""
                  : "transition-[grid-template-rows,opacity] duration-300 ease-out"
              } ${showAll ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
            >
              <div className="min-h-0 overflow-hidden">
                <ul className="border-0">
                  {hiddenByDefault.map((item) => (
                    <RevisionRow
                      key={item.id}
                      item={item}
                      baseId={baseId}
                      isActive={activeId === String(item.id)}
                      hoverCapable={hoverCapable}
                      openItem={openItem}
                      closeItem={closeItem}
                      toggleItem={toggleItem}
                      dimmed={Boolean(activeId && activeId !== String(item.id))}
                    />
                  ))}
                </ul>
              </div>
            </div>
          </li>
        </ul>

        {hiddenByDefault.length > 0 ? (
          <div className="mt-5">
            <button
              type="button"
              onClick={toggleShowAll}
              aria-expanded={showAll}
              className="group inline-flex items-center gap-1.5 text-sm font-light tracking-wide text-gold transition-colors duration-300 hover:text-gold-dark"
            >
              {showAll ? "Skryť revízie" : "Zobraziť všetky revízie"}
              <span
                className={`inline-block transition-transform duration-300 ${
                  showAll ? "group-hover:-translate-y-0.5" : "group-hover:translate-y-0.5"
                }`}
                aria-hidden
              >
                {showAll ? "↑" : "↓"}
              </span>
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
