import type { NextRequest } from 'next/server';
import { verifySession, signSession, SESSION_COOKIE } from './session';
import { refreshAccessToken } from './spotify-auth';

export type AccessTokenResult = {
  accessToken: string;
  refreshedCookie?: string;
};

export async function getValidAccessToken(request: NextRequest): Promise<AccessTokenResult | null> {
  const raw = request.cookies.get(SESSION_COOKIE)?.value;
  const session = raw ? await verifySession(raw) : null;
  if (!session) return null;

  if (Date.now() <= session.expiresAt - 60_000) {
    return { accessToken: session.accessToken };
  }

  const refreshed = await refreshAccessToken(session.refreshToken);
  const refreshedCookie = await signSession(refreshed);
  return { accessToken: refreshed.accessToken, refreshedCookie };
}

export function applySessionCookie(
  response: { cookies: { set: (name: string, value: string, options: object) => void } },
  refreshedCookie: string
) {
  response.cookies.set(SESSION_COOKIE, refreshedCookie, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  });
}
