import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PricingRegister from "@/components/PricingRegister";
import Reveal from "@/components/Reveal";
import { pricingNote } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Cenník – BYTEX Nitra",
  description:
    "Cenník služieb správy bytových domov BYTEX Nitra – odmena za výkon správy, služby a havarijná služba.",
};

export default function PricingPage() {
  return (
    <>
      <Header />
      <main className="flex-1 pt-24 sm:pt-28">
        <section className="section-cream pb-20 sm:pb-24 lg:pb-28">
          <div className="mx-auto max-w-5xl px-6 sm:px-8">
            <Reveal>
              <p className="section-eyebrow">
                CENNÍK
              </p>
              <h1 className="font-serif text-3xl font-light tracking-tight text-charcoal-deep sm:text-4xl lg:text-5xl">
                Cenník
              </h1>
              <p className="mt-4 text-sm font-light tracking-wide text-charcoal/60 sm:text-[0.95rem]">
                {pricingNote}
              </p>
            </Reveal>

            <PricingRegister />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
