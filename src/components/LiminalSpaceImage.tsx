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

// A seed derived from the text keeps the image (and the camera/style below,
// also derived from it) stable across reloads instead of Pollinations
// returning a fresh random image on every visit.
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
  const seed = hashSeed(description);
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const retriedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    retriedRef.current = false;

    // Preload off-screen and only swap the visible image once it's ready, so
    // a slow or failed generation never blanks the image or exposes the raw
    // prompt text - nothing shows until the first successful load.
    const src = buildSrc(description, seed);

    function attemptLoad() {
      const preload = new window.Image();
      preload.onload = () => {
        if (!cancelled) setLoadedSrc(src);
      };
      preload.onerror = () => {
        if (cancelled) return;
        // Pollinations occasionally rate-limits a single request - retry once.
        if (!retriedRef.current) {
          retriedRef.current = true;
          attemptLoad();
        } else {
          setFailed(true);
        }
      };
      preload.src = src;
    }
    attemptLoad();

    return () => {
      cancelled = true;
    };
  }, [description, seed, attempt]);

  const isGenerating = !loadedSrc && !failed;

  function retry() {
    setFailed(false);
    setAttempt((a) => a + 1);
  }

  return (
    <div className="relative mt-3 overflow-hidden rounded-xl bg-zinc-800" style={{ aspectRatio: '16 / 10' }}>
      {loadedSrc && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={loadedSrc}
          alt="Generated illustration of your liminal space"
          className="h-full w-full object-cover"
        />
      )}

      {isGenerating && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/70">
          <p className="animate-pulse text-sm text-zinc-300">Generating your liminal space...</p>
        </div>
      )}

      {failed && !loadedSrc && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <p className="text-sm text-zinc-500">Couldn&apos;t generate an image right now.</p>
          <button
            onClick={retry}
            className="rounded-full bg-white/10 px-3 py-1.5 text-xs text-white hover:bg-white/20"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  );
}
