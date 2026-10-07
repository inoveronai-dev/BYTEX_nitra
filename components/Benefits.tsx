"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import Reveal from "@/components/Reveal";

type BenefitItem = {
  body: string;
  iconKey: string;
  emphasize?: boolean | null;
};

function resolveBenefitIcon(key: string) {
  const map: Record<string, () => ReactNode> = {
    message: MessageCircleCheckIcon,
    clock: ClockIcon,
    users: UsersIcon,
    home: HomeIcon,
    wrench: WrenchIcon,
    shield: ShieldIcon,
    device: DeviceIcon,
  };
  return map[key] || MessageCircleCheckIcon;
}

export default function Benefits({ items }: { items?: BenefitItem[] }) {
  const benefits =
    items && items.length > 0
      ? items.map((b) => ({
          text: b.body,
          icon: resolveBenefitIcon(b.iconKey),
          emphasize: Boolean(b.emphasize),
        }))
      : [];
  return (
    <section id="vyhody" className="section-cream scroll-mt-24 py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 xl:gap-20">
          {/* Left: editorial heading + strong visual */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <Reveal>
                <p className="section-eyebrow">
                  Výhody
                </p>
                <h2 className="font-serif text-3xl font-light tracking-tight text-charcoal-deep sm:text-4xl lg:text-5xl">
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
                  emphasize={benefit.emphasize}
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
  emphasize = false,
}: {
  text: string;
  icon: () => ReactNode;
  index: number;
  emphasize?: boolean;
}) {
  const number = String(index).padStart(2, "0");

  return (
    <article
      className={`group relative overflow-hidden rounded-2xl border p-5 transition-[transform,box-shadow,border-color,background-color] duration-500 ease-out hover:-translate-y-1 sm:p-6 ${
        emphasize
          ? "border-gold/20 bg-[#faf6ee] shadow-[0_4px_22px_rgb(0_0_0_/0.035)] hover:border-gold/35 hover:shadow-[0_12px_34px_rgb(197_155_39_/0.1)]"
          : "border-black/[0.07] bg-[#fbfaf7] shadow-[0_3px_18px_rgb(0_0_0_/0.03)] hover:border-gold/25 hover:bg-white hover:shadow-[0_10px_30px_rgb(197_155_39_/0.08)]"
      }`}
    >
      {/* Soft top-left corner accent */}
      <span
        className="pointer-events-none absolute left-0 top-0 h-10 w-10 border-l border-t border-gold/25 opacity-60 transition-opacity duration-500 group-hover:opacity-100"
        aria-hidden
      />

      {/* Watermark icon */}
      <div
        className={`pointer-events-none absolute -right-1 top-1/2 -translate-y-1/2 transition-[opacity,color,transform] duration-500 sm:right-1 ${
          emphasize
            ? "text-gold/22 group-hover:text-gold/32"
            : "text-gold/14 group-hover:text-gold/24"
        } group-hover:translate-x-[-2px]`}
        aria-hidden
      >
        <div className="h-[4.5rem] w-[4.5rem] sm:h-[5.25rem] sm:w-[5.25rem] [&_svg]:h-full [&_svg]:w-full">
          <Icon />
        </div>
      </div>

      <div className="relative z-10 flex items-start gap-4 sm:gap-5">
        <span
          className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border font-serif text-[0.65rem] font-light tracking-[0.14em] transition-colors duration-500 sm:h-9 sm:w-9 sm:text-xs ${
            emphasize
              ? "border-gold/30 bg-gold/[0.07] text-gold-dark group-hover:border-gold/45"
              : "border-gold/20 bg-white/70 text-gold/70 group-hover:border-gold/40 group-hover:text-gold-dark"
          }`}
        >
          {number}
        </span>

        <div className="min-w-0 flex-1 pr-14 sm:pr-16 md:pr-20">
          <p className="text-sm font-light leading-relaxed text-charcoal/85 sm:text-[0.95rem] sm:leading-[1.75]">
            {text}
          </p>
          <span
            className={`mt-4 block h-px origin-left bg-gradient-to-r from-gold to-gold-light/80 transition-all duration-500 ease-out ${
              emphasize
                ? "w-10 opacity-85 group-hover:w-16"
                : "w-8 opacity-65 group-hover:w-14 group-hover:opacity-90"
            }`}
          />
        </div>
      </div>
    </article>
  );
}

/** Shared stroke language for all benefit icons */
const iconProps = {
  fill: "none" as const,
  viewBox: "0 0 48 48",
  stroke: "currentColor",
  strokeWidth: 1.35,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true as const,
};

function MessageCircleCheckIcon() {
  return (
    <svg {...iconProps}>
      {/* Message circle + check — respectful communication */}
      <path d="M24 10c-8 0-14.5 5.4-14.5 12.1 0 3.4 1.7 6.5 4.5 8.7v5.7l5.2-2.9c1.5.4 3.1.6 4.8.6 8 0 14.5-5.4 14.5-12.1S32 10 24 10Z" />
      <path d="m18.5 21.5 3.6 3.6 7.4-7.4" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="24" cy="24" r="14.5" />
      <path d="M24 14.5V24l7 4" />
      <path d="M24 9.5v2.5M24 36v2.5M9.5 24h2.5M36 24h2.5" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="18" cy="16" r="5" />
      <path d="M8.5 34.5c.8-5.2 4.2-8 9.5-8s8.7 2.8 9.5 8" />
      <circle cx="32.5" cy="17" r="4" />
      <path d="M31 26.5c3.6.6 6.2 2.8 7 6.5" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg {...iconProps}>
      <path d="M8.5 22.5 24 9.5l15.5 13" />
      <path d="M12.5 20.5v16h23v-16" />
      <path d="M20 36.5v-9h8v9" />
    </svg>
  );
}

function WrenchIcon() {
  return (
    <svg {...iconProps}>
      <path d="M28.5 12.5a7 7 0 0 0-9.8 9.2L8.5 32l.8 6.7 6.7.8 10.2-10.3a7 7 0 0 0 9.3-9.7l-5.2 5.2-3.2-3.2 5.2-5.2a7 7 0 0 0-3.8-3.8Z" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg {...iconProps}>
      <path d="M24 8.5 10.5 14v9.5c0 7.2 5.2 13.2 13.5 15 8.3-1.8 13.5-7.8 13.5-15V14L24 8.5Z" />
      <path d="m18.5 24.5 3.8 3.8 7.2-8" />
    </svg>
  );
}

function DeviceIcon() {
  return (
    <svg {...iconProps}>
      <rect x="14.5" y="7.5" width="19" height="33" rx="2.5" />
      <path d="M14.5 12.5h19M14.5 35.5h19" />
      <circle cx="24" cy="38.5" r="1.1" fill="currentColor" stroke="none" />
      <path d="M19.5 18.5h9M19.5 23.5h9M19.5 28.5h6" />
    </svg>
  );
}
