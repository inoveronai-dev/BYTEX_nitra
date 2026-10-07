export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PhoneDirectory from "@/components/PhoneDirectory";
import Reveal from "@/components/Reveal";
import { getContactPage, getImportantContacts } from "@/lib/cms/queries";
import type { PartnerEntry, UtilityEntry } from "@/lib/phones";

export const metadata: Metadata = {
  title: "Dôležité telefónne čísla – BYTEX Nitra",
  description:
    "Havarijná služba BYTEX Nitra, servisní partneri a kontakty na dodávateľov energií a služieb.",
};

export default function ImportantPhonesPage() {
  const rows = getImportantContacts();
  const { settings } = getContactPage();

  const emergencyRow = rows.find((r) => r.groupKey === "emergency");
  const emergencyContact = emergencyRow
    ? {
        title: emergencyRow.name,
        image: emergencyRow.logoSrc || "/phones/bytex-havarijna.png",
        phone: (emergencyRow.contacts as { phone: { label: string; display: string; href: string } })
          .phone,
        email: (emergencyRow.contacts as { email: { label: string; display: string; href: string } })
          .email,
      }
    : null;

  const servicePartners = rows
    .filter((r) => r.groupKey === "service_partner")
    .map(
      (r) =>
        ({
          name: r.name,
          details: r.details || undefined,
          website:
            r.websiteUrl && r.websiteLabel
              ? { label: r.websiteLabel, href: r.websiteUrl }
              : undefined,
          contacts: r.contacts,
        }) as PartnerEntry
    );

  const utilityCompanies = rows
    .filter((r) => r.groupKey === "utility")
    .map(
      (r) =>
        ({
          name: r.name,
          image: r.logoSrc || "/phones/zse.png",
          imageAlt: r.imageAlt || r.name,
          groups: Array.isArray(r.contacts) ? r.contacts : [],
        }) as UtilityEntry
    );

  return (
    <>
      <Header />
      <main className="flex-1 pt-24 sm:pt-28">
        <section className="section-cream pb-20 sm:pb-24 lg:pb-28">
          <div className="mx-auto max-w-5xl px-6 sm:px-8">
            <Reveal>
              <p className="section-eyebrow">DÔLEŽITÉ TELEFÓNNE ČÍSLA</p>
              <h1 className="font-serif text-3xl font-light tracking-tight text-charcoal-deep sm:text-4xl lg:text-5xl">
                Dôležité telefónne čísla
              </h1>
            </Reveal>

            <PhoneDirectory
              emergencyContact={emergencyContact}
              servicePartners={servicePartners}
              utilityCompanies={utilityCompanies}
            />
          </div>
        </section>
      </main>
      <Footer settings={settings} />
    </>
  );
}
