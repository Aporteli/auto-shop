import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAppOrigin, setSessionCookie } from '@/lib/auth';

type GoogleTokenResponse = {
  access_token?: string;
  error?: string;
};

type GoogleUserInfo = {
  id?: string;
  email?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  verified_email?: boolean;
};

export async function GET(request: NextRequest) {
  const origin = getAppOrigin(request);
  const code = request.nextUrl.searchParams.get('code');
  const stateRaw = request.nextUrl.searchParams.get('state');
  const oauthError = request.nextUrl.searchParams.get('error');

  let nextPath = '/';
  try {
    if (stateRaw) {
      const parsed = JSON.parse(Buffer.from(stateRaw, 'base64url').toString('utf8')) as { next?: string };
      if (parsed.next?.startsWith('/')) nextPath = parsed.next;
    }
  } catch {
    nextPath = '/';
  }

  if (oauthError || !code) {
    return NextResponse.redirect(`${origin}/login?error=google_denied`);
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return NextResponse.redirect(`${origin}/login?error=google_not_configured`);
  }

  try {
    const redirectUri = `${origin}/api/auth/google/callback`;
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = (await tokenRes.json()) as GoogleTokenResponse;
    if (!tokenRes.ok || !tokenData.access_token) {
      return NextResponse.redirect(`${origin}/login?error=google_token`);
    }

    const profileRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const profile = (await profileRes.json()) as GoogleUserInfo;

    if (!profileRes.ok || !profile.email || !profile.id) {
      return NextResponse.redirect(`${origin}/login?error=google_profile`);
    }

    const email = profile.email.toLowerCase();
    let user = await prisma.user.findFirst({
      where: {
        OR: [{ googleId: profile.id }, { email }],
      },
    });

    if (user) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          googleId: profile.id,
          avatar: profile.picture || user.avatar,
          isVerified: profile.verified_email || user.isVerified,
          firstName: user.firstName || profile.given_name || 'User',
          lastName: user.lastName || profile.family_name || '',
        },
      });
    } else {
      user = await prisma.user.create({
        data: {
          email,
          googleId: profile.id,
          passwordHash: null,
          firstName: profile.given_name || 'User',
          lastName: profile.family_name || '',
          avatar: profile.picture || null,
          isVerified: Boolean(profile.verified_email),
        },
      });
    }

    await setSessionCookie(user.id);
    return NextResponse.redirect(`${origin}${nextPath}`);
  } catch {
    return NextResponse.redirect(`${origin}/login?error=google_failed`);
  }
}
