/**
 * Public content adapter.
 * - static (Vercel): reads committed snapshot — never touches SQLite
 * - sqlite (local): delegates to queries-sqlite via lazy require
 */
import { publicSiteContent } from "@/lib/content/public-content";
import { isStaticPublicContent } from "@/lib/content/storage-mode";

type SqliteQueries = typeof import("./queries-sqlite");

function sqlite(): SqliteQueries {
  if (isStaticPublicContent()) {
    throw new Error("SQLite CMS is disabled in static public content mode.");
  }
  // Lazy require so better-sqlite3 is never loaded on Vercel public paths.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require("./queries-sqlite") as SqliteQueries;
}

export function getHero() {
  if (isStaticPublicContent()) return publicSiteContent.hero;
  return sqlite().getHero();
}

export function getAbout() {
  if (isStaticPublicContent()) return publicSiteContent.about;
  return sqlite().getAbout();
}

export function getBenefits() {
  if (isStaticPublicContent()) return publicSiteContent.benefits;
  return sqlite().getBenefits();
}

export function getServices() {
  if (isStaticPublicContent()) return publicSiteContent.services;
  return sqlite().getServices();
}

export function getRevisions() {
  if (isStaticPublicContent()) return publicSiteContent.revisions;
  return sqlite().getRevisions();
}

export function getReferences() {
  if (isStaticPublicContent()) return publicSiteContent.references;
  return sqlite().getReferences();
}

export function getReconstructions() {
  if (isStaticPublicContent()) return publicSiteContent.reconstructions;
  return sqlite().getReconstructions();
}

export function getPartners() {
  if (isStaticPublicContent()) return publicSiteContent.partners;
  return sqlite().getPartners();
}

export function getDownloads() {
  if (isStaticPublicContent()) return publicSiteContent.downloads;
  return sqlite().getDownloads();
}

export function getPricing() {
  if (isStaticPublicContent()) return publicSiteContent.pricing;
  return sqlite().getPricing();
}

export function getImportantContacts() {
  if (isStaticPublicContent()) return publicSiteContent.importantContacts;
  return sqlite().getImportantContacts();
}

export function getContactPage() {
  if (isStaticPublicContent()) return publicSiteContent.contactPage;
  return sqlite().getContactPage();
}

export function getChangeManager() {
  if (isStaticPublicContent()) return publicSiteContent.changeManager;
  return sqlite().getChangeManager();
}

export function getPrivacySections() {
  if (isStaticPublicContent()) return publicSiteContent.privacy;
  return sqlite().getPrivacySections();
}
