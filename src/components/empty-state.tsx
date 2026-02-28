"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    actionLabel?: string;
    actionHref?: string;
    onAction?: () => void;
    className?: string;
}

export function EmptyState({
    icon: Icon,
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
                "flex flex-col items-center justify-center py-16 px-6 text-center",
                className
            )}
        >
            <div className="w-20 h-20 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-6">
                <Icon className="h-10 w-10 text-slate-300" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
            <p className="text-sm text-slate-500 max-w-md mb-6">{description}</p>
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
