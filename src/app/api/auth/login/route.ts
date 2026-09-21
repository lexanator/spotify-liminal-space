import { randomBytes } from 'crypto';
import { NextResponse } from 'next/server';
import { buildAuthorizeUrl } from '@/lib/spotify-auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const state = randomBytes(16).toString('hex');
  const response = NextResponse.redirect(buildAuthorizeUrl(state));
  response.cookies.set('wf_oauth_state', state, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 600,
    path: '/',
  });

  return response;
}
