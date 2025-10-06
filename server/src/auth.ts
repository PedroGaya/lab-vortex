import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export async function hashPassword(pwd: string): Promise<string> {
  return await bcrypt.hash(pwd, SALT_ROUNDS);
}

export async function verifyPassword(
  pwd: string,
  hashed: string
): Promise<boolean> {
  return await bcrypt.compare(pwd, hashed);
}

export function generateRefCode(setValue?: string): string {
  if (setValue) return setValue;
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}
