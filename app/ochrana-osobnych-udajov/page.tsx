export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { getContactPage, getPrivacySections } from "@/lib/cms/queries";

export const metadata: Metadata = {
  title: "Ochrana osobných údajov – BYTEX Nitra",
  description: "Zásady spracúvania osobných údajov spoločnosti BYTEX Nitra, s.r.o.",
};

function linkifyEmail(text: string) {
  const parts = text.split(/(bytexnitra@gmail\.com)/g);
  return parts.map((part, i) =>
    part === "bytexnitra@gmail.com" ? (
      <a
        key={i}
        href="mailto:bytexnitra@gmail.com"
        className="text-gold transition-colors duration-300 hover:text-gold-dark"
      >
        {part}
      </a>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export default function PrivacyPolicyPage() {
  const sections = getPrivacySections();
  const { settings } = getContactPage();

  return (
    <>
      <Header />
      <main className="flex-1 pt-24 sm:pt-28">
        <section className="section-cream pb-20 sm:pb-24 lg:pb-28">
          <div className="mx-auto max-w-3xl px-6 sm:px-8">
            <p className="section-eyebrow">OCHRANA OSOBNÝCH ÚDAJOV</p>
            <h1 className="font-serif text-3xl font-light tracking-tight text-charcoal-deep sm:text-4xl">
              Zásady spracúvania osobných údajov
            </h1>

            <h2 className="mt-10 text-xs font-light uppercase tracking-[0.22em] text-gold sm:mt-12">
              ZÁSADY SPRACÚVANIA OSOBNÝCH ÚDAJOV
            </h2>

            <div className="mt-10 space-y-10 sm:mt-12 sm:space-y-12">
              {sections.map((section) => (
                <section key={section.id}>
                  <h3 className="text-base font-normal tracking-wide text-charcoal-deep sm:text-lg">
                    {section.heading}
                  </h3>
                  <p className="mt-3 text-sm font-light leading-relaxed text-charcoal/75 sm:text-[0.95rem] sm:leading-[1.85]">
                    {linkifyEmail(section.body)}
                  </p>
                </section>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer settings={settings} />
    </>
  );
}
