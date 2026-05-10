"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus, LayoutDashboard, Map, BookOpen, Banknote } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Trips", href: "/my-trips", icon: Map },
  { name: "Journal", href: "/journal", icon: BookOpen },
  { name: "Expenses", href: "/expenses", icon: Banknote },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen bg-[#F8F9FA] flex flex-col px-6 py-8 border-r border-gray-100 sticky top-0 rounded-r-2xl shadow-sm">
      {/* Brand */}
      <div className="mb-8">
        <Link href="/dashboard" className="flex flex-col">
          <span className="text-[#2AB5A0] text-3xl font-bold tracking-tight">
            Traveloop
          </span>
          <span className="text-gray-500 text-xs font-medium uppercase tracking-wider mt-1">
            Modern Adventurous
          </span>
        </Link>
      </div>

      {/* Primary Action */}
      <div className="mb-10">
        <Link href="/trips/create" className="w-full block">
          <Button 
            className="w-full bg-[#F5A623] hover:bg-[#d98f1a] text-white font-medium rounded-lg h-12 shadow-sm flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Plan New Trip
          </Button>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (pathname === '/' && item.href === '/dashboard');
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                isActive 
                  ? "bg-[#E6F4F2] text-[#2AB5A0]" 
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive ? "text-[#2AB5A0]" : "text-gray-500")} />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
