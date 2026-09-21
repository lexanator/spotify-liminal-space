import { randomBytes } from 'crypto';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { buildAuthorizeUrl } from '@/lib/spotify-auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const state = randomBytes(16).toString('hex');
  const cookieStore = await cookies();
  cookieStore.set('wf_oauth_state', state, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 600,
    path: '/',
  });

  return NextResponse.redirect(buildAuthorizeUrl(state));
}
