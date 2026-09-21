import type { AudioFeatures, SpotifyArtist, SpotifyTrack } from './spotify-api';

export type TrackVibe = {
  id: string;
  name: string;
  albumImage: string | null;
  spotifyUrl: string;
  popularity: number;
  releaseYear: number | null;
  vibe: string;
};

export type ArtistVibe = {
  id: string;
  name: string;
  image: string | null;
  genres: string[];
  spotifyUrl: string;
  tracks: TrackVibe[];
};

export type VibeProfile = {
  artists: ArtistVibe[];
  moodTags: string[];
  livingRoomDescription: string;
};

type Axes = {
  energy: number; // calm (0) -> intense (1)
  brightness: number; // moody (0) -> upbeat (1)
  acoustic: number; // electronic (0) -> acoustic/organic (1)
  maximalism: number; // sparse/minimal (0) -> dense/maximalist (1)
  vintage: number; // futuristic/current (0) -> vintage/retro (1)
};

const GENRE_AXES: { match: string; axes: Partial<Axes>; descriptors: string[] }[] = [
  { match: 'lo-fi', axes: { energy: 0.15, brightness: 0.35, acoustic: 0.6, maximalism: 0.2 }, descriptors: ['hazy', 'unhurried', 'warm-static'] },
  { match: 'bedroom', axes: { energy: 0.2, brightness: 0.4, acoustic: 0.55, maximalism: 0.25 }, descriptors: ['intimate', 'diaristic', 'hushed'] },
  { match: 'metal', axes: { energy: 0.95, brightness: 0.2, acoustic: 0.1, maximalism: 0.85 }, descriptors: ['crushing', 'cathartic', 'relentless'] },
  { match: 'punk', axes: { energy: 0.9, brightness: 0.35, acoustic: 0.2, maximalism: 0.5, vintage: 0.5 }, descriptors: ['raw', 'unpolished', 'defiant'] },
  { match: 'hardcore', axes: { energy: 0.95, brightness: 0.15, acoustic: 0.1, maximalism: 0.7 }, descriptors: ['ferocious', 'blistering'] },
  { match: 'r&b', axes: { energy: 0.45, brightness: 0.4, acoustic: 0.35, maximalism: 0.4 }, descriptors: ['sultry', 'smooth', 'unhurried'] },
  { match: 'soul', axes: { energy: 0.4, brightness: 0.55, acoustic: 0.55, vintage: 0.6 }, descriptors: ['warm', 'aching', 'soulful'] },
  { match: 'funk', axes: { energy: 0.65, brightness: 0.7, acoustic: 0.4, maximalism: 0.6, vintage: 0.55 }, descriptors: ['groovy', 'strutting', 'loose-limbed'] },
  { match: 'folk', axes: { energy: 0.25, brightness: 0.45, acoustic: 0.85, maximalism: 0.15, vintage: 0.5 }, descriptors: ['earthy', 'reflective', 'porch-lit'] },
  { match: 'country', axes: { energy: 0.35, brightness: 0.55, acoustic: 0.75, vintage: 0.55 }, descriptors: ['dusty', 'storytelling', 'wide-open'] },
  { match: 'jazz', axes: { energy: 0.4, brightness: 0.45, acoustic: 0.7, maximalism: 0.45, vintage: 0.6 }, descriptors: ['smoky', 'loose', 'after-hours'] },
  { match: 'classical', axes: { energy: 0.35, brightness: 0.4, acoustic: 0.9, maximalism: 0.6, vintage: 0.7 }, descriptors: ['stately', 'intricate', 'unhurried'] },
  { match: 'ambient', axes: { energy: 0.1, brightness: 0.4, acoustic: 0.4, maximalism: 0.1 }, descriptors: ['spacious', 'meditative', 'weightless'] },
  { match: 'techno', axes: { energy: 0.85, brightness: 0.3, acoustic: 0.05, maximalism: 0.55 }, descriptors: ['pulsing', 'mechanical', 'trance-inducing'] },
  { match: 'house', axes: { energy: 0.8, brightness: 0.65, acoustic: 0.05, maximalism: 0.5 }, descriptors: ['euphoric', 'four-on-the-floor', 'sweaty'] },
  { match: 'edm', axes: { energy: 0.9, brightness: 0.7, acoustic: 0.05, maximalism: 0.7 }, descriptors: ['anthemic', 'high-gloss', 'peak-time'] },
  { match: 'trap', axes: { energy: 0.7, brightness: 0.3, acoustic: 0.05, maximalism: 0.6 }, descriptors: ['bass-heavy', 'menacing', 'skeletal'] },
  { match: 'hip hop', axes: { energy: 0.6, brightness: 0.4, acoustic: 0.15, maximalism: 0.55 }, descriptors: ['confident', 'rhythmic', 'street-lit'] },
  { match: 'rap', axes: { energy: 0.65, brightness: 0.35, acoustic: 0.15, maximalism: 0.55 }, descriptors: ['sharp-tongued', 'bold', 'rhythmic'] },
  { match: 'indie', axes: { energy: 0.4, brightness: 0.45, acoustic: 0.5, maximalism: 0.3 }, descriptors: ['wistful', 'jangly', 'DIY'] },
  { match: 'alt', axes: { energy: 0.45, brightness: 0.4, acoustic: 0.4, maximalism: 0.35 }, descriptors: ['restless', 'textured'] },
  { match: 'shoegaze', axes: { energy: 0.5, brightness: 0.3, acoustic: 0.3, maximalism: 0.75 }, descriptors: ['wall-of-sound', 'blurred', 'dreamlike'] },
  { match: 'dream pop', axes: { energy: 0.3, brightness: 0.5, acoustic: 0.4, maximalism: 0.5 }, descriptors: ['hazy', 'shimmering', 'floating'] },
  { match: 'pop', axes: { energy: 0.6, brightness: 0.75, acoustic: 0.25, maximalism: 0.5 }, descriptors: ['bright', 'polished', 'hook-forward'] },
  { match: 'disco', axes: { energy: 0.75, brightness: 0.8, acoustic: 0.3, maximalism: 0.6, vintage: 0.7 }, descriptors: ['glittering', 'strutting', 'mirror-ball'] },
  { match: 'reggae', axes: { energy: 0.4, brightness: 0.6, acoustic: 0.5, maximalism: 0.3, vintage: 0.5 }, descriptors: ['loping', 'sun-warmed', 'easy'] },
  { match: 'latin', axes: { energy: 0.7, brightness: 0.75, acoustic: 0.45, maximalism: 0.55 }, descriptors: ['warm', 'rhythmic', 'celebratory'] },
  { match: 'k-pop', axes: { energy: 0.75, brightness: 0.8, acoustic: 0.15, maximalism: 0.7 }, descriptors: ['maximalist', 'candy-bright', 'precise'] },
  { match: 'emo', axes: { energy: 0.55, brightness: 0.25, acoustic: 0.35, maximalism: 0.45, vintage: 0.4 }, descriptors: ['raw-nerved', 'confessional', 'aching'] },
  { match: 'blues', axes: { energy: 0.35, brightness: 0.35, acoustic: 0.75, vintage: 0.7 }, descriptors: ['worn-in', 'weathered', 'lived-in'] },
  { match: 'rock', axes: { energy: 0.65, brightness: 0.45, acoustic: 0.35, maximalism: 0.55 }, descriptors: ['driving', 'guitar-forward', 'muscular'] },
  { match: 'electronic', axes: { energy: 0.65, brightness: 0.45, acoustic: 0.05, maximalism: 0.5 }, descriptors: ['synthetic', 'precise', 'machine-built'] },
  { match: 'dance', axes: { energy: 0.8, brightness: 0.7, acoustic: 0.1, maximalism: 0.55 }, descriptors: ['floor-filling', 'propulsive'] },
  { match: 'singer songwriter', axes: { energy: 0.25, brightness: 0.45, acoustic: 0.8, maximalism: 0.15, vintage: 0.4 }, descriptors: ['plainspoken', 'intimate', 'unadorned'] },
  { match: 'world', axes: { energy: 0.45, brightness: 0.6, acoustic: 0.65, maximalism: 0.4 }, descriptors: ['far-flung', 'polyrhythmic'] },
  { match: 'soundtrack', axes: { energy: 0.35, brightness: 0.4, acoustic: 0.55, maximalism: 0.5, vintage: 0.4 }, descriptors: ['cinematic', 'sweeping'] },
  { match: 'dubstep', axes: { energy: 0.9, brightness: 0.35, acoustic: 0.05, maximalism: 0.75 }, descriptors: ['wobbling', 'bass-driven', 'seismic'] },
  { match: 'drum and bass', axes: { energy: 0.9, brightness: 0.4, acoustic: 0.05, maximalism: 0.7 }, descriptors: ['breakneck', 'restless'] },
];

const DEFAULT_DESCRIPTORS = ['eclectic', 'hard-to-pin-down', 'genre-agnostic'];

function normalizeGenre(genre: string): string {
  return genre.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function axesForGenres(rawGenres: string[]): { axes: Axes; descriptors: string[] } {
  const genres = rawGenres.map(normalizeGenre);
  const matches = GENRE_AXES.filter((g) => genres.some((genre) => genre.includes(normalizeGenre(g.match))));
  if (matches.length === 0) {
    return {
      axes: { energy: 0.5, brightness: 0.5, acoustic: 0.5, maximalism: 0.5, vintage: 0.5 },
      descriptors: DEFAULT_DESCRIPTORS,
    };
  }
  const axes: Axes = { energy: 0, brightness: 0, acoustic: 0, maximalism: 0, vintage: 0 };
  const counts: Record<keyof Axes, number> = { energy: 0, brightness: 0, acoustic: 0, maximalism: 0, vintage: 0 };
  const descriptors: string[] = [];
  for (const m of matches) {
    descriptors.push(...m.descriptors);
    for (const key of Object.keys(m.axes) as (keyof Axes)[]) {
      axes[key] += m.axes[key]!;
      counts[key] += 1;
    }
  }
  for (const key of Object.keys(axes) as (keyof Axes)[]) {
    axes[key] = counts[key] > 0 ? axes[key] / counts[key] : 0.5;
  }
  return { axes, descriptors };
}

function tierWord(value: number, low: string, mid: string, high: string): string {
  if (value < 0.35) return low;
  if (value > 0.65) return high;
  return mid;
}

function trackVibeFromAxesAndFeatures(
  descriptors: string[],
  axes: Axes,
  track: SpotifyTrack,
  features: AudioFeatures | null
): string {
  let energy = axes.energy;
  let brightness = axes.brightness;
  if (features) {
    energy = (energy + features.energy) / 2;
    brightness = (brightness + features.valence) / 2;
  }

  const picked = descriptors.slice(0, 2).join(', ');
  const energyWord = tierWord(energy, 'laid-back', 'mid-tempo', 'high-energy');
  const moodWord = tierWord(brightness, 'moody', 'even-keeled', 'sun-lit');
  const popularityTier =
    track.popularity > 70 ? 'a certified favorite' : track.popularity > 40 ? 'a steady staple' : 'a deep cut';

  return `${picked} - ${energyWord} and ${moodWord}, ${popularityTier}.`;
}

export function buildVibeProfile(
  artists: SpotifyArtist[],
  artistTracks: Map<string, SpotifyTrack[]>,
  audioFeatures: Map<string, AudioFeatures> | null
): VibeProfile {
  const artistVibes: ArtistVibe[] = artists.map((artist) => {
    const { axes, descriptors } = axesForGenres(artist.genres);
    const tracks = (artistTracks.get(artist.id) ?? []).slice(0, 5).map((track) => ({
      id: track.id,
      name: track.name,
      albumImage: track.album.images[0]?.url ?? null,
      spotifyUrl: track.external_urls.spotify,
      popularity: track.popularity,
      releaseYear: track.album.release_date ? parseInt(track.album.release_date.slice(0, 4), 10) : null,
      vibe: trackVibeFromAxesAndFeatures(descriptors, axes, track, audioFeatures?.get(track.id) ?? null),
    }));

    return {
      id: artist.id,
      name: artist.name,
      image: null,
      genres: artist.genres,
      spotifyUrl: `https://open.spotify.com/artist/${artist.id}`,
      tracks,
    };
  });

  const overall = aggregateAxes(artists);
  const moodTags = topMoodTags(overall);
  const dominantGenres = [...new Set(artists.flatMap((a) => a.genres))].slice(0, 5);

  return {
    artists: artistVibes,
    moodTags,
    livingRoomDescription: describeLivingRoom(overall, dominantGenres, artists.map((a) => a.name)),
  };
}

function aggregateAxes(artists: SpotifyArtist[]): Axes {
  const totals: Axes = { energy: 0, brightness: 0, acoustic: 0, maximalism: 0, vintage: 0 };
  let count = 0;
  artists.forEach((artist, index) => {
    const weight = artists.length - index;
    const { axes } = axesForGenres(artist.genres);
    for (const key of Object.keys(totals) as (keyof Axes)[]) {
      totals[key] += axes[key] * weight;
    }
    count += weight;
  });
  if (count === 0) return { energy: 0.5, brightness: 0.5, acoustic: 0.5, maximalism: 0.5, vintage: 0.5 };
  for (const key of Object.keys(totals) as (keyof Axes)[]) {
    totals[key] /= count;
  }
  return totals;
}

function topMoodTags(axes: Axes): string[] {
  const tags: string[] = [];
  tags.push(tierWord(axes.energy, 'calm', 'balanced', 'high-energy'));
  tags.push(tierWord(axes.brightness, 'moody', 'even-keeled', 'upbeat'));
  tags.push(tierWord(axes.acoustic, 'electronic', 'blended', 'acoustic'));
  tags.push(tierWord(axes.vintage, 'forward-looking', 'timeless', 'retro-leaning'));
  return tags;
}

function describeLivingRoom(axes: Axes, dominantGenres: string[], artistNames: string[]): string {
  const lighting = tierWord(
    axes.brightness,
    'the lighting stays low - a couple of warm lamps in the corners rather than anything overhead',
    'the light is soft and adjustable, dimmed most evenings but never fully dark',
    'natural light pours in, and string lights or a bright floor lamp keep the room glowing after sunset'
  );

  const seating = tierWord(
    axes.energy,
    'a deep, worn-in couch built for sinking into for hours at a time',
    'a mix of a couch and a couple of well-loved armchairs, arranged for both company and solitude',
    'seating is pushed toward the edges of the room, leaving open floor space like the room expects to be danced in'
  );

  const soundSystem = tierWord(
    axes.acoustic,
    'a real turntable and a small stack of records sit within arm\'s reach of the couch',
    'a decent bluetooth speaker or soundbar handles most nights, with a few records around for effect',
    'a compact, serious speaker setup dominates one wall - clearly the centerpiece of the room'
  );

  const decor = tierWord(
    axes.vintage,
    'decor leans current and uncluttered - a few plants, clean shelving, nothing borrowed from another decade',
    'there\'s a comfortable mix of old and new: a thrifted lamp next to a newer piece of furniture',
    'thrifted furniture, an old rug, and framed prints give the room a lived-in, secondhand-shop warmth'
  );

  const clutter = tierWord(
    axes.maximalism,
    'surfaces are kept mostly bare - a candle, a book, maybe a single plant, and not much else',
    'shelves hold a curated handful of books, records, and small objects, arranged with some care',
    'every surface carries something - stacked records, string lights, posters overlapping on the walls - the room feels full on purpose'
  );

  const genrePhrase =
    dominantGenres.length > 0
      ? `Between ${formatList(dominantGenres.slice(0, 3))}, the room's whole atmosphere seems tuned to ${artistNames[0] ?? 'their favorite artists'} and the company they keep.`
      : '';

  const closing = tierWord(
    axes.energy,
    'It\'s a room built for slowing down in - the kind of space where a song is left playing quietly just to fill the silence.',
    'It\'s a room that can go either way - quiet enough for a slow morning, lively enough for people to drop by.',
    'It\'s a room that seems to expect movement - something is always about to happen, or the volume is about to go up.'
  );

  return [
    `Picture a living room where ${lighting}. There's ${seating}, and ${soundSystem}. In terms of decor, ${decor}, and ${clutter}.`,
    genrePhrase,
    closing,
  ]
    .filter(Boolean)
    .join(' ');
}

function formatList(items: string[]): string {
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
}
