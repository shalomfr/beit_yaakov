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
    <aside className="fixed right-0 top-0 z-40 h-screen w-64 bg-sidebar text-sidebar-foreground">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sidebar-primary">
          <Building2 className="h-5 w-5 text-sidebar-primary-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-bold">בית יעקב</h1>
          <p className="text-xs text-sidebar-foreground/70">ניהול פיננסי</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-6 px-3">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sidebar-accent text-sm font-medium">
            מנ
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">מנהל המערכת</p>
            <p className="text-xs text-sidebar-foreground/70 truncate">admin@beityaakov.org</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
