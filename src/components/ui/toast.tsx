"use client";

import * as React from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

const ToastProvider = ToastPrimitive.Provider;

const ToastViewport = React.forwardRef<
    React.ElementRef<typeof ToastPrimitive.Viewport>,
    React.ComponentPropsWithoutRef<typeof ToastPrimitive.Viewport>
>(({ className, ...props }, ref) => (
    <ToastPrimitive.Viewport
        ref={ref}
        className={cn(
            "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
            className
        )}
        {...props}
    />
));
ToastViewport.displayName = ToastPrimitive.Viewport.displayName;

const toastVariants = cva(
    "group pointer-events-auto relative flex w-full items-center justify-between space-x-2 overflow-hidden rounded-2xl border p-5 pr-8 shadow-2xl transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
    {
        variants: {
            variant: {
                default: "border-[var(--border-strong)] bg-transparent text-[var(--text-1)]",
                success: "border-emerald-200 bg-emerald-50 text-emerald-900",
                destructive: "border-red-200 bg-red-50 text-red-900",
                warning: "border-amber-200 bg-amber-50 text-amber-900",
                premium: "border-[var(--glass-border)] bg-[var(--text-1)] text-[var(--bg)]",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

const Toast = React.forwardRef<
    React.ElementRef<typeof ToastPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof ToastPrimitive.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
    return (
        <ToastPrimitive.Root
            ref={ref}
            className={cn(toastVariants({ variant }), className)}
            {...props}
        />
    );
});
Toast.displayName = ToastPrimitive.Root.displayName;

const ToastAction = React.forwardRef<
    React.ElementRef<typeof ToastPrimitive.Action>,
    React.ComponentPropsWithoutRef<typeof ToastPrimitive.Action>
>(({ className, ...props }, ref) => (
    <ToastPrimitive.Action
        ref={ref}
        className={cn(
            "inline-flex h-9 shrink-0 items-center justify-center rounded-xl border border-[var(--border-strong)] bg-transparent px-4 text-[10px] font-black uppercase tracking-widest transition-all hover:bg-[var(--bg-subtle)] focus:outline-none disabled:pointer-events-none disabled:opacity-50",
            className
        )}
        {...props}
    />
));
ToastAction.displayName = ToastPrimitive.Action.displayName;

const ToastClose = React.forwardRef<
    React.ElementRef<typeof ToastPrimitive.Close>,
    React.ComponentPropsWithoutRef<typeof ToastPrimitive.Close>
>(({ className, ...props }, ref) => (
    <ToastPrimitive.Close
        ref={ref}
        className={cn(
            "absolute right-2 top-2 rounded-lg p-1.5 text-[var(--text-3)] opacity-0 transition-opacity hover:text-[var(--text-1)] focus:opacity-100 focus:outline-none group-hover:opacity-100",
            className
        )}
        toast-close=""
        {...props}
    >
        <X size={14} weight="bold" />
    </ToastPrimitive.Close>
));
ToastClose.displayName = ToastPrimitive.Close.displayName;

const ToastTitle = React.forwardRef<
    React.ElementRef<typeof ToastPrimitive.Title>,
    React.ComponentPropsWithoutRef<typeof ToastPrimitive.Title>
>(({ className, ...props }, ref) => (
    <ToastPrimitive.Title
        ref={ref}
        className={cn("text-[13px] font-bold tracking-tight [&+div]:mt-1", className)}
        {...props}
    />
));
ToastTitle.displayName = ToastPrimitive.Title.displayName;

const ToastDescription = React.forwardRef<
    React.ElementRef<typeof ToastPrimitive.Description>,
    React.ComponentPropsWithoutRef<typeof ToastPrimitive.Description>
>(({ className, ...props }, ref) => (
    <ToastPrimitive.Description
        ref={ref}
        className={cn("text-[12px] font-medium text-[var(--text-2)] leading-relaxed", className)}
        {...props}
    />
));
ToastDescription.displayName = ToastPrimitive.Description.displayName;

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>;
type ToastActionElement = React.ReactElement<typeof ToastAction>;

export {
    type ToastProps,
    type ToastActionElement,
    ToastProvider,
    ToastViewport,
    Toast,
    ToastTitle,
    ToastDescription,
    ToastClose,
    ToastAction,
};
