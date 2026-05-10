"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MapPin,
  FileText,
  DollarSign,
  Settings,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + "/");

  const menuItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/my-trips", label: "My Trips", icon: MapPin },
    { href: "/documents", label: "Documents", icon: FileText },
    { href: "/expenses", label: "Expenses", icon: DollarSign },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-40 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-black border-r border-slate-200 dark:border-slate-800 py-6 px-3 flex flex-col">
      {/* Branding */}
      <div className="mb-8 px-2">
        <h1 className="text-xl font-bold text-teal-600 dark:text-teal-400">Traveloop</h1>
      </div>

      {/* New Trip Button */}
      <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-lg mb-6">
        + New Trip
      </Button>

      {/* Navigation Menu */}
      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  active
                    ? "bg-teal-600 text-white"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <Icon size={20} />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Menu */}
      <div className="space-y-1 border-t border-slate-200 dark:border-slate-800 pt-4">
        <Link href="/settings">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <Settings size={20} />
            <span className="text-sm font-medium">Settings</span>
          </div>
        </Link>
        <Link href="/support">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <HelpCircle size={20} />
            <span className="text-sm font-medium">Support</span>
          </div>
        </Link>
      </div>
    </aside>
  );
}
