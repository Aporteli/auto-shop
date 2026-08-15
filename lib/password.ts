import { randomBytes, scrypt, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);
const PLACEHOLDER_HASH = '$2b$10$placeholder_hash_replace_later';

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex');
  const derived = (await scryptAsync(password, salt, 64)) as Buffer;
  return `scrypt:${salt}:${derived.toString('hex')}`;
}

export async function verifyPassword(password: string, passwordHash: string | null | undefined) {
  if (!passwordHash) return false;

  if (passwordHash.startsWith('scrypt:')) {
    const parts = passwordHash.split(':');
    if (parts.length !== 3) return false;
    const [, salt, keyHex] = parts;
    const derived = (await scryptAsync(password, salt, 64)) as Buffer;
    const expected = Buffer.from(keyHex, 'hex');
    return expected.length === derived.length && timingSafeEqual(expected, derived);
  }

  // Legacy seeded demo accounts
  if (passwordHash === PLACEHOLDER_HASH) {
    return password === 'password';
  }

  return password === passwordHash;
}
