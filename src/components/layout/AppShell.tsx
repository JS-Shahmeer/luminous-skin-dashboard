"use client";

import { useState, type ReactNode } from "react";
import { X } from "lucide-react";
import { Sidebar, SidebarContent, type Role, type SidebarUser } from "./Sidebar";
import { Topbar } from "./Topbar";
import { cn } from "@/lib/utils";

export function AppShell({
  role,
  user,
  title,
  children,
}: {
  role: Role;
  user: SidebarUser;
  title?: string;
  children: ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-ink">
      <Sidebar role={role} user={user} />

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden",
          mobileOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
      >
        <div
          onClick={() => setMobileOpen(false)}
          className={cn(
            "absolute inset-0 bg-ink/80 backdrop-blur-sm transition-opacity",
            mobileOpen ? "opacity-100" : "opacity-0"
          )}
        />
        <div
          className={cn(
            "absolute inset-y-0 left-0 flex w-72 flex-col border-r border-line bg-charcoal transition-transform duration-300",
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <button
            onClick={() => setMobileOpen(false)}
            className="absolute right-4 top-6 text-beige hover:text-cream"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
          <SidebarContent role={role} user={user} onNavigate={() => setMobileOpen(false)} />
        </div>
      </div>

      <div className="lg:pl-64">
        <Topbar title={title} userName={user.name} onMenuClick={() => setMobileOpen(true)} />
        <main className="px-5 py-8 md:px-8 md:py-10">{children}</main>
      </div>
    </div>
  );
}
