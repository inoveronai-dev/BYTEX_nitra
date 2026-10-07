import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import DocumentList from "@/components/DocumentList";
import Reveal from "@/components/Reveal";
import { downloadsIntro } from "@/lib/downloads";

export const metadata: Metadata = {
  title: "Na stiahnutie – BYTEX Nitra",
  description:
    "Dokumenty na stiahnutie pre vlastníkov bytov – splnomocnenia, protokoly, tlačivá a žiadosti BYTEX Nitra.",
};

function IntroWithEmail({ text }: { text: string }) {
  const email = "bytexnitra@gmail.com";
  const parts = text.split(email);

  return (
    <p className="mt-6 max-w-3xl text-sm font-light leading-relaxed text-charcoal/75 sm:text-base sm:leading-[1.85]">
      {parts.map((part, index) => (
        <span key={index}>
          {part}
          {index < parts.length - 1 && (
            <a
              href="mailto:bytexnitra@gmail.com"
              className="text-gold transition-colors duration-300 hover:text-gold-dark"
            >
              {email}
            </a>
          )}
        </span>
      ))}
    </p>
  );
}

export default function DownloadsPage() {
  return (
    <>
      <Header />
      <main className="flex-1 pt-24 sm:pt-28">
        <section className="section-cream pb-20 sm:pb-24 lg:pb-28">
          <div className="mx-auto max-w-5xl px-6 sm:px-8">
            <Reveal>
              <p className="section-eyebrow">
                NA STIAHNUTIE
              </p>
              <h1 className="font-serif text-3xl font-light tracking-tight text-charcoal-deep sm:text-4xl lg:text-5xl">
                Na stiahnutie
              </h1>
              <IntroWithEmail text={downloadsIntro} />
            </Reveal>

            <DocumentList />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
