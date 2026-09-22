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
  // concrete, visual, and specific rather than abstract mood words. `colors`
  // are the same palette as actual hex values, for rendering gradient cards.
  // `roomVibe` is a subculture-specific bedroom/hangout archetype (2000s emo
  // bedroom, k-pop photocard wall, etc.) used to drive the living-room image
  // - genre-neutral mood words alone rendered as generic, boring stock photos.
  scene: string;
  palette: string;
  colors: [string, string, string];
  roomVibe: string;
};

const GENRE_PROFILES: GenreProfile[] = [
  { match: 'lo-fi', axes: { energy: 0.15, brightness: 0.35, acoustic: 0.6, maximalism: 0.2 }, scene: 'A rain-streaked bedroom window at night, a desk lamp glowing over stacked cassette tapes and a half-finished cup of tea', palette: 'muted beige, faded yellow, static grey', colors: ['#d8c9a3', '#e8d17a', '#9a9a92'], roomVibe: "A cozy 'lo-fi girl' study nook: a warm desk lamp, headphones resting on a mannequin head, potted plants crowding the windowsill, vinyl records leaning in a milk crate, rain streaking the window outside, muted earth-toned walls" },
  { match: 'bedroom', axes: { energy: 0.2, brightness: 0.4, acoustic: 0.55, maximalism: 0.25 }, scene: 'A blanket fort lit by a phone screen and a string of fairy lights, journal pages scattered across the sheets', palette: 'soft pink, cream, dim gold', colors: ['#f2c6d0', '#f5ecd7', '#c9a227'], roomVibe: 'A soft Tumblr-core bedroom: fairy lights taped in loose swags across the ceiling, polaroids pinned above an unmade bed, pastel bedding, a film camera and disposable-camera photos scattered on the nightstand' },
  { match: 'metal', axes: { energy: 0.95, brightness: 0.2, acoustic: 0.1, maximalism: 0.85 }, scene: 'A concrete bunker lit by a single strobing red light, amplifier stacks taller than the room, chains hanging from the ceiling', palette: 'black, blood red, gunmetal', colors: ['#111111', '#7a0e0e', '#4b4f52'], roomVibe: 'A pitch-black bedroom lit only by red and purple LED strips, band posters and skulls covering every wall floor to ceiling, black blackout curtains blocking all daylight, an electric guitar propped against a small practice amp, candles burned down to stubs' },
  { match: 'punk', axes: { energy: 0.9, brightness: 0.35, acoustic: 0.2, maximalism: 0.5, vintage: 0.5 }, scene: 'A graffiti-covered basement show, torn flyers taped to a plywood stage, a crowd mid-pogo under a single bare bulb', palette: 'safety-pin silver, faded black, spray-paint pink', colors: ['#c7c7c7', '#2b2b2b', '#e8447a'], roomVibe: 'A chaotic mid-2000s scene-punk teenage bedroom: matte black walls plastered edge-to-edge with band posters and gig flyers, red fairy lights strung haphazardly, a studded belt and skinny jeans thrown on the floor, a battered guitar covered in stickers, a mirror scrawled with Sharpie doodles' },
  { match: 'hardcore', axes: { energy: 0.95, brightness: 0.15, acoustic: 0.1, maximalism: 0.7 }, scene: 'A packed warehouse pit under flickering fluorescent tubes, sweat-slicked walls, a mic cord whipping through the air', palette: 'stark white, bruise purple, industrial grey', colors: ['#f5f5f5', '#5b3a5c', '#6b6f72'], roomVibe: 'A stark, minimal practice-space bedroom: bare cinderblock walls, a single caged bulb overhead, band flyers stapled in messy overlapping layers, a weight bench doubling as a nightstand, no decoration beyond the flyers' },
  { match: 'r&b', axes: { energy: 0.45, brightness: 0.4, acoustic: 0.35, maximalism: 0.4 }, scene: 'A dim velvet lounge, candlelight reflected in a half-empty glass, silhouettes swaying close on a small dance floor', palette: 'deep maroon, gold, smoky plum', colors: ['#5c1a2b', '#c9a227', '#6b4560'], roomVibe: 'A moody, romantic bedroom lounge: deep maroon velvet curtains, string lights dimmed low, a record player spinning on a marble side table, silk sheets, candles lit on every surface' },
  { match: 'soul', axes: { energy: 0.4, brightness: 0.55, acoustic: 0.55, vintage: 0.6 }, scene: 'A church-turned-nightclub with stained glass glowing behind the stage, a brass section catching the light', palette: 'amber, burnt orange, mahogany', colors: ['#c9821a', '#b5451f', '#5a2e1e'], roomVibe: 'A warm vintage den styled like a 1970s soul record cover: mahogany wood paneling, a cracked leather armchair, a crate of vinyl on the floor, amber light glowing from a brass lamp' },
  { match: 'funk', axes: { energy: 0.65, brightness: 0.7, acoustic: 0.4, maximalism: 0.6, vintage: 0.55 }, scene: 'A mirrored disco corridor, platform boots squeaking on parquet, a bassline rendered as pulsing light trails', palette: 'chrome, tangerine, electric purple', colors: ['#c9c9c9', '#f0842a', '#7a1fa2'], roomVibe: 'A groovy 1970s rec room: thick shag carpet, a mirrored disco ball hanging from the ceiling, orange and purple retro furniture, a chrome turntable stand in the corner' },
  { match: 'folk', axes: { energy: 0.25, brightness: 0.45, acoustic: 0.85, maximalism: 0.15, vintage: 0.5 }, scene: 'A wooden porch at golden hour, a guitar leaning against a rocking chair, fields rolling out toward the treeline', palette: 'wheat gold, sage green, weathered brown', colors: ['#d8b96a', '#8a9a6b', '#6b4a35'], roomVibe: 'A rustic cabin bedroom: exposed wood beams overhead, a quilt-covered bed, dried flowers in mason jars on the sill, an acoustic guitar leaning by a window that looks out over a forest' },
  { match: 'country', axes: { energy: 0.35, brightness: 0.55, acoustic: 0.75, vintage: 0.55 }, scene: 'A dusty highway diner at sunset, neon signage buzzing over a pickup truck parked outside', palette: 'rust orange, denim blue, dust beige', colors: ['#b5541f', '#3b4b6b', '#d8c9a3'], roomVibe: 'A cozy ranch-style bedroom: a cowhide rug on wood flooring, star-shaped string lights, a denim jacket draped over a wooden chair, a framed photo of an old pickup truck on the wall' },
  { match: 'jazz', axes: { energy: 0.4, brightness: 0.45, acoustic: 0.7, maximalism: 0.45, vintage: 0.6 }, scene: 'A smoke-curled basement club, a single spotlight on an upright bass, ice clinking in low glasses', palette: 'charcoal, amber, brass', colors: ['#2e2e2e', '#c9821a', '#a67c3d'], roomVibe: 'A sophisticated speakeasy-style study: dark wood shelving, a worn leather chesterfield sofa, a brass saxophone resting on a stand, low amber lamplight, a half-poured glass on a side table' },
  { match: 'classical', axes: { energy: 0.35, brightness: 0.4, acoustic: 0.9, maximalism: 0.6, vintage: 0.7 }, scene: 'A candlelit concert hall, sheet music trembling on stands, velvet curtains framing a grand stage', palette: 'ivory, burgundy, gold leaf', colors: ['#f2ead9', '#6e1423', '#c9a227'], roomVibe: 'An elegant music room: a grand piano at its center, heavy burgundy velvet drapes, gilded picture frames on the walls, a shelf of leather-bound scores, soft daylight through tall windows' },
  { match: 'ambient', axes: { energy: 0.1, brightness: 0.4, acoustic: 0.4, maximalism: 0.1 }, scene: 'A vast empty room dissolving into fog, a single shaft of light falling through a skylight onto still water', palette: 'pale blue, silver, mist white', colors: ['#a9c6d8', '#c7c7c7', '#eef2f5'], roomVibe: 'A minimalist meditation room: bare white walls, a single floor cushion at its center, a singing bowl beside it, sheer curtains diffusing soft daylight, almost nothing else in the room' },
  { match: 'techno', axes: { energy: 0.85, brightness: 0.3, acoustic: 0.05, maximalism: 0.55 }, scene: 'A concrete warehouse rave lit by a strobing laser grid, fog machines churning under exposed pipework', palette: 'acid green, black, strobe white', colors: ['#a6ff00', '#0a0a0a', '#f5f5f5'], roomVibe: 'A stark industrial loft bedroom: raw concrete walls, a single caged bulb, a modular synthesizer rig glowing acid green, blackout curtains, a bare mattress on a metal frame' },
  { match: 'house', axes: { energy: 0.8, brightness: 0.65, acoustic: 0.05, maximalism: 0.5 }, scene: 'A packed rooftop dance floor at 3am, string lights swaying above a sea of raised hands', palette: 'hot pink, deep blue, gold', colors: ['#e8447a', '#1c2b5c', '#c9a227'], roomVibe: 'A bright rooftop-apartment bedroom that feels like the afterparty just ended: string lights still on, a small disco ball spinning slowly, sneakers kicked off by the door, a skyline view through open windows' },
  { match: 'edm', axes: { energy: 0.9, brightness: 0.7, acoustic: 0.05, maximalism: 0.7 }, scene: 'A festival main stage mid-drop, pyrotechnics and confetti cannons firing over a wall of pulsing LED screens', palette: 'neon cyan, magenta, white strobe', colors: ['#00e5ff', '#ff00e5', '#f5f5f5'], roomVibe: 'A neon-drenched teenage bedroom: blacklight posters glowing under UV light, glow sticks scattered across the bed, a gaming chair in the corner, RGB LED strips lining every edge of the ceiling' },
  { match: 'trap', axes: { energy: 0.7, brightness: 0.3, acoustic: 0.05, maximalism: 0.6 }, scene: 'A fogged-up room lit by a single purple LED strip, stacks of cash fanned across a glass table', palette: 'deep purple, black, chrome', colors: ['#3a1c5c', '#0a0a0a', '#c9c9c9'], roomVibe: 'A moody, luxury-coded bedroom: a purple LED strip glowing along the ceiling edge, fresh sneakers lined up against the wall in their boxes, blackout curtains, a subwoofer visible in the corner' },
  { match: 'hip hop', axes: { energy: 0.6, brightness: 0.4, acoustic: 0.15, maximalism: 0.55 }, scene: 'A city rooftop at night, skyline glittering behind a boombox and a spray-painted brick wall', palette: 'gold chain yellow, concrete grey, neon red', colors: ['#e8c227', '#7a7a7a', '#e8302b'], roomVibe: 'A city-apartment bedroom with a skyline view through the window: a boombox on the dresser, framed album covers on an exposed brick wall, a gold chain hanging off a mirror corner, fresh sneakers displayed on a floating shelf' },
  { match: 'rap', axes: { energy: 0.65, brightness: 0.35, acoustic: 0.15, maximalism: 0.55 }, scene: 'A cypher circle under a streetlight, breath visible in the cold, sneakers scuffing cracked asphalt', palette: 'asphalt grey, streetlight orange, denim', colors: ['#5a5a5a', '#e0842a', '#3b4b6b'], roomVibe: 'A raw, lived-in bedroom: cracked plaster walls, a mattress low on the floor, a spray-painted canvas leaning against the wall, a single bare bulb overhead, notebooks and sneakers scattered about' },
  { match: 'indie', axes: { energy: 0.4, brightness: 0.45, acoustic: 0.5, maximalism: 0.3 }, scene: 'A cluttered bedroom studio, fairy lights strung over a cracked window, a cassette four-track on a thrifted desk', palette: 'faded denim, mustard yellow, dusty rose', colors: ['#5b7196', '#c9a227', '#c98a94'], roomVibe: 'A cluttered DIY bedroom-studio: fairy lights strung over a cracked window, cassette tapes and film photos pinned to a corkboard, a thrifted rug, a four-track recorder balanced on a secondhand desk' },
  { match: 'alt', axes: { energy: 0.45, brightness: 0.4, acoustic: 0.4, maximalism: 0.35 }, scene: 'A rain-slicked city street reflecting a single neon sign, a lone figure walking with headphones on', palette: 'wet asphalt grey, neon blue, muted red', colors: ['#4a4a4a', '#2e6fe8', '#a4423a'], roomVibe: 'A moody city-apartment bedroom: rain streaking a window overlooking neon signs below, band posters on the walls, a leather jacket slung over a chair, a single string of lights the only warmth in the room' },
  { match: 'shoegaze', axes: { energy: 0.5, brightness: 0.3, acoustic: 0.3, maximalism: 0.75 }, scene: 'A wall of fog and reverb, a guitarist barely visible behind a haze of dry ice and pedal lights', palette: 'lavender haze, dusty blue, silver static', colors: ['#b8a8d8', '#7a92ad', '#c7c7c7'], roomVibe: 'A hazy, dreamlike bedroom: sheer curtains diffusing everything into soft blur, a wall of guitar pedals blinking quietly, faint fog from a humidifier, lavender and dusty-blue bedding' },
  { match: 'dream pop', axes: { energy: 0.3, brightness: 0.5, acoustic: 0.4, maximalism: 0.5 }, scene: 'A sunlit meadow blurred at the edges like an overexposed photograph, petals drifting through soft light', palette: 'pastel pink, powder blue, hazy gold', colors: ['#f2c6d0', '#b8d0e8', '#e8d17a'], roomVibe: 'A sunlit, pastel bedroom that looks slightly overexposed like an old photograph: gauzy curtains billowing, dried flowers in a vase, a wall of polaroids, powder-blue and blush-pink bedding' },
  { match: 'pop', axes: { energy: 0.6, brightness: 0.75, acoustic: 0.25, maximalism: 0.5 }, scene: 'A glossy studio backdrop of oversized bubblegum-pink balloons, confetti frozen mid-fall under studio lights', palette: 'bubblegum pink, electric yellow, white', colors: ['#ff6fb0', '#f2e83c', '#ffffff'], roomVibe: 'A glossy, picture-perfect teenage bedroom: a vanity mirror ringed with bulb lights, pastel and neon decor, a phone tripod set up in the corner, a few stray balloons still floating near the ceiling' },
  { match: 'disco', axes: { energy: 0.75, brightness: 0.8, acoustic: 0.3, maximalism: 0.6, vintage: 0.7 }, scene: 'A mirror-ball ballroom, platform shoes catching fractured light, sequins scattering color across the walls', palette: 'gold, hot pink, mirror silver', colors: ['#c9a227', '#e8447a', '#d8d8d8'], roomVibe: 'A glittering 1970s bedroom: a mirrored disco ball catching every light source, sequined pillows piled on the bed, a thick shag rug, platform shoes kicked off by the door, gold accents on every surface' },
  { match: 'reggae', axes: { energy: 0.4, brightness: 0.6, acoustic: 0.5, maximalism: 0.3, vintage: 0.5 }, scene: 'A sun-baked beach shack, palm shadows swaying over a hammock and a half-stacked speaker system', palette: 'sun gold, palm green, faded red', colors: ['#e8c227', '#3f7a3f', '#a4423a'], roomVibe: 'A breezy beach-house bedroom: palm-leaf shadows dancing on the wall, a hammock chair in the corner, a straw hat hanging on a hook, sun-bleached wood furniture throughout' },
  { match: 'latin', axes: { energy: 0.7, brightness: 0.75, acoustic: 0.45, maximalism: 0.55 }, scene: 'A crowded plaza at dusk, string lights zigzagging overhead, couples spinning under warm lantern light', palette: 'warm terracotta, marigold, deep red', colors: ['#c1653a', '#e8a227', '#7a1f1f'], roomVibe: 'A warm, festive bedroom: string lights zigzagging across the ceiling, terracotta and marigold textiles draped over furniture, a small shelf of family photos, records leaning against the wall' },
  { match: 'k-pop', axes: { energy: 0.75, brightness: 0.8, acoustic: 0.15, maximalism: 0.7 }, scene: 'A hyper-saturated stage set with mirrored panels and choreographed light beams sweeping in unison', palette: 'candy pink, holographic silver, neon blue', colors: ['#ff6fb0', '#d8d8e8', '#2e9dff'], roomVibe: 'A hyper-curated teenage bedroom: a wall covered edge-to-edge in photocards and polaroids, plushies lined up in a neat row on the bed, a lightstick standing on the desk, soft pink LED lighting washing over everything' },
  { match: 'emo', axes: { energy: 0.55, brightness: 0.25, acoustic: 0.35, maximalism: 0.45, vintage: 0.4 }, scene: 'A rain-fogged car window, a half-lit bedroom with band posters peeling off the wall, a diary left open', palette: 'faded black, bruised purple, grey', colors: ['#1c1c1c', '#4a2e5c', '#6b6b6b'], roomVibe: 'A dim mid-2000s emo teenager\'s bedroom: black-painted walls covered in posters and Sharpie doodles, red fairy lights strung across the ceiling, a studded belt and skinny jeans draped over a chair, a battered guitar covered in band stickers, a straightener still plugged in by the mirror' },
  { match: 'blues', axes: { energy: 0.35, brightness: 0.35, acoustic: 0.75, vintage: 0.7 }, scene: 'A cracked-leather barstool under a single hanging bulb, a slide guitar resting against a whiskey-stained table', palette: 'whiskey amber, faded denim, smoke grey', colors: ['#a6690f', '#4a5f7a', '#5a5a5a'], roomVibe: 'A worn, atmospheric bedroom above a bar: peeling wallpaper, a single bulb hanging bare, a slide guitar leaning in the corner, a half-empty bottle left on the nightstand' },
  { match: 'rock', axes: { energy: 0.65, brightness: 0.45, acoustic: 0.35, maximalism: 0.55 }, scene: 'A sweat-soaked arena stage, guitar feedback catching under white spotlights, amps stacked to the rafters', palette: 'denim blue, rust, spotlight white', colors: ['#3b4b6b', '#a4472b', '#f5f5f5'], roomVibe: 'A grungy teenage bedroom: band posters layered three-deep on every wall, a cracked mirror, an electric guitar leaning against a small amp, ripped jeans on the floor, string lights strung up haphazardly' },
  { match: 'electronic', axes: { energy: 0.65, brightness: 0.45, acoustic: 0.05, maximalism: 0.5 }, scene: 'A server-room-like grid of pulsing LEDs, cables snaking across a dark studio floor', palette: 'electric blue, black, chrome', colors: ['#2e6fe8', '#0a0a0a', '#c9c9c9'], roomVibe: 'A dark, tech-filled bedroom: a wall of glowing synth gear and tangled cables, blackout curtains, a single monitor casting blue light across the room, otherwise minimal furniture' },
  { match: 'dance', axes: { energy: 0.8, brightness: 0.7, acoustic: 0.1, maximalism: 0.55 }, scene: 'A strobe-lit floor packed shoulder to shoulder, hands raised into a haze of stage smoke', palette: 'hot magenta, strobe white, deep blue', colors: ['#e83ce0', '#f5f5f5', '#1c2b5c'], roomVibe: 'A bright, high-energy bedroom that looks ready for a night out: a full-length mirror, an outfit laid out across the bed, string lights on, glitter still dusting the desk from the night before' },
  { match: 'singer songwriter', axes: { energy: 0.25, brightness: 0.45, acoustic: 0.8, maximalism: 0.15, vintage: 0.4 }, scene: 'A single stool under a warm spotlight, an acoustic guitar leaning beside a glass of water', palette: 'warm amber, oak brown, cream', colors: ['#c9821a', '#6b4a2e', '#f2ead9'], roomVibe: 'A quiet, plain bedroom: a single guitar resting on a stand, a notebook left open on an unmade bed, warm lamplight, early morning sun coming through a bare window' },
  { match: 'world', axes: { energy: 0.45, brightness: 0.6, acoustic: 0.65, maximalism: 0.4 }, scene: 'A sunlit market square filled with woven textiles and hand drums, dust rising in golden light', palette: 'terracotta, saffron, indigo', colors: ['#c1653a', '#e8a227', '#3b3a7a'], roomVibe: 'A richly textured bedroom filled with woven textiles hung on the walls, hand-carved instruments displayed like art, warm terracotta tones throughout, patterned rugs layered on the floor' },
  { match: 'soundtrack', axes: { energy: 0.35, brightness: 0.4, acoustic: 0.55, maximalism: 0.5, vintage: 0.4 }, scene: 'A sweeping cinematic vista at dawn, an orchestral swell rising over mist-covered mountains', palette: 'steel blue, dawn gold, charcoal', colors: ['#4a6b8a', '#e8b04a', '#2e2e2e'], roomVibe: 'A cinematic, moody bedroom: heavy curtains framing a large window over a mountain or city view, dramatic side-lighting like a film still, deliberately minimal furniture' },
  { match: 'dubstep', axes: { energy: 0.9, brightness: 0.35, acoustic: 0.05, maximalism: 0.75 }, scene: 'A bass-shaking basement rig, subwoofers visibly rattling under pulsing green laser light', palette: 'toxic green, black, chrome', colors: ['#7aff2e', '#0a0a0a', '#c9c9c9'], roomVibe: 'A bass-heavy teenage bedroom: a subwoofer visibly rattling on the floor, green and black LED strips lining the ceiling, gaming posters on the walls, headphones hanging off a glowing monitor' },
  { match: 'drum and bass', axes: { energy: 0.9, brightness: 0.4, acoustic: 0.05, maximalism: 0.7 }, scene: 'A breakneck strobe-lit tunnel rave, light trails smearing behind dancers moving too fast to focus', palette: 'electric green, black, strobe white', colors: ['#2eff7a', '#0a0a0a', '#f5f5f5'], roomVibe: 'A chaotic, strobe-lit bedroom: a green-and-black color scheme throughout, a wall covered in old rave flyers, a mattress low on the floor, energy drink cans lined up on the desk' },
];

const DEFAULT_PROFILE: Pick<GenreProfile, 'scene' | 'palette' | 'colors' | 'roomVibe'> = {
  scene: 'A room that resists any single aesthetic - shelves mixing records from a dozen different scenes, no two objects quite matching',
  palette: 'mixed neutrals, unexpected accent colors',
  colors: ['#6b6b6b', '#9a9a9a', '#c9c9c9'],
  roomVibe: 'A room that refuses to commit to one aesthetic: shelves mixing records and memorabilia from a dozen different scenes, no two decor choices quite matching, everything held together by pure enthusiasm rather than a plan',
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
    livingRoomDescription: describeLivingRoom(dominantProfiles, overall, artists.map((a) => a.name)),
  };
}

/** Ranks the genre archetypes actually present, weighted by artist rank, so the
 * living-room image is built from a specific subculture aesthetic rather than
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

function describeLivingRoom(profiles: GenreProfile[], axes: Axes, artistNames: string[]): string {
  const closing = tierWord(
    axes.energy,
    'It feels like a room built for slowing down in - the kind of space where a song gets left playing quietly just to fill the silence.',
    'It feels like a room that can go either way - quiet enough for a slow morning, lively enough for people to drop by.',
    'It feels like a room where something is always about to happen, or the volume is about to go up.'
  );

  if (profiles.length === 0) {
    return describeGenericLivingRoom(axes, closing);
  }

  const primary = profiles[0];
  const artistPhrase = artistNames[0]
    ? ` It's unmistakably the room of someone who has ${artistNames[0]} on repeat.`
    : '';
  const secondaryPhrase = profiles[1]
    ? ` There's a second layer to it too - somewhere in the mix, a ${profiles[1].match} influence creeps in around the edges.`
    : '';

  return `${primary.roomVibe}.${artistPhrase}${secondaryPhrase} ${closing}`;
}

function describeGenericLivingRoom(axes: Axes, closing: string): string {
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

  return `Picture a living room where ${lighting}. There's ${seating}, and ${soundSystem}. In terms of decor, ${decor}, and ${clutter}. ${closing}`;
}

function formatList(items: string[]): string {
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
}
