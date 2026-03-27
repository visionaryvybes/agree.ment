"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@/lib/auth";
import {
  Gear,
  X,
  ShieldCheck,
  Layout,
  FolderSimple,
  FileText,
  Bell
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import NotificationCenter from "@/components/NotificationCenter";
import { ThemeToggle } from "@/components/ThemeToggle";

const NAVIGATION = [
  { name: 'Summary', href: '/dashboard', icon: Layout },
  { name: 'Files', href: '/contracts', icon: FolderSimple },
  { name: 'Library', href: '/templates', icon: FileText },
  { name: 'Resolve', href: '/verified-guidance', icon: ShieldCheck },
  { name: 'Settings', href: '/settings', icon: Gear },
];

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const path = usePathname();
  const { user } = useUser();
  const [isHovered, setIsHovered] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const active = (href: string) => {
    if (href === '/contracts' || href === '/dashboard' || href === '/templates') {
      return path === href;
    }
    return path.startsWith(href);
  };

  return (
    <motion.aside 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={false}
      animate={{ width: isHovered ? 280 : 100 }}
      transition={{ type: 'spring', damping: 20, stiffness: 100 }}
      className="flex-shrink-0 bg-[#010101]/40 backdrop-blur-2xl border-r border-white/5 flex flex-col h-screen overflow-hidden relative shadow-[20px_0_60px_rgba(0,0,0,0.4)] z-50"
    >
      
      {/* Background Glows — Subtler */}
      <div className="vibrant-glow top-0 left-0 w-32 h-32 bg-emerald/5 blur-[80px]" />
      <div className="vibrant-glow bottom-0 left-0 w-32 h-32 bg-blue/5 blur-[80px]" />

      {/* Brand */}
      <div className="p-6 flex items-center h-[100px] border-b border-white/10 overflow-hidden px-7">
        <Link href="/" prefetch={true} className="flex items-center gap-4 no-underline group min-w-0">
          <div className="w-11 h-11 relative flex-shrink-0 group-hover:scale-110 transition-all duration-700">
             <img src="/logo_verified.png" className="w-full h-full object-contain" alt="Logo" />
          </div>
          {isHovered && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="min-w-0"
            >
               <h1 className="flex items-center text-xl tracking-tighter leading-none font-black italic uppercase">
                 <span className="brand-agree">AGREE</span>
                 <span className="brand-mint">MINT</span>
              </h1>
            </motion.div>
          )}
        </Link>
        
        {onClose && (
          <button 
            onClick={onClose}
            className="lg:hidden p-3 rounded-2xl bg-white/5 hover:bg-emerald hover:text-[#010101] transition-all ml-auto"
          >
            <X size={20} weight="bold" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-4 overflow-y-auto custom-scrollbar overflow-x-hidden">
        <AnimatePresence>
          {isHovered && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 px-2"
            >
                {/* Brand slogan or empty space */}
            </motion.div>
          )}
        </AnimatePresence>

        <p className={cn(
          "px-4 mb-4 text-[9px] font-black uppercase tracking-[0.4em] text-white/20 transition-opacity",
          !isHovered ? "opacity-0" : "opacity-100"
        )}>
          Menu
        </p>

        <div className="flex flex-col gap-1.5">
          {NAVIGATION.map(({ name, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              prefetch={true}
              className={cn(
                "group relative flex items-center gap-4 px-5 py-4 text-[12px] font-black uppercase tracking-[0.15em] transition-all duration-500 rounded-2xl border border-transparent overflow-hidden",
                active(href)
                  ? "bg-emerald text-[#010101] shadow-[0_10px_30px_rgba(0,255,209,0.2)] border-emerald/5"
                  : "text-text-3 hover:text-white hover:bg-white/[0.03]"
              )}
            >
              {/* Active Indicator Line */}
              {active(href) && (
                <motion.div 
                  layoutId="active-line"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-black rounded-r-full z-20"
                />
              )}

              <div className="relative flex-shrink-0 flex items-center justify-center w-8">
                <Icon
                  size={20}
                  weight="bold"
                  className={cn(
                    "transition-all duration-500 relative z-10", 
                    active(href) ? "scale-110" : "opacity-40 group-hover:opacity-100 group-hover:scale-110 group-hover:text-emerald"
                  )}
                />
              </div>

              {isHovered && (
                <motion.span 
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex-1 truncate relative z-10"
                >
                  {name}
                </motion.span>
              )}
            </Link>
          ))}
        </div>
      </nav>

      {/* Footer / Account */}
      <div className="mt-auto p-4 border-t border-white/5 bg-[#050505]/20 backdrop-blur-2xl space-y-3">
        {/* Notification Bell + Theme Toggle Row */}
        <div className={cn("flex items-center gap-2", isHovered ? "justify-between px-3" : "justify-center")}>
          <button
            onClick={() => setNotificationsOpen(true)}
            className="relative p-2 rounded-xl bg-white/[0.03] border border-white/5 text-text-3 hover:text-emerald hover:border-emerald/20 transition-all"
          >
            <Bell size={18} weight="bold" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald rounded-full border-2 border-[#010101] shadow-[0_0_8px_rgba(0,255,209,0.4)]" />
          </button>
          {isHovered && <ThemeToggle />}
        </div>

        {/* User Info */}
        <div className={cn(
          "flex items-center gap-3 p-3 bg-white/[0.02] rounded-2xl border border-white/5 group transition-all",
          !isHovered ? "justify-center" : "justify-start"
        )}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-black text-[#010101] overflow-hidden shadow-xl group-hover:scale-110 transition-transform" style={{ background: 'linear-gradient(135deg,#00FFD1,#0070FF)' }}>
            {user?.firstName?.charAt(0) ?? "G"}
          </div>
          {isHovered && (
            <motion.div 
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex-1 min-w-0"
            >
              <p className="text-[11px] font-black text-white truncate leading-none tracking-tighter">{user?.firstName || "Account"}</p>
              <p className="text-[8px] text-emerald font-black mt-2 truncate tracking-[0.2em] uppercase opacity-60">Verified</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Notification Center Panel */}
      <NotificationCenter isOpen={notificationsOpen} onClose={() => setNotificationsOpen(false)} />
    </motion.aside>
  );
}
