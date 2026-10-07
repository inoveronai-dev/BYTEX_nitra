export type PublicHero = {
  headlineLines: string[];
  imageSrc: string;
};

export type PublicAbout = {
  eyebrow: string;
  heading: string;
  body: string;
};

export type PublicBenefit = {
  body: string;
  iconKey: string;
  emphasize?: boolean | null;
};

export type PublicService = {
  title: string;
  description: string;
  image: string;
  imageClassName?: string | null;
  imageOverlayClassName?: string | null;
};

export type PublicRevision = {
  id: number;
  title: string;
  frequency: string;
  body: string;
};

export type PublicReference = {
  name: string;
  image: string;
};

export type PublicReconstruction = {
  id: string;
  title: string;
  beforeImage: string;
  afterImage: string;
  beforeText: string;
  afterText: string;
  facts: string[];
  yearStatus: string;
  investment: string;
};

export type PublicPartner = {
  name: string;
  src: string;
  url: string | null;
  alt: string;
};

export type PublicChangeManager = {
  intro: string;
  quotes: Array<{ text: string; citation?: string }>;
  downloadHref: string;
  backgroundImage: string;
};

export type PublicContactInfo = {
  person: string;
  email: string;
  phone: string;
  phoneHref: string;
  addressLine1: string;
  addressLine2: string;
  facebookUrl: string;
  instagramUrl: string;
  mapEmbedUrl: string;
  clientCentreIntro: string;
  formIntroBeforeEmail: string;
  formIntroAfterEmail: string;
};

export type PublicOfficeHour = {
  day: string;
  timeText: string;
  isOpen: boolean;
  sortOrder: number;
};

export type PublicSiteSettings = {
  companyName: string;
  ico: string;
  dic: string;
  copyrightText: string;
};

export type PublicContactPage = {
  contact: PublicContactInfo;
  hours: PublicOfficeHour[];
  settings: PublicSiteSettings;
};

export type PublicDownloads = {
  intro: string;
  documents: Array<{ title: string; href: string }>;
};

export type PublicPricing = {
  note: string;
  sections: Array<{
    id: string;
    title: string;
    note?: string;
    items: Array<{
      title: string;
      description: string;
      prices: Array<{ amount: string; unit?: string }>;
    }>;
  }>;
};

export type PublicPrivacySection = {
  id: number;
  heading: string;
  body: string;
};

export type PublicImportantContact = {
  groupKey: string;
  name: string;
  details?: string | null;
  logoPath?: string | null;
  logoSrc?: string | null;
  imageAlt?: string | null;
  websiteLabel?: string | null;
  websiteUrl?: string | null;
  contactsJson: string;
  contacts: unknown;
  isActive?: boolean;
};

export type PublicSiteContent = {
  hero: PublicHero;
  about: PublicAbout;
  benefits: PublicBenefit[];
  services: PublicService[];
  revisions: { intro: string; items: PublicRevision[] };
  references: PublicReference[];
  reconstructions: PublicReconstruction[];
  partners: PublicPartner[];
  changeManager: PublicChangeManager;
  contactPage: PublicContactPage;
  downloads: PublicDownloads;
  pricing: PublicPricing;
  privacy: PublicPrivacySection[];
  importantContacts: PublicImportantContact[];
};
