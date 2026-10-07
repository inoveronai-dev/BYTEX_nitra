"use client";

import { useEffect, useRef, useState } from "react";

const defaults = {
  eyebrow: "O nás",
  heading: "Poslanie spoločnosti",
  body: "Sme správcovská spoločnosť zameraná na správu bytových domov v Nitre. Bezprostredným podnetom k vzniku spoločnosti boli impulzy a myšlienky individuálneho prístupu k bytovým domom, pričom hlavným cieľom našich činností je komplexný komfort pre každého koncového užívateľa.",
};

export default function About({
  eyebrow = defaults.eyebrow,
  heading = defaults.heading,
  body = defaults.body,
}: {
  eyebrow?: string;
  heading?: string;
  body?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(motion.matches);
    if (motion.matches) {
      setVisible(true);
      return;
    }

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.28, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const show = reduceMotion || visible;

  return (
    <section
      ref={ref}
      id="o-nas"
      className="section-cream scroll-mt-0 py-24 sm:py-32 lg:py-40"
    >
      <div className="mx-auto max-w-3xl px-6 text-center sm:px-8">
        <p
          className={`section-eyebrow transition-[opacity,transform] duration-700 ease-out ${
            show ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          {eyebrow}
        </p>
        <h2 className="font-serif overflow-hidden text-4xl font-light leading-tight tracking-tight text-charcoal-deep sm:text-5xl lg:text-6xl">
          <span
            className={`block transition-[transform,opacity] duration-700 ease-out ${
              show ? "translate-y-0 opacity-100" : "translate-y-[115%] opacity-0"
            }`}
            style={{
              transitionDelay: show && !reduceMotion ? "120ms" : "0ms",
              transitionDuration: "780ms",
            }}
          >
            {heading}
          </span>
        </h2>
        <p
          className={`mt-12 text-base font-light leading-relaxed text-charcoal/75 transition-[opacity,transform] duration-700 ease-out sm:text-lg sm:leading-[1.9] lg:text-xl ${
            show ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
          }`}
          style={{ transitionDelay: show && !reduceMotion ? "260ms" : "0ms" }}
        >
          {body}
        </p>
      </div>
    </section>
  );
}
