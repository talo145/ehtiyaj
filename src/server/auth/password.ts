import "server-only";

import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt) as (
  password: string,
  salt: Buffer,
  keylen: number,
  options: { N: number; r: number; p: number; maxmem: number },
) => Promise<Buffer>;

/** معاملات scrypt. N=2^16 يوازن بين التكلفة على الخادم وصعوبة التخمين. */
const PARAMS = { N: 65536, r: 8, p: 1, maxmem: 128 * 65536 * 8 * 2 };
const KEYLEN = 64;

/** التجزئة تحمل معاملاتها معها، فتغييرها لاحقًا لا يبطل الحسابات القائمة. */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await scryptAsync(password.normalize("NFKC"), salt, KEYLEN, PARAMS);
  return [
    "scrypt",
    PARAMS.N,
    PARAMS.r,
    PARAMS.p,
    salt.toString("base64url"),
    key.toString("base64url"),
  ].join("$");
}

export async function verifyPassword(
  password: string,
  stored: string,
): Promise<boolean> {
  const parts = stored.split("$");
  if (parts.length !== 6 || parts[0] !== "scrypt") return false;

  const [, n, r, p, saltB64, keyB64] = parts;
  const salt = Buffer.from(saltB64, "base64url");
  const expected = Buffer.from(keyB64, "base64url");

  const key = await scryptAsync(password.normalize("NFKC"), salt, expected.length, {
    N: Number(n),
    r: Number(r),
    p: Number(p),
    maxmem: 128 * Number(n) * Number(r) * 2,
  });

  return key.length === expected.length && timingSafeEqual(key, expected);
}
