import Image from "next/image";

type PartnerItem = {
  name: string;
  src: string;
  alt?: string;
  url?: string | null;
};

export default function Partners({ items = [] }: { items?: PartnerItem[] }) {
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
          {items.map((partner) => {
            const image = (
              <Image
                src={partner.src}
                alt={partner.alt || partner.name}
                width={280}
                height={120}
                className="max-h-16 w-auto object-contain opacity-90 transition-opacity duration-300 group-hover:opacity-100 sm:max-h-20"
              />
            );
            return (
              <div
                key={partner.src}
                className="group relative flex h-24 w-full max-w-[220px] items-center justify-center px-4"
              >
                {partner.url ? (
                  <a href={partner.url} target="_blank" rel="noopener noreferrer">
                    {image}
                  </a>
                ) : (
                  image
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
