"use client";

import { useActionState } from "react";
import { Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { loginAction } from "./actions";

export function LoginForm() {
  const [error, formAction, pending] = useActionState(loginAction, undefined);

  return (
    <form className="mt-8 space-y-4" action={formAction}>
      <label className="block">
        <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-beige">
          Email
        </span>
        <div className="flex items-center gap-2.5 rounded-sm border border-line bg-charcoal px-3.5 py-3 focus-within:border-gold/60">
          <Mail size={16} className="text-beige" strokeWidth={1.75} />
          <input
            name="email"
            type="email"
            required
            defaultValue="jordan.blake@example.com"
            placeholder="you@example.com"
            className="w-full bg-transparent text-sm text-cream placeholder:text-beige/60 focus:outline-none"
          />
        </div>
      </label>

      <label className="block">
        <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-beige">
          Password
        </span>
        <div className="flex items-center gap-2.5 rounded-sm border border-line bg-charcoal px-3.5 py-3 focus-within:border-gold/60">
          <Lock size={16} className="text-beige" strokeWidth={1.75} />
          <input
            name="password"
            type="password"
            required
            placeholder="Enter your password"
            className="w-full bg-transparent text-sm text-cream placeholder:text-beige/60 focus:outline-none"
          />
        </div>
      </label>

      {error && <p className="text-sm text-rust">{error}</p>}

      <div className="flex items-center justify-between pt-1 text-sm">
        <label className="flex items-center gap-2 text-beige">
          <input type="checkbox" defaultChecked className="accent-[#C6A875]" />
          Remember me
        </label>
        <a href="#" className="text-beige hover:text-gold">
          Forgot password?
        </a>
      </div>

      <Button type="submit" variant="primary" size="lg" className="w-full" disabled={pending}>
        {pending ? "Signing in…" : "Sign In"}
      </Button>
    </form>
  );
}
