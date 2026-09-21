'use client';

import { useState } from 'react';

export default function VibeCard({
  rank,
  title,
  subtitle,
  vibe,
  colors,
  image,
  href,
}: {
  rank: number;
  title: string;
  subtitle?: string;
  vibe: string;
  colors: string[];
  image?: string | null;
  href: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const gradient = `linear-gradient(135deg, ${colors.join(', ')})`;

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(vibe);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard access can be denied by the browser - nothing to recover.
    }
  }

  return (
    <div
      className="group relative aspect-[3/4] overflow-hidden rounded-2xl shadow-lg"
      style={{ backgroundImage: gradient }}
    >
      {/* Subtle grain texture so the gradient reads as a designed poster, not a flat swatch. */}
      <svg className="absolute inset-0 h-full w-full opacity-20 mix-blend-overlay" aria-hidden="true">
        <filter id={`grain-${rank}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#grain-${rank})`} />
      </svg>

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30" />

      <span className="absolute left-3 top-3 text-2xl font-black text-white/40">
        {String(rank).padStart(2, '0')}
      </span>

      {image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image}
          alt=""
          className="absolute right-3 top-3 h-14 w-14 rotate-3 rounded-md object-cover shadow-xl ring-2 ring-white/20"
        />
      )}

      <div className="absolute inset-x-0 bottom-0 p-4">
        <h3 className="text-lg font-bold leading-tight text-white drop-shadow">{title}</h3>
        {subtitle && <p className="text-sm text-white/80 drop-shadow">{subtitle}</p>}

        <div className="mt-2 flex gap-2">
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-black/40 px-2.5 py-1 text-xs text-white backdrop-blur hover:bg-black/60"
          >
            Spotify ↗
          </a>
          <button
            onClick={() => setExpanded((v) => !v)}
            className="rounded-full bg-black/40 px-2.5 py-1 text-xs text-white backdrop-blur hover:bg-black/60"
          >
            {expanded ? 'Hide prompt' : 'Show prompt'}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="absolute inset-0 flex flex-col justify-between bg-black/85 p-4 backdrop-blur-sm">
          <p className="overflow-y-auto text-xs leading-relaxed text-zinc-200">{vibe}</p>
          <div className="mt-2 flex gap-2">
            <button
              onClick={copyPrompt}
              className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-white hover:bg-white/20"
            >
              {copied ? 'Copied ✓' : 'Copy prompt'}
            </button>
            <button
              onClick={() => setExpanded(false)}
              className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-white hover:bg-white/20"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
