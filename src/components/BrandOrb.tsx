"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Sphere, Torus, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

interface BrandOrbProps {
  position?: [number, number, number];
  scale?: number;
  colorCore?: string;
  colorRing1?: string;
  colorRing2?: string;
}

export default function BrandOrb({
  position = [0, 0, 0],
  scale = 1,
  colorCore = "#00f3ff",
  colorRing1 = "#bc13fe",
  colorRing2 = "#00f3ff",
}: BrandOrbProps) {
  const orbRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    // Bobbing motion
    if (orbRef.current) {
      orbRef.current.position.y = Math.sin(t * 2) * 0.1;
    }

    // Ring rotations
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = t * 0.5;
      ring1Ref.current.rotation.y = t * 0.3;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = t * 0.4 + 1; // Offset angle
      ring2Ref.current.rotation.y = t * 0.6;
    }
  });

  return (
    <group position={position} scale={scale}>
      {/* Core Sphere with Distort Material for "Energy" look */}
      <Sphere ref={orbRef} args={[1, 64, 64]}>
        <MeshDistortMaterial
          color={colorCore}
          emissive={colorCore}
          emissiveIntensity={0.8}
          roughness={0.2}
          metalness={0.8}
          distort={0.4}
          speed={3}
        />
      </Sphere>

      {/* Inner Ring */}
      <Torus ref={ring1Ref} args={[1.4, 0.05, 16, 100]}>
        <meshStandardMaterial
          color={colorRing1}
          emissive={colorRing1}
          emissiveIntensity={2}
          toneMapped={false}
        />
      </Torus>

      {/* Outer Ring */}
      <Torus ref={ring2Ref} args={[1.8, 0.05, 16, 100]}>
        <meshStandardMaterial
          color={colorRing2}
          emissive={colorRing2}
          emissiveIntensity={2}
          toneMapped={false}
        />
      </Torus>
      
      {/* Glow/Light */}
      <pointLight color={colorCore} intensity={2} distance={5} decay={2} />
    </group>
  );
}
