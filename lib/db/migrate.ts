import fs from "node:fs";
import path from "node:path";
import { isStaticPublicContent } from "@/lib/content/storage-mode";
import { getSqlite } from "@/lib/db/client";
import { getUploadDir } from "@/lib/db/paths";

const UPLOAD_SUBDIRS = [
  "services",
  "references",
  "reconstructions",
  "partners",
  "documents",
  "contacts",
  "hero",
  "general",
] as const;

/** Apply SQL migrations from drizzle/ folder and ensure upload dirs exist. */
export function runMigrations() {
  if (isStaticPublicContent()) {
    throw new Error("Database migrations are disabled in static public content mode.");
  }
  const sqlite = getSqlite();
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS __drizzle_migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      hash TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  const migrationsDir = path.join(/*turbopackIgnore: true*/ process.cwd(), "drizzle");
  if (!fs.existsSync(migrationsDir)) {
    ensureUploadDirs();
    return;
  }

  const files = fs
    .readdirSync(migrationsDir)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  for (const file of files) {
    const applied = sqlite
      .prepare("SELECT 1 FROM __drizzle_migrations WHERE hash = ?")
      .get(file);
    if (applied) continue;

    const sql = fs.readFileSync(path.join(migrationsDir, file), "utf8");
    sqlite.exec(sql);
    sqlite.prepare("INSERT INTO __drizzle_migrations (hash) VALUES (?)").run(file);
  }

  ensureUploadDirs();
}

function ensureUploadDirs() {
  const root = getUploadDir();
  fs.mkdirSync(root, { recursive: true });
  for (const sub of UPLOAD_SUBDIRS) {
    fs.mkdirSync(path.join(/*turbopackIgnore: true*/ root, sub), { recursive: true });
  }
}
