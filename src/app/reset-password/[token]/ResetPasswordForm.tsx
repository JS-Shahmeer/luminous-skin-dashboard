"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { resetPasswordAction } from "./actions";

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, formAction, pending] = useActionState(resetPasswordAction, undefined);

  if (state?.ok) {
    return (
      <div className="mt-6 space-y-4">
        <p className="text-sm text-sage">{state.message}</p>
        <Link
          href="/login"
          className="inline-block rounded-sm bg-gold px-5 py-2.5 text-sm font-medium text-on-gold hover:bg-gold-soft"
        >
          Go to sign in
        </Link>
      </div>
    );
  }

  return (
    <form className="mt-8 space-y-4" action={formAction}>
      <input type="hidden" name="token" value={token} />

      <label className="block">
        <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-beige">
          New password
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
          Confirm new password
        </span>
        <div className="flex items-center gap-2.5 rounded-sm border border-line bg-charcoal px-3.5 py-3 focus-within:border-gold/60">
          <Lock size={16} className="text-beige" strokeWidth={1.75} />
          <input
            name="confirmPassword"
            type="password"
            required
            minLength={8}
            placeholder="Re-enter your new password"
            className="w-full bg-transparent text-sm text-cream placeholder:text-beige/60 focus:outline-none"
          />
        </div>
      </label>

      {state && !state.ok && <p className="text-sm text-rust">{state.message}</p>}

      <Button type="submit" variant="primary" size="lg" className="w-full" disabled={pending}>
        {pending ? "Resetting…" : "Reset password"}
      </Button>
    </form>
  );
}
