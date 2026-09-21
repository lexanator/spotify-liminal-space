'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import { Euler, Vector3 } from 'three';

const BASE_SPEED = 18;
const LOOK_SENSITIVITY = 0.0022;

export default function FlyControls({ onLockChange }: { onLockChange?: (locked: boolean) => void }) {
  const { camera, gl } = useThree();
  const keys = useRef<Record<string, boolean>>({});
  const euler = useRef(new Euler(0, 0, 0, 'YXZ'));
  const speedMultiplier = useRef(1);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    const canvas = gl.domElement;

    function onClick() {
      if (document.pointerLockElement !== canvas) canvas.requestPointerLock();
    }

    function onLockChangeEvent() {
      const isLocked = document.pointerLockElement === canvas;
      setLocked(isLocked);
      onLockChange?.(isLocked);
    }

    function onMouseMove(e: MouseEvent) {
      if (document.pointerLockElement !== canvas) return;
      euler.current.setFromQuaternion(camera.quaternion);
      euler.current.y -= e.movementX * LOOK_SENSITIVITY;
      euler.current.x -= e.movementY * LOOK_SENSITIVITY;
      euler.current.x = Math.max(-Math.PI / 2.1, Math.min(Math.PI / 2.1, euler.current.x));
      camera.quaternion.setFromEuler(euler.current);
    }

    function onKeyDown(e: KeyboardEvent) {
      keys.current[e.code] = true;
    }
    function onKeyUp(e: KeyboardEvent) {
      keys.current[e.code] = false;
    }
    function onWheel(e: WheelEvent) {
      speedMultiplier.current = Math.max(0.25, Math.min(6, speedMultiplier.current - e.deltaY * 0.001));
    }

    canvas.addEventListener('click', onClick);
    document.addEventListener('pointerlockchange', onLockChangeEvent);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    canvas.addEventListener('wheel', onWheel);

    return () => {
      canvas.removeEventListener('click', onClick);
      document.removeEventListener('pointerlockchange', onLockChangeEvent);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
      canvas.removeEventListener('wheel', onWheel);
    };
  }, [camera, gl, onLockChange]);

  const forward = useRef(new Vector3());
  const right = useRef(new Vector3());
  const move = useRef(new Vector3());

  useFrame((_, delta) => {
    if (!locked) return;
    const k = keys.current;
    move.current.set(0, 0, 0);

    camera.getWorldDirection(forward.current);
    forward.current.y = 0;
    forward.current.normalize();
    right.current.crossVectors(forward.current, camera.up).negate();

    if (k['KeyW'] || k['ArrowUp']) move.current.add(forward.current);
    if (k['KeyS'] || k['ArrowDown']) move.current.sub(forward.current);
    if (k['KeyD'] || k['ArrowRight']) move.current.add(right.current);
    if (k['KeyA'] || k['ArrowLeft']) move.current.sub(right.current);
    if (k['Space']) move.current.y += 1;
    if (k['ShiftLeft'] || k['ControlLeft']) move.current.y -= 1;

    if (move.current.lengthSq() > 0) {
      move.current.normalize().multiplyScalar(BASE_SPEED * speedMultiplier.current * delta);
      camera.position.add(move.current);
    }
  });

  return null;
}
