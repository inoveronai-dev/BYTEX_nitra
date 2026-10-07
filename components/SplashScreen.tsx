"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { SPLASH_DONE_EVENT, SPLASH_SESSION_KEY, SPLASH_TOTAL_MS } from "@/lib/splash";

const FADE_OUT_MS = 520;
const LINE_START_MS = 520;
const TEXT_START_MS = 980;
const EXIT_START_MS = SPLASH_TOTAL_MS - FADE_OUT_MS;

function finishSplash() {
  sessionStorage.setItem(SPLASH_SESSION_KEY, "1");
  window.dispatchEvent(new Event(SPLASH_DONE_EVENT));
}

export default function SplashScreen() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [lineActive, setLineActive] = useState(false);
  const [textActive, setTextActive] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const alreadySeen = sessionStorage.getItem(SPLASH_SESSION_KEY) === "1";

    if (alreadySeen || reduceMotion) {
      finishSplash();
      return;
    }

    setMounted(true);

    const showId = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setVisible(true));
    });

    const lineId = window.setTimeout(() => setLineActive(true), LINE_START_MS);
    const textId = window.setTimeout(() => setTextActive(true), TEXT_START_MS);
    const exitId = window.setTimeout(() => setExiting(true), EXIT_START_MS);
    const doneId = window.setTimeout(() => {
      finishSplash();
      setMounted(false);
    }, SPLASH_TOTAL_MS);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.cancelAnimationFrame(showId);
      window.clearTimeout(lineId);
      window.clearTimeout(textId);
      window.clearTimeout(exitId);
      window.clearTimeout(doneId);
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  if (!mounted) return null;

  return (
    <div
      className={`fixed inset-0 z-[200] flex items-center justify-center bg-cream transition-opacity ease-out ${
        exiting
          ? "duration-[520ms] opacity-0"
          : visible
            ? "duration-[420ms] opacity-100"
            : "opacity-0"
      }`}
      aria-hidden
      role="presentation"
    >
      {/* Soft radial emphasis behind the logo */}
      <div
        className={`pointer-events-none absolute inset-0 transition-opacity duration-700 ease-out ${
          visible && !exiting ? "opacity-100" : "opacity-0"
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
            : visible
              ? "duration-[560ms] translate-y-0 scale-100 opacity-100"
              : "translate-y-1 scale-[0.96] opacity-0"
        }`}
      >
        <Image
          src="/logo-bytex.png"
          alt="BYTEX Nitra"
          width={714}
          height={510}
          priority
          className="h-auto w-[132px] sm:w-[150px] md:w-[165px]"
        />

        {/* Warm gold accent — draws left to right */}
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
