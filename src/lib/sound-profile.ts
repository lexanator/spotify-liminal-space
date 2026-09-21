import type { AudioFeatures, SpotifyArtist, SpotifyTrack } from './spotify-api';

export type TrackNode = {
  id: string;
  name: string;
  artistNames: string;
  albumImage: string | null;
  spotifyUrl: string;
  previewUrl: string | null;
  popularity: number;
  releaseYear: number | null;
  genre: string;
  color: string;
  position: [number, number, number];
  size: number;
  audioFeatures: AudioFeatures | null;
};

export type GenreCluster = {
  genre: string;
  weight: number;
  color: string;
  center: [number, number, number];
};

export type SoundProfile = {
  tracks: TrackNode[];
  clusters: GenreCluster[];
  hasAudioFeatures: boolean;
  description: string;
};

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

function seededUnit(seed: string): number {
  // Deterministic pseudo-random value in [0, 1) from a string seed.
  const h = hashString(seed);
  return (h >>> 0) / 4294967295;
}

function genreColor(genre: string): string {
  const hue = Math.abs(hashString(genre)) % 360;
  return `hsl(${hue}, 70%, 60%)`;
}

const OTHER_GENRE = 'other';
const CLUSTER_RADIUS = 26;
const CLUSTER_JITTER = 9;

export function buildSoundProfile(
  tracks: SpotifyTrack[],
  artists: SpotifyArtist[],
  audioFeatures: Map<string, AudioFeatures> | null
): SoundProfile {
  const artistById = new Map(artists.map((a) => [a.id, a]));

  // Weight genres by how highly-ranked the artists carrying them are.
  const genreWeight = new Map<string, number>();
  artists.forEach((artist, index) => {
    const weight = artists.length - index;
    for (const genre of artist.genres) {
      genreWeight.set(genre, (genreWeight.get(genre) ?? 0) + weight);
    }
  });

  const rankedGenres = [...genreWeight.entries()].sort((a, b) => b[1] - a[1]);
  const topGenres = rankedGenres.slice(0, 8).map(([genre]) => genre);
  if (topGenres.length === 0) topGenres.push(OTHER_GENRE);

  const clusters: GenreCluster[] = topGenres.map((genre, index) => {
    const angle = (index / topGenres.length) * Math.PI * 2;
    return {
      genre,
      weight: genreWeight.get(genre) ?? 0,
      color: genreColor(genre),
      center: [Math.cos(angle) * CLUSTER_RADIUS, 0, Math.sin(angle) * CLUSTER_RADIUS],
    };
  });
  const clusterByGenre = new Map(clusters.map((c) => [c.genre, c]));

  function primaryGenreForTrack(track: SpotifyTrack): string {
    let best: string | null = null;
    let bestWeight = -1;
    for (const artistRef of track.artists) {
      const artist = artistById.get(artistRef.id);
      if (!artist) continue;
      for (const genre of artist.genres) {
        if (!topGenres.includes(genre)) continue;
        const weight = genreWeight.get(genre) ?? 0;
        if (weight > bestWeight) {
          bestWeight = weight;
          best = genre;
        }
      }
    }
    return best ?? topGenres[0];
  }

  const trackNodes: TrackNode[] = tracks.map((track, index) => {
    const genre = primaryGenreForTrack(track);
    const cluster = clusterByGenre.get(genre)!;
    const features = audioFeatures?.get(track.id) ?? null;
    const releaseYear = track.album.release_date
      ? parseInt(track.album.release_date.slice(0, 4), 10)
      : null;

    // Closer to the cluster center = more popular; deterministic jitter otherwise.
    const jitterR = CLUSTER_JITTER * (1 - track.popularity / 130);
    const angleSeed = seededUnit(`${track.id}-angle`) * Math.PI * 2;
    const radiusSeed = seededUnit(`${track.id}-radius`);
    const heightSeed = seededUnit(`${track.id}-height`);

    let y: number;
    if (features) {
      y = (features.valence - 0.5) * 20;
    } else if (releaseYear) {
      y = ((releaseYear - 1990) / 35) * 16 - 8;
    } else {
      y = (heightSeed - 0.5) * 10;
    }

    const position: [number, number, number] = [
      cluster.center[0] + Math.cos(angleSeed) * jitterR * radiusSeed,
      y,
      cluster.center[2] + Math.sin(angleSeed) * jitterR * radiusSeed,
    ];

    return {
      id: track.id,
      name: track.name,
      artistNames: track.artists.map((a) => a.name).join(', '),
      albumImage: track.album.images[0]?.url ?? null,
      spotifyUrl: track.external_urls.spotify,
      previewUrl: track.preview_url,
      popularity: track.popularity,
      releaseYear,
      genre,
      color: cluster.color,
      position,
      size: 1.1 + (track.popularity / 100) * 1.4 + (index < 5 ? 0.4 : 0),
      audioFeatures: features,
    };
  });

  const description = buildDescription(clusters, trackNodes, audioFeatures !== null);

  return { tracks: trackNodes, clusters, hasAudioFeatures: audioFeatures !== null, description };
}

function buildDescription(
  clusters: GenreCluster[],
  tracks: TrackNode[],
  hasAudioFeatures: boolean
): string {
  const topThree = clusters
    .slice()
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 3)
    .map((c) => c.genre)
    .filter((g) => g !== OTHER_GENRE);

  const genrePhrase =
    topThree.length > 0
      ? `Your world is anchored in ${formatList(topThree)}.`
      : 'Your taste spans a wide, hard-to-label mix of genres.';

  const years = tracks.map((t) => t.releaseYear).filter((y): y is number => y != null);
  const avgYear = years.length ? Math.round(years.reduce((a, b) => a + b, 0) / years.length) : null;
  const eraPhrase = avgYear ? ` Most of it centers around ${avgYear}.` : '';

  let moodPhrase = '';
  if (hasAudioFeatures) {
    const withFeatures = tracks.filter((t) => t.audioFeatures);
    if (withFeatures.length) {
      const avg = (key: keyof AudioFeatures) =>
        withFeatures.reduce((sum, t) => sum + (t.audioFeatures![key] as number), 0) /
        withFeatures.length;
      const energy = avg('energy');
      const valence = avg('valence');
      const energyWord = energy > 0.66 ? 'high-energy' : energy > 0.4 ? 'mid-tempo' : 'mellow';
      const moodWord = valence > 0.6 ? 'upbeat' : valence > 0.4 ? 'even-keeled' : 'moody';
      moodPhrase = ` Sonically it leans ${energyWord} and ${moodWord}.`;
    }
  }

  return `${genrePhrase}${eraPhrase}${moodPhrase} Each cluster of lights below is a genre - fly closer to explore the tracks inside it.`;
}

function formatList(items: string[]): string {
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
}
