'use client';

import React, { useEffect, useRef } from 'react';
import { SealCheck } from '@phosphor-icons/react';

export default function DigitalSeal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sealRef = useRef<HTMLDivElement>(null);
  const ring1Ref = useRef<HTMLDivElement>(null);
  const ring2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const targets = [sealRef.current, ring1Ref.current, ring2Ref.current];
    targets.forEach((t) => {
      if (t) t.style.transition = 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)';
    });

    const handleMouseMove = (e: MouseEvent) => {
      const { width, height, left, top } = container.getBoundingClientRect();
      const x = (e.clientX - left) / width - 0.5;
      const y = (e.clientY - top) / height - 0.5;
      if (sealRef.current)
        sealRef.current.style.transform = `rotateY(${x * 30}deg) rotateX(${-y * 30}deg)`;
      if (ring1Ref.current)
        ring1Ref.current.style.transform = `translate(${x * 20}px, ${y * 20}px)`;
      if (ring2Ref.current)
        ring2Ref.current.style.transform = `translate(${-x * 10}px, ${-y * 10}px)`;
    };

    const handleMouseLeave = () => {
      targets.forEach((t) => {
        if (t) t.style.transform = '';
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
      className="relative w-48 h-48 flex items-center justify-center cursor-pointer"
      style={{ perspective: '1000px' }}
    >
      {/* Outer Glow Ring */}
      <div
        ref={ring2Ref}
        className="absolute inset-0 rounded-full blur-xl animate-pulse"
        style={{ border: '1px solid rgba(16,119,94,0.1)' }}
      />

      {/* Middle Orbit Ring */}
      <div
        ref={ring1Ref}
        className="absolute inset-4 rounded-full animate-spin-slow"
        style={{ border: '2px dashed rgba(16,119,94,0.2)' }}
      />

      {/* The Central Seal */}
      <div
        ref={sealRef}
        className="relative z-10 w-24 h-24 bg-gradient-to-br from-emerald to-emerald/40 rounded-3xl flex items-center justify-center shadow-[0_0_50px_rgba(16,119,94,0.3)]"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="absolute inset-1 bg-ground rounded-[22px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-emerald/10 to-transparent" />
          <SealCheck size={40} weight="duotone" className="text-emerald relative z-20" />
        </div>
      </div>
    </div>
  );
}
