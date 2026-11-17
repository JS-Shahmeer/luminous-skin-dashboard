"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Award,
  BookOpen,
  Compass,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  User,
  Users,
  GraduationCap,
  ClipboardList,
  FileCheck,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Avatar } from "@/components/ui/Avatar";
import { cn, getInitials } from "@/lib/utils";
import { logoutAction } from "@/app/actions/auth";

export type Role = "student" | "admin";

export interface SidebarUser {
  name: string;
  title: string;
  role: "STUDENT" | "ADMIN";
}

const studentNav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/catalog", label: "Browse Courses", icon: Compass },
  { href: "/my-courses", label: "My Courses", icon: BookOpen },
  { href: "/certificates", label: "Certificates", icon: Award },
  { href: "/profile", label: "Profile", icon: User },
];

const adminNav = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/courses", label: "Courses", icon: BookOpen },
  { href: "/admin/applications", label: "Applications", icon: FileCheck },
  { href: "/admin/students", label: "Students", icon: Users },
  { href: "/admin/certificates", label: "Certificates", icon: GraduationCap },
  { href: "/admin/orders", label: "Orders", icon: ClipboardList },
];

export function SidebarContent({
  role,
  user,
  onNavigate,
}: {
  role: Role;
  user: SidebarUser;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const nav = role === "admin" ? adminNav : studentNav;
  const canSwitch = user.role === "ADMIN";

  return (
    <>
      <div className="flex h-20 items-center border-b border-line px-6">
        <Logo />
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-6">
        <p className="px-2.5 pb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-beige/70">
          {role === "admin" ? "Manage" : "Learn"}
        </p>
        {nav.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "group flex items-center gap-3 rounded-sm border-l-2 px-3 py-2.5 text-sm transition-colors",
                active
                  ? "border-gold bg-gold/10 text-cream"
                  : "border-transparent text-beige hover:border-line hover:bg-white/[0.03] hover:text-cream"
              )}
            >
              <Icon
                size={17}
                strokeWidth={1.75}
                className={cn(active ? "text-gold" : "text-beige group-hover:text-gold")}
              />
              {item.label}
            </Link>
          );
        })}

        {canSwitch && (
          <div className="!mt-6 border-t border-line pt-4">
            <Link
              href={role === "admin" ? "/dashboard" : "/admin"}
              onClick={onNavigate}
              className="group flex items-center gap-3 rounded-sm border-l-2 border-transparent px-3 py-2.5 text-sm text-beige transition-colors hover:border-line hover:bg-white/[0.03] hover:text-cream"
            >
              <ShieldCheck size={17} strokeWidth={1.75} className="text-beige group-hover:text-gold" />
              {role === "admin" ? "Switch to Student View" : "Switch to Admin View"}
            </Link>
          </div>
        )}
      </nav>

      <div className="border-t border-line p-4">
        <div className="flex items-center gap-3 rounded-sm px-2 py-2">
          <Avatar initials={getInitials(user.name)} size={38} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm text-cream">{user.name}</p>
            <p className="truncate text-xs text-beige">
              {role === "admin" ? "Academy Admin" : user.title}
            </p>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="text-beige transition-colors hover:text-gold"
              aria-label="Log out"
            >
              <LogOut size={16} strokeWidth={1.75} />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export function Sidebar({ role, user }: { role: Role; user: SidebarUser }) {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-line bg-charcoal/60 lg:flex">
      <SidebarContent role={role} user={user} />
    </aside>
  );
}
