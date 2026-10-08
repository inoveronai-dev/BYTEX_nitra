#!/usr/bin/env tsx
/**
 * Generate ADMIN_PASSWORD_HASH for env.
 * Usage: npm run admin:hash-password
 * Or: npx tsx scripts/hash-admin-password.ts 'your-password'
 */
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { assertStrongPassword, hashPassword } from "../lib/auth/password";

async function main() {
  const arg = process.argv[2];
  let password = arg;
  if (!password) {
    const rl = createInterface({ input, output });
    password = await rl.question("Nové admin heslo (min. 10 znakov): ");
    rl.close();
  }
  assertStrongPassword(password);
  const hash = await hashPassword(password);
  console.log("\nPridajte do Vercel / .env.local:\n");
  console.log(`ADMIN_PASSWORD_HASH=${hash}`);
  console.log("");
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
