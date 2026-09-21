export type TimeRange = 'short_term' | 'medium_term' | 'long_term';

// Spotify's /me/top/tracks and /me/top/artists return a reduced object shape
// for apps without extended-quota access: no `popularity`, no `followers`,
// and `genres` is frequently an empty array. Types reflect only what's
// actually present at runtime rather than the full catalog-endpoint shape.
export type SpotifyTrack = {
  id: string;
  name: string;
  artists: { id: string; name: string }[];
  album: { name: string; images: { url: string; width: number; height: number }[]; release_date: string };
  duration_ms: number;
  explicit: boolean;
  external_urls: { spotify: string };
};

export type SpotifyArtist = {
  id: string;
  name: string;
  genres: string[];
};

export type AudioFeatures = {
  id: string;
  danceability: number;
  energy: number;
  valence: number;
  tempo: number;
  acousticness: number;
};

async function spotifyFetch(accessToken: string, path: string) {
  const res = await fetch(`https://api.spotify.com/v1${path}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: 'no-store',
  });
  if (!res.ok) {
    const body = await res.text();
    const err = new Error(`Spotify API ${path} failed: ${res.status} ${body}`);
    (err as Error & { status?: number }).status = res.status;
    throw err;
  }
  return res.json();
}

export async function fetchTopTracks(
  accessToken: string,
  timeRange: TimeRange,
  limit = 50
): Promise<SpotifyTrack[]> {
  const data = await spotifyFetch(
    accessToken,
    `/me/top/tracks?time_range=${timeRange}&limit=${limit}`
  );
  return data.items;
}

export async function fetchTopArtists(
  accessToken: string,
  timeRange: TimeRange,
  limit = 50
): Promise<SpotifyArtist[]> {
  const data = await spotifyFetch(
    accessToken,
    `/me/top/artists?time_range=${timeRange}&limit=${limit}`
  );
  return (data.items as SpotifyArtist[]).map((artist) => ({
    ...artist,
    genres: artist.genres ?? [],
  }));
}

/**
 * Spotify restricted /audio-features to apps granted "extended quota mode"
 * for apps created after Nov 2024, so this returns null on 403 instead of
 * throwing - callers fall back to genre/popularity-based positioning.
 */
export async function fetchAudioFeatures(
  accessToken: string,
  trackIds: string[]
): Promise<Map<string, AudioFeatures> | null> {
  if (trackIds.length === 0) return new Map();
  try {
    const chunks: string[][] = [];
    for (let i = 0; i < trackIds.length; i += 100) {
      chunks.push(trackIds.slice(i, i + 100));
    }
    const map = new Map<string, AudioFeatures>();
    for (const chunk of chunks) {
      const data = await spotifyFetch(accessToken, `/audio-features?ids=${chunk.join(',')}`);
      for (const f of data.audio_features ?? []) {
        if (f) map.set(f.id, f);
      }
    }
    return map;
  } catch (err) {
    const status = (err as Error & { status?: number }).status;
    if (status === 403 || status === 404) return null;
    throw err;
  }
}
