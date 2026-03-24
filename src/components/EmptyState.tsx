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
    <div className={cn("p-16 text-center bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl", className)}>
      {icon || <WarningCircle size={56} weight="duotone" className="mx-auto mb-6 text-[var(--text-3)]" />}
      <h3 className="text-xl font-semibold text-[var(--text-1)] mb-3">{title}</h3>
      <p className="text-sm text-[var(--text-2)] mb-8 max-w-sm mx-auto leading-relaxed">{description}</p>
      
      {actionLabel && actionHref && (
        <Link href={actionHref} className="btn-primary px-6 py-3 text-sm inline-flex no-underline rounded-lg font-medium">
          {actionLabel}
        </Link>
      )}
      {actionLabel && onAction && (
        <button onClick={onAction} className="btn-primary px-6 py-3 text-sm inline-flex rounded-lg font-medium">
          {actionLabel}
        </button>
      )}
    </div>
  );
}
