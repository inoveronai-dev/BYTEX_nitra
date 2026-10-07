"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";

const references = [
  { src: "/ref-1.jpg", address: "Ďurčanského 934/18, Nitra" },
  { src: "/ref-2.jpg", address: "SVB Mikovíniho 18 a 20" },
  { src: "/ref-3.jpg", address: "Beethovenova 450/2 - 4, Nitra" },
  { src: "/ref-4.jpg", address: "Hlohovecká 826/1, Lužianky" },
  { src: "/ref-5.jpg", address: "Jurkovičova 385/1, Nitra" },
  { src: "/ref-6.jpg", address: "Za Humnami 511/2, Veľký Cetín" },
];

const COUNT = references.length;
const FIRST_MOVE_MS = 1200;
const AUTOPLAY_MS = 2000;
const RESUME_MS = 1800;

/** Triple the list so we can jump between clones without a visible reset. */
const loopItems = [...references, ...references, ...references];

function ArrowIcon({ direction }: { direction: "prev" | "next" }) {
  return (
    <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
      {direction === "prev" ? (
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19 8 12l7-7" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" d="m9 5 7 7-7 7" />
      )}
    </svg>
  );
}

export default function References() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startScroll: number;
  } | null>(null);
  const normalizeTimer = useRef<number | null>(null);
  const resumeTimer = useRef<number | null>(null);
  const readyRef = useRef(false);
  const activeIndexRef = useRef(0);

  const [activeIndex, setActiveIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const [tabHidden, setTabHidden] = useState(false);
  const [inView, setInView] = useState(false);

  const getCards = useCallback(() => {
    const track = trackRef.current;
    if (!track) return [] as HTMLElement[];
    return Array.from(track.querySelectorAll<HTMLElement>("[data-ref-card]"));
  }, []);

  const getNearestIndex = useCallback(() => {
    const track = trackRef.current;
    const cards = getCards();
    if (!track || cards.length === 0) return COUNT;

    const trackLeft = track.scrollLeft;
    let nearest = COUNT;
    let nearestDistance = Number.POSITIVE_INFINITY;

    cards.forEach((card, index) => {
      const distance = Math.abs(card.offsetLeft - trackLeft);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearest = index;
      }
    });

    return nearest;
  }, [getCards]);

  const scrollToDomIndex = useCallback(
    (index: number, behavior: ScrollBehavior) => {
      const track = trackRef.current;
      const cards = getCards();
      const target = cards[index];
      if (!track || !target) return;

      track.scrollTo({
        left: target.offsetLeft,
        behavior,
      });
    },
    [getCards]
  );

  const normalizeLoop = useCallback(() => {
    const nearest = getNearestIndex();
    let normalized = nearest;

    if (nearest < COUNT) {
      normalized = nearest + COUNT;
      scrollToDomIndex(normalized, "auto");
    } else if (nearest >= COUNT * 2) {
      normalized = nearest - COUNT;
      scrollToDomIndex(normalized, "auto");
    }

    setActiveIndex(((normalized % COUNT) + COUNT) % COUNT);
  }, [getNearestIndex, scrollToDomIndex]);

  const scheduleNormalize = useCallback(() => {
    if (normalizeTimer.current) window.clearTimeout(normalizeTimer.current);
    normalizeTimer.current = window.setTimeout(() => {
      normalizeLoop();
    }, reduceMotion ? 20 : 420);
  }, [normalizeLoop, reduceMotion]);

  const goBy = useCallback(
    (delta: number) => {
      if (!readyRef.current) return;
      const next = getNearestIndex() + delta;
      scrollToDomIndex(next, reduceMotion ? "auto" : "smooth");
      scheduleNormalize();
    },
    [getNearestIndex, reduceMotion, scheduleNormalize, scrollToDomIndex]
  );

  const pauseInteraction = useCallback(() => {
    setInteracting(true);
    if (resumeTimer.current) window.clearTimeout(resumeTimer.current);
  }, []);

  const resumeInteractionSoon = useCallback(() => {
    if (resumeTimer.current) window.clearTimeout(resumeTimer.current);
    resumeTimer.current = window.setTimeout(() => {
      setInteracting(false);
    }, RESUME_MS);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const onVisibility = () => setTabHidden(document.hidden);
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting && entry.intersectionRatio > 0.2),
      { threshold: [0.2, 0.35] }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const placeMiddle = () => {
      scrollToDomIndex(COUNT + activeIndexRef.current, "auto");
      readyRef.current = true;
    };

    placeMiddle();
    const onResize = () => {
      readyRef.current = false;
      scrollToDomIndex(COUNT + activeIndexRef.current, "auto");
      readyRef.current = true;
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [scrollToDomIndex]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const onScroll = () => {
      const nearest = getNearestIndex();
      setActiveIndex(((nearest % COUNT) + COUNT) % COUNT);
    };

    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, [getNearestIndex]);

  // Faster autoplay: first advance soon after entering view, then every ~2.75s
  useEffect(() => {
    if (reduceMotion || !inView || hovered || interacting || tabHidden) return;

    let intervalId = 0;
    const firstId = window.setTimeout(() => {
      goBy(1);
      intervalId = window.setInterval(() => {
        goBy(1);
      }, AUTOPLAY_MS);
    }, FIRST_MOVE_MS);

    return () => {
      window.clearTimeout(firstId);
      if (intervalId) window.clearInterval(intervalId);
    };
  }, [goBy, hovered, inView, interacting, reduceMotion, tabHidden]);

  useEffect(() => {
    return () => {
      if (normalizeTimer.current) window.clearTimeout(normalizeTimer.current);
      if (resumeTimer.current) window.clearTimeout(resumeTimer.current);
    };
  }, []);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    const track = trackRef.current;
    if (!track) return;

    pauseInteraction();
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startScroll: track.scrollLeft,
    };
    track.setPointerCapture(event.pointerId);
    track.classList.add("cursor-grabbing", "snap-none", "scroll-auto");
    track.classList.remove("snap-x", "snap-mandatory", "scroll-smooth");
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    const track = trackRef.current;
    if (!drag || !track || drag.pointerId !== event.pointerId) return;

    const delta = event.clientX - drag.startX;
    track.scrollLeft = drag.startScroll - delta;
  };

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    const track = trackRef.current;
    if (!drag || !track || drag.pointerId !== event.pointerId) return;

    dragRef.current = null;
    track.classList.remove("cursor-grabbing", "snap-none", "scroll-auto");
    track.classList.add("snap-x", "snap-mandatory");
    if (!reduceMotion) track.classList.add("scroll-smooth");

    if (track.hasPointerCapture(event.pointerId)) {
      track.releasePointerCapture(event.pointerId);
    }

    const nearest = getNearestIndex();
    scrollToDomIndex(nearest, reduceMotion ? "auto" : "smooth");
    scheduleNormalize();
    resumeInteractionSoon();
  };

  const onArrow = (delta: number) => {
    pauseInteraction();
    goBy(delta);
    resumeInteractionSoon();
  };

  return (
    <section
      ref={sectionRef}
      id="referencie"
      className="section-cream scroll-mt-24 py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-serif text-3xl font-light tracking-tight text-charcoal-deep sm:text-4xl lg:text-5xl">
            REFERENCIE
          </h2>
          <span
            className="mx-auto mt-4 block h-px w-12 bg-gold-eyebrow"
            aria-hidden
          />
          <p className="mx-auto mt-4 max-w-xl text-sm font-light leading-relaxed text-charcoal/65 sm:text-base">
            Využívame odborné znalosti a kvalitný systém práce.
          </p>
        </div>

        <div
          className="relative mt-8 sm:mt-9"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <button
            type="button"
            onClick={() => onArrow(-1)}
            aria-label="Predchádzajúca referencia"
            className="absolute top-1/2 left-1 z-20 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-gold/40 bg-cream/90 text-gold shadow-[0_4px_16px_rgb(0_0_0_/0.1)] backdrop-blur-[2px] transition-colors duration-300 hover:border-gold hover:bg-cream hover:text-gold-dark sm:left-2 sm:h-10 sm:w-10 md:-left-1 lg:-left-2"
          >
            <ArrowIcon direction="prev" />
          </button>
          <button
            type="button"
            onClick={() => onArrow(1)}
            aria-label="Ďalšia referencia"
            className="absolute top-1/2 right-1 z-20 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-gold/40 bg-cream/90 text-gold shadow-[0_4px_16px_rgb(0_0_0_/0.1)] backdrop-blur-[2px] transition-colors duration-300 hover:border-gold hover:bg-cream hover:text-gold-dark sm:right-2 sm:h-10 sm:w-10 md:-right-1 lg:-right-2"
          >
            <ArrowIcon direction="next" />
          </button>

          <div
            ref={trackRef}
            className="flex cursor-grab gap-1 overflow-x-auto overscroll-x-contain scroll-smooth pb-1 [-ms-overflow-style:none] [scrollbar-width:none] snap-x snap-mandatory touch-pan-x sm:gap-1.5 lg:gap-2 [&::-webkit-scrollbar]:hidden"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            role="region"
            aria-roledescription="carousel"
            aria-label="Referencie"
          >
            {loopItems.map((ref, index) => (
              <article
                key={`${ref.src}-${index}`}
                data-ref-card
                aria-label={`${(index % COUNT) + 1} z ${COUNT}: ${ref.address}`}
                className="group relative aspect-[4/5] w-[85%] shrink-0 snap-start overflow-hidden sm:w-[48%] lg:w-[31.8%]"
              >
                <Image
                  src={ref.src}
                  alt={ref.address}
                  fill
                  draggable={false}
                  className={`object-cover brightness-75 grayscale-[50%] transition-all duration-500 ${
                    reduceMotion
                      ? ""
                      : "group-hover:scale-105 group-hover:brightness-100 group-hover:grayscale-0"
                  }`}
                  sizes="(max-width: 640px) 85vw, (max-width: 1024px) 48vw, 32vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent transition-opacity duration-500 group-hover:from-black/80" />
                <p
                  className={`absolute inset-x-0 bottom-0 px-5 py-5 text-xs font-light uppercase tracking-[0.15em] text-white transition-transform duration-500 sm:text-sm ${
                    reduceMotion ? "" : "group-hover:-translate-y-0.5"
                  }`}
                >
                  {ref.address}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
