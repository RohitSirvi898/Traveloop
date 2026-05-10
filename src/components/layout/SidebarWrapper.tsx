"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";

const HIDE_SIDEBAR_ROUTES = ["/", "/sign-in", "/sign-up", "/admin"];

export function SidebarWrapper() {
  const pathname = usePathname();
  
  // Hide sidebar on landing, auth, and admin pages
  const shouldHide = HIDE_SIDEBAR_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  if (shouldHide) {
    return null;
  }

  return <Sidebar />;
}
