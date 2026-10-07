"use client";

import Image from "next/image";
import Reveal from "@/components/Reveal";

type ServiceItem = {
  title: string;
  description: string;
  image: string;
  imageClassName?: string | null;
  imageOverlayClassName?: string | null;
};

export default function Services({ items = [] }: { items?: ServiceItem[] }) {
  const services = items;
  return (
    <section id="sluzby" className="scroll-mt-24 bg-[#111111] py-24 text-cream sm:py-32 lg:py-40">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <Reveal>
          <p className="section-eyebrow section-eyebrow--on-dark">
            Správa bytových domov
          </p>
          <h2 className="font-serif text-3xl font-light tracking-tight text-cream sm:text-4xl lg:text-5xl">
            Komplexné služby správy
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {services.map((service, index) => (
            <Reveal key={service.title} delayMs={index * 80}>
              <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-all duration-500 hover:-translate-y-1 hover:border-gold/30 hover:shadow-[0_16px_48px_rgb(0_0_0_/0.35)]">
                <div className="relative h-36 overflow-hidden sm:h-40">
                  <Image
                    src={service.image}
                    alt=""
                    fill
                    className={`object-cover brightness-75 grayscale-[30%] transition-all duration-700 group-hover:scale-105 group-hover:brightness-90 group-hover:grayscale-0 ${
                      service.imageClassName ?? "object-center"
                    }`}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div
                    className={`absolute inset-0 ${
                      service.imageOverlayClassName ??
                      "bg-gradient-to-t from-[#111111] via-[#111111]/40 to-transparent"
                    }`}
                  />
                </div>

                <div className="flex flex-1 flex-col p-6 sm:p-7">
                  <h3 className="text-sm font-normal uppercase tracking-[0.18em] text-gold-light">
                    {service.title}
                  </h3>
                  <p className="mt-4 text-sm font-light leading-relaxed text-cream/70 sm:leading-[1.8]">
                    {service.description}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
