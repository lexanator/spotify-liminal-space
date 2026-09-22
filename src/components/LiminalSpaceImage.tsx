'use client';

import { useEffect, useRef, useState } from 'react';

function hashSeed(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % 1_000_000;
}

// Same prompt + different seed often nudges Pollinations toward only
// superficially different output (same composition, different noise). These
// are derived from the seed so each regenerate also varies the actual prompt
// text - a genuinely different camera angle and rendering style, not just a
// re-roll - while a given seed still always resolves to the same image.
const CAMERA_ANGLES = [
  'a wide-angle establishing shot',
  'an intimate close framing',
  'a low angle looking up',
  'a high angle looking down its length',
  'a first-person point of view walking through it',
  'a distant, perfectly symmetrical wide shot',
  'a shot taken from just inside a doorway looking in',
];

const RENDER_STYLES = [
  'shot on grainy analog film',
  'rendered in crisp hyperrealistic photography',
  'with subtle VHS distortion and scan lines',
  'in stark, high-contrast digital clarity',
  'with heavy film grain and desaturated color',
  'lit like a found-footage horror still',
  'as a slightly overexposed photograph',
  'with the flat, dull color of an old security camera feed',
];

function buildSrc(description: string, seed: number): string {
  const camera = CAMERA_ANGLES[seed % CAMERA_ANGLES.length];
  const style = RENDER_STYLES[Math.floor(seed / CAMERA_ANGLES.length) % RENDER_STYLES.length];
  const prompt = `${description} Shot as ${camera}, ${style}.`;
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(
    prompt
  )}?width=1024&height=640&seed=${seed}&nologo=true`;
}

export default function LiminalSpaceImage({ description }: { description: string }) {
  // A seed derived from the text keeps the image stable across reloads by
  // default; "Regenerate" picks a new random one to reroll on demand.
  const [seed, setSeed] = useState(() => hashSeed(description));
  const [result, setResult] = useState<{ seed: number; src: string } | null>(null);
  const [failedSeed, setFailedSeed] = useState<number | null>(null);
  // Pollinations occasionally rate-limits a request; retry once with a fresh
  // seed automatically before surfacing a failure to the viewer.
  const retriedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    // Preload off-screen and only swap the visible image once it's ready,
    // so a slow or failed generation never blanks the image or exposes the
    // raw prompt text - the previously displayed image (or nothing, on
    // first load) stays up the whole time.
    const src = buildSrc(description, seed);
    const preload = new window.Image();
    preload.onload = () => {
      if (cancelled) return;
      retriedRef.current = false;
      setResult({ seed, src });
    };
    preload.onerror = () => {
      if (cancelled) return;
      if (!retriedRef.current) {
        retriedRef.current = true;
        setSeed(Math.floor(Math.random() * 1_000_000));
      } else {
        retriedRef.current = false;
        setFailedSeed(seed);
      }
    };
    preload.src = src;

    return () => {
      cancelled = true;
    };
  }, [description, seed]);

  const displaySrc = result?.src ?? null;
  const isGenerating = result?.seed !== seed && failedSeed !== seed;
  const neverLoadedAndFailed = failedSeed === seed && !displaySrc;
  const regenerateFailed = failedSeed === seed && !!displaySrc;

  function regenerate() {
    setFailedSeed(null);
    retriedRef.current = false;
    setSeed(Math.floor(Math.random() * 1_000_000));
  }

  return (
    <div className="relative mt-3 overflow-hidden rounded-xl bg-zinc-800" style={{ aspectRatio: '16 / 10' }}>
      {displaySrc && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={displaySrc}
          alt="Generated illustration of your liminal space"
          className="h-full w-full object-cover"
        />
      )}

      {isGenerating && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/70">
          <p className="animate-pulse text-sm text-zinc-300">Generating your liminal space...</p>
        </div>
      )}

      {!isGenerating && neverLoadedAndFailed && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <p className="text-sm text-zinc-500">Couldn&apos;t generate an image right now.</p>
          <button
            onClick={regenerate}
            className="rounded-full bg-white/10 px-3 py-1.5 text-xs text-white hover:bg-white/20"
          >
            Try again
          </button>
        </div>
      )}

      {displaySrc && !isGenerating && (
        <div className="absolute right-3 top-3 flex items-center gap-2">
          {regenerateFailed && (
            <span className="rounded-full bg-red-950/80 px-2.5 py-1 text-xs text-red-300">
              Failed - try again
            </span>
          )}
          <button
            onClick={regenerate}
            className="rounded-full bg-black/50 px-3 py-1.5 text-xs text-white backdrop-blur hover:bg-black/70"
          >
            Regenerate ↻
          </button>
        </div>
      )}
    </div>
  );
}
