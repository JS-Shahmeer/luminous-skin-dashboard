"use client";

import { useActionState } from "react";
import { Lock, Mail, User } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { signupAction } from "./actions";

export function SignupForm() {
  const [error, formAction, pending] = useActionState(signupAction, undefined);

  return (
    <form className="mt-8 space-y-4" action={formAction}>
      <label className="block">
        <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-beige">
          Full Name
        </span>
        <div className="flex items-center gap-2.5 rounded-sm border border-line bg-charcoal px-3.5 py-3 focus-within:border-gold/60">
          <User size={16} className="text-beige" strokeWidth={1.75} />
          <input
            name="name"
            type="text"
            required
            placeholder="Jordan Blake"
            className="w-full bg-transparent text-sm text-cream placeholder:text-beige/60 focus:outline-none"
          />
        </div>
      </label>

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
            minLength={8}
            placeholder="At least 8 characters"
            className="w-full bg-transparent text-sm text-cream placeholder:text-beige/60 focus:outline-none"
          />
        </div>
      </label>

      <label className="block">
        <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-beige">
          Confirm Password
        </span>
        <div className="flex items-center gap-2.5 rounded-sm border border-line bg-charcoal px-3.5 py-3 focus-within:border-gold/60">
          <Lock size={16} className="text-beige" strokeWidth={1.75} />
          <input
            name="confirmPassword"
            type="password"
            required
            minLength={8}
            placeholder="Re-enter your password"
            className="w-full bg-transparent text-sm text-cream placeholder:text-beige/60 focus:outline-none"
          />
        </div>
      </label>

      {error && <p className="text-sm text-rust">{error}</p>}

      <Button type="submit" variant="primary" size="lg" className="w-full" disabled={pending}>
        {pending ? "Creating account…" : "Create Account"}
      </Button>
    </form>
  );
}
