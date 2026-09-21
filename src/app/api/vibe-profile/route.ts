import { NextRequest, NextResponse } from 'next/server';
import { getValidAccessToken, applySessionCookie } from '@/lib/require-session';
import {
  fetchAudioFeatures,
  fetchTopArtists,
  fetchTopTracks,
  type SpotifyTrack,
  type TimeRange,
} from '@/lib/spotify-api';
import { buildVibeProfile } from '@/lib/vibe';
import { fetchItunesGenre } from '@/lib/itunes';

export const dynamic = 'force-dynamic';

const VALID_RANGES: TimeRange[] = ['short_term', 'medium_term', 'long_term'];
const TRACKS_PER_ARTIST = 5;

export async function GET(request: NextRequest) {
  const tokenResult = await getValidAccessToken(request);
  if (!tokenResult) {
    return NextResponse.json({ error: 'not_authenticated' }, { status: 401 });
  }
  const { accessToken, refreshedCookie } = tokenResult;

  const rangeParam = request.nextUrl.searchParams.get('range');
  const timeRange: TimeRange = VALID_RANGES.includes(rangeParam as TimeRange)
    ? (rangeParam as TimeRange)
    : 'medium_term';

  try {
    const [artists, topTracks] = await Promise.all([
      fetchTopArtists(accessToken, timeRange, 10),
      fetchTopTracks(accessToken, timeRange, 50),
    ]);

    // The catalog-wide "artist top tracks" endpoint is 403'd for this app
    // (Spotify has locked it behind extended-quota approval), so favorite
    // tracks per artist come from the listener's own top-tracks list instead.
    const artistTracks = new Map<string, SpotifyTrack[]>();
    for (const artist of artists) {
      const tracks = topTracks
        .filter((track) => track.artists.some((a) => a.id === artist.id))
        .slice(0, TRACKS_PER_ARTIST);
      artistTracks.set(artist.id, tracks);
    }

    const audioFeatures = await fetchAudioFeatures(
      accessToken,
      topTracks.map((t) => t.id)
    );

    await Promise.all(
      artists.map(async (artist) => {
        if (artist.genres.length > 0) return;
        const genre = await fetchItunesGenre(artist.name);
        if (genre) artist.genres = [genre];
      })
    );

    const profile = buildVibeProfile(artists, artistTracks, audioFeatures);

    const response = NextResponse.json(profile);
    if (refreshedCookie) applySessionCookie(response, refreshedCookie);
    return response;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'spotify_fetch_failed' }, { status: 502 });
  }
}
