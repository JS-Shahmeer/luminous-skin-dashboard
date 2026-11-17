"use client";

import { Bell, Menu, Search } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { getInitials } from "@/lib/utils";

export function Topbar({
  title,
  userName,
  onMenuClick,
}: {
  title?: string;
  userName: string;
  onMenuClick?: () => void;
}) {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center gap-4 border-b border-line bg-ink/80 px-5 backdrop-blur md:px-8">
      <button
        onClick={onMenuClick}
        className="text-beige hover:text-cream lg:hidden"
        aria-label="Open menu"
      >
        <Menu size={22} strokeWidth={1.75} />
      </button>

      {title ? (
        <h2 className="font-serif text-xl text-cream lg:hidden">{title}</h2>
      ) : (
        <div className="lg:hidden" />
      )}

      <div className="ml-auto flex flex-1 items-center justify-end gap-4 md:flex-none">
        <div className="hidden items-center gap-2.5 rounded-sm border border-line bg-charcoal px-3.5 py-2.5 text-beige focus-within:border-gold/50 md:flex md:w-72">
          <Search size={16} strokeWidth={1.75} />
          <input
            type="text"
            placeholder="Search courses, students…"
            className="w-full bg-transparent text-sm text-cream placeholder:text-beige focus:outline-none"
          />
        </div>

        <ThemeToggle />

        <button
          className="relative text-beige hover:text-cream"
          aria-label="Notifications"
        >
          <Bell size={19} strokeWidth={1.75} />
          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-gold" />
        </button>

        <div className="hidden items-center gap-2.5 border-l border-line pl-4 md:flex">
          <Avatar initials={getInitials(userName)} size={34} />
        </div>
      </div>
    </header>
  );
}
