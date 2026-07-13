"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@/lib/auth";
import { Bell, Plus, X } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import NotificationCenter from "@/components/NotificationCenter";
import { ThemeToggle } from "@/components/ThemeToggle";

const NAVIGATION = [
  { n: "01", name: "Ledger",    href: "/dashboard" },
  { n: "02", name: "Files",     href: "/contracts" },
  { n: "03", name: "Templates", href: "/templates" },
  { n: "04", name: "Explain",   href: "/explain" },
  { n: "05", name: "Counsel",   href: "/tools" },
  { n: "06", name: "Resolve",   href: "/verified-guidance" },
  { n: "07", name: "Settings",  href: "/settings" },
];

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const path = usePathname();
  const { user } = useUser();
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const active = (href: string) =>
    href === "/dashboard" || href === "/contracts" || href === "/templates"
      ? path === href
      : path.startsWith(href);

  return (
    <aside className="flex-shrink-0 w-60 bg-ground border-r border-line flex flex-col h-screen sticky top-0 z-50">
      {/* Wordmark */}
      <div className="px-7 pt-8 pb-6 flex items-center justify-between">
        <Link href="/" prefetch className="text-[22px] leading-none">
          <span className="brand-agree">Agree</span>
          <span className="brand-mint">Mint</span>
        </Link>
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-2 text-ink-3 hover:text-ink transition-colors">
            <X size={18} weight="bold" />
          </button>
        )}
      </div>

      {/* New agreement — the one loud action */}
      <div className="px-5 pb-6">
        <Link
          href="/contracts/new"
          className="group flex items-center justify-between w-full px-4 py-3 bg-ink text-paper rounded-lg text-sm font-semibold hover:bg-mint transition-colors duration-300"
        >
          New agreement
          <Plus size={16} weight="bold" className="group-hover:rotate-90 transition-transform duration-300" />
        </Link>
      </div>

      {/* Index-style nav */}
      <nav className="flex-1 overflow-y-auto custom-scrollbar border-t border-line">
        {NAVIGATION.map(({ n, name, href }) => (
          <Link
            key={href}
            href={href}
            prefetch
            className={cn(
              "group flex items-baseline gap-4 px-7 py-3.5 border-b border-line/60 transition-colors duration-200",
              active(href) ? "bg-card" : "hover:bg-card/60"
            )}
          >
            <span className={cn(
              "font-mono text-[10px] tracking-wider transition-colors",
              active(href) ? "text-mint" : "text-ink-3/60 group-hover:text-ink-3"
            )}>
              {n}
            </span>
            <span className={cn(
              "font-display text-[17px] leading-none transition-all",
              active(href)
                ? "text-ink italic font-semibold"
                : "text-ink-2 group-hover:text-ink group-hover:translate-x-0.5"
            )}>
              {name}
            </span>
            {active(href) && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-mint self-center" />}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-line px-5 py-4 space-y-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setNotificationsOpen(true)}
            className="relative p-2 rounded-lg text-ink-3 hover:text-ink hover:bg-card transition-colors"
            aria-label="Notifications"
          >
            <Bell size={18} weight="duotone" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-mint rounded-full" />
          </button>
          <ThemeToggle />
        </div>
        <div className="flex items-center gap-3 pt-3 border-t border-dashed border-line">
          <div className="w-8 h-8 rounded-full bg-mint text-paper flex items-center justify-center text-xs font-display italic flex-shrink-0">
            {user?.firstName?.charAt(0) ?? "G"}
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-medium text-ink truncate leading-tight">{user?.firstName || "Guest"}</p>
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-ink-3">signed in</p>
          </div>
        </div>
      </div>

      <NotificationCenter isOpen={notificationsOpen} onClose={() => setNotificationsOpen(false)} />
    </aside>
  );
}
