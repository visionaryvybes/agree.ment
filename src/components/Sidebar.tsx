"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import {
  PlusCircle,
  Files,
  Stack,
  BookOpen,
  Sparkle,
  Gear,
  House,
  CaretRight,
  X
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

const nav = [
  { label: "Dashboard", href: "/dashboard", icon: House },
  { label: "New Agreement", href: "/contracts/new", icon: PlusCircle },
  { label: "My Agreements", href: "/contracts", icon: Files },
  { label: "Templates", href: "/templates", icon: Stack },
  { label: "Legal Library", href: "/legal-library", icon: BookOpen },
  { label: "AI Advisor", href: "/ai", icon: Sparkle },
];

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const path = usePathname();
  const { user } = useUser();
  const active = (href: string) => {
    if (href === '/contracts' || href === '/dashboard' || href === '/templates') {
      return path === href;
    }
    return path.startsWith(href);
  };

  return (
    <aside className="w-[300px] flex-shrink-0 bg-[var(--bg)] border-r-4 border-[var(--text-1)] flex flex-col h-screen overflow-hidden relative z-50">

      {/* Brand Section */}
      <div className="p-8 border-b-4 border-[var(--text-1)] bg-[var(--bg)] flex items-center h-[120px] justify-between z-10">
        <Link href="/" className="flex items-center gap-4 no-underline group mb-0 min-w-0 flex-1">
          <div className="w-10 h-10 bg-[var(--text-1)] flex items-center justify-center flex-shrink-0 shadow-[2px_2px_0_0_var(--text-1)] group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-hover:shadow-none transition-all">
            <svg width="20" height="20" viewBox="0 0 14 14" fill="none" className="flex-shrink-0">
              <path d="M2 3h10M2 7h7M2 11h5" stroke="var(--bg)" strokeWidth="2" strokeLinecap="square" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl tracking-tighter leading-none text-[var(--text-1)] uppercase font-black truncate">AgreeMint</h1>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text-3)] mt-1 truncate">Legal Platform</p>
          </div>
        </Link>
        
        {/* Mobile Close Button */}
        {onClose && (
          <button 
            onClick={onClose}
            className="lg:hidden p-2 border-2 border-[var(--text-1)] bg-[var(--color-white)] shadow-[2px_2px_0_0_var(--text-1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all ml-4"
          >
            <X size={20} weight="bold" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-10 px-6 overflow-y-auto space-y-2 custom-scrollbar">
        <p className="px-4 mb-6 text-[9px] font-black uppercase tracking-[0.3em] text-[var(--text-3)] opacity-60">
          Navigation
        </p>
        <div className="flex flex-col gap-2">
          {nav.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "group relative flex items-center gap-4 px-4 py-3 text-sm transition-all duration-100 border-2",
                active(href)
                  ? "bg-[var(--text-1)] text-[var(--bg)] border-[var(--text-1)] shadow-[4px_4px_0_0_#1447E6]"
                  : "text-[var(--text-2)] border-transparent hover:border-[var(--text-1)] hover:bg-[var(--bg-subtle)]"
              )}
            >
              <Icon
                size={22}
                weight={active(href) ? "bold" : "regular"}
                className={cn(
                  "transition-colors",
                  active(href) ? "text-[var(--bg)]" : "text-[var(--text-3)] group-hover:text-[var(--text-1)]"
                )}
              />
              <span className="flex-1 font-black uppercase tracking-tight text-[11px]">{label}</span>
              {active(href) && (
                <CaretRight size={14} weight="bold" />
              )}
            </Link>
          ))}
        </div>
      </nav>

      {/* Footer / Account */}
      <div className="mt-auto p-6 border-t-4 border-[var(--text-1)] bg-[var(--bg)]">
        <Link
          href="/settings"
          className="flex items-center gap-4 px-4 py-3 text-[11px] font-black uppercase tracking-widest text-[var(--text-2)] hover:text-[var(--text-1)] transition-colors mb-6"
        >
          <Gear size={20} weight="bold" />
          <span>General Settings</span>
        </Link>

        <div className="flex items-center gap-4 p-4 bg-[var(--color-white)] border-2 border-[var(--text-1)] shadow-[4px_4px_0_0_var(--text-1)]">
          <div className="w-10 h-10 bg-[var(--blue)] border-2 border-[var(--text-1)] flex items-center justify-center flex-shrink-0 text-xs font-black text-[var(--bg)] overflow-hidden uppercase">
            {user?.imageUrl ? (
              <Image src={user.imageUrl} alt={user.fullName || "User"} width={40} height={40} className="w-full h-full object-cover" />
            ) : (
              user?.firstName?.charAt(0) || "ADM"
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-black text-[var(--text-1)] truncate leading-none uppercase tracking-tighter">{user?.fullName || "User Account"}</p>
            <p className="text-[9px] font-black text-[var(--text-3)] mt-1 truncate uppercase tracking-widest">{user?.primaryEmailAddress?.emailAddress || "Verified Access"}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
