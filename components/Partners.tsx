import Image from "next/image";

const partners = [
  {
    src: "/partner-sana.png",
    alt: "Sana – profesionálne čistenie fasád",
    width: 526,
    height: 460,
  },
  {
    src: "/partner-resitech.png",
    alt: "Resitech – digitálna platforma pre vlastníkov",
    width: 572,
    height: 270,
  },
  {
    src: "/partner-bytex.png",
    alt: "BYTEX Nitra SERVIS – servis bytových domov",
    width: 700,
    height: 433,
  },
];

export default function Partners() {
  return (
    <section id="partneri" className="section-dark scroll-mt-24 py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <p className="text-center text-xs font-light uppercase tracking-[0.3em] text-gold-light">
          Partneri
        </p>
        <h2 className="font-serif mx-auto mt-8 max-w-2xl text-center text-3xl font-light tracking-tight text-white sm:text-4xl lg:text-5xl">
          Spolupracujeme s overenými partnermi
        </h2>

        <div className="mt-20 flex flex-wrap items-center justify-center gap-12 sm:gap-16 md:gap-20 lg:gap-28">
          {partners.map((partner) => (
            <div
              key={partner.src}
              className="group relative flex h-20 w-40 items-center justify-center sm:h-24 sm:w-48 md:h-28 md:w-56"
            >
              <Image
                src={partner.src}
                alt={partner.alt}
                width={partner.width}
                height={partner.height}
                className="max-h-full w-auto object-contain grayscale opacity-60 transition-all duration-500 group-hover:grayscale-0 group-hover:opacity-100"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
