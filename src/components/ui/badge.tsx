import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
    "inline-flex items-center rounded-[2px] border-[1.5px] px-2.5 py-0.5 text-xs font-mono font-bold uppercase tracking-widest transition-colors focus:outline-none focus-visible:outline-2",
    {
        variants: {
            variant: {
                default: "border-line-strong bg-ink text-paper",
                secondary: "border-line bg-wash text-ink-2",
                success: "border-emerald bg-emerald/10 text-emerald",
                warning: "border-amber bg-amber/10 text-amber",
                danger: "border-rose bg-rose/10 text-rose",
                info: "border-blue bg-blue/10 text-blue",
                outline: "text-ink-2 border-line",
                premium: "border-emerald bg-emerald text-paper",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    );
}

export { Badge, badgeVariants };
