import type { VibeProfile } from '@/lib/vibe';

export default function VibeProfileView({ profile }: { profile: VibeProfile }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <section className="rounded-2xl bg-zinc-900/60 p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
          Your listening room
        </h2>
        <p className="mt-3 text-lg leading-relaxed text-zinc-100">{profile.livingRoomDescription}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {profile.moodTags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-[#1DB954]/15 px-3 py-1 text-xs font-medium text-[#1DB954]"
            >
              {tag}
            </span>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-lg font-semibold text-zinc-100">Top 10 Artists</h2>
        <ul className="flex flex-col gap-4">
          {profile.artists.map((artist, i) => (
            <li key={artist.id} className="rounded-xl bg-zinc-900/40 p-4">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-medium text-zinc-50">
                  <span className="mr-2 text-zinc-600">#{i + 1}</span>
                  {artist.name}
                </h3>
                <a
                  href={artist.spotifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 text-xs text-zinc-500 hover:text-[#1DB954]"
                >
                  Open ↗
                </a>
              </div>
              {artist.genres.length > 0 && (
                <p className="mt-1 text-xs text-zinc-500">{artist.genres.slice(0, 4).join(' · ')}</p>
              )}
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{artist.vibe}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-lg font-semibold text-zinc-100">Top 10 Songs</h2>
        <ul className="flex flex-col gap-4">
          {profile.tracks.map((track, i) => (
            <li key={track.id} className="flex items-start gap-3 rounded-xl bg-zinc-900/40 p-4">
              {track.albumImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={track.albumImage}
                  alt=""
                  width={56}
                  height={56}
                  className="h-14 w-14 shrink-0 rounded-md object-cover"
                />
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-3">
                  <a
                    href={track.spotifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-zinc-50 hover:text-[#1DB954]"
                  >
                    <span className="mr-2 text-zinc-600">#{i + 1}</span>
                    {track.name}
                  </a>
                  {track.releaseYear && (
                    <span className="shrink-0 text-xs text-zinc-600">{track.releaseYear}</span>
                  )}
                </div>
                <p className="text-xs text-zinc-500">{track.artistNames}</p>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{track.vibe}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
