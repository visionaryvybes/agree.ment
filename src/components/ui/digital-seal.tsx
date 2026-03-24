'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { SealCheck } from '@phosphor-icons/react';

export default function DigitalSeal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sealRef = useRef<HTMLDivElement>(null);
  const ring1Ref = useRef<HTMLDivElement>(null);
  const ring2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { width, height, left, top } = container.getBoundingClientRect();
      const x = (clientX - left) / width - 0.5;
      const y = (clientY - top) / height - 0.5;

      gsap.to(sealRef.current, {
        rotateY: x * 30,
        rotateX: -y * 30,
        duration: 0.5,
        ease: "power2.out"
      });

      gsap.to(ring1Ref.current, {
        x: x * 20,
        y: y * 20,
        duration: 0.7,
        ease: "power2.out"
      });

      gsap.to(ring2Ref.current, {
        x: -x * 10,
        y: -y * 10,
        duration: 0.9,
        ease: "power2.out"
      });
    };

    const handleMouseLeave = () => {
      gsap.to([sealRef.current, ring1Ref.current, ring2Ref.current], {
        rotateY: 0,
        rotateX: 0,
        x: 0,
        y: 0,
        duration: 1,
        ease: "elastic.out(1, 0.3)"
      });
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative w-48 h-48 flex items-center justify-center perspective-1000 cursor-pointer"
    >
      {/* Outer Glow Ring */}
      <div 
        ref={ring2Ref}
        className="absolute inset-0 border border-create/10 rounded-full blur-xl animate-pulse" 
      />
      
      {/* Middle Orbit Ring */}
      <div 
        ref={ring1Ref}
        className="absolute inset-4 border-2 border-dashed border-create/20 rounded-full animate-spin-slow" 
      />

      {/* The Central Seal */}
      <div 
        ref={sealRef}
        className="relative z-10 w-24 h-24 bg-gradient-to-br from-emerald to-emerald/40 rounded-3xl flex items-center justify-center shadow-[0_0_50px_rgba(0,255,209,0.3)] transform-style-3d"
      >
        <div className="absolute inset-1 bg-[#010101] rounded-[22px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-emerald/10 to-transparent" />
          <SealCheck size={40} weight="duotone" className="text-emerald relative z-20" />
        </div>
      </div>

      <style jsx>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .animate-spin-slow { animation: spin 10s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
