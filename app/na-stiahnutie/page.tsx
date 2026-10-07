export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import DocumentList from "@/components/DocumentList";
import { getContactPage, getDownloads } from "@/lib/cms/queries";

export const metadata: Metadata = {
  title: "Na stiahnutie – BYTEX Nitra",
  description: "Dokumenty a tlačivá na stiahnutie od BYTEX Nitra.",
};

export default function DownloadsPage() {
  const data = getDownloads();
  const { settings } = getContactPage();

  return (
    <>
      <Header />
      <main className="flex-1 pt-24 sm:pt-28">
        <section className="section-cream pb-20 sm:pb-24 lg:pb-28">
          <div className="mx-auto max-w-3xl px-6 sm:px-8">
            <p className="section-eyebrow">Na stiahnutie</p>
            <h1 className="font-serif text-3xl font-light tracking-tight text-charcoal-deep sm:text-4xl">
              Dokumenty a tlačivá
            </h1>
            <p className="mt-6 text-sm font-light leading-relaxed text-charcoal/75 sm:text-[0.95rem] sm:leading-[1.8]">
              {data.intro}
            </p>
            <div className="mt-10">
              <DocumentList documents={data.documents} />
            </div>
          </div>
        </section>
      </main>
      <Footer settings={settings} />
    </>
  );
}
