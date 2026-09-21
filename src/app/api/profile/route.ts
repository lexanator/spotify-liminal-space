import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { verifySession, signSession, SESSION_COOKIE } from '@/lib/session';
import { refreshAccessToken } from '@/lib/spotify-auth';
import { fetchAudioFeatures, fetchTopArtists, fetchTopTracks, type TimeRange } from '@/lib/spotify-api';
import { buildSoundProfile } from '@/lib/sound-profile';

export const dynamic = 'force-dynamic';

const VALID_RANGES: TimeRange[] = ['short_term', 'medium_term', 'long_term'];

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const raw = cookieStore.get(SESSION_COOKIE)?.value;
  const session = raw ? await verifySession(raw) : null;

  if (!session) {
    return NextResponse.json({ error: 'not_authenticated' }, { status: 401 });
  }

  const rangeParam = request.nextUrl.searchParams.get('range');
  const timeRange: TimeRange = VALID_RANGES.includes(rangeParam as TimeRange)
    ? (rangeParam as TimeRange)
    : 'medium_term';

  let accessToken = session.accessToken;

  if (Date.now() > session.expiresAt - 60_000) {
    try {
      const refreshed = await refreshAccessToken(session.refreshToken);
      accessToken = refreshed.accessToken;
      const newCookie = await signSession(refreshed);
      cookieStore.set(SESSION_COOKIE, newCookie, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 30,
        path: '/',
      });
    } catch (err) {
      console.error('Failed to refresh Spotify token', err);
      cookieStore.delete(SESSION_COOKIE);
      return NextResponse.json({ error: 'session_expired' }, { status: 401 });
    }
  }

  try {
    const [tracks, artists] = await Promise.all([
      fetchTopTracks(accessToken, timeRange),
      fetchTopArtists(accessToken, timeRange),
    ]);

    const audioFeatures = await fetchAudioFeatures(
      accessToken,
      tracks.map((t) => t.id)
    );

    const profile = buildSoundProfile(tracks, artists, audioFeatures);
    return NextResponse.json(profile);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'spotify_fetch_failed' }, { status: 502 });
  }
}
