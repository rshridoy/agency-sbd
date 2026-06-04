"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard, Users, FileText, MessageSquare, Image, BarChart2,
  Settings, LogOut, Tag, PenTool, Globe, Building
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/leads", label: "Leads", icon: Users },
  { href: "/admin/community", label: "Community", icon: MessageSquare },
  { href: "/admin/posts", label: "Blog Posts", icon: FileText },
  { href: "/admin/authors", label: "Authors", icon: PenTool },
  { href: "/admin/categories", label: "Categories", icon: Tag },
  { href: "/admin/services", label: "Services", icon: Building },
  { href: "/admin/logos", label: "Client Logos", icon: Image },
  { href: "/admin/stats", label: "Stats", icon: BarChart2 },
];

export function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-64 bg-gray-900 text-gray-300 flex flex-col h-screen sticky top-0 shrink-0">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold">S</div>
          <div>
            <p className="font-bold text-white text-sm">Siren Admin</p>
            <p className="text-xs text-gray-500">CMS Dashboard</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-3">
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mb-0.5",
              isActive(item.href, item.exact)
                ? "bg-brand-600 text-white"
                : "hover:bg-gray-800 hover:text-white"
            )}
          >
            <item.icon size={17} />
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-gray-800">
        <Link href="/" target="_blank" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-gray-800 hover:text-white transition-colors mb-0.5">
          <Globe size={17} /> View Site
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-gray-800 hover:text-red-400 transition-colors"
        >
          <LogOut size={17} /> Sign Out
        </button>
      </div>
    </aside>
  );
}
