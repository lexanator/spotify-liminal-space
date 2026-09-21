import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForToken } from '@/lib/spotify-auth';
import { signSession, SESSION_COOKIE } from '@/lib/session';

export const dynamic = 'force-dynamic';

// Built from an explicit APP_URL rather than request.url: this app is only ever
// reached via the exact host in SPOTIFY_REDIRECT_URI (127.0.0.1, which Spotify
// requires for non-HTTPS loopback redirects), but a dev-server proxy in front of
// Next can normalize the request's perceived host to "localhost" - a different
// cookie origin - which would silently drop the session cookie we just set.
const APP_URL = process.env.APP_URL!;

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const error = searchParams.get('error');
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const expectedState = request.cookies.get('wf_oauth_state')?.value;

  if (error) {
    return NextResponse.redirect(new URL(`/?error=${encodeURIComponent(error)}`, APP_URL));
  }
  if (!code || !state || state !== expectedState) {
    return NextResponse.redirect(new URL('/?error=invalid_state', APP_URL));
  }

  try {
    const token = await exchangeCodeForToken(code);
    const session = await signSession(token);

    const response = NextResponse.redirect(new URL('/space', APP_URL));
    response.cookies.delete('wf_oauth_state');
    response.cookies.set(SESSION_COOKIE, session, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });

    return response;
  } catch (err) {
    console.error(err);
    return NextResponse.redirect(new URL('/?error=token_exchange_failed', APP_URL));
  }
}
