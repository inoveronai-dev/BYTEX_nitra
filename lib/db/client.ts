import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "@/lib/db/schema";
import { getDatabasePath } from "@/lib/db/paths";

let sqlite: Database.Database | null = null;
let dbInstance: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getSqlite() {
  if (sqlite) return sqlite;

  const dbPath = getDatabasePath();
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });

  sqlite = new Database(dbPath);
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("foreign_keys = ON");
  return sqlite;
}

export function getDb() {
  if (dbInstance) return dbInstance;
  dbInstance = drizzle(getSqlite(), { schema });
  return dbInstance;
}

export type Db = ReturnType<typeof getDb>;
