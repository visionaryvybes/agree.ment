"use client";

import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";

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
                        <div className="flex items-center gap-3">
                            <div
                                className={cn(
                                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold transition-all duration-300",
                                    index < currentStep &&
                                    "border-emerald-500 bg-emerald-500 text-white",
                                    index === currentStep &&
                                    "border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-110",
                                    index > currentStep &&
                                    "border-slate-200 bg-white text-slate-400"
                                )}
                            >
                                {index < currentStep ? (
                                    <CheckCircle2 className="h-5 w-5" />
                                ) : (
                                    index + 1
                                )}
                            </div>
                            <div className="hidden sm:block">
                                <p
                                    className={cn(
                                        "text-sm font-semibold transition-colors",
                                        index <= currentStep ? "text-slate-900" : "text-slate-400"
                                    )}
                                >
                                    {step.label}
                                </p>
                                {step.description && (
                                    <p className="text-xs text-slate-400">{step.description}</p>
                                )}
                            </div>
                        </div>
                        {index !== steps.length - 1 && (
                            <div
                                className={cn(
                                    "mx-4 h-0.5 flex-1 transition-colors duration-500",
                                    index < currentStep ? "bg-emerald-500" : "bg-slate-200"
                                )}
                            />
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
