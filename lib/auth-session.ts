export const SESSION_COOKIE = 'autoshop_session';
const SESSION_DAYS = 14;

function getSecret() {
  return process.env.AUTH_SECRET || process.env.DATABASE_URL || 'autoshop-dev-secret';
}

function toBase64Url(bytes: Uint8Array) {
  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function fromBase64Url(value: string) {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function importKey() {
  const encoder = new TextEncoder();
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(getSecret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  );
}

async function signPayload(payload: string) {
  const encoder = new TextEncoder();
  const key = await importKey();
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
  return toBase64Url(new Uint8Array(signature));
}

async function verifyPayload(payload: string, signature: string) {
  const encoder = new TextEncoder();
  const key = await importKey();
  return crypto.subtle.verify('HMAC', key, fromBase64Url(signature), encoder.encode(payload));
}

export async function createSessionToken(userId: number) {
  const expiresAt = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  const payload = `${userId}.${expiresAt}`;
  const signature = await signPayload(payload);
  return `${payload}.${signature}`;
}

export async function parseSessionToken(
  token: string | undefined | null,
): Promise<{ userId: number; expiresAt: number } | null> {
  if (!token) return null;

  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [userIdRaw, expiresAtRaw, signature] = parts;
  const payload = `${userIdRaw}.${expiresAtRaw}`;
  const isValid = await verifyPayload(payload, signature);
  if (!isValid) return null;

  const userId = Number(userIdRaw);
  const expiresAt = Number(expiresAtRaw);
  if (!Number.isFinite(userId) || !Number.isFinite(expiresAt) || expiresAt < Date.now()) {
    return null;
  }

  return { userId, expiresAt };
}

export { SESSION_DAYS };
