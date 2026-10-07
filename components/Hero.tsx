"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { SPLASH_DONE_EVENT, SPLASH_SESSION_KEY, SPLASH_TOTAL_MS } from "@/lib/splash";

export default function Hero({
  headlineLines = ["Individuálny prístup", "k bytovým domom"],
  imageSrc = "/hero-bytex.jpg",
}: {
  headlineLines?: string[];
  imageSrc?: string;
}) {
  const [active, setActive] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(motionQuery.matches);

    if (motionQuery.matches) {
      setActive(true);
      return;
    }

    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      setActive(true);
    };

    window.addEventListener(SPLASH_DONE_EVENT, start);

    const alreadySeen = sessionStorage.getItem(SPLASH_SESSION_KEY) === "1";
    const delay = alreadySeen ? 60 : SPLASH_TOTAL_MS + 60;
    const timer = window.setTimeout(start, delay);

    return () => {
      window.removeEventListener(SPLASH_DONE_EVENT, start);
      window.clearTimeout(timer);
    };
  }, []);

  const reveal = reduceMotion || active;

  return (
    <section id="uvod" className="relative h-screen w-full overflow-hidden">
      <div
        className={`absolute inset-0 transition-[opacity,transform] duration-[900ms] ease-out ${
          reveal ? "scale-100 opacity-100" : "scale-[1.03] opacity-90"
        }`}
      >
        <Image
          src={imageSrc}
          alt="Obytná štvrť v Nitre so správou bytových domov"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/40 to-black/70" />

      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        <h1 className="hero-text-shadow max-w-5xl text-2xl font-light uppercase leading-snug tracking-[0.2em] text-white sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
          {headlineLines.map((line, index) => (
            <span key={line} className="block overflow-hidden py-0.5">
              <span
                className={`block transition-[transform,opacity] duration-700 ease-out ${
                  reveal ? "translate-y-0 opacity-100" : "translate-y-[110%] opacity-0"
                }`}
                style={{
                  transitionDelay: reduceMotion ? "0ms" : `${110 + index * 140}ms`,
                }}
              >
                {line}
              </span>
            </span>
          ))}
        </h1>
      </div>
    </section>
  );
}
