'use client';

import { Html, useTexture } from '@react-three/drei';
import { useState } from 'react';
import type { TrackNode as TrackNodeData } from '@/lib/sound-profile';

export default function TrackNode({ track }: { track: TrackNodeData }) {
  const [hovered, setHovered] = useState(false);
  const texture = useTexture(track.albumImage ?? '/vercel.svg');

  return (
    <group position={track.position}>
      <sprite
        scale={[track.size * 1.6, track.size * 1.6, 1]}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
          document.body.style.cursor = '';
        }}
        onClick={(e) => {
          e.stopPropagation();
          window.open(track.spotifyUrl, '_blank', 'noopener,noreferrer');
        }}
      >
        <spriteMaterial
          map={texture}
          transparent
          depthWrite={false}
          color={hovered ? '#ffffff' : '#dddddd'}
        />
      </sprite>

      <sprite scale={[track.size * 2.4, track.size * 2.4, 1]} position={[0, 0, -0.05]}>
        <spriteMaterial
          color={track.color}
          transparent
          opacity={hovered ? 0.5 : 0.22}
          depthWrite={false}
        />
      </sprite>

      {hovered && (
        <Html center distanceFactor={22} style={{ pointerEvents: 'none' }}>
          <div className="w-max max-w-[220px] rounded-lg bg-black/85 px-3 py-2 text-center text-xs text-white shadow-lg">
            <div className="font-semibold">{track.name}</div>
            <div className="text-zinc-400">{track.artistNames}</div>
          </div>
        </Html>
      )}
    </group>
  );
}
