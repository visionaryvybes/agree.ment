"use client";

import { cn } from "@/lib/utils";
import { Check } from "@phosphor-icons/react";

interface StepperProps {
    steps: { label: string; description?: string }[];
    currentStep: number;
    className?: string;
}

export function Stepper({ steps, currentStep, className }: StepperProps) {
    return (
        <nav aria-label="Progress" className={cn("w-full", className)}>
            <ol className="flex items-center">
                {steps.map((step, index) => (
                    <li
                        key={step.label}
                        className={cn(
                            "flex items-center",
                            index !== steps.length - 1 && "flex-1"
                        )}
                    >
                        <div className="flex items-center gap-4">
                            <div
                                className={cn(
                                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-[10px] font-black transition-all duration-500",
                                    index < currentStep &&
                                    "border-[var(--text-1)] bg-[var(--text-1)] text-white",
                                    index === currentStep &&
                                    "border-[var(--text-1)] bg-white text-[var(--text-1)] shadow-xl shadow-black/5 scale-110",
                                    index > currentStep &&
                                    "border-[var(--border-strong)] bg-white text-[var(--text-3)]"
                                )}
                            >
                                {index < currentStep ? (
                                    <Check size={14} weight="bold" />
                                ) : (
                                    index + 1
                                )}
                            </div>
                            <div className="hidden lg:block">
                                <p
                                    className={cn(
                                        "text-[10px] font-black uppercase tracking-widest transition-colors",
                                        index <= currentStep ? "text-[var(--text-1)]" : "text-[var(--text-3)]"
                                    )}
                                >
                                    {step.label}
                                </p>
                            </div>
                        </div>
                        {index !== steps.length - 1 && (
                            <div
                                className={cn(
                                    "mx-6 h-px flex-1 transition-colors duration-700",
                                    index < currentStep ? "bg-[var(--text-1)]" : "bg-[var(--border-strong)]"
                                )}
                            />
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
