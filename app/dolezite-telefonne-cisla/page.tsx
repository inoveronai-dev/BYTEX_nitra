import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PhoneDirectory from "@/components/PhoneDirectory";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Dôležité telefónne čísla – BYTEX Nitra",
  description:
    "Havarijná služba BYTEX Nitra, servisní partneri a kontakty na dodávateľov energií a služieb.",
};

export default function ImportantPhonesPage() {
  return (
    <>
      <Header />
      <main className="flex-1 pt-24 sm:pt-28">
        <section className="section-cream pb-20 sm:pb-24 lg:pb-28">
          <div className="mx-auto max-w-5xl px-6 sm:px-8">
            <Reveal>
              <p className="section-eyebrow">
                DÔLEŽITÉ TELEFÓNNE ČÍSLA
              </p>
              <h1 className="font-serif text-3xl font-light tracking-tight text-charcoal-deep sm:text-4xl lg:text-5xl">
                Dôležité telefónne čísla
              </h1>
            </Reveal>

            <PhoneDirectory />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
