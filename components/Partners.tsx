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
    <section id="partneri" className="section-dark scroll-mt-24 py-14 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <p className="section-eyebrow section-eyebrow--on-dark text-center">
          Partneri
        </p>
        <h2 className="font-serif mx-auto max-w-2xl text-center text-3xl font-light tracking-tight text-white sm:text-4xl lg:text-5xl">
          Spolupracujeme s overenými partnermi
        </h2>

        <div className="mt-10 grid grid-cols-1 items-center justify-items-center gap-6 sm:mt-12 sm:grid-cols-3 sm:gap-6 md:gap-8">
          {partners.map((partner) => (
            <div
              key={partner.src}
              className="group relative flex h-24 w-full max-w-[220px] items-center justify-center px-4"
            >
              <Image
                src={partner.src}
                alt={partner.alt}
                width={partner.width}
                height={partner.height}
                className="max-h-20 w-auto object-contain grayscale opacity-55 transition-all duration-500 group-hover:grayscale-0 group-hover:opacity-100 sm:max-h-24"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
