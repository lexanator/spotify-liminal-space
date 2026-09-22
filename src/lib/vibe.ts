import type { AudioFeatures, SpotifyArtist, SpotifyTrack } from './spotify-api';

export type TrackVibe = {
  id: string;
  name: string;
  artistNames: string;
  albumImage: string | null;
  spotifyUrl: string;
  releaseYear: number | null;
  vibe: string;
  colors: string[];
};

export type ArtistVibe = {
  id: string;
  name: string;
  image: string | null;
  genres: string[];
  spotifyUrl: string;
  vibe: string;
  colors: string[];
};

export type VibeProfile = {
  artists: ArtistVibe[];
  tracks: TrackVibe[];
  moodTags: string[];
  liminalSpaceDescription: string;
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
  // concrete, visual, and specific rather than abstract mood words. `colors`
  // are the same palette as actual hex values, for rendering gradient cards.
  // `liminalVibe` is a "backrooms"-style empty, uncanny architectural space
  // themed by genre (an abandoned emo venue, a k-pop mirrored hallway, a
  // shuttered rave) - genre-neutral mood words alone rendered as generic,
  // boring stock photos instead of something actually stylized.
  scene: string;
  palette: string;
  colors: [string, string, string];
  liminalVibe: string;
};

const GENRE_PROFILES: GenreProfile[] = [
  { match: 'lo-fi', axes: { energy: 0.15, brightness: 0.35, acoustic: 0.6, maximalism: 0.2 }, scene: 'A rain-streaked bedroom window at night, a desk lamp glowing over stacked cassette tapes and a half-finished cup of tea', palette: 'muted beige, faded yellow, static grey', colors: ['#d8c9a3', '#e8d17a', '#9a9a92'], liminalVibe: 'A rain-fogged laundromat at 3am: a single flickering fluorescent tube, rows of dryers humming with nothing inside them, a lukewarm cup of tea left on a plastic chair, no one else there' },
  { match: 'bedroom', axes: { energy: 0.2, brightness: 0.4, acoustic: 0.55, maximalism: 0.25 }, scene: 'A blanket fort lit by a phone screen and a string of fairy lights, journal pages scattered across the sheets', palette: 'soft pink, cream, dim gold', colors: ['#f2c6d0', '#f5ecd7', '#c9a227'], liminalVibe: 'An empty motel room where the fairy lights were never taken down: pastel wallpaper peeling at the seams, a disposable camera left on the nightstand, a television humming static to no one' },
  { match: 'metal', axes: { energy: 0.95, brightness: 0.2, acoustic: 0.1, maximalism: 0.85 }, scene: 'A concrete bunker lit by a single strobing red light, amplifier stacks taller than the room, chains hanging from the ceiling', palette: 'black, blood red, gunmetal', colors: ['#111111', '#7a0e0e', '#4b4f52'], liminalVibe: "A pitch-black concrete stairwell that seems to descend forever, a single red emergency light pulsing at each landing, a distant amplifier hum echoing up from somewhere below" },
  { match: 'punk', axes: { energy: 0.9, brightness: 0.35, acoustic: 0.2, maximalism: 0.5, vintage: 0.5 }, scene: 'A graffiti-covered basement show, torn flyers taped to a plywood stage, a crowd mid-pogo under a single bare bulb', palette: 'safety-pin silver, faded black, spray-paint pink', colors: ['#c7c7c7', '#2b2b2b', '#e8447a'], liminalVibe: "An abandoned all-ages venue long after the last show ended: rows of empty folding chairs facing a dark stage, a red exit sign glowing at the end of a flyer-covered hallway, a single fluorescent tube buzzing and flickering overhead" },
  { match: 'hardcore', axes: { energy: 0.95, brightness: 0.15, acoustic: 0.1, maximalism: 0.7 }, scene: 'A packed warehouse pit under flickering fluorescent tubes, sweat-slicked walls, a mic cord whipping through the air', palette: 'stark white, bruise purple, industrial grey', colors: ['#f5f5f5', '#5b3a5c', '#6b6f72'], liminalVibe: "A cinderblock stairwell with no visible exit, flyers stapled in overlapping layers on every wall, a bare bulb swinging slightly though there's no draft" },
  { match: 'r&b', axes: { energy: 0.45, brightness: 0.4, acoustic: 0.35, maximalism: 0.4 }, scene: 'A dim velvet lounge, candlelight reflected in a half-empty glass, silhouettes swaying close on a small dance floor', palette: 'deep maroon, gold, smoky plum', colors: ['#5c1a2b', '#c9a227', '#6b4560'], liminalVibe: 'A velvet-lined lounge long after last call: candles burned down to puddles of wax, a record still spinning on an untouched turntable, the exit door somehow further away than it should be' },
  { match: 'soul', axes: { energy: 0.4, brightness: 0.55, acoustic: 0.55, vintage: 0.6 }, scene: 'A church-turned-nightclub with stained glass glowing behind the stage, a brass section catching the light', palette: 'amber, burnt orange, mahogany', colors: ['#c9821a', '#b5451f', '#5a2e1e'], liminalVibe: 'An empty church-turned-nightclub at dawn: stained glass glowing with no sun behind it, a brass instrument left resting on an empty stage, dust suspended motionless in amber light' },
  { match: 'funk', axes: { energy: 0.65, brightness: 0.7, acoustic: 0.4, maximalism: 0.6, vintage: 0.55 }, scene: 'A mirrored disco corridor, platform boots squeaking on parquet, a bassline rendered as pulsing light trails', palette: 'chrome, tangerine, electric purple', colors: ['#c9c9c9', '#f0842a', '#7a1fa2'], liminalVibe: 'An abandoned roller rink with the disco ball still slowly turning, mirrored walls reflecting a floor with no skaters on it, the sound system left on humming with nothing playing through it' },
  { match: 'folk', axes: { energy: 0.25, brightness: 0.45, acoustic: 0.85, maximalism: 0.15, vintage: 0.5 }, scene: 'A wooden porch at golden hour, a guitar leaning against a rocking chair, fields rolling out toward the treeline', palette: 'wheat gold, sage green, weathered brown', colors: ['#d8b96a', '#8a9a6b', '#6b4a35'], liminalVibe: "An empty wooden cabin deep in a forest that goes on for miles in every direction, a guitar leaning against a rocking chair that's still gently moving, golden light with no sun visible anywhere" },
  { match: 'country', axes: { energy: 0.35, brightness: 0.55, acoustic: 0.75, vintage: 0.55 }, scene: 'A dusty highway diner at sunset, neon signage buzzing over a pickup truck parked outside', palette: 'rust orange, denim blue, dust beige', colors: ['#b5541f', '#3b4b6b', '#d8c9a3'], liminalVibe: 'A gas station at the edge of an endless highway, a neon sign buzzing over empty pumps, a jukebox playing to no one inside, fields stretching toward a horizon that never arrives' },
  { match: 'jazz', axes: { energy: 0.4, brightness: 0.45, acoustic: 0.7, maximalism: 0.45, vintage: 0.6 }, scene: 'A smoke-curled basement club, a single spotlight on an upright bass, ice clinking in low glasses', palette: 'charcoal, amber, brass', colors: ['#2e2e2e', '#c9821a', '#a67c3d'], liminalVibe: "A basement jazz club long after closing: chairs stacked on every table but one, a single spotlight still lit on an untouched upright bass, a door at the back left slightly ajar onto a hallway that shouldn't be there" },
  { match: 'classical', axes: { energy: 0.35, brightness: 0.4, acoustic: 0.9, maximalism: 0.6, vintage: 0.7 }, scene: 'A candlelit concert hall, sheet music trembling on stands, velvet curtains framing a grand stage', palette: 'ivory, burgundy, gold leaf', colors: ['#f2ead9', '#6e1423', '#c9a227'], liminalVibe: 'An empty concert hall at 3am, house lights dimmed to almost nothing, a single spotlight on an empty piano bench, red velvet seats stretching back further than the room should allow' },
  { match: 'ambient', axes: { energy: 0.1, brightness: 0.4, acoustic: 0.4, maximalism: 0.1 }, scene: 'A vast empty room dissolving into fog, a single shaft of light falling through a skylight onto still water', palette: 'pale blue, silver, mist white', colors: ['#a9c6d8', '#c7c7c7', '#eef2f5'], liminalVibe: 'An endless white room dissolving into fog in every direction, a single fluorescent panel humming overhead, no doors, no windows, just the hum' },
  { match: 'techno', axes: { energy: 0.85, brightness: 0.3, acoustic: 0.05, maximalism: 0.55 }, scene: 'A concrete warehouse rave lit by a strobing laser grid, fog machines churning under exposed pipework', palette: 'acid green, black, strobe white', colors: ['#a6ff00', '#0a0a0a', '#f5f5f5'], liminalVibe: 'An endless corridor inside a shuttered warehouse rave: strobe lights still flickering in empty rooms, fog machine residue hanging motionless in the air, a subwoofer humming somewhere unseen' },
  { match: 'house', axes: { energy: 0.8, brightness: 0.65, acoustic: 0.05, maximalism: 0.5 }, scene: 'A packed rooftop dance floor at 3am, string lights swaying above a sea of raised hands', palette: 'hot pink, deep blue, gold', colors: ['#e8447a', '#1c2b5c', '#c9a227'], liminalVibe: 'A rooftop where the party ended hours ago but the lights never turned off: string lights swaying in a wind that isn\'t there, a disco ball still slowly turning, the city below eerily silent' },
  { match: 'edm', axes: { energy: 0.9, brightness: 0.7, acoustic: 0.05, maximalism: 0.7 }, scene: 'A festival main stage mid-drop, pyrotechnics and confetti cannons firing over a wall of pulsing LED screens', palette: 'neon cyan, magenta, white strobe', colors: ['#00e5ff', '#ff00e5', '#f5f5f5'], liminalVibe: 'An empty festival field the morning after: a stage still lit and humming, confetti and glow sticks scattered across trampled grass, speaker stacks facing an audience of no one' },
  { match: 'trap', axes: { energy: 0.7, brightness: 0.3, acoustic: 0.05, maximalism: 0.6 }, scene: 'A fogged-up room lit by a single purple LED strip, stacks of cash fanned across a glass table', palette: 'deep purple, black, chrome', colors: ['#3a1c5c', '#0a0a0a', '#c9c9c9'], liminalVibe: "A room lit only by a purple LED strip with no visible source, a stack of cash fanned across a glass table that reflects no ceiling above it, a bassline you can feel in the floor but can't hear" },
  { match: 'hip hop', axes: { energy: 0.6, brightness: 0.4, acoustic: 0.15, maximalism: 0.55 }, scene: 'A city rooftop at night, skyline glittering behind a boombox and a spray-painted brick wall', palette: 'gold chain yellow, concrete grey, neon red', colors: ['#e8c227', '#7a7a7a', '#e8302b'], liminalVibe: "An empty parking garage rooftop at 3am, a boombox left playing to no one, a chain-link fence rattling in wind that isn't there, the skyline glowing distant and silent" },
  { match: 'rap', axes: { energy: 0.65, brightness: 0.35, acoustic: 0.15, maximalism: 0.55 }, scene: 'A cypher circle under a streetlight, breath visible in the cold, sneakers scuffing cracked asphalt', palette: 'asphalt grey, streetlight orange, denim', colors: ['#5a5a5a', '#e0842a', '#3b4b6b'], liminalVibe: "A cracked concrete underpass lit by a single streetlight flickering on a loop, breath-fog visible in air that isn't cold, footsteps echoing that aren't yours" },
  { match: 'indie', axes: { energy: 0.4, brightness: 0.45, acoustic: 0.5, maximalism: 0.3 }, scene: 'A cluttered bedroom studio, fairy lights strung over a cracked window, a cassette four-track on a thrifted desk', palette: 'faded denim, mustard yellow, dusty rose', colors: ['#5b7196', '#c9a227', '#c98a94'], liminalVibe: 'A bedroom-studio abandoned mid-session: a cassette four-track still recording silence, fairy lights looping over a window that looks out onto nothing, a corkboard of photos of people who don\'t seem to exist' },
  { match: 'alt', axes: { energy: 0.45, brightness: 0.4, acoustic: 0.4, maximalism: 0.35 }, scene: 'A rain-slicked city street reflecting a single neon sign, a lone figure walking with headphones on', palette: 'wet asphalt grey, neon blue, muted red', colors: ['#4a4a4a', '#2e6fe8', '#a4423a'], liminalVibe: "A rain-slicked city street with every window dark except one neon sign, a silhouette that never quite turns the corner, headphones playing faintly with no one wearing them" },
  { match: 'shoegaze', axes: { energy: 0.5, brightness: 0.3, acoustic: 0.3, maximalism: 0.75 }, scene: 'A wall of fog and reverb, a guitarist barely visible behind a haze of dry ice and pedal lights', palette: 'lavender haze, dusty blue, silver static', colors: ['#b8a8d8', '#7a92ad', '#c7c7c7'], liminalVibe: "A hallway that dissolves into fog a few feet in either direction, the hum of an amplifier somewhere unseen, everything slightly out of focus like a memory you can't quite place" },
  { match: 'dream pop', axes: { energy: 0.3, brightness: 0.5, acoustic: 0.4, maximalism: 0.5 }, scene: 'A sunlit meadow blurred at the edges like an overexposed photograph, petals drifting through soft light', palette: 'pastel pink, powder blue, hazy gold', colors: ['#f2c6d0', '#b8d0e8', '#e8d17a'], liminalVibe: 'A sunlit meadow that turns out to be indoors somehow, wallpaper painted like a sky, petals drifting from a ceiling with no vents, everything slightly overexposed' },
  { match: 'pop', axes: { energy: 0.6, brightness: 0.75, acoustic: 0.25, maximalism: 0.5 }, scene: 'A glossy studio backdrop of oversized bubblegum-pink balloons, confetti frozen mid-fall under studio lights', palette: 'bubblegum pink, electric yellow, white', colors: ['#ff6fb0', '#f2e83c', '#ffffff'], liminalVibe: 'An abandoned television studio set: stage lights still on, confetti frozen mid-fall that never lands, rows of empty folding chairs facing a stage with no performer' },
  { match: 'disco', axes: { energy: 0.75, brightness: 0.8, acoustic: 0.3, maximalism: 0.6, vintage: 0.7 }, scene: 'A mirror-ball ballroom, platform shoes catching fractured light, sequins scattering color across the walls', palette: 'gold, hot pink, mirror silver', colors: ['#c9a227', '#e8447a', '#d8d8d8'], liminalVibe: 'An abandoned ballroom where the mirror ball never stopped turning, dust hanging in shafts of colored light, an endless dance floor stretching into a darkness with no far wall' },
  { match: 'reggae', axes: { energy: 0.4, brightness: 0.6, acoustic: 0.5, maximalism: 0.3, vintage: 0.5 }, scene: 'A sun-baked beach shack, palm shadows swaying over a hammock and a half-stacked speaker system', palette: 'sun gold, palm green, faded red', colors: ['#e8c227', '#3f7a3f', '#a4423a'], liminalVibe: "An empty beach shack where you can't hear any ocean, palm-leaf shadows swaying on the wall from a breeze that isn't blowing, a hammock rocking gently on its own" },
  { match: 'latin', axes: { energy: 0.7, brightness: 0.75, acoustic: 0.45, maximalism: 0.55 }, scene: 'A crowded plaza at dusk, string lights zigzagging overhead, couples spinning under warm lantern light', palette: 'warm terracotta, marigold, deep red', colors: ['#c1653a', '#e8a227', '#7a1f1f'], liminalVibe: 'A plaza at dusk with string lights swaying overhead and not a single person in the crowd that should be there, lanterns still lit, music echoing from speakers with no visible source' },
  { match: 'k-pop', axes: { energy: 0.75, brightness: 0.8, acoustic: 0.15, maximalism: 0.7 }, scene: 'A hyper-saturated stage set with mirrored panels and choreographed light beams sweeping in unison', palette: 'candy pink, holographic silver, neon blue', colors: ['#ff6fb0', '#d8d8e8', '#2e9dff'], liminalVibe: 'An endless pastel hallway of mirrored dressing rooms, vanity bulbs buzzing in an unbroken row disappearing into the distance, confetti still settling on a floor with no one around' },
  { match: 'emo', axes: { energy: 0.55, brightness: 0.25, acoustic: 0.35, maximalism: 0.45, vintage: 0.4 }, scene: 'A rain-fogged car window, a half-lit bedroom with band posters peeling off the wall, a diary left open', palette: 'faded black, bruised purple, grey', colors: ['#1c1c1c', '#4a2e5c', '#6b6b6b'], liminalVibe: "An abandoned all-ages venue backroom: black walls devoured by peeling band flyers, a red exit sign the only light at the end of a hallway that keeps going, a guitar leaning against an amp that's still faintly humming" },
  { match: 'blues', axes: { energy: 0.35, brightness: 0.35, acoustic: 0.75, vintage: 0.7 }, scene: 'A cracked-leather barstool under a single hanging bulb, a slide guitar resting against a whiskey-stained table', palette: 'whiskey amber, faded denim, smoke grey', colors: ['#a6690f', '#4a5f7a', '#5a5a5a'], liminalVibe: 'A room above a bar that closed decades ago, a bare bulb swinging on its own, a slide guitar propped in the corner, a half-empty bottle that never seems to empty any further' },
  { match: 'rock', axes: { energy: 0.65, brightness: 0.45, acoustic: 0.35, maximalism: 0.55 }, scene: 'A sweat-soaked arena stage, guitar feedback catching under white spotlights, amps stacked to the rafters', palette: 'denim blue, rust, spotlight white', colors: ['#3b4b6b', '#a4472b', '#f5f5f5'], liminalVibe: 'An arena the morning after a show that never happened: amps stacked to the rafters humming with feedback, spotlights still sweeping an empty stage, seats stretching into darkness' },
  { match: 'electronic', axes: { energy: 0.65, brightness: 0.45, acoustic: 0.05, maximalism: 0.5 }, scene: 'A server-room-like grid of pulsing LEDs, cables snaking across a dark studio floor', palette: 'electric blue, black, chrome', colors: ['#2e6fe8', '#0a0a0a', '#c9c9c9'], liminalVibe: 'A server-room corridor lit by pulsing LEDs with no visible machines, cables snaking across a floor that never quite ends, a low electronic hum that never resolves into a song' },
  { match: 'dance', axes: { energy: 0.8, brightness: 0.7, acoustic: 0.1, maximalism: 0.55 }, scene: 'A strobe-lit floor packed shoulder to shoulder, hands raised into a haze of stage smoke', palette: 'hot magenta, strobe white, deep blue', colors: ['#e83ce0', '#f5f5f5', '#1c2b5c'], liminalVibe: 'A strobe-lit floor with the lights still flashing to music that stopped, fog machine haze hanging motionless, mirrors on every wall reflecting a room with no one in it' },
  { match: 'singer songwriter', axes: { energy: 0.25, brightness: 0.45, acoustic: 0.8, maximalism: 0.15, vintage: 0.4 }, scene: 'A single stool under a warm spotlight, an acoustic guitar leaning beside a glass of water', palette: 'warm amber, oak brown, cream', colors: ['#c9821a', '#6b4a2e', '#f2ead9'], liminalVibe: 'A single spotlight on an empty stool, an acoustic guitar leaning against it, a room that should hold an audience but holds only empty chairs stretching back into the dark' },
  { match: 'world', axes: { energy: 0.45, brightness: 0.6, acoustic: 0.65, maximalism: 0.4 }, scene: 'A sunlit market square filled with woven textiles and hand drums, dust rising in golden light', palette: 'terracotta, saffron, indigo', colors: ['#c1653a', '#e8a227', '#3b3a7a'], liminalVibe: 'A market square at an hour with no people in it, woven textiles still hanging, hand drums resting untouched, dust rising in golden light with no wind to stir it' },
  { match: 'soundtrack', axes: { energy: 0.35, brightness: 0.4, acoustic: 0.55, maximalism: 0.5, vintage: 0.4 }, scene: 'A sweeping cinematic vista at dawn, an orchestral swell rising over mist-covered mountains', palette: 'steel blue, dawn gold, charcoal', colors: ['#4a6b8a', '#e8b04a', '#2e2e2e'], liminalVibe: "A vast mist-covered vista that feels indoors and outdoors at once, an orchestral swell with no visible source, mountains that don't end no matter how far you walk" },
  { match: 'dubstep', axes: { energy: 0.9, brightness: 0.35, acoustic: 0.05, maximalism: 0.75 }, scene: 'A bass-shaking basement rig, subwoofers visibly rattling under pulsing green laser light', palette: 'toxic green, black, chrome', colors: ['#7aff2e', '#0a0a0a', '#c9c9c9'], liminalVibe: 'A basement rig still rattling a subwoofer with no one left to hear it, green laser light sweeping an empty room in a loop that never varies' },
  { match: 'drum and bass', axes: { energy: 0.9, brightness: 0.4, acoustic: 0.05, maximalism: 0.7 }, scene: 'A breakneck strobe-lit tunnel rave, light trails smearing behind dancers moving too fast to focus', palette: 'electric green, black, strobe white', colors: ['#2eff7a', '#0a0a0a', '#f5f5f5'], liminalVibe: 'A tunnel rave with strobe lights still flashing down a corridor that has no end, light trails smearing behind dancers who aren\'t there anymore' },
];

const DEFAULT_PROFILE: Pick<GenreProfile, 'scene' | 'palette' | 'colors' | 'liminalVibe'> = {
  scene: 'A room that resists any single aesthetic - shelves mixing records from a dozen different scenes, no two objects quite matching',
  palette: 'mixed neutrals, unexpected accent colors',
  colors: ['#6b6b6b', '#9a9a9a', '#c9c9c9'],
  liminalVibe: "A liminal space that refuses to settle into any one aesthetic - a hallway that keeps changing style every few doors, fluorescent light giving way to neon giving way to candlelight, none of it quite matching, none of it quite explainable",
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

function sceneAndPalette(matches: GenreProfile[]): { scene: string; palette: string; colors: string[] } {
  if (matches.length === 0) return DEFAULT_PROFILE;
  const scene = matches[0].scene;
  const palette = [...new Set(matches.slice(0, 2).flatMap((m) => m.palette.split(', ')))]
    .slice(0, 5)
    .join(', ');
  const colors = [...new Set(matches.slice(0, 2).flatMap((m) => m.colors))].slice(0, 3);
  return { scene, palette, colors };
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
): { vibe: string; colors: string[] } {
  const matches = matchGenreProfiles(genres);
  const { scene, palette, colors } = sceneAndPalette(matches);

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

  const vibe = [
    `${scene}.`,
    `Color palette: ${palette}.`,
    `The overall feeling is ${energyWord}, ${moodWord}. ${lengthPhrase}.${explicitPhrase}`,
    eraPhrase,
  ]
    .filter(Boolean)
    .join(' ');

  return { vibe, colors };
}

function artistVibeDescription(artist: SpotifyArtist): { vibe: string; colors: string[] } {
  const matches = matchGenreProfiles(artist.genres);
  const axes = axesForProfiles(matches);
  const { scene, palette, colors } = sceneAndPalette(matches);

  const energyWord = tierWord(axes.energy, 'slow and unhurried', 'mid-tempo', 'high-energy and intense');
  const moodWord = tierWord(axes.brightness, 'shadowed and moody', 'even-keeled', 'bright and sun-lit');

  const genrePhrase =
    artist.genres.length > 0
      ? `Their sound is generally described as ${formatList(artist.genres.slice(0, 3))}.`
      : '';

  const vibe = [
    `${scene}.`,
    `Color palette: ${palette}.`,
    `The overall feeling is ${energyWord}, ${moodWord}.`,
    genrePhrase,
  ]
    .filter(Boolean)
    .join(' ');

  return { vibe, colors };
}

export function buildVibeProfile(
  artists: SpotifyArtist[],
  tracks: SpotifyTrack[],
  genresByArtistId: Map<string, string[]>,
  audioFeatures: Map<string, AudioFeatures> | null
): VibeProfile {
  const artistVibes: ArtistVibe[] = artists.map((artist) => {
    const { vibe, colors } = artistVibeDescription(artist);
    return {
      id: artist.id,
      name: artist.name,
      image: artist.images[0]?.url ?? null,
      genres: artist.genres,
      spotifyUrl: `https://open.spotify.com/artist/${artist.id}`,
      vibe,
      colors,
    };
  });

  const trackVibes: TrackVibe[] = tracks.map((track) => {
    const genres = genresByArtistId.get(track.artists[0]?.id) ?? [];
    const axes = axesForProfiles(matchGenreProfiles(genres));
    const { vibe, colors } = trackVibeDescription(genres, axes, track, audioFeatures?.get(track.id) ?? null);
    return {
      id: track.id,
      name: track.name,
      artistNames: track.artists.map((a) => a.name).join(', '),
      albumImage: track.album.images[0]?.url ?? null,
      spotifyUrl: track.external_urls.spotify,
      releaseYear: track.album.release_date ? parseInt(track.album.release_date.slice(0, 4), 10) : null,
      vibe,
      colors,
    };
  });

  const overall = aggregateAxes(artists);
  const moodTags = topMoodTags(overall);
  const dominantProfiles = dominantGenreProfiles(artists);

  return {
    artists: artistVibes,
    tracks: trackVibes,
    moodTags,
    liminalSpaceDescription: describeLiminalSpace(dominantProfiles, overall, artists.map((a) => a.name)),
  };
}

/** Ranks the genre archetypes actually present, weighted by artist rank, so the
 * liminal-space image is built from a specific subculture aesthetic rather than
 * a genre-neutral blend of every axis. */
function dominantGenreProfiles(artists: SpotifyArtist[]): GenreProfile[] {
  const weight = new Map<string, number>();
  const byMatch = new Map<string, GenreProfile>();
  artists.forEach((artist, index) => {
    const w = artists.length - index;
    for (const profile of matchGenreProfiles(artist.genres)) {
      weight.set(profile.match, (weight.get(profile.match) ?? 0) + w);
      byMatch.set(profile.match, profile);
    }
  });
  return [...weight.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([match]) => byMatch.get(match)!)
    .slice(0, 2);
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

function describeLiminalSpace(profiles: GenreProfile[], axes: Axes, artistNames: string[]): string {
  const closing = tierWord(
    axes.energy,
    "The silence here doesn't feel empty so much as waiting.",
    "You get the feeling that if you turned around, the hallway behind you would look different too.",
    'Somewhere close by, you swear you can still feel the bass - like the volume never actually turned off.'
  );

  if (profiles.length === 0) {
    return describeGenericLiminalSpace(axes, closing);
  }

  const primary = profiles[0];
  const artistPhrase = artistNames[0]
    ? ` If there's a source for the sound bleeding through the walls, it would be ${artistNames[0]}.`
    : '';
  const secondaryPhrase = profiles[1]
    ? ` Further down, the space starts to shift - a ${profiles[1].match} atmosphere bleeding in at the edges.`
    : '';

  return `${primary.liminalVibe}.${artistPhrase}${secondaryPhrase} ${closing}`;
}

function describeGenericLiminalSpace(axes: Axes, closing: string): string {
  const lighting = tierWord(
    axes.brightness,
    'lit by a flat fluorescent hum with no visible source',
    'lit by fixtures that flicker between warm and cold without ever settling on either',
    "lit by daylight pouring through windows that don't seem to lead outside"
  );

  const walls = tierWord(
    axes.acoustic,
    'bare concrete walls, cold to the touch',
    'nondescript beige walls, water-stained in places',
    'thickly carpeted walls, the kind that muffle every sound'
  );

  const layout = tierWord(
    axes.energy,
    'The space feels frozen, like it has been waiting for someone to walk through',
    'The layout keeps almost repeating itself, hallway after hallway',
    'The space feels mid-motion, like something just left the room'
  );

  const scale = tierWord(
    axes.maximalism,
    'nearly empty - a single chair, and nothing else',
    'scattered with ordinary furniture at odd angles, like it was arranged by no one in particular',
    "packed with mismatched objects that don't belong to any one era"
  );

  return `You find yourself in a space that's hard to place: ${walls}, ${lighting}. ${layout}. It's ${scale}. ${closing}`;
}

function formatList(items: string[]): string {
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
}
