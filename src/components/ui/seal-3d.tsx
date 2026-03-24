"use client";

import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Environment, Text3D, Center } from '@react-three/drei';
import { useRef, Suspense } from 'react';
import * as THREE from 'three';

function SealMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = -state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
      <group>
        {/* Inner seal disk */}
        <mesh ref={meshRef}>
          <cylinderGeometry args={[1.2, 1.2, 0.15, 64]} />
          <MeshDistortMaterial 
            color="#00FFD1" 
            metalness={0.9} 
            roughness={0.1} 
            distort={0.05} 
            speed={2}
          />
        </mesh>

        {/* Outer ring */}
        <mesh ref={ringRef}>
          <torusGeometry args={[1.5, 0.08, 16, 64]} />
          <meshStandardMaterial color="#FFB800" metalness={1} roughness={0.2} />
        </mesh>

        {/* Second ring */}
        <mesh rotation={[Math.PI / 4, 0, 0]}>
          <torusGeometry args={[1.7, 0.04, 16, 64]} />
          <meshStandardMaterial color="#0070FF" metalness={1} roughness={0.2} emissive="#0070FF" emissiveIntensity={0.3} />
        </mesh>

        {/* Center checkmark glow */}
        <mesh position={[0, 0, 0.1]}>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshStandardMaterial 
            color="#00FFD1" 
            emissive="#00FFD1" 
            emissiveIntensity={2} 
            transparent 
            opacity={0.6} 
          />
        </mesh>

        {/* Particle dots around the seal */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(angle) * 1.5, Math.sin(angle) * 1.5, 0]}>
              <sphereGeometry args={[0.04, 16, 16]} />
              <meshStandardMaterial 
                color="#00FFD1" 
                emissive="#00FFD1" 
                emissiveIntensity={3} 
              />
            </mesh>
          );
        })}
      </group>
    </Float>
  );
}

export default function Seal3D({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas camera={{ position: [0, 0, 5], fov: 40 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={1} color="#00FFD1" />
        <pointLight position={[-5, -5, 5]} intensity={0.5} color="#0070FF" />
        <spotLight position={[0, 5, 5]} angle={0.3} penumbra={1} intensity={1} color="#FFB800" />
        <Suspense fallback={null}>
          <SealMesh />
          <Environment preset="night" />
        </Suspense>
      </Canvas>
    </div>
  );
}
