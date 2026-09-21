/**
 * Spotify's artist `genres` field is frequently empty (a long-standing gap,
 * independent of the audio-features/top-tracks lockdown), so this looks up a
 * genre from Apple's free, unauthenticated iTunes Search API as a fallback.
 */
export async function fetchItunesGenre(artistName: string): Promise<string | null> {
  try {
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(
      artistName
    )}&entity=musicArtist&limit=1`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    const genre = data.results?.[0]?.primaryGenreName;
    return typeof genre === 'string' ? genre : null;
  } catch {
    return null;
  }
}
