#!/usr/bin/env tsx
/**
 * Seeds SQLite with the current website content and copies images into data/uploads.
 */
import { eq } from "drizzle-orm";
import { getDb } from "../lib/db/client";
import { runMigrations } from "../lib/db/migrate";
import {
  aboutContent,
  benefits,
  changeManagerCta,
  contactInfo,
  documents,
  downloadsIntro,
  heroContent,
  importantContacts,
  officeHours,
  partners,
  pricingCategories,
  pricingItems,
  pricingNote,
  pricingPrices,
  privacySections,
  reconstructions,
  revisions,
  revisionsIntro,
  services,
  siteReferences,
  siteSettings,
} from "../lib/db/schema";
import { copyPublicAssetToUploads } from "../lib/uploads/storage";
import { downloadsIntro as downloadsIntroText, documents as seedDocs } from "../lib/downloads";
import { pricingNote as seedPricingNote, pricingSections } from "../lib/pricing";
import {
  emergencyContact,
  servicePartners,
  utilityCompanies,
} from "../lib/phones";

function clearContent() {
  const db = getDb();
  const tables = [
    pricingPrices,
    pricingItems,
    pricingCategories,
    pricingNote,
    documents,
    downloadsIntro,
    importantContacts,
    privacySections,
    reconstructions,
    siteReferences,
    partners,
    revisions,
    revisionsIntro,
    services,
    benefits,
    officeHours,
    contactInfo,
    siteSettings,
    changeManagerCta,
    aboutContent,
    heroContent,
  ];
  for (const t of tables) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    db.delete(t as any).run();
  }
}

function main() {
  runMigrations();
  clearContent();
  const db = getDb();

  const heroImage = copyPublicAssetToUploads("/hero-bytex.jpg", "hero", "hero-bytex.jpg");
  db.insert(heroContent)
    .values({
      headlineLinesJson: JSON.stringify(["Individuálny prístup", "k bytovým domom"]),
      imagePath: heroImage,
    })
    .run();

  db.insert(aboutContent)
    .values({
      eyebrow: "O nás",
      heading: "Poslanie spoločnosti",
      body: "Sme správcovská spoločnosť zameraná na správu bytových domov v Nitre. Bezprostredným podnetom k vzniku spoločnosti boli impulzy a myšlienky individuálneho prístupu k bytovým domom, pričom hlavným cieľom našich činností je komplexný komfort pre každého koncového užívateľa.",
    })
    .run();

  const benefitRows = [
    {
      body: "Seriózne a ústretové jednanie so všetkými vlastníkmi objektov - po dohode aj vo vlastnom bytovom dome.",
      iconKey: "message",
    },
    {
      body: "Pracujeme pre Vás nonstop 24 hodín denne a 7 dní v týždni.",
      iconKey: "clock",
    },
    {
      body: "Úzka spolupráca s vlastníkmi bytov a spoločné prehodnocovanie potrebných investícií.",
      iconKey: "users",
    },
    { body: "Sústavná starostlivosť o komfort bývania.", iconKey: "home" },
    {
      body: "Pružnejšie a efektívnejšie vykonávanie jednotlivých opráv v dome odbornými pracovníkmi.",
      iconKey: "wrench",
    },
    {
      body: "Predĺženie životnosti objektov pravidelnými kontrolami a z nich vyplývajúcimi údržbárskymi a servisnými prácami.",
      iconKey: "shield",
    },
    {
      body: "Informovanosť, komunikácia, oznamy, tlačivá, elektronické hlasovanie cez platformu Resitech.",
      iconKey: "device",
      emphasize: true,
    },
  ];
  benefitRows.forEach((b, i) => {
    db.insert(benefits)
      .values({
        body: b.body,
        iconKey: b.iconKey,
        emphasize: Boolean(b.emphasize),
        sortOrder: i,
        isActive: true,
      })
      .run();
  });

  const serviceSeed = [
    {
      title: "Ekonomická činnosť",
      description:
        "Evidencia platieb a tvorba predpisov, upomínanie platieb v omeškaní, vedenie samostatného účtovníctva, založenie a vedenie bankových účtov pre jednotlivé objekty, ročné vyúčtovanie, poistenie nehnuteľnosti.",
      file: "/service-1.jpg",
      imageClassName: "object-left-bottom",
      imageOverlayClassName: "bg-gradient-to-t from-[#111111]/25 via-transparent to-black/10",
    },
    {
      title: "Technická činnosť",
      description:
        "Starostlivosť o stavebný a technický stav budov, periodické revízie, zabezpečenie projektových prác, inžinierskej činnosti a energetických certifikátov, zostavovanie ročných plánov opráv.",
      file: "/service-2-tech-v2.jpg",
      imageClassName: "object-center",
      imageOverlayClassName: "bg-gradient-to-t from-[#111111]/40 via-transparent to-transparent",
    },
    {
      title: "Prevádzková činnosť",
      description:
        "Kontrola nad všetkými prevádzkovými procesmi, s ktorými sa vlastníci denne priamo stretávajú. Zabezpečenie všetkých služieb spojených s prevádzkou bytových domov (upratovanie, dodávka tepla, TÚV, studenej vody, plynu, elektriny, odvoz a likvidácia odpadu, dezinfekcia, dezinsekcia, deratizácia).",
      file: "/service-3.jpg",
    },
    {
      title: "Havarijná služba",
      description:
        "Štandardne poskytovaná služba bez poplatku na bytovú jednotku. Službu zabezpečujú a vykonávajú externé spoločnosti s najvýhodnejšou cenou. Zásah vo sfére spoločných častí a spoločných zariadení bytového domu je hradený z fondu opráv a zásah v byte a týkajúci sa výlučne bytu je hradený vlastníkom bytu.",
      file: "/service-4.jpg",
    },
    {
      title: "Právna činnosť",
      description:
        "Informovanie vlastníkov o aktuálnych zmenách zákonov týkajúcich sa prevádzky objektu, vymáhanie nedoplatkov a zabezpečenie dobrovoľných dražieb, dozor nad užívaním nehnuteľnosti v súlade so zákonom.",
      file: "/service-5.jpg",
    },
    {
      title: "Upratovacia činnosť",
      description:
        "Ako správca bytových domov spolupracujeme s upratovacou firmou UP Cleaning prostredníctvom ktorej Vám vieme zabezpečiť upratovanie spoločných priestorov v bytovom dome za výhodné ceny.",
      file: "/service-6.jpg",
    },
  ];

  serviceSeed.forEach((s, i) => {
    const imagePath = copyPublicAssetToUploads(s.file, "services");
    db.insert(services)
      .values({
        title: s.title,
        description: s.description,
        imagePath,
        imageClassName: s.imageClassName || null,
        imageOverlayClassName: s.imageOverlayClassName || null,
        sortOrder: i,
        isActive: true,
      })
      .run();
  });

  db.insert(revisionsIntro)
    .values({
      body: "V bytových domoch sa nachádzajú aj spoločné zariadenia (§ 2 ods. 5 zákona č. 182/1993 Z. z.), ktoré si z hľadiska bezpečnosti, prevádzkyschopnosti alebo spoľahlivosti vyžadujú vykonávanie pravidelných odborných prehliadok, revízií, skúšok a overovaní:",
    })
    .run();

  const revisionSeed = [
    ["Rozvody elektroinštalácie", "5 rokov", "Vykonávajú sa každých 5 rokov, v mokrom prostredí (napr. práčovne) každý rok."],
    ["Sústava bleskozvodov", "4 roky / 2 roky", "Vykonávajú sa každé 4 roky, prípadne každé 2 roky, podľa úrovni ochrany."],
    ["Plynové rozvody", "1 rok / 3 roky", "Každý rok sa musí uskutočniť kontrola hlavného prívodu plynu až po stúpací rozvod, každé 3 roky sa musí uskutočniť odborná prehliadka plynových rozvodov, pri ktorej sa kontroluje a meria prípadný únik plynu."],
    ["Hydranty a hasiace prístroje", "1 rok", "Kontrola funkčnosti hasiacich prístrojov a hydrantov, úplnosť ich vybavenia a tlaková skúška hydrantov sa vykonáva každý rok."],
    ["Požiarna ochrana", "1 rok", "Vykonáva sa každý rok. Súčasťou takejto prehliadky je kontrola únikových ciest a východov, ktoré sa musia označovať a udržiavať trvalo voľné, ako aj prístup k uzáverom rozvodných zariadení elektrickej energie, plynu, vody, k požiarnotechnickým zariadeniam a požiarnym vodovodom."],
    ["Komíny", "1 rok / 2× ročne", "Kontrola ich stavu, spôsobilosti a ich čistenie sa vykonáva taktiež každý rok, v niektorých prípadoch aj 2x ročne."],
    ["Výťahy", "3 mesiace / 3 roky / 6 rokov", "Odborné prehliadky každé 3 mesiace, opakované odborné záťažové skúšky každé 3 roky, opakované úradné skúšky každých 6 rokov."],
    ["Vodomer studená voda", "5 rokov", "Pri vodomeroch na studenú vodu príslušná právna úprava (zákon č. 142/2000 Z. z. o metrológii ukladá povinnosť vykonávať opakované overovania a repasáciu meradiel každých 5 rokov."],
    ["Vodomer teplá voda", "5 rokov", "Na vodomery na teplú vodu sa vzťahujú ustanovenia jednak zákona o tepelnej energetike č. 657/2004 Z. z. tak aj zákona o metrológii, ktoré ukladajú povinnosť vykonávať opakované overovania a repasáciu meradiel každých 5 rokov."],
  ] as const;

  revisionSeed.forEach(([title, frequency, body], i) => {
    db.insert(revisions).values({ title, frequency, body, sortOrder: i, isActive: true }).run();
  });

  for (let i = 1; i <= 6; i++) {
    const imagePath = copyPublicAssetToUploads(`/ref-${i}.jpg`, "references");
    db.insert(siteReferences)
      .values({ name: `Referencia ${i}`, imagePath, sortOrder: i - 1, isActive: true })
      .run();
  }

  // Fix reference names from References.tsx if available - use generic for now; seed will use actual names from file
  const refNames = [
    "Ďurčanského 934/18, Nitra",
    "SVB Mikovíniho 18 a 20",
    "Beethovenova 450/2 - 4, Nitra",
    "Hlohovecká 826/1, Lužianky",
    "Jurkovičova 385/1, Nitra",
    "Za Humnami 511/2, Veľký Cetín",
  ];
  const refs = db.select().from(siteReferences).all();
  refs.forEach((r, i) => {
    db.update(siteReferences)
      .set({ name: refNames[i] || r.name })
      .where(eq(siteReferences.id, r.id))
      .run();
  });

  const reconSeed = [
    {
      slug: "hlohovecka",
      title: "Hlohovecká 1, Lužianky",
      before: "/reconstructions/hlohovecka-pred.jpeg",
      after: "/reconstructions/hlohovecka-po.jpeg",
      beforeText:
        "Bytový dom pred komplexnou rekonštrukciou 2025. Zhotoviteľ: fasáda a pivnice BYTEX Nitra,s.r.o., strecha DEPEX,s.r.o., okná a dvere TERMOWIN,s.r.o., bleskozvod projekt REXEL,s.r.o., a realizácia Branislav Borza, vodovodná prípojka Ing. Jozef Vyskoč EKOSTAVING.",
      afterText:
        "Bytový dom po rekonštrukcii 2025. Zateplenie a výmena krytiny strechy, projektovanie a výmena bleskozvodu, renovácia fasády, zateplenie pivníc, vymaľovanie spoločných priestorov, výmena vchodových dverí a pivničných okien a nakoniec nová vodovodná prípojka. Celková investícia 50 000€.",
      facts: ["2025", "Celková investícia 50 000 €"],
      yearStatus: "2025",
      investment: "Celková investícia 50 000 €",
    },
    {
      slug: "za-humnami",
      title: "Za Humnami 2, Veľký Cetín",
      before: "/reconstructions/za-humnami-pred.jpeg",
      after: "/reconstructions/za-humnami-po.jpeg",
      beforeText:
        "Bytový dom pred komplexnou rekonštrukciou 2025. Zhotoviteľ: zateplenie fasády, omietky schodisko BYTEX Nitra SERVIS,s.r.o., pivničné okná Vladimír Čaplák, bleskozvod projekt REXEL,s.r.o. a realizácia Branislav Borza.",
      afterText:
        "Bytový dom po rekonštrukcii 2025. Zateplenie fasády, rekonštrukcia interiéru schodiska, projektovanie a výmena bleskozvodu a elektroinštalácie, výmena pivničných okien. Celková investícia 50 000€.",
      facts: ["2025", "Celková investícia 50 000 €"],
      yearStatus: "2025",
      investment: "Celková investícia 50 000 €",
    },
    {
      slug: "mikoviniho",
      title: "Mikovíniho 18 a 20, Nitra",
      before: "/reconstructions/mikoviniho-pred.jpeg",
      after: "/reconstructions/mikoviniho-po.jpeg",
      beforeText:
        "Bytový dom pred komplexnou rekonštrukciou 2025. Zhotoviteľ: Umytie a premaľovanie fasády, nové závesné balkóny so striežkami SanaTOP,s.r.o., rekonštrukcia elektroištalácie stupačky EkoReko,s.r.o. Projekt realizovaný cez ŠFRB.",
      afterText:
        "Bytový dom v procese rekonštrukcie. Termín ukončenia prác september 2025. Umytie a premaľovanie fasády, nové závesné hliníkové balkóny so striežkami a bočnicami, vý́mena napájacích rozvodov v stupačkách, vý́mena napájacích káblov do bytov, doplnenie núdzových svietidiel na schodiskách, doplnenie hlavného ističa v stupačkách a uzemnenie bytového domu. Celková investícia 295 000 €.",
      facts: ["V procese rekonštrukcie", "Celková investícia 295 000 €"],
      yearStatus: "V procese rekonštrukcie",
      investment: "Celková investícia 295 000 €",
    },
  ];

  reconSeed.forEach((p, i) => {
    db.insert(reconstructions)
      .values({
        slug: p.slug,
        title: p.title,
        yearStatus: p.yearStatus,
        investment: p.investment,
        beforeImagePath: copyPublicAssetToUploads(p.before, "reconstructions"),
        afterImagePath: copyPublicAssetToUploads(p.after, "reconstructions"),
        beforeText: p.beforeText,
        afterText: p.afterText,
        factsJson: JSON.stringify(p.facts),
        sortOrder: i,
        isActive: true,
      })
      .run();
  });

  const partnerSeed = [
    { file: "/partner-sana.png", name: "Sana – profesionálne čistenie fasád" },
    { file: "/partner-resitech.png", name: "Resitech – digitálna platforma pre vlastníkov" },
    { file: "/partner-bytex.png", name: "BYTEX Nitra SERVIS – servis bytových domov" },
  ];
  partnerSeed.forEach((p, i) => {
    try {
      const logoPath = copyPublicAssetToUploads(p.file, "partners");
      db.insert(partners)
        .values({ name: p.name, logoPath, url: null, sortOrder: i, isActive: true })
        .run();
    } catch (e) {
      console.warn("Partner asset missing:", p.file, e);
    }
  });

  db.insert(downloadsIntro).values({ body: downloadsIntroText }).run();
  seedDocs.forEach((d, i) => {
    db.insert(documents)
      .values({
        title: d.title,
        externalUrl: d.href,
        filePath: null,
        sortOrder: i,
        isActive: true,
      })
      .run();
  });

  db.insert(pricingNote).values({ note: seedPricingNote }).run();
  pricingSections.forEach((section, catIndex) => {
    const cat = db
      .insert(pricingCategories)
      .values({
        slug: section.id,
        title: section.title,
        note: section.note || null,
        sortOrder: catIndex,
        isActive: true,
      })
      .returning()
      .get();
    section.items.forEach((item, itemIndex) => {
      const inserted = db
        .insert(pricingItems)
        .values({
          categoryId: cat.id,
          title: item.title,
          description: item.description,
          sortOrder: itemIndex,
          isActive: true,
        })
        .returning()
        .get();
      item.prices.forEach((price, priceIndex) => {
        db.insert(pricingPrices)
          .values({
            itemId: inserted.id,
            amount: price.amount,
            unit: price.unit || null,
            sortOrder: priceIndex,
          })
          .run();
      });
    });
  });

  db.insert(importantContacts)
    .values({
      groupKey: "emergency",
      name: emergencyContact.title,
      logoPath: copyPublicAssetToUploads(emergencyContact.image, "contacts"),
      imageAlt: emergencyContact.title,
      contactsJson: JSON.stringify({
        phone: emergencyContact.phone,
        email: emergencyContact.email,
      }),
      sortOrder: 0,
      isActive: true,
    })
    .run();

  servicePartners.forEach((p, i) => {
    db.insert(importantContacts)
      .values({
        groupKey: "service_partner",
        name: p.name,
        details: p.details || null,
        websiteLabel: p.website?.label || null,
        websiteUrl: p.website?.href || null,
        contactsJson: JSON.stringify(p.contacts),
        sortOrder: i + 1,
        isActive: true,
      })
      .run();
  });

  utilityCompanies.forEach((u, i) => {
    db.insert(importantContacts)
      .values({
        groupKey: "utility",
        name: u.name,
        logoPath: copyPublicAssetToUploads(u.image, "contacts"),
        imageAlt: u.imageAlt,
        contactsJson: JSON.stringify(u.groups),
        sortOrder: 100 + i,
        isActive: true,
      })
      .run();
  });

  db.insert(contactInfo)
    .values({
      person: "PaedDr. Michal Hudec, PhD.",
      email: "bytexnitra@gmail.com",
      phone: "+421 907 615 135",
      phoneHref: "tel:+421907615135",
      addressLine1: "Jurkovičova 385/1, 949 11 Nitra",
      addressLine2: "Zvonček 050, 11. poschodie",
      facebookUrl: "https://www.facebook.com/profile.php?id=61556337906214",
      instagramUrl:
        "https://www.instagram.com/bytex.nitra/?fbclid=IwAR2R9Dj4Br3B8hU6H4NV92IdCeWAaFBtK-RDpL0R50C-AOiAd5_RHCNvbVQ",
      mapEmbedUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976!2d18.068075!3d48.305988!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sJurkovi%C4%8Dova+385%2F1%2C+Nitra%2C+949+11!5e0!3m2!1ssk!2sSK!4v1791377097000",
      clientCentreIntro:
        "Klientske centrum umožňuje klientom rýchle a jednoduché vybavenie požiadaviek spojených so správou bytových a nebytových priestorov na jednom mieste. Pracovník centra poskytne radu a pomoc, prípadne usmerní majiteľov bytov na ďalší postup na kompletné vybavenie Vašej žiadosti.",
      formIntroBeforeEmail: 'V prípade otázok nás môžete kontaktovať prostredníctvom emailu "',
      formIntroAfterEmail: '" alebo vyplnením kontaktného formuláru.',
    })
    .run();

  const hours = [
    ["Pondelok", "Nestránkový deň", false],
    ["Utorok", "14:00 - 18:00", true],
    ["Streda", "Nestránkový deň", false],
    ["Štvrtok", "14:00 - 18:00", true],
    ["Piatok", "Nestránkový deň", false],
  ] as const;
  hours.forEach(([day, timeText, isOpen], i) => {
    db.insert(officeHours).values({ day, timeText, isOpen, sortOrder: i }).run();
  });

  db.insert(siteSettings)
    .values({
      companyName: "BYTEX Nitra, s.r.o.",
      ico: "55 420 401",
      dic: "2122045123",
      copyrightText: "© 2026 BYTEX Nitra, s.r.o.",
    })
    .run();

  const bg = copyPublicAssetToUploads("/change-manager-bg.jpg", "general");
  db.insert(changeManagerCta)
    .values({
      intro:
        "Pokiaľ ste sa už definitívne rozhodli, že ďalšia zmluvná spolupráca s doterajším správcom už nie je za žiadnych okolností možná, je potrebné zmluvný vzťah ukončiť. Aj v tomto treba byť obozretný a postupovať v súlade jednak s uzatvorenou a stále platnou zmluvou o výkone správy a jednak s príslušnými ustanoveniami Zákona o bytoch. Z hľadiska Zákona o bytoch majte na pamäti nasledujúce ustanovenia:",
      quotesJson: JSON.stringify([
        {
          text: '"Vlastníci bytov a nebytových priestorov v dome uzatvoria so správcom písomnú zmluvu o výkone správy. Zmluva o výkone správy, jej zmena alebo jej zánik sa schvaľuje nadpolovičnou väčšinou hlasov všetkých vlastníkov bytov a nebytových priestorov v dome. Schválená zmluva o výkone správy alebo jej zmena, alebo jej zánik je záväzný pre všetkých vlastníkov bytov a nebytových priestorov v dome, ak je podpísaný nadpolovičnou väčšinou vlastníkov bytov a nebytových priestorov v dome a správcom. Správca je povinný schválenú zmluvu alebo jej zmenu doručiť každému vlastníkovi bytu a nebytového priestoru v dome. Na doručovanie sa vzťahuje osobitný predpis. 12e) Zmluva o výkone správy obsahuje najmä"',
          citation: "(§ 8a ods. 1 Zákona o bytoch).",
        },
        {
          text: '"Zmluva o výkone správy sa uzatvára so správcom písomne na neurčitý čas. Vlastníci bytov a nebytových priestorov v dome môžu vypovedať zmluvu o výkone správy len na základe rozhodnutia podľa § 14. Výpovedná lehota je tri mesiace, ak sa zmluvné strany v zmluve o výkone správy nedohodnú inak. Výpovedná lehota začína plynúť od prvého dňa kalendárneho mesiaca nasledujúceho po doručení výpovede."',
          citation: "(§ 8a ods. 6 Zákona o bytoch).",
        },
        {
          text: '"Vlastník bytu alebo nebytového priestoru v dome má právo a povinnosť zúčastňovať sa na správe domu a hlasovaním rozhodovať ako spoluvlastník o spoločných častiach domu a spoločných zariadeniach domu, spoločných nebytových priestoroch, príslušenstve a pozemku na schôdzi vlastníkov. Oznámenie o schôdzi vlastníkov musí byť v písomnej forme doručené každému vlastníkovi bytu alebo nebytového priestoru v dome minimálne päť pracovných dní pred dňom konania schôdze. Výsledok hlasovania oznamuje ten, kto schôdzu vlastníkov alebo zhromaždenie zvolal, a to do piatich pracovných dní od konania schôdze vlastníkov alebo zhromaždenia spôsobom v dome obvyklým."',
          citation: "(§ 14 ods. 1 Zákona o bytoch).",
        },
      ]),
      downloadUrl:
        "https://d9651b25e0.clvaw-cdnwnd.com/751510981f5ea21da00aa9cb8de7515e/200000036-533e4533e7/%C5%BDiados%C5%A5%20o%20zvolanie%20sch%C3%B4dze%20vlastn%C3%ADkov_odvolanie.doc?ph=d9651b25e0",
      backgroundImagePath: bg,
    })
    .run();

  const privacy = [
    [
      "Kto spracúva Vaše osobné údaje a ako ho môžete kontaktovať?",
      "Vaše osobné údaje spracúva spoločnosť BYTEX Nitra, s.r.o., ktorú môžete kontaktovať na adrese Jurkovičova 385/1, 949 01 Nitra alebo e-mailom na adrese bytexnitra@gmail.com",
    ],
    [
      "Na aký účel budú spracúvané Vaše osobné údaje?",
      "Vaše osobné údaje budeme spracúvať na účel vybavenia Vašej požiadavky, objednávky alebo podnetu, na účel plnenia zmluvy, na účel ochrany práv a právom chránených záujmov alebo na účel plnenia našich povinností. Ak ste nám udelili súhlas, Vaše osobné údaje môžu byť použité v súlade s udeleným súhlasom.",
    ],
    [
      "Čo nám umožňuje spracúvať Vaše osobné údaje?",
      "Vaše osobné údaje nám umožňujú spracúvať právne predpisy, a to v prípade, ak je spracúvanie nevyhnutné na plnenie zmluvy uzatvorenej s Vami alebo aby sa na základe Vašej žiadosti vykonali opatrenia pred uzatvorením zmluvy, a tiež v prípade, ak je spracúvanie nevyhnutné na plnenie našich povinností. Ak ste nám udelili súhlas so spracúvaním Vašich osobných údajov, Vaše osobné údaje budú spracúvané na základe Vášho súhlasu. Vaše osobné údaje môžu byť tiež spracúvané z dôvodu oprávneného záujmu, ktorý môže súvisieť s ochranou práv alebo oprávnených záujmov.",
    ],
    [
      "Komu Vaše osobné údaje budeme poskytovať?",
      "Vaše osobné údaje môžeme poskytnúť osobám, ktoré sa budú podieľať na ich spracúvaní a iným osobám alebo subjektom, ak to ustanovuje alebo umožňuje právny predpis.",
    ],
    [
      "Ako dlho budeme uchovávať Vaše osobné údaje?",
      "Vaše osobné údaje budeme uchovávať počas doby, kým bude existovať naše oprávnenie alebo povinnosť ich spracúvať, najmä počas doby plnenia zmluvy, počas doby na uplatnenie právnych nárokov alebo počas doby, ktorú určuje právny predpis. Ak sa spracúvanie Vašich osobných údajov uskutočňuje iba na základe Vášho súhlasu, Vaše osobné údaje budeme spracúvať iba počas jeho trvania, pričom máte právo svoj súhlas kedykoľvek odvolať prostredníctvom našich kontaktných údajov.",
    ],
    [
      "Aké sú Vaše práva pri spracúvaní osobných údajov?",
      "Medzi Vaše práva patrí právo požadovať od nás prístup k osobným údajom, ktoré sa Vás týkajú, právo na opravu osobných údajov, právo na vymazanie osobných údajov alebo právo na obmedzenie spracúvania osobných údajov, právo namietať spracúvanie osobných údajov a právo na prenosnosť osobných údajov. Ak sa domnievate, že došlo k porušeniu Vašich práv pri spracúvaní osobných údajov, môžete sa obrátiť na Úrad na ochranu osobných údajov Slovenskej republiky.",
    ],
    [
      "Je potrebné, aby ste nám Vaše osobné údaje poskytli?",
      "Poskytovanie Vašich osobných údajov môže vyžadovať právny predpis, zmluva alebo uskutočnenie úkonov pred jej uzatvorením, prípadne splnenie iného účelu ich spracúvania, najmä vybavenie Vašej požiadavky, objednávky, podnetu, plnenie zmluvy alebo našej povinnosti. Ak má byť naplnený účel spracúvania, je nevyhnutné poskytnutie Vašich osobných údajov. Následkom neposkytnutia osobných údajov môže byť nemožnosť splnenia Vašej požiadavky, naplnenia účelu ich spracúvania, porušenie zmluvy alebo právneho predpisu. V prípade, ak by ste mali akékoľvek otázky ohľadne spracúvania Vašich osobných údajov alebo Vašich práv a povinností, neváhajte nás kontaktovať.",
    ],
  ] as const;

  privacy.forEach(([heading, body], i) => {
    db.insert(privacySections).values({ heading, body, sortOrder: i, isActive: true }).run();
  });

  console.log("CMS seed complete.");
}

main();
