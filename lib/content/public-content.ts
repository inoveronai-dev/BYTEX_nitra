/**
 * Static public website content snapshot for Vercel (and CMS_STORAGE_MODE=static).
 * Source of truth: approved BYTEX content (same as current seeded CMS).
 * Image paths point at committed /public assets — never data/uploads.
 */
import type { PublicSiteContent } from "./types";

export const publicSiteContent: PublicSiteContent = {
  "hero": {
    "headlineLines": [
      "Individuálny prístup",
      "k bytovým domom"
    ],
    "imageSrc": "/hero-bytex.jpg"
  },
  "about": {
    "eyebrow": "O nás",
    "heading": "Poslanie spoločnosti",
    "body": "Sme správcovská spoločnosť zameraná na správu bytových domov v Nitre. Bezprostredným podnetom k vzniku spoločnosti boli impulzy a myšlienky individuálneho prístupu k bytovým domom, pričom hlavným cieľom našich činností je komplexný komfort pre každého koncového užívateľa."
  },
  "benefits": [
    {
      "body": "Seriózne a ústretové jednanie so všetkými vlastníkmi objektov - po dohode aj vo vlastnom bytovom dome.",
      "iconKey": "message",
      "emphasize": false
    },
    {
      "body": "Pracujeme pre Vás nonstop 24 hodín denne a 7 dní v týždni.",
      "iconKey": "clock",
      "emphasize": false
    },
    {
      "body": "Úzka spolupráca s vlastníkmi bytov a spoločné prehodnocovanie potrebných investícií.",
      "iconKey": "users",
      "emphasize": false
    },
    {
      "body": "Sústavná starostlivosť o komfort bývania.",
      "iconKey": "home",
      "emphasize": false
    },
    {
      "body": "Pružnejšie a efektívnejšie vykonávanie jednotlivých opráv v dome odbornými pracovníkmi.",
      "iconKey": "wrench",
      "emphasize": false
    },
    {
      "body": "Predĺženie životnosti objektov pravidelnými kontrolami a z nich vyplývajúcimi údržbárskymi a servisnými prácami.",
      "iconKey": "shield",
      "emphasize": false
    },
    {
      "body": "Informovanosť, komunikácia, oznamy, tlačivá, elektronické hlasovanie cez platformu Resitech.",
      "iconKey": "device",
      "emphasize": true
    }
  ],
  "services": [
    {
      "title": "Ekonomická činnosť",
      "description": "Evidencia platieb a tvorba predpisov, upomínanie platieb v omeškaní, vedenie samostatného účtovníctva, založenie a vedenie bankových účtov pre jednotlivé objekty, ročné vyúčtovanie, poistenie nehnuteľnosti.",
      "image": "/service-1.jpg",
      "imageClassName": "object-left-bottom",
      "imageOverlayClassName": "bg-gradient-to-t from-[#111111]/25 via-transparent to-black/10"
    },
    {
      "title": "Technická činnosť",
      "description": "Starostlivosť o stavebný a technický stav budov, periodické revízie, zabezpečenie projektových prác, inžinierskej činnosti a energetických certifikátov, zostavovanie ročných plánov opráv.",
      "image": "/service-2-tech-v2.jpg",
      "imageClassName": "object-center",
      "imageOverlayClassName": "bg-gradient-to-t from-[#111111]/40 via-transparent to-transparent"
    },
    {
      "title": "Prevádzková činnosť",
      "description": "Kontrola nad všetkými prevádzkovými procesmi, s ktorými sa vlastníci denne priamo stretávajú. Zabezpečenie všetkých služieb spojených s prevádzkou bytových domov (upratovanie, dodávka tepla, TÚV, studenej vody, plynu, elektriny, odvoz a likvidácia odpadu, dezinfekcia, dezinsekcia, deratizácia).",
      "image": "/service-3.jpg",
      "imageClassName": null,
      "imageOverlayClassName": null
    },
    {
      "title": "Havarijná služba",
      "description": "Štandardne poskytovaná služba bez poplatku na bytovú jednotku. Službu zabezpečujú a vykonávajú externé spoločnosti s najvýhodnejšou cenou. Zásah vo sfére spoločných častí a spoločných zariadení bytového domu je hradený z fondu opráv a zásah v byte a týkajúci sa výlučne bytu je hradený vlastníkom bytu.",
      "image": "/service-4.jpg",
      "imageClassName": null,
      "imageOverlayClassName": null
    },
    {
      "title": "Právna činnosť",
      "description": "Informovanie vlastníkov o aktuálnych zmenách zákonov týkajúcich sa prevádzky objektu, vymáhanie nedoplatkov a zabezpečenie dobrovoľných dražieb, dozor nad užívaním nehnuteľnosti v súlade so zákonom.",
      "image": "/service-5.jpg",
      "imageClassName": null,
      "imageOverlayClassName": null
    },
    {
      "title": "Upratovacia činnosť",
      "description": "Ako správca bytových domov spolupracujeme s upratovacou firmou UP Cleaning prostredníctvom ktorej Vám vieme zabezpečiť upratovanie spoločných priestorov v bytovom dome za výhodné ceny.",
      "image": "/service-6.jpg",
      "imageClassName": null,
      "imageOverlayClassName": null
    }
  ],
  "revisions": {
    "intro": "V bytových domoch sa nachádzajú aj spoločné zariadenia (§ 2 ods. 5 zákona č. 182/1993 Z. z.), ktoré si z hľadiska bezpečnosti, prevádzkyschopnosti alebo spoľahlivosti vyžadujú vykonávanie pravidelných odborných prehliadok, revízií, skúšok a overovaní:",
    "items": [
      {
        "id": 1,
        "title": "Rozvody elektroinštalácie",
        "frequency": "5 rokov",
        "body": "Vykonávajú sa každých 5 rokov, v mokrom prostredí (napr. práčovne) každý rok."
      },
      {
        "id": 2,
        "title": "Sústava bleskozvodov",
        "frequency": "4 roky / 2 roky",
        "body": "Vykonávajú sa každé 4 roky, prípadne každé 2 roky, podľa úrovni ochrany."
      },
      {
        "id": 3,
        "title": "Plynové rozvody",
        "frequency": "1 rok / 3 roky",
        "body": "Každý rok sa musí uskutočniť kontrola hlavného prívodu plynu až po stúpací rozvod, každé 3 roky sa musí uskutočniť odborná prehliadka plynových rozvodov, pri ktorej sa kontroluje a meria prípadný únik plynu."
      },
      {
        "id": 4,
        "title": "Hydranty a hasiace prístroje",
        "frequency": "1 rok",
        "body": "Kontrola funkčnosti hasiacich prístrojov a hydrantov, úplnosť ich vybavenia a tlaková skúška hydrantov sa vykonáva každý rok."
      },
      {
        "id": 5,
        "title": "Požiarna ochrana",
        "frequency": "1 rok",
        "body": "Vykonáva sa každý rok. Súčasťou takejto prehliadky je kontrola únikových ciest a východov, ktoré sa musia označovať a udržiavať trvalo voľné, ako aj prístup k uzáverom rozvodných zariadení elektrickej energie, plynu, vody, k požiarnotechnickým zariadeniam a požiarnym vodovodom."
      },
      {
        "id": 6,
        "title": "Komíny",
        "frequency": "1 rok / 2× ročne",
        "body": "Kontrola ich stavu, spôsobilosti a ich čistenie sa vykonáva taktiež každý rok, v niektorých prípadoch aj 2x ročne."
      },
      {
        "id": 7,
        "title": "Výťahy",
        "frequency": "3 mesiace / 3 roky / 6 rokov",
        "body": "Odborné prehliadky každé 3 mesiace, opakované odborné záťažové skúšky každé 3 roky, opakované úradné skúšky každých 6 rokov."
      },
      {
        "id": 8,
        "title": "Vodomer studená voda",
        "frequency": "5 rokov",
        "body": "Pri vodomeroch na studenú vodu príslušná právna úprava (zákon č. 142/2000 Z. z. o metrológii ukladá povinnosť vykonávať opakované overovania a repasáciu meradiel každých 5 rokov."
      },
      {
        "id": 9,
        "title": "Vodomer teplá voda",
        "frequency": "5 rokov",
        "body": "Na vodomery na teplú vodu sa vzťahujú ustanovenia jednak zákona o tepelnej energetike č. 657/2004 Z. z. tak aj zákona o metrológii, ktoré ukladajú povinnosť vykonávať opakované overovania a repasáciu meradiel každých 5 rokov."
      }
    ]
  },
  "references": [
    {
      "name": "Ďurčanského 934/18, Nitra",
      "image": "/ref-1.jpg"
    },
    {
      "name": "SVB Mikovíniho 18 a 20",
      "image": "/ref-2.jpg"
    },
    {
      "name": "Beethovenova 450/2 - 4, Nitra",
      "image": "/ref-3.jpg"
    },
    {
      "name": "Hlohovecká 826/1, Lužianky",
      "image": "/ref-4.jpg"
    },
    {
      "name": "Jurkovičova 385/1, Nitra",
      "image": "/ref-5.jpg"
    },
    {
      "name": "Za Humnami 511/2, Veľký Cetín",
      "image": "/ref-6.jpg"
    }
  ],
  "reconstructions": [
    {
      "id": "hlohovecka",
      "title": "Hlohovecká 1, Lužianky",
      "beforeImage": "/reconstructions/hlohovecka-pred.jpeg",
      "afterImage": "/reconstructions/hlohovecka-po.jpeg",
      "beforeText": "Bytový dom pred komplexnou rekonštrukciou 2025. Zhotoviteľ: fasáda a pivnice BYTEX Nitra,s.r.o., strecha DEPEX,s.r.o., okná a dvere TERMOWIN,s.r.o., bleskozvod projekt REXEL,s.r.o., a realizácia Branislav Borza, vodovodná prípojka Ing. Jozef Vyskoč EKOSTAVING.",
      "afterText": "Bytový dom po rekonštrukcii 2025. Zateplenie a výmena krytiny strechy, projektovanie a výmena bleskozvodu, renovácia fasády, zateplenie pivníc, vymaľovanie spoločných priestorov, výmena vchodových dverí a pivničných okien a nakoniec nová vodovodná prípojka. Celková investícia 50 000€.",
      "facts": [
        "2025",
        "Celková investícia 50 000 €"
      ],
      "yearStatus": "2025",
      "investment": "Celková investícia 50 000 €"
    },
    {
      "id": "za-humnami",
      "title": "Za Humnami 2, Veľký Cetín",
      "beforeImage": "/reconstructions/za-humnami-pred.jpeg",
      "afterImage": "/reconstructions/za-humnami-po.jpeg",
      "beforeText": "Bytový dom pred komplexnou rekonštrukciou 2025. Zhotoviteľ: zateplenie fasády, omietky schodisko BYTEX Nitra SERVIS,s.r.o., pivničné okná Vladimír Čaplák, bleskozvod projekt REXEL,s.r.o. a realizácia Branislav Borza.",
      "afterText": "Bytový dom po rekonštrukcii 2025. Zateplenie fasády, rekonštrukcia interiéru schodiska, projektovanie a výmena bleskozvodu a elektroinštalácie, výmena pivničných okien. Celková investícia 50 000€.",
      "facts": [
        "2025",
        "Celková investícia 50 000 €"
      ],
      "yearStatus": "2025",
      "investment": "Celková investícia 50 000 €"
    },
    {
      "id": "mikoviniho",
      "title": "Mikovíniho 18 a 20, Nitra",
      "beforeImage": "/reconstructions/mikoviniho-pred.jpeg",
      "afterImage": "/reconstructions/mikoviniho-po.jpeg",
      "beforeText": "Bytový dom pred komplexnou rekonštrukciou 2025. Zhotoviteľ: Umytie a premaľovanie fasády, nové závesné balkóny so striežkami SanaTOP,s.r.o., rekonštrukcia elektroištalácie stupačky EkoReko,s.r.o. Projekt realizovaný cez ŠFRB.",
      "afterText": "Bytový dom v procese rekonštrukcie. Termín ukončenia prác september 2025. Umytie a premaľovanie fasády, nové závesné hliníkové balkóny so striežkami a bočnicami, vý́mena napájacích rozvodov v stupačkách, vý́mena napájacích káblov do bytov, doplnenie núdzových svietidiel na schodiskách, doplnenie hlavného ističa v stupačkách a uzemnenie bytového domu. Celková investícia 295 000 €.",
      "facts": [
        "V procese rekonštrukcie",
        "Celková investícia 295 000 €"
      ],
      "yearStatus": "V procese rekonštrukcie",
      "investment": "Celková investícia 295 000 €"
    }
  ],
  "partners": [
    {
      "name": "Sana – profesionálne čistenie fasád",
      "src": "/partner-sana.png",
      "url": null,
      "alt": "Sana – profesionálne čistenie fasád"
    },
    {
      "name": "Resitech – digitálna platforma pre vlastníkov",
      "src": "/partner-resitech.png",
      "url": null,
      "alt": "Resitech – digitálna platforma pre vlastníkov"
    },
    {
      "name": "BYTEX Nitra SERVIS – servis bytových domov",
      "src": "/partner-bytex.png",
      "url": null,
      "alt": "BYTEX Nitra SERVIS – servis bytových domov"
    }
  ],
  "changeManager": {
    "intro": "Pokiaľ ste sa už definitívne rozhodli, že ďalšia zmluvná spolupráca s doterajším správcom už nie je za žiadnych okolností možná, je potrebné zmluvný vzťah ukončiť. Aj v tomto treba byť obozretný a postupovať v súlade jednak s uzatvorenou a stále platnou zmluvou o výkone správy a jednak s príslušnými ustanoveniami Zákona o bytoch. Z hľadiska Zákona o bytoch majte na pamäti nasledujúce ustanovenia:",
    "quotes": [
      {
        "text": "\"Vlastníci bytov a nebytových priestorov v dome uzatvoria so správcom písomnú zmluvu o výkone správy. Zmluva o výkone správy, jej zmena alebo jej zánik sa schvaľuje nadpolovičnou väčšinou hlasov všetkých vlastníkov bytov a nebytových priestorov v dome. Schválená zmluva o výkone správy alebo jej zmena, alebo jej zánik je záväzný pre všetkých vlastníkov bytov a nebytových priestorov v dome, ak je podpísaný nadpolovičnou väčšinou vlastníkov bytov a nebytových priestorov v dome a správcom. Správca je povinný schválenú zmluvu alebo jej zmenu doručiť každému vlastníkovi bytu a nebytového priestoru v dome. Na doručovanie sa vzťahuje osobitný predpis. 12e) Zmluva o výkone správy obsahuje najmä\"",
        "citation": "(§ 8a ods. 1 Zákona o bytoch)."
      },
      {
        "text": "\"Zmluva o výkone správy sa uzatvára so správcom písomne na neurčitý čas. Vlastníci bytov a nebytových priestorov v dome môžu vypovedať zmluvu o výkone správy len na základe rozhodnutia podľa § 14. Výpovedná lehota je tri mesiace, ak sa zmluvné strany v zmluve o výkone správy nedohodnú inak. Výpovedná lehota začína plynúť od prvého dňa kalendárneho mesiaca nasledujúceho po doručení výpovede.\"",
        "citation": "(§ 8a ods. 6 Zákona o bytoch)."
      },
      {
        "text": "\"Vlastník bytu alebo nebytového priestoru v dome má právo a povinnosť zúčastňovať sa na správe domu a hlasovaním rozhodovať ako spoluvlastník o spoločných častiach domu a spoločných zariadeniach domu, spoločných nebytových priestoroch, príslušenstve a pozemku na schôdzi vlastníkov. Oznámenie o schôdzi vlastníkov musí byť v písomnej forme doručené každému vlastníkovi bytu alebo nebytového priestoru v dome minimálne päť pracovných dní pred dňom konania schôdze. Výsledok hlasovania oznamuje ten, kto schôdzu vlastníkov alebo zhromaždenie zvolal, a to do piatich pracovných dní od konania schôdze vlastníkov alebo zhromaždenia spôsobom v dome obvyklým.\"",
        "citation": "(§ 14 ods. 1 Zákona o bytoch)."
      }
    ],
    "downloadHref": "https://d9651b25e0.clvaw-cdnwnd.com/751510981f5ea21da00aa9cb8de7515e/200000036-533e4533e7/%C5%BDiados%C5%A5%20o%20zvolanie%20sch%C3%B4dze%20vlastn%C3%ADkov_odvolanie.doc?ph=d9651b25e0",
    "backgroundImage": "/change-manager-bg.jpg"
  },
  "contactPage": {
    "contact": {
      "person": "PaedDr. Michal Hudec, PhD.",
      "email": "bytexnitra@gmail.com",
      "phone": "+421 907 615 135",
      "phoneHref": "tel:+421907615135",
      "addressLine1": "Jurkovičova 385/1, 949 11 Nitra",
      "addressLine2": "Zvonček 050, 11. poschodie",
      "facebookUrl": "https://www.facebook.com/profile.php?id=61556337906214",
      "instagramUrl": "https://www.instagram.com/bytex.nitra/?fbclid=IwAR2R9Dj4Br3B8hU6H4NV92IdCeWAaFBtK-RDpL0R50C-AOiAd5_RHCNvbVQ",
      "mapEmbedUrl": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976!2d18.068075!3d48.305988!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sJurkovi%C4%8Dova+385%2F1%2C+Nitra%2C+949+11!5e0!3m2!1ssk!2sSK!4v1791377097000",
      "clientCentreIntro": "Klientske centrum umožňuje klientom rýchle a jednoduché vybavenie požiadaviek spojených so správou bytových a nebytových priestorov na jednom mieste. Pracovník centra poskytne radu a pomoc, prípadne usmerní majiteľov bytov na ďalší postup na kompletné vybavenie Vašej žiadosti.",
      "formIntroBeforeEmail": "V prípade otázok nás môžete kontaktovať prostredníctvom emailu \"",
      "formIntroAfterEmail": "\" alebo vyplnením kontaktného formuláru."
    },
    "hours": [
      {
        "day": "Pondelok",
        "timeText": "Nestránkový deň",
        "isOpen": false,
        "sortOrder": 0
      },
      {
        "day": "Utorok",
        "timeText": "14:00 - 18:00",
        "isOpen": true,
        "sortOrder": 1
      },
      {
        "day": "Streda",
        "timeText": "Nestránkový deň",
        "isOpen": false,
        "sortOrder": 2
      },
      {
        "day": "Štvrtok",
        "timeText": "14:00 - 18:00",
        "isOpen": true,
        "sortOrder": 3
      },
      {
        "day": "Piatok",
        "timeText": "Nestránkový deň",
        "isOpen": false,
        "sortOrder": 4
      }
    ],
    "settings": {
      "companyName": "BYTEX Nitra, s.r.o.",
      "ico": "55 420 401",
      "dic": "2122045123",
      "copyrightText": "© 2026 BYTEX Nitra, s.r.o."
    }
  },
  "downloads": {
    "intro": "Tu si môžete stiahnuť potrebné dokumenty na splnomocnenie osoby na schôdzy, dokumenty potrebné pri predaji bytu, pristúpenie k zmluve o výkone správy a vzor žiadosti na stavebné úpravy v byte. Všetky žiadosti môžete zaslať podpísané a oskenované mailom na adresu bytexnitra@gmail.com alebo sa môžeme stretnúť osobne po telefonickom dohovore.",
    "documents": [
      {
        "title": "Splnomocnenie na zastupovanie vlastníka bytu na schôdzi",
        "href": "https://d9651b25e0.clvaw-cdnwnd.com/751510981f5ea21da00aa9cb8de7515e/200000033-7f44f7f452/Splnomocnenie%20vlastn%C3%ADka_sch%C3%B4dza.pdf?ph=d9651b25e0"
      },
      {
        "title": "Protokol o odovzdaní a prevzatí bytu do užívania",
        "href": "https://d9651b25e0.clvaw-cdnwnd.com/751510981f5ea21da00aa9cb8de7515e/200000050-3008030082/Protokol%20a%20odovzdan%C3%AD%20a%20prevzat%C3%AD%20bytu%20do%20u%C5%BE%C3%ADvania%20-2.pdf?ph=d9651b25e0"
      },
      {
        "title": "Tlačivo na odpočet vodomerov",
        "href": "https://d9651b25e0.clvaw-cdnwnd.com/751510981f5ea21da00aa9cb8de7515e/200000052-72bd072bd3/Odpo%C4%8Det%20vodomerov.pdf?ph=d9651b25e0"
      },
      {
        "title": "Oznámenie o pristúpení k zmluve o výkone správy",
        "href": "https://d9651b25e0.clvaw-cdnwnd.com/751510981f5ea21da00aa9cb8de7515e/200000041-cc724cc727/Ozn%C3%A1menie%20o%20prist%C3%BApen%C3%AD%20k%20zmluve%20o%20v%C3%BDkone%20spr%C3%A1vy.pdf?ph=d9651b25e0"
      },
      {
        "title": "Dohoda o splátkach",
        "href": "https://d9651b25e0.clvaw-cdnwnd.com/751510981f5ea21da00aa9cb8de7515e/200000035-1554d1554f/Dohoda%20o%20spl%C3%A1tkach.pdf?ph=d9651b25e0"
      },
      {
        "title": "Žiadosť o elektronické zasielanie",
        "href": "https://d9651b25e0.clvaw-cdnwnd.com/751510981f5ea21da00aa9cb8de7515e/200000051-7ad887ad8a/suhlas_so_zasielanim_dokumentov_formou_e_mailovej_spravy.pdf?ph=d9651b25e0"
      },
      {
        "title": "Žiadosť o stavebné úpravy",
        "href": "https://d9651b25e0.clvaw-cdnwnd.com/751510981f5ea21da00aa9cb8de7515e/200000034-bb199bb19c/ziadost_o_vydanie_predbezneho_suhlasu_na_stavebnu_upravu.pdf?ph=d9651b25e0"
      },
      {
        "title": "Oznámenie škodovej udalosti",
        "href": "https://d9651b25e0.clvaw-cdnwnd.com/751510981f5ea21da00aa9cb8de7515e/200000039-4bffe4c001/oznamenie_skodovej_udalosti_efc.pdf?ph=d9651b25e0"
      },
      {
        "title": "Objednávka na vykonanie opráv",
        "href": "https://d9651b25e0.clvaw-cdnwnd.com/751510981f5ea21da00aa9cb8de7515e/200000053-3626b3626d/Objedn%C3%A1vka%20na%20vykonanie%20opr%C3%A1v.pdf?ph=d9651b25e0"
      }
    ]
  },
  "pricing": {
    "note": "nie sme platcom DPH",
    "sections": [
      {
        "id": "odmena",
        "title": "ŠTANDARDNÁ ODMENA ZA VÝKON SPRÁVY",
        "note": "nie sme platcom DPH",
        "items": [
          {
            "title": "Správa bytového domu",
            "description": "Správcovský poplatok zahŕňa vedenie, správu úverového účtu a havarijnú službu.",
            "prices": [
              {
                "amount": "9 €",
                "unit": "1 byt/mesiac"
              }
            ]
          },
          {
            "title": "Vedenie a správa účtovníctva pre bytové domy a SVB",
            "description": "Spracovávanie zálohových platieb vlastníkov bytov, úhrady za služby a média, fond prevádzky, údržby a opráv, stavy meračov, počty osôb.",
            "prices": [
              {
                "amount": "6 €",
                "unit": "1 byt/mesiac"
              }
            ]
          },
          {
            "title": "Platforma Resitech",
            "description": "Komunikácia, elektronické hlasovanie, oznamy, dokumenty, tlačivá a iné.",
            "prices": [
              {
                "amount": "0,49 €",
                "unit": "1 byt/mesiac"
              }
            ]
          },
          {
            "title": "Vyúčtovanie a predpisy",
            "description": "Vyhotovenie vyúčtovania na 1 byt/rok.",
            "prices": [
              {
                "amount": "10 €"
              }
            ]
          },
          {
            "title": "Schôdza",
            "description": "Schôdza 1x ročne v zmysle zákona ZADARMO. Za zvolanie schôdze vlastníkov bytov a NP nad rámec zákona a účasť zástupcu správcu na nej v Bytovom dome na základe požiadavky zástupcu vlastníkov alebo zmluvného partnera domu.",
            "prices": [
              {
                "amount": "50 €"
              }
            ]
          }
        ]
      },
      {
        "id": "sluzba",
        "title": "SLUŽBA",
        "items": [
          {
            "title": "Potvrdenia",
            "description": "Vystavenie potvrdenia o veku domu, Vystavenie potvrdenia o vysporiadaní úhrad, Vystavenie potvrdenia na žiadosť vlastníka.",
            "prices": [
              {
                "amount": "10€"
              }
            ]
          },
          {
            "title": "Upomienky",
            "description": "Zaslanie upomienky, ak je evidovaný nedoplatok na mes. platbách - poštou",
            "prices": [
              {
                "amount": "SMS zadarmo"
              },
              {
                "amount": "Cena podľa aktuálneho poštovného"
              }
            ]
          },
          {
            "title": "Rozúčtovanie nákladov pri predaji bytu",
            "description": "Rozúčtovanie tepla, TÚV, SV podľa skutočnej spotreby za dané obdobie.",
            "prices": [
              {
                "amount": "40 €"
              }
            ]
          },
          {
            "title": "Zriadenie úveru",
            "description": "Poplatok za práce spojené so zriadením úveru pre bytový dom, 0,4 % z čerpanej sumy.",
            "prices": [
              {
                "amount": "min. 400 €"
              }
            ]
          },
          {
            "title": "Administratívne služby",
            "description": "Administratívne práce - kopírovanie a skenovanie dokumentov, vyhľadávanie dokumentov v archíve - každá začatá polhodina",
            "prices": [
              {
                "amount": "8 €"
              }
            ]
          },
          {
            "title": "Vypracovanie zmlúv",
            "description": "Spísanie zmluvy /výpožičky o nájme spoločných zariadení, častí domu a nebytových priestorov.",
            "prices": [
              {
                "amount": "15 €"
              }
            ]
          },
          {
            "title": "Konzultačná a poradenská činnosť",
            "description": "Konzultačná a poradenská činnosť napr. k vyúčtovania, predpisom a k iným činnostiam SVB (hodinová sadzba).",
            "prices": [
              {
                "amount": "20 €"
              }
            ]
          },
          {
            "title": "Iné služby",
            "description": "Iné činnosti nad rámec zmluvy - napr. technika a bežná údržba (hodinová sadzba).",
            "prices": [
              {
                "amount": "25 €"
              }
            ]
          },
          {
            "title": "Vypracovanie preberacieho protokolu",
            "description": "Poplatok za vypracovanie preberacieho protokolu pri zmene výkou správy BD alebo pri založení SVB.",
            "prices": [
              {
                "amount": "400€"
              }
            ]
          },
          {
            "title": "Doprava",
            "description": "Doprava v prípade potreby bytového domu.",
            "prices": [
              {
                "amount": "6 €/v rámci NR"
              },
              {
                "amount": "10€/mimo NR"
              }
            ]
          }
        ]
      },
      {
        "id": "havarijna",
        "title": "HAVARIJNÁ SLUŽBA",
        "items": [
          {
            "title": "Od 8:00 do 16:00",
            "description": "Hodinová sadzba za výkon havarijnej služby na jedného pracovníka za každú začatú hodinu v čase od 8:00 do 16:00.",
            "prices": [
              {
                "amount": "20 €"
              }
            ]
          },
          {
            "title": "Víkend a sviatok",
            "description": "Hodinová sadzba za výkon havarijnej služby na jedného pracovníka za každú začatú hodinu po prac. čase, So, Ne a vo sviatok.",
            "prices": [
              {
                "amount": "30 €"
              }
            ]
          },
          {
            "title": "Výjazd havarijnej služby",
            "description": "Doprava za každý výjazd samostatne.",
            "prices": [
              {
                "amount": "8 €"
              }
            ]
          }
        ]
      }
    ]
  },
  "privacy": [
    {
      "id": 1,
      "heading": "Kto spracúva Vaše osobné údaje a ako ho môžete kontaktovať?",
      "body": "Vaše osobné údaje spracúva spoločnosť BYTEX Nitra, s.r.o., ktorú môžete kontaktovať na adrese Jurkovičova 385/1, 949 01 Nitra alebo e-mailom na adrese bytexnitra@gmail.com"
    },
    {
      "id": 2,
      "heading": "Na aký účel budú spracúvané Vaše osobné údaje?",
      "body": "Vaše osobné údaje budeme spracúvať na účel vybavenia Vašej požiadavky, objednávky alebo podnetu, na účel plnenia zmluvy, na účel ochrany práv a právom chránených záujmov alebo na účel plnenia našich povinností. Ak ste nám udelili súhlas, Vaše osobné údaje môžu byť použité v súlade s udeleným súhlasom."
    },
    {
      "id": 3,
      "heading": "Čo nám umožňuje spracúvať Vaše osobné údaje?",
      "body": "Vaše osobné údaje nám umožňujú spracúvať právne predpisy, a to v prípade, ak je spracúvanie nevyhnutné na plnenie zmluvy uzatvorenej s Vami alebo aby sa na základe Vašej žiadosti vykonali opatrenia pred uzatvorením zmluvy, a tiež v prípade, ak je spracúvanie nevyhnutné na plnenie našich povinností. Ak ste nám udelili súhlas so spracúvaním Vašich osobných údajov, Vaše osobné údaje budú spracúvané na základe Vášho súhlasu. Vaše osobné údaje môžu byť tiež spracúvané z dôvodu oprávneného záujmu, ktorý môže súvisieť s ochranou práv alebo oprávnených záujmov."
    },
    {
      "id": 4,
      "heading": "Komu Vaše osobné údaje budeme poskytovať?",
      "body": "Vaše osobné údaje môžeme poskytnúť osobám, ktoré sa budú podieľať na ich spracúvaní a iným osobám alebo subjektom, ak to ustanovuje alebo umožňuje právny predpis."
    },
    {
      "id": 5,
      "heading": "Ako dlho budeme uchovávať Vaše osobné údaje?",
      "body": "Vaše osobné údaje budeme uchovávať počas doby, kým bude existovať naše oprávnenie alebo povinnosť ich spracúvať, najmä počas doby plnenia zmluvy, počas doby na uplatnenie právnych nárokov alebo počas doby, ktorú určuje právny predpis. Ak sa spracúvanie Vašich osobných údajov uskutočňuje iba na základe Vášho súhlasu, Vaše osobné údaje budeme spracúvať iba počas jeho trvania, pričom máte právo svoj súhlas kedykoľvek odvolať prostredníctvom našich kontaktných údajov."
    },
    {
      "id": 6,
      "heading": "Aké sú Vaše práva pri spracúvaní osobných údajov?",
      "body": "Medzi Vaše práva patrí právo požadovať od nás prístup k osobným údajom, ktoré sa Vás týkajú, právo na opravu osobných údajov, právo na vymazanie osobných údajov alebo právo na obmedzenie spracúvania osobných údajov, právo namietať spracúvanie osobných údajov a právo na prenosnosť osobných údajov. Ak sa domnievate, že došlo k porušeniu Vašich práv pri spracúvaní osobných údajov, môžete sa obrátiť na Úrad na ochranu osobných údajov Slovenskej republiky."
    },
    {
      "id": 7,
      "heading": "Je potrebné, aby ste nám Vaše osobné údaje poskytli?",
      "body": "Poskytovanie Vašich osobných údajov môže vyžadovať právny predpis, zmluva alebo uskutočnenie úkonov pred jej uzatvorením, prípadne splnenie iného účelu ich spracúvania, najmä vybavenie Vašej požiadavky, objednávky, podnetu, plnenie zmluvy alebo našej povinnosti. Ak má byť naplnený účel spracúvania, je nevyhnutné poskytnutie Vašich osobných údajov. Následkom neposkytnutia osobných údajov môže byť nemožnosť splnenia Vašej požiadavky, naplnenia účelu ich spracúvania, porušenie zmluvy alebo právneho predpisu. V prípade, ak by ste mali akékoľvek otázky ohľadne spracúvania Vašich osobných údajov alebo Vašich práv a povinností, neváhajte nás kontaktovať."
    }
  ],
  "importantContacts": [
    {
      "websiteLabel": null,
      "websiteUrl": null,
      "details": null,
      "logoPath": "/phones/bytex-havarijna.png",
      "logoSrc": "/phones/bytex-havarijna.png",
      "imageAlt": "Havarijná služba BYTEX Nitra, s.r.o",
      "isActive": true,
      "groupKey": "emergency",
      "name": "Havarijná služba BYTEX Nitra, s.r.o",
      "contactsJson": "{\"phone\":{\"label\":\"mobil:\",\"display\":\"0907 615 135\",\"href\":\"tel:+421907615135\"},\"email\":{\"label\":\"e-mail:\",\"display\":\"bytexnitra@gmail.com\",\"href\":\"mailto:bytexnitra@gmail.com\"}}",
      "contacts": {
        "phone": {
          "label": "mobil:",
          "display": "0907 615 135",
          "href": "tel:+421907615135"
        },
        "email": {
          "label": "e-mail:",
          "display": "bytexnitra@gmail.com",
          "href": "mailto:bytexnitra@gmail.com"
        }
      }
    },
    {
      "websiteLabel": null,
      "websiteUrl": null,
      "details": "IČO: 52988490",
      "logoPath": null,
      "logoSrc": null,
      "imageAlt": "GALLEX s. r. o. - Alex Gála",
      "isActive": true,
      "groupKey": "service_partner",
      "name": "GALLEX s. r. o. - Alex Gála",
      "contactsJson": "[{\"label\":\"Tel. č.\",\"phone\":{\"label\":\"Tel. č.\",\"display\":\"0950 329 710\",\"href\":\"tel:+421950329710\"}}]",
      "contacts": [
        {
          "label": "Tel. č.",
          "phone": {
            "label": "Tel. č.",
            "display": "0950 329 710",
            "href": "tel:+421950329710"
          }
        }
      ]
    },
    {
      "websiteLabel": "www.hodinovy-majster-nitra.sk",
      "websiteUrl": "https://www.hodinovy-majster-nitra.sk/",
      "details": null,
      "logoPath": null,
      "logoSrc": null,
      "imageAlt": "HODINOVÝ MAJSTER",
      "isActive": true,
      "groupKey": "service_partner",
      "name": "HODINOVÝ MAJSTER",
      "contactsJson": "[{\"text\":\"Peter Krajčír\",\"phone\":{\"label\":\"\",\"display\":\"0908 383 467\",\"href\":\"tel:+421908383467\"}},{\"text\":\"Andrej Kukla\",\"phone\":{\"label\":\"\",\"display\":\"0910 909 986\",\"href\":\"tel:+421910909986\"}}]",
      "contacts": [
        {
          "text": "Peter Krajčír",
          "phone": {
            "label": "",
            "display": "0908 383 467",
            "href": "tel:+421908383467"
          }
        },
        {
          "text": "Andrej Kukla",
          "phone": {
            "label": "",
            "display": "0910 909 986",
            "href": "tel:+421910909986"
          }
        }
      ]
    },
    {
      "websiteLabel": null,
      "websiteUrl": null,
      "details": "IČO 45438781",
      "logoPath": null,
      "logoSrc": null,
      "imageAlt": "INSTAL - Peter Kmeť",
      "isActive": true,
      "groupKey": "service_partner",
      "name": "INSTAL - Peter Kmeť",
      "contactsJson": "[{\"label\":\"Tel.č.\",\"phone\":{\"label\":\"Tel.č.\",\"display\":\"0948 377 388\",\"href\":\"tel:+421948377388\"}}]",
      "contacts": [
        {
          "label": "Tel.č.",
          "phone": {
            "label": "Tel.č.",
            "display": "0948 377 388",
            "href": "tel:+421948377388"
          }
        }
      ]
    },
    {
      "websiteLabel": null,
      "websiteUrl": null,
      "details": "IČO: 55031188",
      "logoPath": null,
      "logoSrc": null,
      "imageAlt": "EkoReko, s.r.o.",
      "isActive": true,
      "groupKey": "service_partner",
      "name": "EkoReko, s.r.o.",
      "contactsJson": "[{\"text\":\"Matúš Kováč\",\"phone\":{\"label\":\"Tel.č.\",\"display\":\"0911 886 455\",\"href\":\"tel:+421911886455\"}}]",
      "contacts": [
        {
          "text": "Matúš Kováč",
          "phone": {
            "label": "Tel.č.",
            "display": "0911 886 455",
            "href": "tel:+421911886455"
          }
        }
      ]
    },
    {
      "websiteLabel": null,
      "websiteUrl": null,
      "details": "IČO: 50995740",
      "logoPath": null,
      "logoSrc": null,
      "imageAlt": "Peter Janeba",
      "isActive": true,
      "groupKey": "service_partner",
      "name": "Peter Janeba",
      "contactsJson": "[{\"label\":\"Tel. č.\",\"phone\":{\"label\":\"Tel. č.\",\"display\":\"0908 167 422\",\"href\":\"tel:+421908167422\"}}]",
      "contacts": [
        {
          "label": "Tel. č.",
          "phone": {
            "label": "Tel. č.",
            "display": "0908 167 422",
            "href": "tel:+421908167422"
          }
        }
      ]
    },
    {
      "websiteLabel": "https://www.hodinovypomocnik.sk/",
      "websiteUrl": "https://www.hodinovypomocnik.sk/",
      "details": null,
      "logoPath": null,
      "logoSrc": null,
      "imageAlt": "HODINOVÝ POMOCNÍK",
      "isActive": true,
      "groupKey": "service_partner",
      "name": "HODINOVÝ POMOCNÍK",
      "contactsJson": "[{\"text\":\"Peter Fuska\",\"phone\":{\"label\":\"\",\"display\":\"0905530963\",\"href\":\"tel:+421905530963\"}}]",
      "contacts": [
        {
          "text": "Peter Fuska",
          "phone": {
            "label": "",
            "display": "0905530963",
            "href": "tel:+421905530963"
          }
        }
      ]
    },
    {
      "websiteLabel": null,
      "websiteUrl": null,
      "details": null,
      "logoPath": "/phones/techem.png",
      "logoSrc": "/phones/techem.png",
      "imageAlt": "TECHEM spol. s r. o",
      "isActive": true,
      "groupKey": "utility",
      "name": "TECHEM spol. s r. o",
      "contactsJson": "[{\"title\":\"SERVIS:\",\"lines\":[{\"label\":\"tel.č.:\",\"display\":\"+42135 6420 424\",\"href\":\"tel:+421356420424\"},{\"label\":\"mobil:\",\"display\":\"+421905 527 668\",\"href\":\"tel:+421905527668\"},{\"label\":\"e-mail:\",\"display\":\"techem@techem.sk\",\"href\":\"mailto:techem@techem.sk\"}]}]",
      "contacts": [
        {
          "title": "SERVIS:",
          "lines": [
            {
              "label": "tel.č.:",
              "display": "+42135 6420 424",
              "href": "tel:+421356420424"
            },
            {
              "label": "mobil:",
              "display": "+421905 527 668",
              "href": "tel:+421905527668"
            },
            {
              "label": "e-mail:",
              "display": "techem@techem.sk",
              "href": "mailto:techem@techem.sk"
            }
          ]
        }
      ]
    },
    {
      "websiteLabel": null,
      "websiteUrl": null,
      "details": null,
      "logoPath": "/phones/ista.png",
      "logoSrc": "/phones/ista.png",
      "imageAlt": "ISTA SLOVAKIA s.r.o.",
      "isActive": true,
      "groupKey": "utility",
      "name": "ISTA SLOVAKIA s.r.o.",
      "contactsJson": "[{\"title\":\"SERVIS:\",\"lines\":[{\"label\":\"\",\"display\":\"02/402 409 24\",\"href\":\"tel:+421240240924\"},{\"label\":\"email:\",\"display\":\"servis@ista.sk\",\"href\":\"mailto:servis@ista.sk\"}]},{\"title\":\"ODPOČTY:\",\"lines\":[{\"label\":\"\",\"display\":\"0905 253 814\",\"href\":\"tel:+421905253814\"},{\"label\":\"\",\"display\":\"odpocty@ista.sk\",\"href\":\"mailto:odpocty@ista.sk\"}]}]",
      "contacts": [
        {
          "title": "SERVIS:",
          "lines": [
            {
              "label": "",
              "display": "02/402 409 24",
              "href": "tel:+421240240924"
            },
            {
              "label": "email:",
              "display": "servis@ista.sk",
              "href": "mailto:servis@ista.sk"
            }
          ]
        },
        {
          "title": "ODPOČTY:",
          "lines": [
            {
              "label": "",
              "display": "0905 253 814",
              "href": "tel:+421905253814"
            },
            {
              "label": "",
              "display": "odpocty@ista.sk",
              "href": "mailto:odpocty@ista.sk"
            }
          ]
        }
      ]
    },
    {
      "websiteLabel": null,
      "websiteUrl": null,
      "details": null,
      "logoPath": "/phones/zse.png",
      "logoSrc": "/phones/zse.png",
      "imageAlt": "Západoslovenské elektrárne",
      "isActive": true,
      "groupKey": "utility",
      "name": "Západoslovenské elektrárne",
      "contactsJson": "[{\"title\":\"\",\"lines\":[{\"label\":\"Zákaznícka linka:\",\"display\":\"0850 111555\",\"href\":\"tel:+421850111555\"},{\"label\":\"Plyn:\",\"display\":\"0850 111727\",\"href\":\"tel:+421850111727\"},{\"label\":\"Elektrina:\",\"display\":\"0800 111567\",\"href\":\"tel:+421800111567\"}]}]",
      "contacts": [
        {
          "title": "",
          "lines": [
            {
              "label": "Zákaznícka linka:",
              "display": "0850 111555",
              "href": "tel:+421850111555"
            },
            {
              "label": "Plyn:",
              "display": "0850 111727",
              "href": "tel:+421850111727"
            },
            {
              "label": "Elektrina:",
              "display": "0800 111567",
              "href": "tel:+421800111567"
            }
          ]
        }
      ]
    },
    {
      "websiteLabel": null,
      "websiteUrl": null,
      "details": null,
      "logoPath": "/phones/spp.png",
      "logoSrc": "/phones/spp.png",
      "imageAlt": "Slovenský plynárenský priemysel, a. s.",
      "isActive": true,
      "groupKey": "utility",
      "name": "Slovenský plynárenský priemysel, a. s.",
      "contactsJson": "[{\"title\":\"\",\"lines\":[{\"label\":\"Zákaznícka linka:\",\"display\":\"0850 111363\",\"href\":\"tel:+421850111363\"},{\"label\":\"Plyn:\",\"display\":\"0850 111 727\",\"href\":\"tel:+421850111727\"},{\"label\":\"Elektrina:\",\"display\":\"0800 159000\",\"href\":\"tel:+421800159000\"}]}]",
      "contacts": [
        {
          "title": "",
          "lines": [
            {
              "label": "Zákaznícka linka:",
              "display": "0850 111363",
              "href": "tel:+421850111363"
            },
            {
              "label": "Plyn:",
              "display": "0850 111 727",
              "href": "tel:+421850111727"
            },
            {
              "label": "Elektrina:",
              "display": "0800 159000",
              "href": "tel:+421800159000"
            }
          ]
        }
      ]
    },
    {
      "websiteLabel": null,
      "websiteUrl": null,
      "details": null,
      "logoPath": "/phones/zsvs.png",
      "logoSrc": "/phones/zsvs.png",
      "imageAlt": "Západoslovenská vodárenská spoločnosť, a.s.",
      "isActive": true,
      "groupKey": "utility",
      "name": "Západoslovenská vodárenská spoločnosť, a.s.",
      "contactsJson": "[{\"title\":\"POHOTOVOSŤ\",\"lines\":[{\"label\":\"tel.č.:\",\"display\":\"+421 37 6949 336\",\"href\":\"tel:+421376949336\"},{\"label\":\"mobil:\",\"display\":\"+421 904 259 687\",\"href\":\"tel:+421904259687\"}]}]",
      "contacts": [
        {
          "title": "POHOTOVOSŤ",
          "lines": [
            {
              "label": "tel.č.:",
              "display": "+421 37 6949 336",
              "href": "tel:+421376949336"
            },
            {
              "label": "mobil:",
              "display": "+421 904 259 687",
              "href": "tel:+421904259687"
            }
          ]
        }
      ]
    },
    {
      "websiteLabel": null,
      "websiteUrl": null,
      "details": null,
      "logoPath": "/phones/nts.png",
      "logoSrc": "/phones/nts.png",
      "imageAlt": "Nitrianska teplárenská spoločnosť, a.s.",
      "isActive": true,
      "groupKey": "utility",
      "name": "Nitrianska teplárenská spoločnosť, a.s.",
      "contactsJson": "[{\"title\":\"NON STOP - PORUCHOVÁ SLUŽBA\",\"lines\":[{\"kind\":\"text\",\"text\":\"DISPEČING NTS, A.S. (24 HOD.)\"}]},{\"title\":\"\",\"lines\":[{\"label\":\"mobil:\",\"display\":\"+421 917 396 105\",\"href\":\"tel:+421917396105\"},{\"label\":\"tel. č.:\",\"display\":\"+421 37 692 3411\",\"href\":\"tel:+421376923411\"},{\"label\":\"e-mail:\",\"display\":\"dispecingctz@ntsas.sk\",\"href\":\"mailto:dispecingctz@ntsas.sk\"}]}]",
      "contacts": [
        {
          "title": "NON STOP - PORUCHOVÁ SLUŽBA",
          "lines": [
            {
              "kind": "text",
              "text": "DISPEČING NTS, A.S. (24 HOD.)"
            }
          ]
        },
        {
          "title": "",
          "lines": [
            {
              "label": "mobil:",
              "display": "+421 917 396 105",
              "href": "tel:+421917396105"
            },
            {
              "label": "tel. č.:",
              "display": "+421 37 692 3411",
              "href": "tel:+421376923411"
            },
            {
              "label": "e-mail:",
              "display": "dispecingctz@ntsas.sk",
              "href": "mailto:dispecingctz@ntsas.sk"
            }
          ]
        }
      ]
    }
  ]
};
