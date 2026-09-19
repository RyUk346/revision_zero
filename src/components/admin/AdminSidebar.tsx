"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState } from "react";
import {
  LayoutDashboard,
  FolderKanban,
  Tags,
  Wrench,
  Newspaper,
  Users,
  Briefcase,
  Mail,
  CalendarClock,
  FileText,
  Boxes,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/categories", label: "Categories", icon: Tags },
  { href: "/admin/services", label: "Services", icon: Wrench },
  { href: "/admin/news", label: "News", icon: Newspaper },
  { href: "/admin/team", label: "Team", icon: Users },
  { href: "/admin/careers", label: "Careers", icon: Briefcase },
  { href: "/admin/partners", label: "Partners", icon: Boxes },
  { href: "/admin/messages", label: "Messages", icon: Mail },
  { href: "/admin/calls", label: "Call Requests", icon: CalendarClock },
  { href: "/admin/applications", label: "Applications", icon: FileText },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminSidebar({ userName }: { userName?: string | null }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const nav = (
    <nav className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-5 py-5">
        <span className="flex h-9 w-9 items-center justify-center rounded bg-accent-500 font-display text-sm font-extrabold text-white">
          R0
        </span>
        <div className="leading-tight">
          <p className="text-sm font-bold text-white">Revision Zero</p>
          <p className="text-[11px] uppercase tracking-wider text-steel-400">Admin Panel</p>
        </div>
      </div>

      <div className="admin-scroll flex-1 overflow-y-auto px-3 py-2">
        {LINKS.map((l) => {
          const Active = isActive(l.href, l.exact);
          const I = l.icon;
          return (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                Active
                  ? "bg-accent-500 text-white"
                  : "text-steel-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <I className="h-4 w-4 shrink-0" />
              {l.label}
            </Link>
          );
        })}
      </div>

      <div className="border-t border-white/10 px-3 py-3">
        <Link
          href="/"
          target="_blank"
          className="mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-steel-300 hover:bg-white/5 hover:text-white"
        >
          <ExternalLink className="h-4 w-4" /> View site
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-steel-300 hover:bg-white/5 hover:text-white"
        >
          <LogOut className="h-4 w-4" /> Sign out
          {userName ? <span className="ml-auto truncate text-xs text-steel-500">{userName}</span> : null}
        </button>
      </div>
    </nav>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-steel-200 bg-white px-4 py-3 lg:hidden">
        <span className="font-bold text-steel-900">Admin Panel</span>
        <button onClick={() => setOpen(true)} aria-label="Open menu" className="p-1 text-steel-700">
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 bg-steel-950 lg:block">{nav}</aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-64 bg-steel-950">
            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="absolute right-3 top-4 z-10 text-steel-300"
            >
              <X className="h-6 w-6" />
            </button>
            {nav}
          </div>
        </div>
      )}
    </>
  );
}
