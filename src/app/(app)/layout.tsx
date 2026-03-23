"use client";

import Sidebar from "@/components/Sidebar";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { List } from "@phosphor-icons/react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Close sidebar on navigation
    useEffect(() => {
        setSidebarOpen(false);
    }, [pathname]);

    return (
        <div className="flex h-screen overflow-hidden bg-[var(--bg)] print:h-auto print:overflow-visible">
            {/* Desktop Sidebar Sidebar */}
            <div className="hidden lg:block print:hidden">
                <Sidebar />
            </div>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {sidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSidebarOpen(false)}
                            className="fixed inset-0 bg-[var(--text-1)]/60 backdrop-blur-sm z-[60] lg:hidden"
                        />
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 z-[70] lg:hidden w-[300px]"
                        >
                            <Sidebar onClose={() => setSidebarOpen(false)} />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Mobile Header */}
                <header className="lg:hidden print:hidden h-16 border-b-2 border-[var(--text-1)] bg-[var(--color-white)] flex items-center justify-between px-6 flex-shrink-0 z-50">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[var(--text-1)] flex items-center justify-center shadow-[1px_1px_0_0_var(--text-1)]">
                             <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M2 3h10M2 7h7M2 11h5" stroke="var(--bg)" strokeWidth="2" strokeLinecap="square" />
                            </svg>
                        </div>
                        <span className="font-black uppercase tracking-tighter text-[var(--text-1)] text-lg">AgreeMint</span>
                    </div>
                    <button 
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 border-2 border-[var(--text-1)] bg-[var(--color-white)] shadow-[2px_2px_0_0_var(--text-1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
                    >
                        <List size={22} weight="bold" />
                    </button>
                </header>

                <main className="flex-1 overflow-y-auto relative bg-[var(--bg)] custom-scrollbar print:overflow-visible text-[var(--text-1)]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={pathname}
                            initial={{ opacity: 0, y: 10, scale: 0.995 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.995 }}
                            transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
                            className="min-h-full flex flex-col"
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}
