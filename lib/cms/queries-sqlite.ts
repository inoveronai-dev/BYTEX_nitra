import { asc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { runMigrations } from "@/lib/db/migrate";
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
} from "@/lib/db/schema";
import { mediaSrc } from "@/lib/cms/media";

function ensureDb() {
  runMigrations();
  return getDb();
}

export function getHero() {
  const row = ensureDb().select().from(heroContent).get();
  if (!row) return null;
  return {
    headlineLines: JSON.parse(row.headlineLinesJson) as string[],
    imageSrc: mediaSrc(row.imagePath || "/hero-bytex.jpg"),
  };
}

export function getAbout() {
  return ensureDb().select().from(aboutContent).get() || null;
}

export function getBenefits() {
  return ensureDb()
    .select()
    .from(benefits)
    .where(eq(benefits.isActive, true))
    .orderBy(asc(benefits.sortOrder))
    .all();
}

export function getServices() {
  return ensureDb()
    .select()
    .from(services)
    .where(eq(services.isActive, true))
    .orderBy(asc(services.sortOrder))
    .all()
    .map((s) => ({
      ...s,
      image: mediaSrc(s.imagePath),
    }));
}

export function getRevisions() {
  const db = ensureDb();
  return {
    intro: db.select().from(revisionsIntro).get()?.body || "",
    items: db
      .select()
      .from(revisions)
      .where(eq(revisions.isActive, true))
      .orderBy(asc(revisions.sortOrder))
      .all(),
  };
}

export function getReferences() {
  return ensureDb()
    .select()
    .from(siteReferences)
    .where(eq(siteReferences.isActive, true))
    .orderBy(asc(siteReferences.sortOrder))
    .all()
    .map((r) => ({
      name: r.name,
      image: mediaSrc(r.imagePath),
    }));
}

export function getReconstructions() {
  return ensureDb()
    .select()
    .from(reconstructions)
    .where(eq(reconstructions.isActive, true))
    .orderBy(asc(reconstructions.sortOrder))
    .all()
    .map((p) => ({
      id: p.slug,
      title: p.title,
      beforeImage: mediaSrc(p.beforeImagePath),
      afterImage: mediaSrc(p.afterImagePath),
      beforeText: p.beforeText,
      afterText: p.afterText,
      facts: JSON.parse(p.factsJson || "[]") as string[],
      yearStatus: p.yearStatus,
      investment: p.investment,
    }));
}

export function getPartners() {
  return ensureDb()
    .select()
    .from(partners)
    .where(eq(partners.isActive, true))
    .orderBy(asc(partners.sortOrder))
    .all()
    .map((p) => ({
      name: p.name,
      src: mediaSrc(p.logoPath),
      url: p.url,
      alt: p.name,
    }));
}

export function getDownloads() {
  const db = ensureDb();
  return {
    intro: db.select().from(downloadsIntro).get()?.body || "",
    documents: db
      .select()
      .from(documents)
      .where(eq(documents.isActive, true))
      .orderBy(asc(documents.sortOrder))
      .all()
      .map((d) => ({
        title: d.title,
        href: d.filePath ? mediaSrc(d.filePath) : d.externalUrl || "#",
      })),
  };
}

export function getPricing() {
  const db = ensureDb();
  const note = db.select().from(pricingNote).get()?.note || "";
  const categories = db
    .select()
    .from(pricingCategories)
    .where(eq(pricingCategories.isActive, true))
    .orderBy(asc(pricingCategories.sortOrder))
    .all();
  const items = db
    .select()
    .from(pricingItems)
    .where(eq(pricingItems.isActive, true))
    .orderBy(asc(pricingItems.sortOrder))
    .all();
  const prices = db.select().from(pricingPrices).orderBy(asc(pricingPrices.sortOrder)).all();

  return {
    note,
    sections: categories.map((c) => ({
      id: c.slug,
      title: c.title,
      note: c.note || undefined,
      items: items
        .filter((i) => i.categoryId === c.id)
        .map((i) => ({
          title: i.title,
          description: i.description,
          prices: prices
            .filter((p) => p.itemId === i.id)
            .map((p) => ({ amount: p.amount, unit: p.unit || undefined })),
        })),
    })),
  };
}

export function getImportantContacts() {
  const rows = ensureDb()
    .select()
    .from(importantContacts)
    .where(eq(importantContacts.isActive, true))
    .orderBy(asc(importantContacts.sortOrder))
    .all();

  return rows.map((r) => ({
    ...r,
    logoSrc: r.logoPath ? mediaSrc(r.logoPath) : null,
    contacts: JSON.parse(r.contactsJson || "[]"),
  }));
}

export function getContactPage() {
  const db = ensureDb();
  return {
    contact: db.select().from(contactInfo).get(),
    hours: db.select().from(officeHours).orderBy(asc(officeHours.sortOrder)).all(),
    settings: db.select().from(siteSettings).get(),
  };
}

export function getChangeManager() {
  const row = ensureDb().select().from(changeManagerCta).get();
  if (!row) return null;
  return {
    intro: row.intro,
    quotes: JSON.parse(row.quotesJson) as Array<{ text: string; citation?: string }>,
    downloadHref: row.downloadPath
      ? mediaSrc(row.downloadPath)
      : row.downloadUrl || "#",
    backgroundImage: mediaSrc(row.backgroundImagePath || "/change-manager-bg.jpg"),
  };
}

export function getPrivacySections() {
  return ensureDb()
    .select()
    .from(privacySections)
    .where(eq(privacySections.isActive, true))
    .orderBy(asc(privacySections.sortOrder))
    .all();
}
