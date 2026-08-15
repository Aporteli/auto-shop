import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { createSessionToken, parseSessionToken, SESSION_COOKIE, SESSION_DAYS } from '@/lib/auth-session';
import { verifyPassword as verifyPasswordHash } from '@/lib/password';

export type SessionUser = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  role: string;
};

export async function verifyPassword(password: string, passwordHash: string | null | undefined) {
  return verifyPasswordHash(password, passwordHash);
}

export async function setSessionCookie(userId: number) {
  const token = await createSessionToken(userId);
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

export async function clearSessionCookie() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const jar = await cookies();
  const parsed = await parseSessionToken(jar.get(SESSION_COOKIE)?.value);
  if (!parsed) return null;

  const user = await prisma.user.findUnique({
    where: { id: parsed.userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      role: true,
    },
  });

  return user;
}

export function getAppOrigin(request?: Request) {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '');
  }
  if (request) {
    const url = new URL(request.url);
    return url.origin;
  }
  return 'http://localhost:3000';
}

export { SESSION_COOKIE };
