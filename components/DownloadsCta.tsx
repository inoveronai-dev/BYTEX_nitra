import Link from "next/link";
import Reveal from "@/components/Reveal";

export default function DownloadsCta() {
  return (
    <section
      id="na-stiahnutie"
      className="scroll-mt-24 border-y border-black/[0.06] bg-cream py-14 sm:py-16"
      aria-labelledby="downloads-cta-heading"
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <Reveal>
          <div className="flex flex-col gap-7 md:flex-row md:items-center md:justify-start md:gap-14 lg:gap-16">
            <div className="max-w-xl lg:max-w-2xl">
              <p className="section-eyebrow">
                NA STIAHNUTIE
              </p>
              <h2
                id="downloads-cta-heading"
                className="font-serif text-2xl font-light tracking-tight text-charcoal-deep sm:text-3xl"
              >
                Potrebujete stiahnuť dokumenty?
              </h2>
              <p className="mt-4 text-sm font-light leading-relaxed text-charcoal/70 sm:text-[0.95rem] sm:leading-[1.75]">
                Tu si môžete stiahnuť potrebné dokumenty na splnomocnenie osoby na
                schôdzy, dokumenty potrebné pri predaji bytu, pristúpenie k zmluve o
                výkone správy a vzor žiadosti na stavebné úpravy v byte.
              </p>
            </div>

            <Link
              href="/na-stiahnutie"
              className="group inline-flex min-h-12 shrink-0 items-center justify-center gap-2.5 self-start rounded-lg bg-gold px-6 py-3.5 text-[0.95rem] font-normal tracking-wide text-charcoal-deep transition-colors duration-300 hover:bg-gold-dark hover:text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40 focus-visible:ring-offset-2 sm:px-7 sm:text-base md:self-center"
            >
              Dokumenty na stiahnutie
              <span
                className="inline-block transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden
              >
                →
              </span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
