"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import Reveal from "@/components/Reveal";

const benefits = [
  {
    text: "Seriózne a ústretové jednanie so všetkými vlastníkmi objektov - po dohode aj vo vlastnom bytovom dome.",
    icon: HandshakeIcon,
  },
  {
    text: "Pracujeme pre Vás nonstop 24 hodín denne a 7 dní v týždni.",
    icon: ClockIcon,
  },
  {
    text: "Úzka spolupráca s vlastníkmi bytov a spoločné prehodnocovanie potrebných investícií.",
    icon: UsersIcon,
  },
  {
    text: "Sústavná starostlivosť o komfort bývania.",
    icon: HomeIcon,
  },
  {
    text: "Pružnejšie a efektívnejšie vykonávanie jednotlivých opráv v dome odbornými pracovníkmi.",
    icon: WrenchIcon,
  },
  {
    text: "Predĺženie životnosti objektov pravidelnými kontrolami a z nich vyplývajúcimi údržbárskymi a servisnými prácami.",
    icon: ShieldIcon,
  },
  {
    text: "Informovanosť, komunikácia, oznamy, tlačivá, elektronické hlasovanie cez platformu Resitech.",
    icon: DeviceIcon,
    accent: true,
  },
];

export default function Benefits() {
  return (
    <section id="vyhody" className="section-cream scroll-mt-24 py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 xl:gap-20">
          {/* Left: editorial heading + strong visual */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <Reveal>
                <p className="text-xs font-light uppercase tracking-[0.3em] text-gold">
                  Výhody
                </p>
                <h2 className="font-serif mt-6 text-3xl font-light tracking-tight text-charcoal-deep sm:text-4xl lg:text-5xl">
                  Prečo BYTEX Nitra
                </h2>
              </Reveal>

              <Reveal delayMs={100}>
                <div className="mt-10 overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-[0_8px_40px_rgb(0_0_0_/0.06)]">
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <Image
                      src="/ref-5.jpg"
                      alt=""
                      fill
                      className="object-cover transition-transform duration-700 ease-out hover:scale-[1.03]"
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      priority={false}
                    />
                  </div>
                </div>
              </Reveal>

              <Reveal delayMs={180}>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-black/[0.06]">
                    <Image
                      src="/ref-2.jpg"
                      alt=""
                      fill
                      className="object-cover transition-transform duration-700 ease-out hover:scale-105"
                      sizes="(max-width: 1024px) 50vw, 20vw"
                    />
                  </div>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-black/[0.06]">
                    <Image
                      src="/ref-1.jpg"
                      alt=""
                      fill
                      className="object-cover transition-transform duration-700 ease-out hover:scale-105"
                      sizes="(max-width: 1024px) 50vw, 20vw"
                    />
                  </div>
                </div>
              </Reveal>
            </div>
          </div>

          {/* Right: vertical stack of benefit cards */}
          <div className="flex flex-col gap-4 lg:col-span-7 lg:gap-5">
            {benefits.map((benefit, index) => (
              <Reveal key={benefit.text} delayMs={80 + index * 70}>
                <BenefitCard
                  text={benefit.text}
                  icon={benefit.icon}
                  index={index + 1}
                  accent={benefit.accent}
                />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function BenefitCard({
  text,
  icon: Icon,
  index,
  accent = false,
}: {
  text: string;
  icon: () => ReactNode;
  index: number;
  accent?: boolean;
}) {
  const number = String(index).padStart(2, "0");

  return (
    <article
      className={`group relative overflow-hidden rounded-2xl border p-5 transition-all duration-500 ease-out hover:-translate-y-0.5 sm:p-6 ${
        accent
          ? "border-gold/25 bg-charcoal-deep text-cream shadow-[0_8px_32px_rgb(0_0_0_/0.12)] hover:border-gold/40 hover:shadow-[0_14px_40px_rgb(0_0_0_/0.18)]"
          : "border-black/[0.06] bg-white shadow-[0_4px_20px_rgb(0_0_0_/0.03)] hover:border-gold/20 hover:shadow-[0_12px_36px_rgb(197_155_39_/0.08)]"
      }`}
    >
      {/* Large decorative watermark symbol */}
      <div
        className={`pointer-events-none absolute -right-3 top-1/2 -translate-y-1/2 transition-opacity duration-500 sm:-right-2 ${
          accent
            ? "text-[#c59b27]/30 group-hover:text-[#c59b27]/40"
            : "text-[#c59b27]/16 group-hover:text-[#c59b27]/24"
        }`}
        aria-hidden
      >
        <div className="h-24 w-24 sm:h-28 sm:w-28 md:h-[7.5rem] md:w-[7.5rem] [&_svg]:h-full [&_svg]:w-full">
          <Icon />
        </div>
      </div>

      <div className="relative z-10 flex gap-4 sm:gap-5">
        <span
          className={`mt-0.5 shrink-0 font-serif text-xs font-light tracking-[0.18em] ${
            accent ? "text-gold-light/45" : "text-gold/45"
          }`}
        >
          {number}
        </span>

        <div className="min-w-0 flex-1 pr-16 sm:pr-20 md:pr-24">
          <p
            className={`text-sm font-light leading-relaxed sm:text-[0.95rem] sm:leading-[1.75] ${
              accent ? "text-cream/90" : "text-charcoal/85"
            }`}
          >
            {text}
          </p>
          <span
            className={`mt-4 block h-px w-8 origin-left bg-gradient-to-r from-amber-500 to-yellow-600 transition-all duration-500 group-hover:w-14 ${
              accent ? "opacity-90" : "opacity-70"
            }`}
          />
        </div>
      </div>
    </article>
  );
}

function HandshakeIcon() {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.85} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 12.5 4.5 10a2.1 2.1 0 0 1 3-3L10 9.5m7 3 2.5-2.5a2.1 2.1 0 0 0-3-3L14 9.5m-4 0 1.2 1.2a2 2 0 0 0 2.8 0L15.2 9.5M8 14.5l1.8 1.8a2 2 0 0 0 2.8 0L16 14.5" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.85} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.85} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2m18 0v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75M12 11a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.85} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="m3 11 9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9Z" />
    </svg>
  );
}

function WrenchIcon() {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.85} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.7 6.3a4.5 4.5 0 0 0-6.3 6.3L3 18v3h3l5.4-5.4a4.5 4.5 0 0 0 6.3-6.3l-2.1 2.1-1.4-1.4 2.1-2.1Z" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.85} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3 4.5 6.5v5.2c0 4.4 3 8.3 7.5 9.3 4.5-1 7.5-4.9 7.5-9.3V6.5L12 3Z" />
    </svg>
  );
}

function DeviceIcon() {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.85} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 5h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm0 14h8M12 17.5h.01" />
    </svg>
  );
}
