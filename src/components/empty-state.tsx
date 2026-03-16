"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    actionLabel?: string;
    actionHref?: string;
    onAction?: () => void;
    className?: string;
}

export function EmptyState({
    icon,
    title,
    description,
    actionLabel,
    actionHref,
    onAction,
    className,
}: EmptyStateProps) {
    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center py-20 px-6 text-center",
                className
            )}
        >
            <div className="w-24 h-24 rounded-3xl bg-[var(--bg-subtle)] border border-[var(--border-strong)] flex items-center justify-center mb-8 shadow-sm">
                {icon}
            </div>
            <h3 className="font-serif text-3xl text-[var(--text-1)] tracking-tight mb-3">{title}</h3>
            <p className="text-base text-[var(--text-2)] max-w-sm mb-10 opacity-70 leading-relaxed font-medium tracking-tight">{description}</p>
            {actionLabel && (
                actionHref ? (
                    <Button variant="premium" asChild>
                        <a href={actionHref}>{actionLabel}</a>
                    </Button>
                ) : (
                    <Button variant="premium" onClick={onAction}>
                        {actionLabel}
                    </Button>
                )
            )}
        </div>
    );
}
