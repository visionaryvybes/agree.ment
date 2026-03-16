"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import {
  PlusCircle,
  Files,
  Stack,
  BookOpen,
  Sparkle,
  Gear,
  House,
  MagnifyingGlass,
  Command,
  SelectionBackground,
  CaretRight
} from "@phosphor-icons/react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const nav = [
  { label: "Dashboard", href: "/dashboard", icon: House },
  { label: "New Contract", href: "/contracts/new", icon: PlusCircle },
  { label: "My Contracts", href: "/contracts", icon: Files },
  { label: "Templates", href: "/templates", icon: Stack },
  { label: "Legal Library", href: "/legal-library", icon: BookOpen },
  { label: "AI Advisor", href: "/ai", icon: Sparkle },
];

export default function Sidebar() {
  const path = usePathname();
  const { user } = useUser();
  const active = (href: string) => path === href || (href !== "/dashboard" && path.startsWith(href));

  return (
    <aside className="w-[280px] flex-shrink-0 bg-white border-r-[3px] border-[var(--text-1)] flex flex-col h-screen overflow-hidden relative z-50">

      {/* Brand Section */}
      <div className="p-8 border-b-2 border-[var(--text-1)] bg-[var(--bg)]">
        <Link href="/" className="flex items-center gap-4 no-underline group mb-0">
          <div className="w-10 h-10 bg-[var(--text-1)] flex items-center justify-center flex-shrink-0 shadow-[2px_2px_0_0_black] group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-hover:shadow-none transition-all">
            <svg width="20" height="20" viewBox="0 0 14 14" fill="none">
              <path d="M2 3h10M2 7h7M2 11h5" stroke="#fff" strokeWidth="2" strokeLinecap="square" />
            </svg>
          </div>
          <div>
            <h1 className="heading-section text-xl tracking-tighter leading-none text-[var(--text-1)] uppercase font-black">AgreeMint</h1>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text-3)] mt-1">Core Protocol</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-10 px-6 overflow-y-auto space-y-2 custom-scrollbar">
        <p className="px-4 mb-6 text-[9px] font-black uppercase tracking-[0.3em] text-[var(--text-3)] opacity-60">
          Architecture
        </p>
        <div className="flex flex-col gap-2">
          {nav.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "group relative flex items-center gap-4 px-4 py-3 text-sm transition-all duration-100 border-2",
                active(href)
                  ? "bg-[var(--text-1)] text-white border-[var(--text-1)] shadow-[4px_4px_0_0_#1447E6]"
                  : "text-[var(--text-2)] border-transparent hover:border-[var(--text-1)] hover:bg-[var(--bg-subtle)]"
              )}
            >
              <Icon
                size={22}
                weight={active(href) ? "bold" : "regular"}
                className={cn(
                  "transition-colors",
                  active(href) ? "text-white" : "text-[var(--text-3)] group-hover:text-[var(--text-1)]"
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
      <div className="mt-auto p-6 border-t-2 border-[var(--text-1)] bg-[var(--bg)]">
        <Link
          href="/settings"
          className="flex items-center gap-4 px-4 py-3 text-[11px] font-black uppercase tracking-widest text-[var(--text-2)] hover:text-[var(--text-1)] transition-colors mb-6"
        >
          <Gear size={20} weight="bold" />
          <span>Protocol Configuration</span>
        </Link>

        <div className="flex items-center gap-4 p-4 bg-white border-2 border-[var(--text-1)] shadow-[3px_3px_0_0_black]">
          <div className="w-10 h-10 bg-[var(--blue)] border-2 border-[var(--text-1)] flex items-center justify-center flex-shrink-0 text-xs font-black text-white overflow-hidden uppercase">
            {user?.imageUrl ? (
              <img src={user.imageUrl} alt={user.fullName || "User"} className="w-full h-full object-cover" />
            ) : (
              user?.firstName?.charAt(0) || "ADM"
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-black text-[var(--text-1)] truncate leading-none uppercase tracking-tighter">{user?.fullName || "Root Admin"}</p>
            <p className="text-[9px] font-black text-[var(--text-3)] mt-1 truncate uppercase tracking-widest">{user?.primaryEmailAddress?.emailAddress || "Level 1 Enforcement"}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
