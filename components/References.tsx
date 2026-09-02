import Image from "next/image";

const references = [
  { src: "/ref-1.jpg", address: "Ďurčanského 934/18, Nitra" },
  { src: "/ref-2.jpg", address: "SVB Mikovíniho 18 a 20" },
  { src: "/ref-3.jpg", address: "Beethovenova 450/2 - 4, Nitra" },
  { src: "/ref-4.jpg", address: "Hlohovecká 826/1, Lužianky" },
  { src: "/ref-5.jpg", address: "Jurkovičova 385/1, Nitra" },
  { src: "/ref-6.jpg", address: "Za Humnami 511/2, Veľký Cetín" },
];

export default function References() {
  return (
    <section id="referencie" className="section-cream scroll-mt-24 py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <p className="text-center text-xs font-light uppercase tracking-[0.3em] text-gold">
          Referencie
        </p>
        <h2 className="font-serif mx-auto mt-8 max-w-3xl text-center text-3xl font-light tracking-tight text-charcoal-deep sm:text-4xl lg:text-5xl">
          REFERENCIE
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-center text-sm font-light leading-relaxed text-charcoal/65 sm:text-base">
          Využívame odborné znalosti a kvalitný systém práce.
        </p>

        <div className="mt-16 grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-3">
          {references.map((ref) => (
            <article
              key={ref.src}
              className="group relative aspect-[4/5] overflow-hidden"
            >
              <Image
                src={ref.src}
                alt={ref.address}
                fill
                className="object-cover brightness-75 grayscale-[50%] transition-all duration-500 group-hover:scale-105 group-hover:brightness-100 group-hover:grayscale-0"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <p className="absolute inset-x-0 bottom-0 px-5 py-5 text-xs font-light uppercase tracking-[0.15em] text-white sm:text-sm">
                {ref.address}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
