/**
 * Public content reader — loads committed content/*.json at build/render time.
 * Visitors never call GitHub; admin APIs talk to GitHub separately.
 */
import aboutJson from "@/content/about.json";
import benefitsJson from "@/content/benefits.json";
import contactJson from "@/content/contact.json";
import documentsJson from "@/content/documents.json";
import heroJson from "@/content/hero.json";
import importantContactsJson from "@/content/important-contacts.json";
import partnersJson from "@/content/partners.json";
import pricingJson from "@/content/pricing.json";
import privacyJson from "@/content/privacy.json";
import reconstructionsJson from "@/content/reconstructions.json";
import referencesJson from "@/content/references.json";
import revisionsJson from "@/content/revisions.json";
import servicesJson from "@/content/services.json";
import { mediaSrc } from "@/lib/cms/media";

function activeSorted<T extends { isActive?: boolean; sortOrder?: number }>(items: T[]) {
  return [...items]
    .filter((i) => i.isActive !== false)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
}

function parseContactsJson(raw: string) {
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return [];
  }
}

export function getHero() {
  return {
    headlineLines: heroJson.headlineLines,
    imageSrc: mediaSrc(heroJson.imageSrc),
  };
}

export function getAbout() {
  return aboutJson;
}

export function getBenefits() {
  return activeSorted(benefitsJson);
}

export function getServices() {
  return activeSorted(servicesJson).map((s) => ({
    ...s,
    image: mediaSrc(s.imagePath),
  }));
}

export function getRevisions() {
  return {
    intro: revisionsJson.intro,
    items: activeSorted(revisionsJson.items),
  };
}

export function getReferences() {
  return activeSorted(referencesJson).map((r) => ({
    name: r.name,
    image: mediaSrc(r.imagePath),
  }));
}

export function getReconstructions() {
  return activeSorted(reconstructionsJson).map((p) => ({
    id: p.slug,
    title: p.title,
    beforeImage: mediaSrc(p.beforeImagePath),
    afterImage: mediaSrc(p.afterImagePath),
    beforeText: p.beforeText,
    afterText: p.afterText,
    facts: p.facts ?? [],
    yearStatus: p.yearStatus,
    investment: p.investment,
  }));
}

export function getPartners() {
  return activeSorted(partnersJson).map((p) => ({
    name: p.name,
    src: mediaSrc(p.logoPath),
    url: p.url,
    alt: p.name,
  }));
}

export function getDownloads() {
  return {
    intro: documentsJson.intro,
    documents: activeSorted(documentsJson.items).map((d) => ({
      title: d.title,
      href: d.filePath ? mediaSrc(d.filePath) : d.externalUrl || "#",
    })),
  };
}

export function getPricing() {
  return {
    note: pricingJson.note,
    sections: pricingJson.sections,
  };
}

export function getImportantContacts() {
  return activeSorted(importantContactsJson).map((r) => ({
    ...r,
    logoSrc: r.logoPath ? mediaSrc(r.logoPath) : null,
    contacts: parseContactsJson(r.contactsJson),
  }));
}

export function getContactPage() {
  return {
    contact: contactJson.contact,
    hours: [...contactJson.hours].sort((a, b) => a.sortOrder - b.sortOrder),
    settings: contactJson.settings,
  };
}

export function getChangeManager() {
  const cm = heroJson.changeManager;
  if (!cm) return null;
  return {
    intro: cm.intro,
    quotes: cm.quotes,
    downloadHref: cm.downloadPath
      ? mediaSrc(cm.downloadPath)
      : cm.downloadUrl || "#",
    backgroundImage: mediaSrc(cm.backgroundImagePath || "/change-manager-bg.jpg"),
  };
}

export function getPrivacySections() {
  return activeSorted(privacyJson);
}
