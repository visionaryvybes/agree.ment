'use client';

import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  Float, 
  Text,
  Environment,
  ContactShadows,
  PresentationControls,
  Line
} from '@react-three/drei';
import * as THREE from 'three';

// Stylish signature path (normalized)
const SIGNATURE_POINTS: [number, number, number][] = [
  [-1, 0, 0.06], [-0.8, 0.5, 0.06], [-0.6, -0.2, 0.06], [-0.4, 0.3, 0.06],
  [-0.2, -0.1, 0.06], [0, 0.2, 0.06], [0.2, -0.2, 0.06], [0.4, 0.1, 0.06],
  [0.6, -0.05, 0.06], [0.8, 0, 0.06], [1, 0, 0.06]
];

function Signature({ progress }: { progress: number }) {
  const points = useMemo(() => {
    const count = Math.max(2, Math.ceil(progress * SIGNATURE_POINTS.length));
    return SIGNATURE_POINTS.slice(0, count) as [number, number, number][];
  }, [progress]);

  return (
    <Line
      points={points}
      color="#00FFD1"
      lineWidth={4}
      transparent
      opacity={0.8}
    />
  );
}

function SigningPen({ progress }: { progress: number }) {
  const penRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!penRef.current) return;
    const pointIdx = Math.min(
      Math.floor(progress * (SIGNATURE_POINTS.length - 1)),
      SIGNATURE_POINTS.length - 1
    );
    const target = SIGNATURE_POINTS[pointIdx];
    
    // Smoothly follow the signature path
    penRef.current.position.lerp(new THREE.Vector3(target[0], target[1], target[2] + 0.4), 0.1);
    penRef.current.rotation.z = Math.sin(progress * 20) * 0.1;
    penRef.current.rotation.x = -Math.PI / 4 + Math.cos(progress * 10) * 0.1;
  });

  return (
    <group ref={penRef}>
      <mesh castShadow>
        <cylinderGeometry args={[0.015, 0.015, 0.6, 16]} />
        <meshPhysicalMaterial color="#111" roughness={0.2} metalness={0.9} />
      </mesh>
      <mesh position={[0, -0.3, 0]}>
        <coneGeometry args={[0.015, 0.08, 16]} />
        <meshPhysicalMaterial color="#00FFD1" emissive="#00FFD1" emissiveIntensity={2} />
      </mesh>
      <pointLight color="#00FFD1" intensity={0.5} distance={1} position={[0, -0.3, 0]} />
    </group>
  );
}

function ContractPaper() {
  return (
    <group rotation={[-Math.PI / 10, 0, 0]} position={[0, -0.2, 0]}>
      <mesh receiveShadow>
        <boxGeometry args={[3, 4, 0.05]} />
        <meshPhysicalMaterial 
          color="#111" 
          roughness={0.8} 
          metalness={0.1}
          transparent
          opacity={0.95}
        />
      </mesh>
      <gridHelper args={[3, 20, "#222", "#181818"]} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.03]} />
      
      <Text
        position={[0, 1.4, 0.04]}
        fontSize={0.15}
        color="#00FFD1"
        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.woff"
      >
        AGREEMINT VERIFIED
      </Text>
      
      <mesh position={[0, -1, 0.04]}>
        <planeGeometry args={[2, 0.01]} />
        <meshBasicMaterial color="#333" />
      </mesh>
    </group>
  );
}

function SceneContent() {
  const [progress, setProgress] = useState(0);

  useFrame((state) => {
    // Loop signature animation - more natural timing
    const t = state.clock.getElapsedTime();
    const p = (Math.sin(t * 0.8) + 1) / 2;
    setProgress(p);
  });

  return (
    <PresentationControls
      global
      snap
      speed={1.5}
      rotation={[0, 0.2, 0]}
      polar={[-0.1, 0.1]}
      azimuth={[-0.1, 0.1]}
    >
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.1}>
        <ContractPaper />
        <Signature progress={progress} />
        <SigningPen progress={progress} />
      </Float>
    </PresentationControls>
  );
}

export default function HandSigningScene() {
  return (
    <div className="w-full h-full min-h-[500px] relative pointer-events-auto">
      <Canvas shadows camera={{ position: [0, 0, 4.5], fov: 35 }}>
        <ambientLight intensity={0.8} />
        <spotLight position={[5, 10, 5]} angle={0.3} penumbra={1} intensity={5} castShadow />
        
        <SceneContent />
        
        <ContactShadows position={[0, -2.5, 0]} opacity={0.6} scale={10} blur={2.5} />
        <Environment preset="night" />
      </Canvas>
    </div>
  );
}
