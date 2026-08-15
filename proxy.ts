import { NextRequest, NextResponse } from 'next/server';
import { parseSessionToken, SESSION_COOKIE } from '@/lib/auth-session';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname === '/add' ||
    pathname.startsWith('/add/') ||
    pathname === '/account' ||
    pathname.startsWith('/account/')
  ) {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const session = await parseSessionToken(token);

    if (!session) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/add', '/add/:path*', '/account', '/account/:path*'],
};
