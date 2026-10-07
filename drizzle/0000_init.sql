CREATE TABLE IF NOT EXISTS `admins` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`last_login_at` text
);
CREATE UNIQUE INDEX IF NOT EXISTS `admins_email_unique` ON `admins` (`email`);

CREATE TABLE IF NOT EXISTS `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`admin_id` integer NOT NULL,
	`token_hash` text NOT NULL,
	`expires_at` text NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`user_agent` text,
	`ip` text,
	FOREIGN KEY (`admin_id`) REFERENCES `admins`(`id`) ON UPDATE no action ON DELETE cascade
);

CREATE TABLE IF NOT EXISTS `login_attempts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`key` text NOT NULL,
	`failed_count` integer DEFAULT 0 NOT NULL,
	`window_until` text,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS `login_attempts_key_idx` ON `login_attempts` (`key`);

CREATE TABLE IF NOT EXISTS `hero_content` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`headline_lines_json` text NOT NULL,
	`image_path` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);

CREATE TABLE IF NOT EXISTS `about_content` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`eyebrow` text NOT NULL,
	`heading` text NOT NULL,
	`body` text NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);

CREATE TABLE IF NOT EXISTS `change_manager_cta` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`intro` text NOT NULL,
	`quotes_json` text NOT NULL,
	`download_path` text,
	`download_url` text,
	`background_image_path` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);

CREATE TABLE IF NOT EXISTS `contact_info` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`person` text NOT NULL,
	`email` text NOT NULL,
	`phone` text NOT NULL,
	`phone_href` text NOT NULL,
	`address_line1` text NOT NULL,
	`address_line2` text NOT NULL,
	`facebook_url` text NOT NULL,
	`instagram_url` text NOT NULL,
	`map_embed_url` text NOT NULL,
	`client_centre_intro` text NOT NULL,
	`form_intro_before_email` text NOT NULL,
	`form_intro_after_email` text NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);

CREATE TABLE IF NOT EXISTS `office_hours` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`day` text NOT NULL,
	`time_text` text NOT NULL,
	`is_open` integer DEFAULT false NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);

CREATE TABLE IF NOT EXISTS `site_settings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`company_name` text NOT NULL,
	`ico` text NOT NULL,
	`dic` text NOT NULL,
	`copyright_text` text NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);

CREATE TABLE IF NOT EXISTS `benefits` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`body` text NOT NULL,
	`icon_key` text NOT NULL,
	`emphasize` integer DEFAULT false NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);

CREATE TABLE IF NOT EXISTS `services` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`image_path` text NOT NULL,
	`image_class_name` text,
	`image_overlay_class_name` text,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);

CREATE TABLE IF NOT EXISTS `revisions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`frequency` text NOT NULL,
	`body` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);

CREATE TABLE IF NOT EXISTS `site_references` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`image_path` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);

CREATE TABLE IF NOT EXISTS `reconstructions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`year_status` text NOT NULL,
	`investment` text NOT NULL,
	`before_image_path` text NOT NULL,
	`after_image_path` text NOT NULL,
	`before_text` text NOT NULL,
	`after_text` text NOT NULL,
	`facts_json` text DEFAULT '[]' NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS `reconstructions_slug_unique` ON `reconstructions` (`slug`);

CREATE TABLE IF NOT EXISTS `partners` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`logo_path` text NOT NULL,
	`url` text,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);

CREATE TABLE IF NOT EXISTS `documents` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`file_path` text,
	`external_url` text,
	`mime_type` text,
	`file_ext` text,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);

CREATE TABLE IF NOT EXISTS `downloads_intro` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`body` text NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);

CREATE TABLE IF NOT EXISTS `pricing_categories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`note` text,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS `pricing_categories_slug_unique` ON `pricing_categories` (`slug`);

CREATE TABLE IF NOT EXISTS `pricing_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`category_id` integer NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`category_id`) REFERENCES `pricing_categories`(`id`) ON UPDATE no action ON DELETE cascade
);

CREATE TABLE IF NOT EXISTS `pricing_prices` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`item_id` integer NOT NULL,
	`amount` text NOT NULL,
	`unit` text,
	`sort_order` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`item_id`) REFERENCES `pricing_items`(`id`) ON UPDATE no action ON DELETE cascade
);

CREATE TABLE IF NOT EXISTS `pricing_note` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`note` text NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);

CREATE TABLE IF NOT EXISTS `important_contacts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`group_key` text NOT NULL,
	`name` text NOT NULL,
	`details` text,
	`logo_path` text,
	`image_alt` text,
	`website_label` text,
	`website_url` text,
	`contacts_json` text DEFAULT '[]' NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);

CREATE TABLE IF NOT EXISTS `privacy_sections` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`heading` text NOT NULL,
	`body` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);

CREATE TABLE IF NOT EXISTS `revisions_intro` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`body` text NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);
