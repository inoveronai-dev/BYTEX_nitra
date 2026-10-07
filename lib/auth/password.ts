import bcrypt from "bcrypt";

const ROUNDS = 12;

export async function hashPassword(password: string) {
  return bcrypt.hash(password, ROUNDS);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function assertStrongPassword(password: string) {
  if (password.length < 10) {
    throw new Error("Heslo musí mať aspoň 10 znakov.");
  }
}
