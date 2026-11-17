import type { ReactNode } from "react";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export function PublicHeader({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-ink">
      <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-line bg-ink/80 px-5 backdrop-blur md:px-8">
        <Logo />
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button href="/login" variant="ghost" size="sm">
            Sign In
          </Button>
          <Button href="/signup" size="sm">
            Create Account
          </Button>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-5 py-8 md:px-8 md:py-10">{children}</main>
    </div>
  );
}
