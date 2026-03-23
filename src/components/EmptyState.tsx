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
    <div className={cn("p-16 text-center border border-[var(--glass-border)] bg-transparent shadow-2xl", className)}>
      {icon || <WarningCircle size={64} weight="duotone" className="mx-auto mb-8 text-[var(--text-3)]" />}
      <h3 className="heading-section text-2xl uppercase font-black mb-4">{title}</h3>
      <p className="text-[var(--text-3)] font-bold mb-8 max-w-md mx-auto">{description}</p>
      
      {actionLabel && actionHref && (
        <Link href={actionHref} className="btn-primary px-8 py-4 text-xs inline-flex text-[var(--bg)] no-underline">
          {actionLabel}
        </Link>
      )}
      {actionLabel && onAction && (
        <button onClick={onAction} className="btn-primary px-8 py-4 text-xs inline-flex text-[var(--bg)]">
          {actionLabel}
        </button>
      )}
    </div>
  );
}
