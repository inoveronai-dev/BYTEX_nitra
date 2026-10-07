#!/usr/bin/env tsx
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { eq } from "drizzle-orm";
import { assertStrongPassword, hashPassword } from "../lib/auth/password";
import { getDb } from "../lib/db/client";
import { runMigrations } from "../lib/db/migrate";
import { admins } from "../lib/db/schema";

async function promptCredentials() {
  const envEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const envPassword = process.env.ADMIN_PASSWORD;
  if (envEmail && envPassword) {
    if (!envEmail.includes("@")) {
      throw new Error("Neplatný e-mail.");
    }
    assertStrongPassword(envPassword);
    return { email: envEmail, password: envPassword };
  }

  const rl = readline.createInterface({ input, output });
  try {
    const emailRaw = await rl.question("Admin e-mail: ");
    const email = emailRaw.trim().toLowerCase();
    if (!email || !email.includes("@")) {
      throw new Error("Neplatný e-mail.");
    }

    const password = await rl.question("Heslo (min. 10 znakov): ");
    assertStrongPassword(password);
    const confirm = await rl.question("Potvrďte heslo: ");
    if (password !== confirm) {
      throw new Error("Heslá sa nezhodujú.");
    }
    return { email, password };
  } finally {
    rl.close();
  }
}

async function main() {
  runMigrations();
  const { email, password } = await promptCredentials();

  const db = getDb();
  const existing = db.select().from(admins).where(eq(admins.email, email)).get();
  const passwordHash = await hashPassword(password);

  if (existing) {
    db.update(admins).set({ passwordHash }).where(eq(admins.id, existing.id)).run();
    console.log(`Aktualizované heslo pre ${email}`);
  } else {
    db.insert(admins).values({ email, passwordHash }).run();
    console.log(`Vytvorený admin: ${email}`);
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
