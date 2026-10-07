"use client";

import Image from "next/image";
import { useId, useState } from "react";
import Reveal from "@/components/Reveal";

type Project = {
  id: string;
  title: string;
  beforeImage: string;
  afterImage: string;
  beforeText: string;
  afterText: string;
  facts: string[];
};

const projects: Project[] = [
  {
    id: "hlohovecka",
    title: "Hlohovecká 1, Lužianky",
    beforeImage: "/reconstructions/hlohovecka-pred.jpeg",
    afterImage: "/reconstructions/hlohovecka-po.jpeg",
    beforeText:
      "Bytový dom pred komplexnou rekonštrukciou 2025. Zhotoviteľ: fasáda a pivnice BYTEX Nitra,s.r.o., strecha DEPEX,s.r.o., okná a dvere TERMOWIN,s.r.o., bleskozvod projekt REXEL,s.r.o., a realizácia Branislav Borza, vodovodná prípojka Ing. Jozef Vyskoč EKOSTAVING.",
    afterText:
      "Bytový dom po rekonštrukcii 2025. Zateplenie a výmena krytiny strechy, projektovanie a výmena bleskozvodu, renovácia fasády, zateplenie pivníc, vymaľovanie spoločných priestorov, výmena vchodových dverí a pivničných okien a nakoniec nová vodovodná prípojka. Celková investícia 50 000€.",
    facts: ["2025", "Celková investícia 50 000 €"],
  },
  {
    id: "za-humnami",
    title: "Za Humnami 2, Veľký Cetín",
    beforeImage: "/reconstructions/za-humnami-pred.jpeg",
    afterImage: "/reconstructions/za-humnami-po.jpeg",
    beforeText:
      "Bytový dom pred komplexnou rekonštrukciou 2025. Zhotoviteľ: zateplenie fasády, omietky schodisko BYTEX Nitra SERVIS,s.r.o., pivničné okná Vladimír Čaplák, bleskozvod projekt REXEL,s.r.o. a realizácia Branislav Borza.",
    afterText:
      "Bytový dom po rekonštrukcii 2025. Zateplenie fasády, rekonštrukcia interiéru schodiska, projektovanie a výmena bleskozvodu a elektroinštalácie, výmena pivničných okien. Celková investícia 50 000€.",
    facts: ["2025", "Celková investícia 50 000 €"],
  },
  {
    id: "mikoviniho",
    title: "Mikovíniho 18 a 20, Nitra",
    beforeImage: "/reconstructions/mikoviniho-pred.jpeg",
    afterImage: "/reconstructions/mikoviniho-po.jpeg",
    beforeText:
      "Bytový dom pred komplexnou rekonštrukciou 2025. Zhotoviteľ: Umytie a premaľovanie fasády, nové závesné balkóny so striežkami SanaTOP,s.r.o., rekonštrukcia elektroištalácie stupačky EkoReko,s.r.o. Projekt realizovaný cez ŠFRB.",
    afterText:
      "Bytový dom v procese rekonštrukcie. Termín ukončenia prác september 2025. Umytie a premaľovanie fasády, nové závesné hliníkové balkóny so striežkami a bočnicami, vý́mena napájacích rozvodov v stupačkách, vý́mena napájacích káblov do bytov, doplnenie núdzových svietidiel na schodiskách, doplnenie hlavného ističa v stupačkách a uzemnenie bytového domu. Celková investícia 295 000 €.",
    facts: [
      "V procese rekonštrukcie",
      "Termín ukončenia prác september 2025",
      "Celková investícia 295 000 €",
    ],
  },
];

function isInvestmentFact(fact: string) {
  return /investícia|€/i.test(fact);
}

function ProjectShowcase({ project }: { project: Project }) {
  const [open, setOpen] = useState(false);
  const [hoverSide, setHoverSide] = useState<"before" | "after" | null>(null);
  const panelId = useId();
  const buttonId = useId();

  const beforeFlex =
    hoverSide === "before" ? "lg:flex-[1.25]" : hoverSide === "after" ? "lg:flex-[0.85]" : "lg:flex-1";
  const afterFlex =
    hoverSide === "after" ? "lg:flex-[1.25]" : hoverSide === "before" ? "lg:flex-[0.85]" : "lg:flex-1";

  return (
    <article className="flex h-full flex-col">
      <div className="flex h-44 overflow-hidden sm:h-48 lg:h-52">
        <div
          className={`relative min-w-0 flex-1 basis-0 transition-[flex] duration-500 ease-out ${beforeFlex}`}
          onMouseEnter={() => setHoverSide("before")}
          onMouseLeave={() => setHoverSide(null)}
        >
          <Image
            src={project.beforeImage}
            alt=""
            fill
            className="object-cover transition-transform duration-700 ease-out hover:scale-[1.03]"
            sizes="(max-width: 768px) 50vw, 18vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
          <span className="absolute left-2 top-2 bg-charcoal-deep/80 px-2 py-0.5 text-[0.65rem] font-medium tracking-[0.18em] text-cream">
            PRED
          </span>
        </div>
        <div
          className={`relative min-w-0 flex-1 basis-0 transition-[flex] duration-500 ease-out ${afterFlex}`}
          onMouseEnter={() => setHoverSide("after")}
          onMouseLeave={() => setHoverSide(null)}
        >
          <Image
            src={project.afterImage}
            alt=""
            fill
            className="object-cover transition-transform duration-700 ease-out hover:scale-[1.03]"
            sizes="(max-width: 768px) 50vw, 18vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          <span className="absolute left-2 top-2 bg-gold px-2 py-0.5 text-[0.65rem] font-medium tracking-[0.18em] text-charcoal-deep">
            PO
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center pt-4 text-center sm:pt-5">
        <h3 className="font-serif text-lg font-light tracking-tight text-charcoal-deep sm:text-xl">
          {project.title}
        </h3>
        <ul className="mt-2 space-y-0.5">
          {project.facts.map((fact) => (
            <li
              key={fact}
              className={`text-xs font-light leading-snug sm:text-[0.8125rem] ${
                isInvestmentFact(fact) ? "text-gold-dark" : "text-charcoal/55"
              }`}
            >
              {fact}
            </li>
          ))}
        </ul>

        <button
          type="button"
          id={buttonId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((value) => !value)}
          className="group/btn mt-3 inline-flex items-center gap-1.5 text-sm font-light tracking-wide text-gold transition-colors duration-300 hover:text-gold-dark"
        >
          {open ? "Skryť detail" : "Zobraziť detail"}
          <span
            className={`inline-block transition-transform duration-300 ${
              open ? "rotate-90" : "group-hover/btn:translate-x-1"
            }`}
            aria-hidden
          >
            →
          </span>
        </button>

        <div
          id={panelId}
          role="region"
          aria-labelledby={buttonId}
          className={`grid w-full min-h-0 transition-[grid-template-rows,opacity] duration-300 ease-out ${
            open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="min-h-0 overflow-hidden">
            <div className="mt-3 space-y-3 border-t border-black/[0.08] pt-3 text-center">
              <div>
                <p className="text-[0.65rem] font-medium tracking-[0.18em] text-gold">PRED</p>
                <p className="mt-1.5 text-xs font-light leading-relaxed text-charcoal/70 sm:text-[0.8125rem] sm:leading-[1.65]">
                  {project.beforeText}
                </p>
              </div>
              <div>
                <p className="text-[0.65rem] font-medium tracking-[0.18em] text-gold">PO</p>
                <p className="mt-1.5 text-xs font-light leading-relaxed text-charcoal/70 sm:text-[0.8125rem] sm:leading-[1.65]">
                  {project.afterText}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function Reconstructions() {
  return (
    <section
      id="rekonstrukcie"
      className="section-cream scroll-mt-28 py-16 sm:scroll-mt-32 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <Reveal>
          <h2 className="font-serif text-3xl font-light tracking-tight sm:text-4xl">
            <span className="text-gold-eyebrow">Rekonštrukcia</span>{" "}
            <span className="text-charcoal-deep">bytových domov</span>
          </h2>
        </Reveal>

        <div className="mt-9 grid gap-10 sm:mt-10 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-12 lg:mt-11 lg:grid-cols-3 lg:gap-0 lg:divide-x lg:divide-black/[0.08]">
          {projects.map((project, index) => (
            <Reveal key={project.id} delayMs={index * 80}>
              <div
                className={`h-full lg:px-6 ${index === 0 ? "lg:pl-0" : ""} ${
                  index === projects.length - 1 ? "lg:pr-0" : ""
                }`}
              >
                <ProjectShowcase project={project} />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
