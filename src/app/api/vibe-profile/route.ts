import { NextRequest, NextResponse } from 'next/server';
import { getValidAccessToken, applySessionCookie } from '@/lib/require-session';
import { fetchAudioFeatures, fetchTopArtists, fetchTopTracks, type TimeRange } from '@/lib/spotify-api';
import { buildVibeProfile } from '@/lib/vibe';
import { fetchItunesGenre } from '@/lib/itunes';

export const dynamic = 'force-dynamic';

const VALID_RANGES: TimeRange[] = ['short_term', 'medium_term', 'long_term'];
const TOP_N = 10;

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
    const [artists, tracks] = await Promise.all([
      fetchTopArtists(accessToken, timeRange, TOP_N),
      fetchTopTracks(accessToken, timeRange, TOP_N),
    ]);

    const audioFeatures = await fetchAudioFeatures(
      accessToken,
      tracks.map((t) => t.id)
    );

    // Spotify's artist.genres is frequently empty, so backfill via iTunes -
    // first for the top artists themselves, then for any track's primary
    // artist that isn't already among them.
    await Promise.all(
      artists.map(async (artist) => {
        if (artist.genres.length > 0) return;
        const genre = await fetchItunesGenre(artist.name);
        if (genre) artist.genres = [genre];
      })
    );

    const genresByArtistId = new Map(artists.map((a) => [a.id, a.genres]));
    const unknownTrackArtists = new Map<string, string>();
    for (const track of tracks) {
      const primary = track.artists[0];
      if (primary && !genresByArtistId.has(primary.id)) {
        unknownTrackArtists.set(primary.id, primary.name);
      }
    }
    await Promise.all(
      [...unknownTrackArtists.entries()].map(async ([id, name]) => {
        const genre = await fetchItunesGenre(name);
        genresByArtistId.set(id, genre ? [genre] : []);
      })
    );

    const profile = buildVibeProfile(artists, tracks, genresByArtistId, audioFeatures);

    const response = NextResponse.json(profile);
    if (refreshedCookie) applySessionCookie(response, refreshedCookie);
    return response;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'spotify_fetch_failed' }, { status: 502 });
  }
}
