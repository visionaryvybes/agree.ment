"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  FilePlus,
  FileText,
  BookOpen,
  Sparkles,
  Layers,
  Settings,
  ChevronRight,
} from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

const nav = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutGrid },
  { label: "New Contract", href: "/contracts/new", icon: FilePlus },
  { label: "My Contracts", href: "/contracts", icon: FileText },
  { label: "Templates", href: "/templates", icon: Layers },
  { label: "Legal Library", href: "/legal-library", icon: BookOpen },
  { label: "AI Advisor", href: "/ai", icon: Sparkles },
];

export default function Sidebar() {
  const path = usePathname();
  const active = (href: string) => path.startsWith(href);

  return (
    <aside
      style={{
        width: 260,
        flexShrink: 0,
        background: "var(--sidebar-bg)",
        borderRight: "1px solid var(--sidebar-border)",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {/* Brand */}
      <div style={{ padding: "32px 24px 24px", borderBottom: "1px solid var(--sidebar-border)" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 14, textDecoration: "none" }}>
          <div
            style={{
              width: 32,
              height: 32,
              background: "var(--text-1)",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 14 14" fill="none">
              <path d="M2 3h10M2 7h7M2 11h5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <div className="serif" style={{ color: "var(--text-1)", fontSize: 20, fontWeight: 400, letterSpacing: "-0.01em", lineHeight: 1 }}>
              AgreeMint
            </div>
            <div style={{ color: "var(--text-3)", fontSize: 11, marginTop: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Digital Legal
            </div>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "24px 16px", overflowY: "auto" }}>
        <div style={{ marginBottom: 8 }}>
          <div className="heading-2" style={{ padding: "4px 12px 12px" }}>
            Workspace
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {nav.map(({ label, href, icon: Icon }) => (
              <Tooltip key={href}>
                <TooltipTrigger asChild>
                  <Link
                    href={href}
                    className={`sidebar-link ${active(href) ? "sidebar-link-active" : ""}`}
                    style={{ padding: '10px 12px', borderRadius: 8, fontSize: 14, fontWeight: 500 }}
                  >
                    <Icon size={18} strokeWidth={1.5} style={{ flexShrink: 0, opacity: active(href) ? 1 : 0.7 }} />
                    <span style={{ flex: 1 }}>{label}</span>
                    {active(href) && <ChevronRight size={14} style={{ opacity: 0.4 }} />}
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">{label}</TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div style={{ borderTop: "1px solid var(--sidebar-border)", padding: "16px" }}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href="/settings" className="sidebar-link" style={{ padding: '10px 12px', borderRadius: 8, marginBottom: 8 }}>
              <Settings size={18} strokeWidth={1.5} style={{ opacity: 0.7 }} />
              <span>Settings</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Settings</TooltipContent>
        </Tooltip>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px", background: 'var(--bg-subtle)', borderRadius: 12 }}>
          <div
            style={{
              width: 36,
              height: 36,
              background: "var(--surface-solid)",
              border: "1px solid var(--border)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              fontSize: 13,
              fontWeight: 700,
              color: "var(--text-1)",
            }}
          >
            U
          </div>
          <div>
            <div style={{ fontSize: 13, color: "var(--text-1)", fontWeight: 600 }}>Personal Space</div>
            <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 1, fontWeight: 500 }}>Pro Account</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
