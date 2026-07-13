'use client';

import React, { useEffect, useRef } from 'react';

interface MagneticProps {
  children: React.ReactElement;
  strength?: number;
}

/** Gently pulls its child toward the cursor on hover (CSS spring, no deps). */
export default function Magnetic({ children, strength = 40 }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.style.transition = 'transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)';

    const handleMouseMove = (e: MouseEvent) => {
      const { height, width, left, top } = el.getBoundingClientRect();
      const x = (e.clientX - (left + width / 2)) * (strength / 100);
      const y = (e.clientY - (top + height / 2)) * (strength / 100);
      el.style.transform = `translate(${x}px, ${y}px)`;
    };

    const handleMouseLeave = () => {
      el.style.transform = 'translate(0, 0)';
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [strength]);

  return (
    <div ref={ref} className="inline-block">
      {children}
    </div>
  );
}
