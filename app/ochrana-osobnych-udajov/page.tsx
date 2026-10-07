import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Ochrana osobných údajov – BYTEX Nitra",
  description: "Zásady spracúvania osobných údajov spoločnosti BYTEX Nitra, s.r.o.",
};

const sections = [
  {
    heading: "Kto spracúva Vaše osobné údaje a ako ho môžete kontaktovať?",
    body: (
      <>
        Vaše osobné údaje spracúva spoločnosť BYTEX Nitra, s.r.o., ktorú môžete
        kontaktovať na adrese Jurkovičova 385/1, 949 01 Nitra alebo e-mailom na
        adrese{" "}
        <a
          href="mailto:bytexnitra@gmail.com"
          className="text-gold transition-colors duration-300 hover:text-gold-dark"
        >
          bytexnitra@gmail.com
        </a>
      </>
    ),
  },
  {
    heading: "Na aký účel budú spracúvané Vaše osobné údaje?",
    body: "Vaše osobné údaje budeme spracúvať na účel vybavenia Vašej požiadavky, objednávky alebo podnetu, na účel plnenia zmluvy, na účel ochrany práv a právom chránených záujmov alebo na účel plnenia našich povinností. Ak ste nám udelili súhlas, Vaše osobné údaje môžu byť použité v súlade s udeleným súhlasom.",
  },
  {
    heading: "Čo nám umožňuje spracúvať Vaše osobné údaje?",
    body: "Vaše osobné údaje nám umožňujú spracúvať právne predpisy, a to v prípade, ak je spracúvanie nevyhnutné na plnenie zmluvy uzatvorenej s Vami alebo aby sa na základe Vašej žiadosti vykonali opatrenia pred uzatvorením zmluvy, a tiež v prípade, ak je spracúvanie nevyhnutné na plnenie našich povinností. Ak ste nám udelili súhlas so spracúvaním Vašich osobných údajov, Vaše osobné údaje budú spracúvané na základe Vášho súhlasu. Vaše osobné údaje môžu byť tiež spracúvané z dôvodu oprávneného záujmu, ktorý môže súvisieť s ochranou práv alebo oprávnených záujmov.",
  },
  {
    heading: "Komu Vaše osobné údaje budeme poskytovať?",
    body: "Vaše osobné údaje môžeme poskytnúť osobám, ktoré sa budú podieľať na ich spracúvaní a iným osobám alebo subjektom, ak to ustanovuje alebo umožňuje právny predpis.",
  },
  {
    heading: "Ako dlho budeme uchovávať Vaše osobné údaje?",
    body: "Vaše osobné údaje budeme uchovávať počas doby, kým bude existovať naše oprávnenie alebo povinnosť ich spracúvať, najmä počas doby plnenia zmluvy, počas doby na uplatnenie právnych nárokov alebo počas doby, ktorú určuje právny predpis. Ak sa spracúvanie Vašich osobných údajov uskutočňuje iba na základe Vášho súhlasu, Vaše osobné údaje budeme spracúvať iba počas jeho trvania, pričom máte právo svoj súhlas kedykoľvek odvolať prostredníctvom našich kontaktných údajov.",
  },
  {
    heading: "Aké sú Vaše práva pri spracúvaní osobných údajov?",
    body: "Medzi Vaše práva patrí právo požadovať od nás prístup k osobným údajom, ktoré sa Vás týkajú, právo na opravu osobných údajov, právo na vymazanie osobných údajov alebo právo na obmedzenie spracúvania osobných údajov, právo namietať spracúvanie osobných údajov a právo na prenosnosť osobných údajov. Ak sa domnievate, že došlo k porušeniu Vašich práv pri spracúvaní osobných údajov, môžete sa obrátiť na Úrad na ochranu osobných údajov Slovenskej republiky.",
  },
  {
    heading: "Je potrebné, aby ste nám Vaše osobné údaje poskytli?",
    body: "Poskytovanie Vašich osobných údajov môže vyžadovať právny predpis, zmluva alebo uskutočnenie úkonov pred jej uzatvorením, prípadne splnenie iného účelu ich spracúvania, najmä vybavenie Vašej požiadavky, objednávky, podnetu, plnenie zmluvy alebo našej povinnosti. Ak má byť naplnený účel spracúvania, je nevyhnutné poskytnutie Vašich osobných údajov. Následkom neposkytnutia osobných údajov môže byť nemožnosť splnenia Vašej požiadavky, naplnenia účelu ich spracúvania, porušenie zmluvy alebo právneho predpisu. V prípade, ak by ste mali akékoľvek otázky ohľadne spracúvania Vašich osobných údajov alebo Vašich práv a povinností, neváhajte nás kontaktovať.",
  },
] as const;

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main className="flex-1 pt-24 sm:pt-28">
        <section className="section-cream pb-20 sm:pb-24 lg:pb-28">
          <div className="mx-auto max-w-3xl px-6 sm:px-8">
            <p className="section-eyebrow">
              OCHRANA OSOBNÝCH ÚDAJOV
            </p>
            <h1 className="font-serif text-3xl font-light tracking-tight text-charcoal-deep sm:text-4xl">
              Zásady spracúvania osobných údajov
            </h1>

            <h2 className="mt-10 text-xs font-light uppercase tracking-[0.22em] text-gold sm:mt-12">
              ZÁSADY SPRACÚVANIA OSOBNÝCH ÚDAJOV
            </h2>

            <div className="mt-10 space-y-10 sm:mt-12 sm:space-y-12">
              {sections.map((section) => (
                <section key={section.heading}>
                  <h3 className="text-base font-normal tracking-wide text-charcoal-deep sm:text-lg">
                    {section.heading}
                  </h3>
                  <p className="mt-3 text-sm font-light leading-relaxed text-charcoal/75 sm:text-[0.95rem] sm:leading-[1.85]">
                    {section.body}
                  </p>
                </section>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
