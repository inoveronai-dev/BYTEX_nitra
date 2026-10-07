"use client";

import Image from "next/image";
import Reveal from "@/components/Reveal";

const services: {
  title: string;
  description: string;
  image: string;
  imageClassName?: string;
  imageOverlayClassName?: string;
}[] = [
  {
    title: "Ekonomická činnosť",
    description:
      "Evidencia platieb a tvorba predpisov, upomínanie platieb v omeškaní, vedenie samostatného účtovníctva, založenie a vedenie bankových účtov pre jednotlivé objekty, ročné vyúčtovanie, poistenie nehnuteľnosti.",
    image: "/service-1.jpg",
    // Anchor crop to bottom-left so the calculator stays fully in frame
    imageClassName: "object-left-bottom",
    imageOverlayClassName: "bg-gradient-to-t from-[#111111]/25 via-transparent to-black/10",
  },
  {
    title: "Technická činnosť",
    description:
      "Starostlivosť o stavebný a technický stav budov, periodické revízie, zabezpečenie projektových prác, inžinierskej činnosti a energetických certifikátov, zostavovanie ročných plánov opráv.",
    image: "/service-2-tech-v2.jpg",
    // Same source photo, reframed to clipboard/hands + technical bokeh (not portrait)
    imageClassName: "object-center",
    imageOverlayClassName: "bg-gradient-to-t from-[#111111]/40 via-transparent to-transparent",
  },
  {
    title: "Prevádzková činnosť",
    description:
      "Kontrola nad všetkými prevádzkovými procesmi, s ktorými sa vlastníci denne priamo stretávajú. Zabezpečenie všetkých služieb spojených s prevádzkou bytových domov (upratovanie, dodávka tepla, TÚV, studenej vody, plynu, elektriny, odvoz a likvidácia odpadu, dezinfekcia, dezinsekcia, deratizácia).",
    image: "/service-3.jpg",
  },
  {
    title: "Havarijná služba",
    description:
      "Štandardne poskytovaná služba bez poplatku na bytovú jednotku. Službu zabezpečujú a vykonávajú externé spoločnosti s najvýhodnejšou cenou. Zásah vo sfére spoločných častí a spoločných zariadení bytového domu je hradený z fondu opráv a zásah v byte a týkajúci sa výlučne bytu je hradený vlastníkom bytu.",
    image: "/service-4.jpg",
  },
  {
    title: "Právna činnosť",
    description:
      "Informovanie vlastníkov o aktuálnych zmenách zákonov týkajúcich sa prevádzky objektu, vymáhanie nedoplatkov a zabezpečenie dobrovoľných dražieb, dozor nad užívaním nehnuteľnosti v súlade so zákonom.",
    image: "/service-5.jpg",
  },
  {
    title: "Upratovacia činnosť",
    description:
      "Ako správca bytových domov spolupracujeme s upratovacou firmou UP Cleaning prostredníctvom ktorej Vám vieme zabezpečiť upratovanie spoločných priestorov v bytovom dome za výhodné ceny.",
    image: "/service-6.jpg",
  },
];

export default function Services() {
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
