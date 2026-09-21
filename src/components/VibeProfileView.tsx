import type { VibeProfile } from '@/lib/vibe';
import LivingRoomImage from './LivingRoomImage';
import VibeCard from './VibeCard';

export default function VibeProfileView({ profile }: { profile: VibeProfile }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <section className="rounded-2xl bg-zinc-900/60 p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
          Your listening room
        </h2>
        <LivingRoomImage description={profile.livingRoomDescription} />
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
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {profile.artists.map((artist, i) => (
            <VibeCard
              key={artist.id}
              rank={i + 1}
              title={artist.name}
              subtitle={artist.genres[0]}
              vibe={artist.vibe}
              colors={artist.colors}
              image={artist.image}
              imageShape="circle"
              href={artist.spotifyUrl}
            />
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-lg font-semibold text-zinc-100">Top 10 Songs</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {profile.tracks.map((track, i) => (
            <VibeCard
              key={track.id}
              rank={i + 1}
              title={track.name}
              subtitle={track.artistNames}
              vibe={track.vibe}
              colors={track.colors}
              image={track.albumImage}
              href={track.spotifyUrl}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
