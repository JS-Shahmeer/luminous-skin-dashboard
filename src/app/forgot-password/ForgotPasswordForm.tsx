"use client";

import { useActionState } from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { requestPasswordResetAction } from "./actions";

export function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(requestPasswordResetAction, undefined);

  if (state?.ok) {
    return <p className="mt-6 text-sm text-sage">{state.message}</p>;
  }

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
            placeholder="you@example.com"
            className="w-full bg-transparent text-sm text-cream placeholder:text-beige/60 focus:outline-none"
          />
        </div>
      </label>

      {state && !state.ok && <p className="text-sm text-rust">{state.message}</p>}

      <Button type="submit" variant="primary" size="lg" className="w-full" disabled={pending}>
        {pending ? "Sending…" : "Send reset link"}
      </Button>
    </form>
  );
}
