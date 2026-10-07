export type PriceLine = {
  amount: string;
  unit?: string;
};

export type PricingItem = {
  title: string;
  description: string;
  prices: PriceLine[];
};

export type PricingSection = {
  id: string;
  title: string;
  note?: string;
  items: PricingItem[];
};

export const pricingNote = "nie sme platcom DPH";

export const pricingSections: PricingSection[] = [
  {
    id: "odmena",
    title: "ŠTANDARDNÁ ODMENA ZA VÝKON SPRÁVY",
    note: "nie sme platcom DPH",
    items: [
      {
        title: "Správa bytového domu",
        description:
          "Správcovský poplatok zahŕňa vedenie, správu úverového účtu a havarijnú službu.",
        prices: [{ amount: "9 €", unit: "1 byt/mesiac" }],
      },
      {
        title: "Vedenie a správa účtovníctva pre bytové domy a SVB",
        description:
          "Spracovávanie zálohových platieb vlastníkov bytov, úhrady za služby a média, fond prevádzky, údržby a opráv, stavy meračov, počty osôb.",
        prices: [{ amount: "6 €", unit: "1 byt/mesiac" }],
      },
      {
        title: "Platforma Resitech",
        description:
          "Komunikácia, elektronické hlasovanie, oznamy, dokumenty, tlačivá a iné.",
        prices: [{ amount: "0,49 €", unit: "1 byt/mesiac" }],
      },
      {
        title: "Vyúčtovanie a predpisy",
        description: "Vyhotovenie vyúčtovania na 1 byt/rok.",
        prices: [{ amount: "10 €" }],
      },
      {
        title: "Schôdza",
        description:
          "Schôdza 1x ročne v zmysle zákona ZADARMO. Za zvolanie schôdze vlastníkov bytov a NP nad rámec zákona a účasť zástupcu správcu na nej v Bytovom dome na základe požiadavky zástupcu vlastníkov alebo zmluvného partnera domu.",
        prices: [{ amount: "50 €" }],
      },
    ],
  },
  {
    id: "sluzba",
    title: "SLUŽBA",
    items: [
      {
        title: "Potvrdenia",
        description:
          "Vystavenie potvrdenia o veku domu, Vystavenie potvrdenia o vysporiadaní úhrad, Vystavenie potvrdenia na žiadosť vlastníka.",
        prices: [{ amount: "10€" }],
      },
      {
        title: "Upomienky",
        description:
          "Zaslanie upomienky, ak je evidovaný nedoplatok na mes. platbách - poštou",
        prices: [{ amount: "SMS zadarmo" }, { amount: "Cena podľa aktuálneho poštovného" }],
      },
      {
        title: "Rozúčtovanie nákladov pri predaji bytu",
        description:
          "Rozúčtovanie tepla, TÚV, SV podľa skutočnej spotreby za dané obdobie.",
        prices: [{ amount: "40 €" }],
      },
      {
        title: "Zriadenie úveru",
        description:
          "Poplatok za práce spojené so zriadením úveru pre bytový dom, 0,4 % z čerpanej sumy.",
        prices: [{ amount: "min. 400 €" }],
      },
      {
        title: "Administratívne služby",
        description:
          "Administratívne práce - kopírovanie a skenovanie dokumentov, vyhľadávanie dokumentov v archíve - každá začatá polhodina",
        prices: [{ amount: "8 €" }],
      },
      {
        title: "Vypracovanie zmlúv",
        description:
          "Spísanie zmluvy /výpožičky o nájme spoločných zariadení, častí domu a nebytových priestorov.",
        prices: [{ amount: "15 €" }],
      },
      {
        title: "Konzultačná a poradenská činnosť",
        description:
          "Konzultačná a poradenská činnosť napr. k vyúčtovania, predpisom a k iným činnostiam SVB (hodinová sadzba).",
        prices: [{ amount: "20 €" }],
      },
      {
        title: "Iné služby",
        description:
          "Iné činnosti nad rámec zmluvy - napr. technika a bežná údržba (hodinová sadzba).",
        prices: [{ amount: "25 €" }],
      },
      {
        title: "Vypracovanie preberacieho protokolu",
        description:
          "Poplatok za vypracovanie preberacieho protokolu pri zmene výkou správy BD alebo pri založení SVB.",
        prices: [{ amount: "400€" }],
      },
      {
        title: "Doprava",
        description: "Doprava v prípade potreby bytového domu.",
        prices: [{ amount: "6 €/v rámci NR" }, { amount: "10€/mimo NR" }],
      },
    ],
  },
  {
    id: "havarijna",
    title: "HAVARIJNÁ SLUŽBA",
    items: [
      {
        title: "Od 8:00 do 16:00",
        description:
          "Hodinová sadzba za výkon havarijnej služby na jedného pracovníka za každú začatú hodinu v čase od 8:00 do 16:00.",
        prices: [{ amount: "20 €" }],
      },
      {
        title: "Víkend a sviatok",
        description:
          "Hodinová sadzba za výkon havarijnej služby na jedného pracovníka za každú začatú hodinu po prac. čase, So, Ne a vo sviatok.",
        prices: [{ amount: "30 €" }],
      },
      {
        title: "Výjazd havarijnej služby",
        description: "Doprava za každý výjazd samostatne.",
        prices: [{ amount: "8 €" }],
      },
    ],
  },
];
