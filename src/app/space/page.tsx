'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import type { SoundProfile } from '@/lib/sound-profile';
import type { TimeRange } from '@/lib/spotify-api';

const Scene = dynamic(() => import('@/components/Scene'), { ssr: false });

const RANGE_LABELS: Record<TimeRange, string> = {
  short_term: 'Last 4 weeks',
  medium_term: 'Last 6 months',
  long_term: 'All time',
};

type Loaded = { range: TimeRange; profile: SoundProfile };
type Failed = { range: TimeRange; message: string };

export default function SpacePage() {
  const router = useRouter();
  const [range, setRange] = useState<TimeRange>('medium_term');
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [failed, setFailed] = useState<Failed | null>(null);
  const [showInfo, setShowInfo] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetch(`/api/profile?range=${range}`)
      .then(async (res) => {
        if (res.status === 401) {
          router.push('/');
          return null;
        }
        if (!res.ok) throw new Error('Failed to load your sound profile');
        return res.json();
      })
      .then((data) => {
        if (!cancelled && data) setLoaded({ range, profile: data });
      })
      .catch((err) => {
        if (!cancelled) setFailed({ range, message: err.message });
      });

    return () => {
      cancelled = true;
    };
  }, [range, router]);

  const profile = loaded?.range === range ? loaded.profile : null;
  const error = failed?.range === range ? failed.message : null;
  const isLoading = !profile && !error;

  return (
    <div className="relative h-dvh w-full bg-black text-zinc-50">
      {profile && <Scene profile={profile} />}

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="animate-pulse text-zinc-400">Mapping your sound space...</p>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-4">
        <div className="pointer-events-auto flex gap-2 rounded-full bg-black/60 p-1 backdrop-blur">
          {(Object.keys(RANGE_LABELS) as TimeRange[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                r === range ? 'bg-[#1DB954] text-black' : 'text-zinc-300 hover:text-white'
              }`}
            >
              {RANGE_LABELS[r]}
            </button>
          ))}
        </div>

        <form action="/api/auth/logout" method="POST" className="pointer-events-auto">
          <button className="rounded-full bg-black/60 px-3 py-1.5 text-xs text-zinc-300 backdrop-blur hover:text-white">
            Disconnect
          </button>
        </form>
      </div>

      {profile && showInfo && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center p-4">
          <div className="pointer-events-auto max-w-xl rounded-2xl bg-black/60 p-4 text-sm text-zinc-200 backdrop-blur">
            <div className="flex items-start justify-between gap-4">
              <p>{profile.description}</p>
              <button
                onClick={() => setShowInfo(false)}
                className="shrink-0 text-zinc-500 hover:text-zinc-300"
                aria-label="Dismiss"
              >
                ✕
              </button>
            </div>
            <p className="mt-2 text-xs text-zinc-500">
              Click and drag to look around · WASD to fly · scroll to speed up
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
