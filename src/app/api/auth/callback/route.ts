import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForToken } from '@/lib/spotify-auth';
import { signSession, SESSION_COOKIE } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const error = searchParams.get('error');
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  const cookieStore = await cookies();
  const expectedState = cookieStore.get('wf_oauth_state')?.value;
  cookieStore.delete('wf_oauth_state');

  if (error) {
    return NextResponse.redirect(new URL(`/?error=${encodeURIComponent(error)}`, request.url));
  }
  if (!code || !state || state !== expectedState) {
    return NextResponse.redirect(new URL('/?error=invalid_state', request.url));
  }

  try {
    const token = await exchangeCodeForToken(code);
    const session = await signSession(token);

    cookieStore.set(SESSION_COOKIE, session, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });

    return NextResponse.redirect(new URL('/space', request.url));
  } catch (err) {
    console.error(err);
    return NextResponse.redirect(new URL('/?error=token_exchange_failed', request.url));
  }
}
