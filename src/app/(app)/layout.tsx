'use client';

import { useUser, UserButton } from '@/lib/auth';
import { usePathname } from 'next/navigation';
import {
  Plus,
  Stack,
  Browsers,
  FileText,
  MagnifyingGlass,
} from "@phosphor-icons/react";
import Sidebar from "@/components/Sidebar";
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isLoaded } = useUser();
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (isLoaded) setMounted(true);
  }, [isLoaded]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!mounted) return (
    <div className="min-h-screen bg-ground flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-emerald/20 border-t-emerald rounded-full animate-spin shadow-[0_0_15px_rgba(16,119,94,0.2)]" />
    </div>
  );

  return (
    <div className="min-h-screen bg-ground text-ink selection:bg-emerald selection:text-paper flex font-sans overflow-x-hidden">

      {/* ── SIDEBAR (DESKTOP) ──────────────────────────────────────── */}
      {!isMobile && <Sidebar />}

      {/* ── MOBILE BOTTOM DOCK ────────────────────────────────────── */}
      {isMobile && (
        <div className="fixed bottom-8 left-6 right-6 z-[100]">
          <nav className="liquid-gloss rounded-2xl px-6 py-4 flex items-center justify-between shadow-[var(--shadow-lift)]">
            {[
              { name: 'Ledger', icon: Browsers, href: '/dashboard' },
              { name: 'Files', icon: FileText, href: '/contracts' },
              { name: 'Templates', icon: Stack, href: '/templates' },
              { name: 'Explain', icon: MagnifyingGlass, href: '/explain' },
            ].map((item) => {
              const active = pathname === item.href;
              return (
                <Link key={item.name} href={item.href} className={cn("relative p-2 transition-all duration-300", active ? "text-mint" : "text-text-3")}>
                  <item.icon size={24} weight={active ? 'fill' : 'duotone'} />
                  {active && (
                    <motion.div layoutId="mobile-nav-dot" className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-mint rounded-full" />
                  )}
                </Link>
              );
            })}
            <Link href="/contracts/new" className="w-12 h-12 bg-ink text-paper rounded-xl flex items-center justify-center active:scale-90 transition-transform">
              <Plus size={24} weight="bold" />
            </Link>
          </nav>
        </div>
      )}

      {/* ── MAIN CONTENT ─────────────────────────────────────────── */}
      <main className="flex-1 relative min-h-screen overflow-y-auto">
        <div className="p-6 md:p-12 lg:p-16 max-w-7xl mx-auto">
          {/* Mobile Header Branding */}
          {isMobile && (
            <header className="mb-12 flex items-center justify-between">
              <span className="text-xl leading-none">
                <span className="brand-agree">Agree</span>
                <span className="brand-mint">Mint</span>
              </span>
              <UserButton appearance={{ elements: { avatarBox: "w-10 h-10 rounded-2xl border border-line" } }} />
            </header>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

    </div>
  );
}
