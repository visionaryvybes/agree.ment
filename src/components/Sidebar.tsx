"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FilePlus,
  FileText,
  BookOpen,
  MessageSquare,
  Palette,
  ChevronRight,
} from "lucide-react";

const navItems = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    description: "Overview and analytics",
  },
  {
    name: "New Contract",
    href: "/contracts/new",
    icon: FilePlus,
    description: "Create or upload",
  },
  {
    name: "My Contracts",
    href: "/contracts",
    icon: FileText,
    description: "Manage contracts",
  },
  {
    name: "Templates",
    href: "/templates",
    icon: Palette,
    description: "Template gallery",
  },
  {
    name: "Legal Library",
    href: "/legal-library",
    icon: BookOpen,
    description: "Laws & constitutions",
  },
  {
    name: "AI Legal Advisor",
    href: "/ai",
    icon: MessageSquare,
    description: "Ask legal questions",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen">
      {/* Logo Section */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <div>
            <h1 className="text-white font-bold text-lg leading-none">
              AgreeMint
            </h1>
            <p className="text-xs text-slate-400">Legal-Tech Platform</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-6">
        <div className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-link group ${
                  active ? "sidebar-link-active" : ""
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{item.name}</div>
                  <p className="text-xs opacity-75 truncate">
                    {item.description}
                  </p>
                </div>
                {active && (
                  <ChevronRight className="w-4 h-4 flex-shrink-0 opacity-75" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer Section */}
      <div className="border-t border-slate-800 p-4">
        <div className="bg-slate-800 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-slate-300">
                Pro Plan Active
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Unlimited contracts & AI analysis
              </p>
            </div>
          </div>
          <button className="w-full mt-3 px-3 py-2 text-xs font-medium text-teal-400 hover:text-teal-300 hover:bg-slate-700 rounded transition-colors">
            View Plans
          </button>
        </div>
      </div>

      {/* User Section */}
      <div className="border-t border-slate-800 p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-200 truncate">
              Account
            </p>
            <p className="text-xs text-slate-400 truncate">Settings</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
