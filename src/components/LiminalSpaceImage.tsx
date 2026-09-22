'use client';

import { useState } from 'react';

function hashSeed(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % 1_000_000;
}

export default function LiminalSpaceImage({ description }: { description: string }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  // A seed derived from the text keeps the image stable across reloads
  // instead of Pollinations returning a fresh random image every time.
  const seed = hashSeed(description);
  const src = `https://image.pollinations.ai/prompt/${encodeURIComponent(
    description
  )}?width=1024&height=640&seed=${seed}&nologo=true`;

  if (failed) {
    return <p className="mt-3 text-lg leading-relaxed text-zinc-100">{description}</p>;
  }

  return (
    <div className="relative mt-3 overflow-hidden rounded-xl bg-zinc-800" style={{ aspectRatio: '16 / 10' }}>
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="animate-pulse text-sm text-zinc-500">Generating your liminal space...</p>
        </div>
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt="Generated illustration of your liminal space"
        className={`h-full w-full object-cover transition-opacity duration-500 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
      />
    </div>
  );
}
