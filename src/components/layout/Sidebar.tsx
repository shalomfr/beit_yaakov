"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  Settings,
  Users,
  Building2,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const navigation = [
  {
    name: "דשבורד",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "עובר ושב",
    href: "/transfers",
    icon: ArrowLeftRight,
  },
  {
    name: "חובות",
    href: "/debts",
    icon: Wallet,
  },
  {
    name: "עובדים",
    href: "/employees",
    icon: Users,
  },
  {
    name: "הגדרות",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed right-0 top-0 z-40 h-screen w-72 bg-gradient-to-b from-slate-900 to-slate-800 text-white shadow-2xl">
      {/* Logo */}
      <div className="flex h-20 items-center gap-3 px-6 border-b border-white/10">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/50">
          <Building2 className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            בית יעקב
          </h1>
          <p className="text-xs text-slate-400">ניהול פיננסי</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-8 px-4" data-tour="sidebar">
        <ul className="space-y-2">
          {navigation.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  data-tour={index === 1 ? "expenses-nav" : undefined}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/30"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <item.icon className={cn(
                    "h-5 w-5 transition-transform group-hover:scale-110",
                    isActive && "text-white"
                  )} />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 p-5">
        <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3 backdrop-blur-sm">
          <Avatar className="h-10 w-10 border-2 border-white/20">
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-sm font-bold">
              מנ
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">מנהל המערכת</p>
            <p className="text-xs text-slate-400 truncate">admin@beityaakov.org</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
