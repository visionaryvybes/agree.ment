import { WarningCircle } from "@phosphor-icons/react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export function EmptyState({ title, description, actionLabel, actionHref, onAction, icon, className }: EmptyStateProps) {
  return (
    <div className={cn("p-16 text-center border-4 border-[var(--text-1)] bg-white shadow-[8px_8px_0_0_black]", className)}>
      {icon || <WarningCircle size={64} weight="duotone" className="mx-auto mb-8 text-[var(--text-3)]" />}
      <h3 className="heading-section text-2xl uppercase font-black mb-4">{title}</h3>
      <p className="text-[var(--text-3)] font-bold mb-8 max-w-md mx-auto">{description}</p>
      
      {actionLabel && actionHref && (
        <Link href={actionHref} className="brutalist-button px-8 py-4 text-xs inline-flex text-white no-underline">
          {actionLabel}
        </Link>
      )}
      {actionLabel && onAction && (
        <button onClick={onAction} className="brutalist-button px-8 py-4 text-xs inline-flex text-white">
          {actionLabel}
        </button>
      )}
    </div>
  );
}
