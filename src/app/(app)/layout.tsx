'use client';

import { useUser, UserButton } from '@clerk/nextjs';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Warning, 
  ChartBar, 
  ArrowRight, 
  Clock, 
  CheckCircle, 
  ShieldCheck, 
  Sparkle, 
  CaretRight,
  CaretLeft,
  Plus,
  Files,
  Stack,
  Books,
  Scales,
  House,
  MagnifyingGlass,
  PlusCircle,
  Browsers,
  FileText,
  Gear
} from "@phosphor-icons/react";
import Sidebar from "@/components/Sidebar";
import ScrollToTop from "@/components/ScrollToTop";
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isLoaded: clerkLoaded } = useUser();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (clerkLoaded) {
      setIsLoaded(true);
    } else {
      const timer = setTimeout(() => setIsLoaded(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [clerkLoaded]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);


  if (!isLoaded) return (
    <div className="min-h-screen bg-[#010101] flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-emerald/20 border-t-emerald rounded-full animate-spin shadow-[0_0_15px_rgba(0,255,209,0.2)]" />
    </div>
  );

  const navigation = [
    { name: 'Dashboard', icon: Browsers, href: '/dashboard' },
    { name: 'Contracts', icon: FileText, href: '/contracts' },
    { name: 'Templates', icon: Stack, href: '/templates' },
    { name: 'Repository', icon: Books, href: '/legal-library' },
    { name: 'System Guidance', icon: ShieldCheck, href: '/verified-guidance' },
    { name: 'Settings', icon: Gear, href: '/settings' },
  ];

  return (
    <div className="min-h-screen bg-[#010101] text-white selection:bg-emerald selection:text-[#010101] flex font-sans overflow-x-hidden">
      
      {/* ── SIDEBAR (DESKTOP) ──────────────────────────────────────── */}
      {!isMobile && <Sidebar />}

      {/* ── MOBILE BOTTOM DOCK ────────────────────────────────────── */}
      {isMobile && (
        <div className="fixed bottom-8 left-6 right-6 z-[100]">
          <nav className="liquid-gloss rounded-[32px] px-8 py-5 flex items-center justify-between shadow-[0_32px_64px_rgba(0,0,0,0.9)] border-white/5">
            {[
              { name: 'Deals', icon: Browsers, href: '/dashboard' },
              { name: 'Library', icon: FileText, href: '/contracts' },
              { name: 'Templates', icon: Stack, href: '/templates' },
              { name: 'Resolve', icon: ShieldCheck, href: '/verified-guidance' },
            ].map((item) => {
              const active = pathname === item.href;
              return (
                <Link key={item.name} href={item.href} className={cn("relative p-2 transition-all duration-500", active ? "text-emerald scale-110" : "text-text-3")}>
                  <item.icon size={28} weight={active ? 'fill' : 'bold'} />
                  {active && <motion.div layoutId="mobile-nav-dot" className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-emerald rounded-full shadow-[0_0_15px_#00FFD1]" />}
                </Link>
              );
            })}
            <Link href="/contracts/new" className="w-14 h-14 bg-emerald rounded-[20px] flex items-center justify-center text-[#010101] shadow-[0_0_30px_rgba(0,255,209,0.3)] active:scale-90 transition-transform">
              <PlusCircle size={32} weight="bold" />
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
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(0,255,209,0.2)]">
                  <Plus weight="bold" size={20} className="text-[#010101]" />
                </div>
                <span className="font-display font-black text-xl tracking-tighter uppercase italic">Agree<span className="text-emerald not-italic">Mint</span></span>
              </div>
              <UserButton appearance={{ elements: { avatarBox: "w-10 h-10 rounded-2xl border border-white/10" } }} />
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

      <ScrollToTop />
    </div>
  );
}
