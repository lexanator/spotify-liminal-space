'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import VibeProfileView from '@/components/VibeProfileView';
import type { VibeProfile } from '@/lib/vibe';
import type { TimeRange } from '@/lib/spotify-api';

const RANGE_LABELS: Record<TimeRange, string> = {
  short_term: 'Last 4 weeks',
  medium_term: 'Last 6 months',
  long_term: 'All time',
};

type Loaded = { range: TimeRange; profile: VibeProfile };
type Failed = { range: TimeRange; message: string };

export default function SpacePage() {
  const router = useRouter();
  const [range, setRange] = useState<TimeRange>('medium_term');
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [failed, setFailed] = useState<Failed | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch(`/api/vibe-profile?range=${range}`)
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
    <div className="min-h-dvh w-full bg-black text-zinc-50">
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-800 bg-black/80 p-4 backdrop-blur">
        <div className="flex gap-2 rounded-full bg-zinc-900 p-1">
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

        <form action="/api/auth/logout" method="POST">
          <button className="rounded-full bg-zinc-900 px-3 py-1.5 text-xs text-zinc-300 hover:text-white">
            Disconnect
          </button>
        </form>
      </div>

      {isLoading && (
        <div className="flex h-[60vh] items-center justify-center">
          <p className="animate-pulse text-zinc-400">Reading your top artists and tracks...</p>
        </div>
      )}

      {error && (
        <div className="flex h-[60vh] items-center justify-center">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {profile && <VibeProfileView profile={profile} />}
    </div>
  );
}
