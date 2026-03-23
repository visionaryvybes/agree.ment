import { cn } from "@/lib/utils";

export function RadialProgress({ 
  pct, 
  size = 120, 
  stroke = 10, 
  color = "var(--blue)", 
  className 
}: { 
  pct: number; 
  size?: number; 
  stroke?: number; 
  color?: string;
  className?: string;
}) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }} className={cn("drop-shadow-xl", className)}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)' }}
      />
    </svg>
  );
}
