import { sql } from "drizzle-orm";
import { integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

const timestamps = {
  createdAt: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(datetime('now'))`),
};

export const admins = sqliteTable("admins", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
  lastLoginAt: text("last_login_at"),
});

export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  adminId: integer("admin_id")
    .notNull()
    .references(() => admins.id, { onDelete: "cascade" }),
  tokenHash: text("token_hash").notNull(),
  expiresAt: text("expires_at").notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
  userAgent: text("user_agent"),
  ip: text("ip"),
});

export const loginAttempts = sqliteTable(
  "login_attempts",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    key: text("key").notNull(),
    failedCount: integer("failed_count").notNull().default(0),
    windowUntil: text("window_until"),
    updatedAt: text("updated_at")
      .notNull()
      .default(sql`(datetime('now'))`),
  },
  (t) => [uniqueIndex("login_attempts_key_idx").on(t.key)]
);

export const heroContent = sqliteTable("hero_content", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  headlineLinesJson: text("headline_lines_json").notNull(),
  imagePath: text("image_path"),
  ...timestamps,
});

export const aboutContent = sqliteTable("about_content", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  eyebrow: text("eyebrow").notNull(),
  heading: text("heading").notNull(),
  body: text("body").notNull(),
  ...timestamps,
});

export const changeManagerCta = sqliteTable("change_manager_cta", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  intro: text("intro").notNull(),
  quotesJson: text("quotes_json").notNull(),
  downloadPath: text("download_path"),
  downloadUrl: text("download_url"),
  backgroundImagePath: text("background_image_path"),
  ...timestamps,
});

export const contactInfo = sqliteTable("contact_info", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  person: text("person").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  phoneHref: text("phone_href").notNull(),
  addressLine1: text("address_line1").notNull(),
  addressLine2: text("address_line2").notNull(),
  facebookUrl: text("facebook_url").notNull(),
  instagramUrl: text("instagram_url").notNull(),
  mapEmbedUrl: text("map_embed_url").notNull(),
  clientCentreIntro: text("client_centre_intro").notNull(),
  formIntroBeforeEmail: text("form_intro_before_email").notNull(),
  formIntroAfterEmail: text("form_intro_after_email").notNull(),
  ...timestamps,
});

export const officeHours = sqliteTable("office_hours", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  day: text("day").notNull(),
  timeText: text("time_text").notNull(),
  isOpen: integer("is_open", { mode: "boolean" }).notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  ...timestamps,
});

export const siteSettings = sqliteTable("site_settings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  companyName: text("company_name").notNull(),
  ico: text("ico").notNull(),
  dic: text("dic").notNull(),
  copyrightText: text("copyright_text").notNull(),
  ...timestamps,
});

export const benefits = sqliteTable("benefits", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  body: text("body").notNull(),
  iconKey: text("icon_key").notNull(),
  emphasize: integer("emphasize", { mode: "boolean" }).notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  ...timestamps,
});

export const services = sqliteTable("services", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imagePath: text("image_path").notNull(),
  imageClassName: text("image_class_name"),
  imageOverlayClassName: text("image_overlay_class_name"),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  ...timestamps,
});

export const revisions = sqliteTable("revisions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  frequency: text("frequency").notNull(),
  body: text("body").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  ...timestamps,
});

export const siteReferences = sqliteTable("site_references", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  imagePath: text("image_path").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  ...timestamps,
});

export const reconstructions = sqliteTable("reconstructions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  yearStatus: text("year_status").notNull(),
  investment: text("investment").notNull(),
  beforeImagePath: text("before_image_path").notNull(),
  afterImagePath: text("after_image_path").notNull(),
  beforeText: text("before_text").notNull(),
  afterText: text("after_text").notNull(),
  factsJson: text("facts_json").notNull().default("[]"),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  ...timestamps,
});

export const partners = sqliteTable("partners", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  logoPath: text("logo_path").notNull(),
  url: text("url"),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  ...timestamps,
});

export const documents = sqliteTable("documents", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  filePath: text("file_path"),
  externalUrl: text("external_url"),
  mimeType: text("mime_type"),
  fileExt: text("file_ext"),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  ...timestamps,
});

export const downloadsIntro = sqliteTable("downloads_intro", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  body: text("body").notNull(),
  ...timestamps,
});

export const pricingCategories = sqliteTable("pricing_categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  note: text("note"),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  ...timestamps,
});

export const pricingItems = sqliteTable("pricing_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  categoryId: integer("category_id")
    .notNull()
    .references(() => pricingCategories.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  ...timestamps,
});

export const pricingPrices = sqliteTable("pricing_prices", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  itemId: integer("item_id")
    .notNull()
    .references(() => pricingItems.id, { onDelete: "cascade" }),
  amount: text("amount").notNull(),
  unit: text("unit"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const pricingNote = sqliteTable("pricing_note", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  note: text("note").notNull(),
  ...timestamps,
});

export const importantContacts = sqliteTable("important_contacts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  groupKey: text("group_key").notNull(), // emergency | service_partner | utility
  name: text("name").notNull(),
  details: text("details"),
  logoPath: text("logo_path"),
  imageAlt: text("image_alt"),
  websiteLabel: text("website_label"),
  websiteUrl: text("website_url"),
  contactsJson: text("contacts_json").notNull().default("[]"),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  ...timestamps,
});

export const privacySections = sqliteTable("privacy_sections", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  heading: text("heading").notNull(),
  body: text("body").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  ...timestamps,
});

export const revisionsIntro = sqliteTable("revisions_intro", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  body: text("body").notNull(),
  ...timestamps,
});
