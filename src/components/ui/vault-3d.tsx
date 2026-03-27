"use client";

import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Environment, RoundedBox } from '@react-three/drei';
import { useRef, Suspense } from 'react';
import * as THREE from 'three';

function VaultMesh() {
  const groupRef = useRef<THREE.Group>(null);
  const doorRef = useRef<THREE.Mesh>(null);
  const lockRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.15;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
    if (lockRef.current) {
      lockRef.current.rotation.z = state.clock.elapsedTime * 0.8;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <group ref={groupRef}>
        {/* Vault body */}
        <RoundedBox args={[2, 2.2, 1.5]} radius={0.15} smoothness={4}>
          <meshStandardMaterial color="#1a1a2e" metalness={0.9} roughness={0.3} />
        </RoundedBox>

        {/* Vault door */}
        <mesh ref={doorRef} position={[0, 0, 0.8]}>
          <RoundedBox args={[1.6, 1.8, 0.1]} radius={0.1} smoothness={4}>
            <meshStandardMaterial color="#16213e" metalness={0.95} roughness={0.2} />
          </RoundedBox>
        </mesh>

        {/* Lock dial */}
        <mesh ref={lockRef} position={[0, 0, 0.9]}>
          <torusGeometry args={[0.35, 0.06, 16, 64]} />
          <meshStandardMaterial color="#00FFD1" metalness={1} roughness={0.1} emissive="#00FFD1" emissiveIntensity={0.5} />
        </mesh>

        {/* Lock center */}
        <mesh position={[0, 0, 0.92]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.05, 32]} />
          <meshStandardMaterial color="#00FFD1" emissive="#00FFD1" emissiveIntensity={1} />
        </mesh>

        {/* Handle */}
        <mesh position={[0.5, 0, 0.9]}>
          <capsuleGeometry args={[0.04, 0.4, 8, 16]} />
          <meshStandardMaterial color="#FFB800" metalness={1} roughness={0.2} />
        </mesh>

        {/* Corner bolts */}
        {[[-0.65, 0.75], [0.65, 0.75], [-0.65, -0.75], [0.65, -0.75]].map(([x, y], i) => (
          <mesh key={i} position={[x, y, 0.86]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.08, 16]} />
            <meshStandardMaterial color="#FFB800" metalness={1} roughness={0.3} />
          </mesh>
        ))}

        {/* Glow underneath */}
        <mesh position={[0, -1.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[3, 3]} />
          <meshStandardMaterial 
            color="#00FFD1" 
            emissive="#00FFD1" 
            emissiveIntensity={0.3} 
            transparent 
            opacity={0.15} 
          />
        </mesh>
      </group>
    </Float>
  );
}

export default function Vault3D({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas camera={{ position: [0, 0, 6], fov: 35 }}>
        <ambientLight intensity={0.2} />
        <pointLight position={[5, 5, 5]} intensity={1} color="#00FFD1" />
        <pointLight position={[-5, -5, 3]} intensity={0.5} color="#0070FF" />
        <spotLight position={[0, 5, 5]} angle={0.4} penumbra={1} intensity={0.8} color="#FFB800" />
        <Suspense fallback={null}>
          <VaultMesh />
          <Environment preset="night" />
        </Suspense>
      </Canvas>
    </div>
  );
}
