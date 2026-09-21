'use client';

import { Canvas } from '@react-three/fiber';
import { Stars, Text } from '@react-three/drei';
import { Suspense, useState } from 'react';
import type { SoundProfile } from '@/lib/sound-profile';
import FlyControls from './FlyControls';
import TrackNode from './TrackNode';

export default function Scene({ profile }: { profile: SoundProfile }) {
  const [locked, setLocked] = useState(false);

  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 10, 55], fov: 62, near: 0.1, far: 500 }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={['#050505']} />
        <fog attach="fog" args={['#050505', 40, 220]} />
        <ambientLight intensity={0.6} />
        <hemisphereLight args={['#8899ff', '#100810', 0.5]} />
        <Stars radius={200} depth={80} count={4000} factor={3} fade speed={0.5} />

        {profile.clusters.map((cluster) => (
          <group key={cluster.genre} position={cluster.center}>
            <pointLight color={cluster.color} intensity={40} distance={40} />
            <Text
              position={[0, 14, 0]}
              fontSize={2.2}
              color={cluster.color}
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.05}
              outlineColor="#000000"
            >
              {cluster.genre}
            </Text>
          </group>
        ))}

        <Suspense fallback={null}>
          {profile.tracks.map((track) => (
            <TrackNode key={track.id} track={track} />
          ))}
        </Suspense>

        <FlyControls onLockChange={setLocked} />
      </Canvas>

      {!locked && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="rounded-xl bg-black/70 px-5 py-3 text-center text-sm text-zinc-200">
            Click anywhere to start flying
          </div>
        </div>
      )}

      {locked && (
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/70" />
      )}
    </div>
  );
}
