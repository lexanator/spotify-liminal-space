import type { AudioFeatures, SpotifyArtist, SpotifyTrack } from './spotify-api';

export type TrackVibe = {
  id: string;
  name: string;
  artistNames: string;
  albumImage: string | null;
  spotifyUrl: string;
  releaseYear: number | null;
  vibe: string;
};

export type ArtistVibe = {
  id: string;
  name: string;
  genres: string[];
  spotifyUrl: string;
  vibe: string;
};

export type VibeProfile = {
  artists: ArtistVibe[];
  tracks: TrackVibe[];
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

type GenreProfile = {
  match: string;
  axes: Partial<Axes>;
  // `scene` and `palette` are written as image-generation prompt material -
  // concrete, visual, and specific rather than abstract mood words.
  scene: string;
  palette: string;
};

const GENRE_PROFILES: GenreProfile[] = [
  { match: 'lo-fi', axes: { energy: 0.15, brightness: 0.35, acoustic: 0.6, maximalism: 0.2 }, scene: 'A rain-streaked bedroom window at night, a desk lamp glowing over stacked cassette tapes and a half-finished cup of tea', palette: 'muted beige, faded yellow, static grey' },
  { match: 'bedroom', axes: { energy: 0.2, brightness: 0.4, acoustic: 0.55, maximalism: 0.25 }, scene: 'A blanket fort lit by a phone screen and a string of fairy lights, journal pages scattered across the sheets', palette: 'soft pink, cream, dim gold' },
  { match: 'metal', axes: { energy: 0.95, brightness: 0.2, acoustic: 0.1, maximalism: 0.85 }, scene: 'A concrete bunker lit by a single strobing red light, amplifier stacks taller than the room, chains hanging from the ceiling', palette: 'black, blood red, gunmetal' },
  { match: 'punk', axes: { energy: 0.9, brightness: 0.35, acoustic: 0.2, maximalism: 0.5, vintage: 0.5 }, scene: 'A graffiti-covered basement show, torn flyers taped to a plywood stage, a crowd mid-pogo under a single bare bulb', palette: 'safety-pin silver, faded black, spray-paint pink' },
  { match: 'hardcore', axes: { energy: 0.95, brightness: 0.15, acoustic: 0.1, maximalism: 0.7 }, scene: 'A packed warehouse pit under flickering fluorescent tubes, sweat-slicked walls, a mic cord whipping through the air', palette: 'stark white, bruise purple, industrial grey' },
  { match: 'r&b', axes: { energy: 0.45, brightness: 0.4, acoustic: 0.35, maximalism: 0.4 }, scene: 'A dim velvet lounge, candlelight reflected in a half-empty glass, silhouettes swaying close on a small dance floor', palette: 'deep maroon, gold, smoky plum' },
  { match: 'soul', axes: { energy: 0.4, brightness: 0.55, acoustic: 0.55, vintage: 0.6 }, scene: 'A church-turned-nightclub with stained glass glowing behind the stage, a brass section catching the light', palette: 'amber, burnt orange, mahogany' },
  { match: 'funk', axes: { energy: 0.65, brightness: 0.7, acoustic: 0.4, maximalism: 0.6, vintage: 0.55 }, scene: 'A mirrored disco corridor, platform boots squeaking on parquet, a bassline rendered as pulsing light trails', palette: 'chrome, tangerine, electric purple' },
  { match: 'folk', axes: { energy: 0.25, brightness: 0.45, acoustic: 0.85, maximalism: 0.15, vintage: 0.5 }, scene: 'A wooden porch at golden hour, a guitar leaning against a rocking chair, fields rolling out toward the treeline', palette: 'wheat gold, sage green, weathered brown' },
  { match: 'country', axes: { energy: 0.35, brightness: 0.55, acoustic: 0.75, vintage: 0.55 }, scene: 'A dusty highway diner at sunset, neon signage buzzing over a pickup truck parked outside', palette: 'rust orange, denim blue, dust beige' },
  { match: 'jazz', axes: { energy: 0.4, brightness: 0.45, acoustic: 0.7, maximalism: 0.45, vintage: 0.6 }, scene: 'A smoke-curled basement club, a single spotlight on an upright bass, ice clinking in low glasses', palette: 'charcoal, amber, brass' },
  { match: 'classical', axes: { energy: 0.35, brightness: 0.4, acoustic: 0.9, maximalism: 0.6, vintage: 0.7 }, scene: 'A candlelit concert hall, sheet music trembling on stands, velvet curtains framing a grand stage', palette: 'ivory, burgundy, gold leaf' },
  { match: 'ambient', axes: { energy: 0.1, brightness: 0.4, acoustic: 0.4, maximalism: 0.1 }, scene: 'A vast empty room dissolving into fog, a single shaft of light falling through a skylight onto still water', palette: 'pale blue, silver, mist white' },
  { match: 'techno', axes: { energy: 0.85, brightness: 0.3, acoustic: 0.05, maximalism: 0.55 }, scene: 'A concrete warehouse rave lit by a strobing laser grid, fog machines churning under exposed pipework', palette: 'acid green, black, strobe white' },
  { match: 'house', axes: { energy: 0.8, brightness: 0.65, acoustic: 0.05, maximalism: 0.5 }, scene: 'A packed rooftop dance floor at 3am, string lights swaying above a sea of raised hands', palette: 'hot pink, deep blue, gold' },
  { match: 'edm', axes: { energy: 0.9, brightness: 0.7, acoustic: 0.05, maximalism: 0.7 }, scene: 'A festival main stage mid-drop, pyrotechnics and confetti cannons firing over a wall of pulsing LED screens', palette: 'neon cyan, magenta, white strobe' },
  { match: 'trap', axes: { energy: 0.7, brightness: 0.3, acoustic: 0.05, maximalism: 0.6 }, scene: 'A fogged-up room lit by a single purple LED strip, stacks of cash fanned across a glass table', palette: 'deep purple, black, chrome' },
  { match: 'hip hop', axes: { energy: 0.6, brightness: 0.4, acoustic: 0.15, maximalism: 0.55 }, scene: 'A city rooftop at night, skyline glittering behind a boombox and a spray-painted brick wall', palette: 'gold chain yellow, concrete grey, neon red' },
  { match: 'rap', axes: { energy: 0.65, brightness: 0.35, acoustic: 0.15, maximalism: 0.55 }, scene: 'A cypher circle under a streetlight, breath visible in the cold, sneakers scuffing cracked asphalt', palette: 'asphalt grey, streetlight orange, denim' },
  { match: 'indie', axes: { energy: 0.4, brightness: 0.45, acoustic: 0.5, maximalism: 0.3 }, scene: 'A cluttered bedroom studio, fairy lights strung over a cracked window, a cassette four-track on a thrifted desk', palette: 'faded denim, mustard yellow, dusty rose' },
  { match: 'alt', axes: { energy: 0.45, brightness: 0.4, acoustic: 0.4, maximalism: 0.35 }, scene: 'A rain-slicked city street reflecting a single neon sign, a lone figure walking with headphones on', palette: 'wet asphalt grey, neon blue, muted red' },
  { match: 'shoegaze', axes: { energy: 0.5, brightness: 0.3, acoustic: 0.3, maximalism: 0.75 }, scene: 'A wall of fog and reverb, a guitarist barely visible behind a haze of dry ice and pedal lights', palette: 'lavender haze, dusty blue, silver static' },
  { match: 'dream pop', axes: { energy: 0.3, brightness: 0.5, acoustic: 0.4, maximalism: 0.5 }, scene: 'A sunlit meadow blurred at the edges like an overexposed photograph, petals drifting through soft light', palette: 'pastel pink, powder blue, hazy gold' },
  { match: 'pop', axes: { energy: 0.6, brightness: 0.75, acoustic: 0.25, maximalism: 0.5 }, scene: 'A glossy studio backdrop of oversized bubblegum-pink balloons, confetti frozen mid-fall under studio lights', palette: 'bubblegum pink, electric yellow, white' },
  { match: 'disco', axes: { energy: 0.75, brightness: 0.8, acoustic: 0.3, maximalism: 0.6, vintage: 0.7 }, scene: 'A mirror-ball ballroom, platform shoes catching fractured light, sequins scattering color across the walls', palette: 'gold, hot pink, mirror silver' },
  { match: 'reggae', axes: { energy: 0.4, brightness: 0.6, acoustic: 0.5, maximalism: 0.3, vintage: 0.5 }, scene: 'A sun-baked beach shack, palm shadows swaying over a hammock and a half-stacked speaker system', palette: 'sun gold, palm green, faded red' },
  { match: 'latin', axes: { energy: 0.7, brightness: 0.75, acoustic: 0.45, maximalism: 0.55 }, scene: 'A crowded plaza at dusk, string lights zigzagging overhead, couples spinning under warm lantern light', palette: 'warm terracotta, marigold, deep red' },
  { match: 'k-pop', axes: { energy: 0.75, brightness: 0.8, acoustic: 0.15, maximalism: 0.7 }, scene: 'A hyper-saturated stage set with mirrored panels and choreographed light beams sweeping in unison', palette: 'candy pink, holographic silver, neon blue' },
  { match: 'emo', axes: { energy: 0.55, brightness: 0.25, acoustic: 0.35, maximalism: 0.45, vintage: 0.4 }, scene: 'A rain-fogged car window, a half-lit bedroom with band posters peeling off the wall, a diary left open', palette: 'faded black, bruised purple, grey' },
  { match: 'blues', axes: { energy: 0.35, brightness: 0.35, acoustic: 0.75, vintage: 0.7 }, scene: 'A cracked-leather barstool under a single hanging bulb, a slide guitar resting against a whiskey-stained table', palette: 'whiskey amber, faded denim, smoke grey' },
  { match: 'rock', axes: { energy: 0.65, brightness: 0.45, acoustic: 0.35, maximalism: 0.55 }, scene: 'A sweat-soaked arena stage, guitar feedback catching under white spotlights, amps stacked to the rafters', palette: 'denim blue, rust, spotlight white' },
  { match: 'electronic', axes: { energy: 0.65, brightness: 0.45, acoustic: 0.05, maximalism: 0.5 }, scene: 'A server-room-like grid of pulsing LEDs, cables snaking across a dark studio floor', palette: 'electric blue, black, chrome' },
  { match: 'dance', axes: { energy: 0.8, brightness: 0.7, acoustic: 0.1, maximalism: 0.55 }, scene: 'A strobe-lit floor packed shoulder to shoulder, hands raised into a haze of stage smoke', palette: 'hot magenta, strobe white, deep blue' },
  { match: 'singer songwriter', axes: { energy: 0.25, brightness: 0.45, acoustic: 0.8, maximalism: 0.15, vintage: 0.4 }, scene: 'A single stool under a warm spotlight, an acoustic guitar leaning beside a glass of water', palette: 'warm amber, oak brown, cream' },
  { match: 'world', axes: { energy: 0.45, brightness: 0.6, acoustic: 0.65, maximalism: 0.4 }, scene: 'A sunlit market square filled with woven textiles and hand drums, dust rising in golden light', palette: 'terracotta, saffron, indigo' },
  { match: 'soundtrack', axes: { energy: 0.35, brightness: 0.4, acoustic: 0.55, maximalism: 0.5, vintage: 0.4 }, scene: 'A sweeping cinematic vista at dawn, an orchestral swell rising over mist-covered mountains', palette: 'steel blue, dawn gold, charcoal' },
  { match: 'dubstep', axes: { energy: 0.9, brightness: 0.35, acoustic: 0.05, maximalism: 0.75 }, scene: 'A bass-shaking basement rig, subwoofers visibly rattling under pulsing green laser light', palette: 'toxic green, black, chrome' },
  { match: 'drum and bass', axes: { energy: 0.9, brightness: 0.4, acoustic: 0.05, maximalism: 0.7 }, scene: 'A breakneck strobe-lit tunnel rave, light trails smearing behind dancers moving too fast to focus', palette: 'electric green, black, strobe white' },
];

const DEFAULT_PROFILE: Pick<GenreProfile, 'scene' | 'palette'> = {
  scene: 'A room that resists any single aesthetic - shelves mixing records from a dozen different scenes, no two objects quite matching',
  palette: 'mixed neutrals, unexpected accent colors',
};

function normalizeGenre(genre: string): string {
  return genre.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function matchGenreProfiles(rawGenres: string[]): GenreProfile[] {
  const genres = rawGenres.map(normalizeGenre);
  return GENRE_PROFILES.filter((g) => genres.some((genre) => genre.includes(normalizeGenre(g.match))));
}

function axesForProfiles(matches: GenreProfile[]): Axes {
  if (matches.length === 0) {
    return { energy: 0.5, brightness: 0.5, acoustic: 0.5, maximalism: 0.5, vintage: 0.5 };
  }
  const axes: Axes = { energy: 0, brightness: 0, acoustic: 0, maximalism: 0, vintage: 0 };
  const counts: Record<keyof Axes, number> = { energy: 0, brightness: 0, acoustic: 0, maximalism: 0, vintage: 0 };
  for (const m of matches) {
    for (const key of Object.keys(m.axes) as (keyof Axes)[]) {
      axes[key] += m.axes[key]!;
      counts[key] += 1;
    }
  }
  for (const key of Object.keys(axes) as (keyof Axes)[]) {
    axes[key] = counts[key] > 0 ? axes[key] / counts[key] : 0.5;
  }
  return axes;
}

function tierWord(value: number, low: string, mid: string, high: string): string {
  if (value < 0.35) return low;
  if (value > 0.65) return high;
  return mid;
}

function sceneAndPalette(matches: GenreProfile[]): { scene: string; palette: string } {
  if (matches.length === 0) return DEFAULT_PROFILE;
  const scene = matches[0].scene;
  const palette = [...new Set(matches.slice(0, 2).flatMap((m) => m.palette.split(', ')))]
    .slice(0, 5)
    .join(', ');
  return { scene, palette };
}

/**
 * Builds a long, visually concrete paragraph meant to be usable directly as
 * an image-generation prompt: a scene, a color palette, a mood, and (for
 * tracks) era/length framing - rather than a short abstract mood phrase.
 * Spotify's reduced /me/top/* response has no `popularity` field for either
 * tracks or artists, so "fame" isn't something these can describe.
 */
function trackVibeDescription(
  genres: string[],
  axes: Axes,
  track: SpotifyTrack,
  features: AudioFeatures | null
): string {
  const matches = matchGenreProfiles(genres);
  const { scene, palette } = sceneAndPalette(matches);

  let energy = axes.energy;
  let brightness = axes.brightness;
  if (features) {
    energy = (energy + features.energy) / 2;
    brightness = (brightness + features.valence) / 2;
  }
  const energyWord = tierWord(energy, 'slow and unhurried', 'mid-tempo', 'high-energy and intense');
  const moodWord = tierWord(brightness, 'shadowed and moody', 'even-keeled', 'bright and sun-lit');

  const minutes = track.duration_ms / 60000;
  const lengthPhrase = tierWord(
    minutes / 6,
    'It is a tight, economical track that says what it needs to and gets out',
    'It is a standard-length track',
    'It is a sprawling, extended track that takes its time'
  );

  const explicitPhrase = track.explicit ? ' Explicit lyrics.' : '';

  const eraPhrase = track.album.release_date
    ? `Released in ${track.album.release_date.slice(0, 4)}, it carries a ${tierWord(
        axes.vintage,
        'thoroughly modern, current-day',
        'timeless, hard-to-date',
        'nostalgic, vintage-leaning'
      )} feel.`
    : '';

  return [
    `${scene}.`,
    `Color palette: ${palette}.`,
    `The overall feeling is ${energyWord}, ${moodWord}. ${lengthPhrase}.${explicitPhrase}`,
    eraPhrase,
  ]
    .filter(Boolean)
    .join(' ');
}

function artistVibeDescription(artist: SpotifyArtist): string {
  const matches = matchGenreProfiles(artist.genres);
  const axes = axesForProfiles(matches);
  const { scene, palette } = sceneAndPalette(matches);

  const energyWord = tierWord(axes.energy, 'slow and unhurried', 'mid-tempo', 'high-energy and intense');
  const moodWord = tierWord(axes.brightness, 'shadowed and moody', 'even-keeled', 'bright and sun-lit');

  const genrePhrase =
    artist.genres.length > 0
      ? `Their sound is generally described as ${formatList(artist.genres.slice(0, 3))}.`
      : '';

  return [
    `${scene}.`,
    `Color palette: ${palette}.`,
    `The overall feeling is ${energyWord}, ${moodWord}.`,
    genrePhrase,
  ]
    .filter(Boolean)
    .join(' ');
}

export function buildVibeProfile(
  artists: SpotifyArtist[],
  tracks: SpotifyTrack[],
  genresByArtistId: Map<string, string[]>,
  audioFeatures: Map<string, AudioFeatures> | null
): VibeProfile {
  const artistVibes: ArtistVibe[] = artists.map((artist) => ({
    id: artist.id,
    name: artist.name,
    genres: artist.genres,
    spotifyUrl: `https://open.spotify.com/artist/${artist.id}`,
    vibe: artistVibeDescription(artist),
  }));

  const trackVibes: TrackVibe[] = tracks.map((track) => {
    const genres = genresByArtistId.get(track.artists[0]?.id) ?? [];
    const axes = axesForProfiles(matchGenreProfiles(genres));
    return {
      id: track.id,
      name: track.name,
      artistNames: track.artists.map((a) => a.name).join(', '),
      albumImage: track.album.images[0]?.url ?? null,
      spotifyUrl: track.external_urls.spotify,
      releaseYear: track.album.release_date ? parseInt(track.album.release_date.slice(0, 4), 10) : null,
      vibe: trackVibeDescription(genres, axes, track, audioFeatures?.get(track.id) ?? null),
    };
  });

  const overall = aggregateAxes(artists);
  const moodTags = topMoodTags(overall);
  const dominantGenres = [...new Set(artists.flatMap((a) => a.genres))].slice(0, 5);

  return {
    artists: artistVibes,
    tracks: trackVibes,
    moodTags,
    livingRoomDescription: describeLivingRoom(overall, dominantGenres, artists.map((a) => a.name)),
  };
}

function aggregateAxes(artists: SpotifyArtist[]): Axes {
  const totals: Axes = { energy: 0, brightness: 0, acoustic: 0, maximalism: 0, vintage: 0 };
  let count = 0;
  artists.forEach((artist, index) => {
    const weight = artists.length - index;
    const axes = axesForProfiles(matchGenreProfiles(artist.genres));
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
