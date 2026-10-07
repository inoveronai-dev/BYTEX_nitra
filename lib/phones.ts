export type PhoneLink = {
  label: string;
  display: string;
  href: string;
};

export type EmailLink = {
  label: string;
  display: string;
  href: string;
};

export type PartnerEntry = {
  name: string;
  details?: string;
  website?: { label: string; href: string };
  contacts: Array<{ label?: string; phone: PhoneLink } | { text: string; phone: PhoneLink }>;
};

export type UtilityEntry = {
  name: string;
  image: string;
  imageAlt: string;
  groups: Array<{
    title: string;
    lines: Array<PhoneLink | EmailLink | { kind: "text"; text: string }>;
  }>;
};

export const emergencyContact = {
  title: "Havarijná služba BYTEX Nitra, s.r.o",
  image: "/phones/bytex-havarijna.png",
  phone: {
    label: "mobil:",
    display: "0907 615 135",
    href: "tel:+421907615135",
  },
  email: {
    label: "e-mail:",
    display: "bytexnitra@gmail.com",
    href: "mailto:bytexnitra@gmail.com",
  },
};

export const servicePartners: PartnerEntry[] = [
  {
    name: "GALLEX s. r. o. - Alex Gála",
    details: "IČO: 52988490",
    contacts: [
      {
        label: "Tel. č.",
        phone: { label: "Tel. č.", display: "0950 329 710", href: "tel:+421950329710" },
      },
    ],
  },
  {
    name: "HODINOVÝ MAJSTER",
    website: {
      label: "www.hodinovy-majster-nitra.sk",
      href: "https://www.hodinovy-majster-nitra.sk/",
    },
    contacts: [
      {
        text: "Peter Krajčír",
        phone: { label: "", display: "0908 383 467", href: "tel:+421908383467" },
      },
      {
        text: "Andrej Kukla",
        phone: { label: "", display: "0910 909 986", href: "tel:+421910909986" },
      },
    ],
  },
  {
    name: "INSTAL - Peter Kmeť",
    details: "IČO 45438781",
    contacts: [
      {
        label: "Tel.č.",
        phone: { label: "Tel.č.", display: "0948 377 388", href: "tel:+421948377388" },
      },
    ],
  },
  {
    name: "EkoReko, s.r.o.",
    details: "IČO: 55031188",
    contacts: [
      {
        text: "Matúš Kováč",
        phone: { label: "Tel.č.", display: "0911 886 455", href: "tel:+421911886455" },
      },
    ],
  },
  {
    name: "Peter Janeba",
    details: "IČO: 50995740",
    contacts: [
      {
        label: "Tel. č.",
        phone: { label: "Tel. č.", display: "0908 167 422", href: "tel:+421908167422" },
      },
    ],
  },
  {
    name: "HODINOVÝ POMOCNÍK",
    website: {
      label: "https://www.hodinovypomocnik.sk/",
      href: "https://www.hodinovypomocnik.sk/",
    },
    contacts: [
      {
        text: "Peter Fuska",
        phone: { label: "", display: "0905530963", href: "tel:+421905530963" },
      },
    ],
  },
];

export const utilityCompanies: UtilityEntry[] = [
  {
    name: "TECHEM spol. s r. o",
    image: "/phones/techem.png",
    imageAlt: "TECHEM spol. s r. o",
    groups: [
      {
        title: "SERVIS:",
        lines: [
          { label: "tel.č.:", display: "+42135 6420 424", href: "tel:+421356420424" },
          { label: "mobil:", display: "+421905 527 668", href: "tel:+421905527668" },
          { label: "e-mail:", display: "techem@techem.sk", href: "mailto:techem@techem.sk" },
        ],
      },
    ],
  },
  {
    name: "ISTA SLOVAKIA s.r.o.",
    image: "/phones/ista.png",
    imageAlt: "ISTA SLOVAKIA s.r.o.",
    groups: [
      {
        title: "SERVIS:",
        lines: [
          { label: "", display: "02/402 409 24", href: "tel:+421240240924" },
          { label: "email:", display: "servis@ista.sk", href: "mailto:servis@ista.sk" },
        ],
      },
      {
        title: "ODPOČTY:",
        lines: [
          { label: "", display: "0905 253 814", href: "tel:+421905253814" },
          { label: "", display: "odpocty@ista.sk", href: "mailto:odpocty@ista.sk" },
        ],
      },
    ],
  },
  {
    name: "Západoslovenské elektrárne",
    image: "/phones/zse.png",
    imageAlt: "Západoslovenské elektrárne",
    groups: [
      {
        title: "",
        lines: [
          { label: "Zákaznícka linka:", display: "0850 111555", href: "tel:+421850111555" },
          { label: "Plyn:", display: "0850 111727", href: "tel:+421850111727" },
          { label: "Elektrina:", display: "0800 111567", href: "tel:+421800111567" },
        ],
      },
    ],
  },
  {
    name: "Slovenský plynárenský priemysel, a. s.",
    image: "/phones/spp.png",
    imageAlt: "Slovenský plynárenský priemysel, a. s.",
    groups: [
      {
        title: "",
        lines: [
          { label: "Zákaznícka linka:", display: "0850 111363", href: "tel:+421850111363" },
          { label: "Plyn:", display: "0850 111 727", href: "tel:+421850111727" },
          { label: "Elektrina:", display: "0800 159000", href: "tel:+421800159000" },
        ],
      },
    ],
  },
  {
    name: "Západoslovenská vodárenská spoločnosť, a.s.",
    image: "/phones/zsvs.png",
    imageAlt: "Západoslovenská vodárenská spoločnosť, a.s.",
    groups: [
      {
        title: "POHOTOVOSŤ",
        lines: [
          { label: "tel.č.:", display: "+421 37 6949 336", href: "tel:+421376949336" },
          { label: "mobil:", display: "+421 904 259 687", href: "tel:+421904259687" },
        ],
      },
    ],
  },
  {
    name: "Nitrianska teplárenská spoločnosť, a.s.",
    image: "/phones/nts.png",
    imageAlt: "Nitrianska teplárenská spoločnosť, a.s.",
    groups: [
      {
        title: "NON STOP - PORUCHOVÁ SLUŽBA",
        lines: [{ kind: "text", text: "DISPEČING NTS, A.S. (24 HOD.)" }],
      },
      {
        title: "",
        lines: [
          { label: "mobil:", display: "+421 917 396 105", href: "tel:+421917396105" },
          { label: "tel. č.:", display: "+421 37 692 3411", href: "tel:+421376923411" },
          {
            label: "e-mail:",
            display: "dispecingctz@ntsas.sk",
            href: "mailto:dispecingctz@ntsas.sk",
          },
        ],
      },
    ],
  },
];
