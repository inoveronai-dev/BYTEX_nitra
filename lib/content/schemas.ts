import { z } from "zod";

export const quoteSchema = z.object({
  text: z.string(),
  citation: z.string().optional(),
});

export const heroContentSchema = z.object({
  headlineLines: z.array(z.string()).min(1),
  imageSrc: z.string().min(1),
  changeManager: z.object({
    intro: z.string(),
    quotes: z.array(quoteSchema),
    downloadUrl: z.string().nullable(),
    downloadPath: z.string().nullable(),
    backgroundImagePath: z.string().nullable(),
  }),
});

export const aboutSchema = z.object({
  eyebrow: z.string(),
  heading: z.string(),
  body: z.string(),
});

export const benefitItemSchema = z.object({
  id: z.number(),
  body: z.string(),
  iconKey: z.string(),
  emphasize: z.boolean(),
  isActive: z.boolean(),
  sortOrder: z.number(),
});

export const serviceItemSchema = z.object({
  id: z.number(),
  title: z.string().min(1),
  description: z.string().min(1),
  imagePath: z.string().min(1),
  imageClassName: z.string().nullable(),
  imageOverlayClassName: z.string().nullable(),
  isActive: z.boolean(),
  sortOrder: z.number(),
});

export const revisionItemSchema = z.object({
  id: z.number(),
  title: z.string().min(1),
  frequency: z.string(),
  body: z.string(),
  isActive: z.boolean(),
  sortOrder: z.number(),
});

export const revisionsSchema = z.object({
  intro: z.string(),
  items: z.array(revisionItemSchema),
});

export const referenceItemSchema = z.object({
  id: z.number(),
  name: z.string().min(1),
  imagePath: z.string().min(1),
  isActive: z.boolean(),
  sortOrder: z.number(),
});

export const reconstructionItemSchema = z.object({
  id: z.number(),
  slug: z.string().min(1),
  title: z.string().min(1),
  yearStatus: z.string(),
  investment: z.string(),
  beforeImagePath: z.string().min(1),
  afterImagePath: z.string().min(1),
  beforeText: z.string(),
  afterText: z.string(),
  facts: z.array(z.string()),
  isActive: z.boolean(),
  sortOrder: z.number(),
});

export const partnerItemSchema = z.object({
  id: z.number(),
  name: z.string().min(1),
  logoPath: z.string().min(1),
  url: z.string().nullable(),
  isActive: z.boolean(),
  sortOrder: z.number(),
});

export const documentItemSchema = z.object({
  id: z.number(),
  title: z.string().min(1),
  filePath: z.string().nullable(),
  externalUrl: z.string().nullable(),
  mimeType: z.string().nullable(),
  fileExt: z.string().nullable(),
  isActive: z.boolean(),
  sortOrder: z.number(),
});

export const documentsSchema = z.object({
  intro: z.string(),
  items: z.array(documentItemSchema),
});

export const pricingPriceSchema = z.object({
  amount: z.string(),
  unit: z.string().optional(),
});

export const pricingItemSchema = z.object({
  title: z.string(),
  description: z.string(),
  prices: z.array(pricingPriceSchema),
});

export const pricingSectionSchema = z.object({
  id: z.string(),
  title: z.string(),
  note: z.string().optional(),
  items: z.array(pricingItemSchema),
});

export const pricingSchema = z.object({
  note: z.string(),
  sections: z.array(pricingSectionSchema),
});

export const contactItemSchema = z.object({
  id: z.number(),
  groupKey: z.enum(["emergency", "service_partner", "utility"]),
  name: z.string().min(1),
  details: z.string().nullable(),
  logoPath: z.string().nullable(),
  imageAlt: z.string().nullable(),
  websiteLabel: z.string().nullable(),
  websiteUrl: z.string().nullable(),
  contactsJson: z.string().min(2),
  isActive: z.boolean(),
  sortOrder: z.number(),
});

export const officeHourSchema = z.object({
  day: z.string(),
  timeText: z.string(),
  isOpen: z.boolean(),
  sortOrder: z.number(),
});

export const contactPageSchema = z.object({
  contact: z.object({
    person: z.string(),
    email: z.string(),
    phone: z.string(),
    phoneHref: z.string(),
    addressLine1: z.string(),
    addressLine2: z.string(),
    facebookUrl: z.string(),
    instagramUrl: z.string(),
    mapEmbedUrl: z.string(),
    clientCentreIntro: z.string(),
    formIntroBeforeEmail: z.string(),
    formIntroAfterEmail: z.string(),
  }),
  hours: z.array(officeHourSchema),
  settings: z.object({
    companyName: z.string(),
    ico: z.string(),
    dic: z.string(),
    copyrightText: z.string(),
  }),
});

export const privacyItemSchema = z.object({
  id: z.number(),
  heading: z.string(),
  body: z.string(),
  isActive: z.boolean(),
  sortOrder: z.number(),
});
