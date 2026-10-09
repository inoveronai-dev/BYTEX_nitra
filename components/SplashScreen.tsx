"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { SPLASH_DONE_EVENT, SPLASH_SESSION_KEY, SPLASH_TOTAL_MS } from "@/lib/splash";

const FADE_OUT_MS = 520;
const LINE_START_MS = 520;
const TEXT_START_MS = 980;
const EXIT_START_MS = SPLASH_TOTAL_MS - FADE_OUT_MS;

type Phase = "playing" | "exiting" | "done";

function markSplashDone() {
  try {
    sessionStorage.setItem(SPLASH_SESSION_KEY, "1");
  } catch {
    // sessionStorage may be unavailable
  }
  try {
    document.documentElement.dataset.bytexSplash = "done";
  } catch {
    // ignore
  }
  window.dispatchEvent(new Event(SPLASH_DONE_EVENT));
}

/** Clear any leftover scroll locks — splash no longer sets them, but older sessions might. */
function restoreScroll() {
  document.body.style.removeProperty("overflow");
  document.documentElement.style.removeProperty("overflow");
  document.body.style.removeProperty("position");
  document.body.style.removeProperty("top");
  document.body.style.removeProperty("left");
  document.body.style.removeProperty("right");
  document.body.style.removeProperty("width");
  document.body.classList.remove("overflow-hidden");
  document.documentElement.classList.remove("overflow-hidden");
}

function scrollToHashIfNeeded() {
  const hash = window.location.hash;
  if (!hash || hash.length < 2) return;
  const id = decodeURIComponent(hash.slice(1));
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ block: "start" });
    });
  });
}

function shouldSkipSplash(): boolean {
  try {
    if (document.documentElement.dataset.bytexSplash === "done") return true;
  } catch {
    // ignore
  }
  try {
    if (sessionStorage.getItem(SPLASH_SESSION_KEY) === "1") return true;
  } catch {
    // ignore
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function SplashScreen() {
  // SSR renders nothing; pre-paint CSS cover handles first frame on first visit.
  const [phase, setPhase] = useState<Phase>("done");
  const [entered, setEntered] = useState(false);
  const [lineActive, setLineActive] = useState(false);
  const [textActive, setTextActive] = useState(false);
  const finishedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    const timers: number[] = [];
    let enterFrame = 0;

    const finish = () => {
      if (cancelled || finishedRef.current) return;
      finishedRef.current = true;
      restoreScroll();
      markSplashDone();
      setPhase("done");
      scrollToHashIfNeeded();
    };

    restoreScroll();

    if (shouldSkipSplash()) {
      markSplashDone();
      restoreScroll();
      setPhase("done");
      scrollToHashIfNeeded();
      return () => {
        cancelled = true;
        restoreScroll();
      };
    }

    setPhase("playing");
    enterFrame = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        if (cancelled) return;
        // React overlay painted — drop pre-paint CSS cover so exit fade can reveal the page.
        try {
          document.documentElement.dataset.bytexSplash = "active";
        } catch {
          // ignore
        }
        setEntered(true);
      });
    });

    timers.push(
      window.setTimeout(() => {
        if (!cancelled) setLineActive(true);
      }, LINE_START_MS)
    );
    timers.push(
      window.setTimeout(() => {
        if (!cancelled) setTextActive(true);
      }, TEXT_START_MS)
    );
    timers.push(
      window.setTimeout(() => {
        if (!cancelled) setPhase("exiting");
      }, EXIT_START_MS)
    );
    timers.push(window.setTimeout(finish, SPLASH_TOTAL_MS));

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(enterFrame);
      for (const id of timers) window.clearTimeout(id);
      restoreScroll();
    };
  }, []);

  if (phase === "done") return null;

  const exiting = phase === "exiting";

  return (
    <div
      className={`fixed inset-0 z-[200] flex items-center justify-center bg-cream transition-opacity ease-out ${
        exiting ? "duration-[520ms] opacity-0" : "opacity-100"
      }`}
      aria-hidden
      role="presentation"
    >
      <div
        className={`pointer-events-none absolute inset-0 transition-opacity duration-700 ease-out ${
          entered && !exiting ? "opacity-100" : "opacity-70"
        }`}
        style={{
          background:
            "radial-gradient(ellipse 42% 36% at 50% 48%, rgba(197,155,39,0.09) 0%, rgba(249,249,246,0) 70%)",
        }}
      />

      <div
        className={`relative flex flex-col items-center px-8 transition-[opacity,transform] ease-out ${
          exiting
            ? "duration-[480ms] translate-y-0 scale-100 opacity-0"
            : entered
              ? "duration-[560ms] translate-y-0 scale-100 opacity-100"
              : "translate-y-1 scale-[0.96] opacity-0"
        }`}
      >
        <Image
          src="/bytex-logo-full-v4.png"
          alt="BYTEX Nitra, s.r.o. — správa bytových domov"
          width={1324}
          height={968}
          priority
          unoptimized
          className="h-auto w-[132px] object-contain sm:w-[150px] md:w-[165px]"
        />

        <span
          className={`mt-7 block h-px w-14 origin-left bg-gold-eyebrow transition-transform duration-500 ease-out sm:mt-8 sm:w-16 ${
            lineActive && !exiting ? "scale-x-100" : "scale-x-0"
          }`}
        />

        <p
          className={`mt-4 text-[0.65rem] font-light uppercase tracking-[0.28em] text-charcoal/45 transition-opacity duration-500 ease-out sm:mt-5 sm:text-xs sm:tracking-[0.32em] ${
            textActive && !exiting ? "opacity-100" : "opacity-0"
          }`}
        >
          BYTEX Nitra, s.r.o.
        </p>
      </div>
    </div>
  );
}
