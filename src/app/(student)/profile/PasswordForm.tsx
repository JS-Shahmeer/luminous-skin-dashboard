"use client";

import { useActionState } from "react";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { updatePasswordAction } from "./actions";

export function PasswordForm() {
  const [result, formAction, pending] = useActionState(updatePasswordAction, undefined);

  return (
    <form action={formAction}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-beige">
            New Password
          </span>
          <div className="flex items-center gap-2.5 rounded-sm border border-line bg-ink/40 px-3.5 py-3 focus-within:border-gold/60">
            <Lock size={16} className="text-beige" strokeWidth={1.75} />
            <input
              name="password"
              type="password"
              minLength={8}
              className="w-full bg-transparent text-sm text-cream focus:outline-none"
            />
          </div>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-beige">
            Confirm Password
          </span>
          <div className="flex items-center gap-2.5 rounded-sm border border-line bg-ink/40 px-3.5 py-3 focus-within:border-gold/60">
            <Lock size={16} className="text-beige" strokeWidth={1.75} />
            <input
              name="confirmPassword"
              type="password"
              minLength={8}
              className="w-full bg-transparent text-sm text-cream focus:outline-none"
            />
          </div>
        </label>
      </div>
      <div className="mt-6 flex items-center justify-end gap-3">
        {result && (
          <p className={`text-sm ${result.ok ? "text-sage" : "text-rust"}`}>{result.message}</p>
        )}
        <Button type="submit" size="sm" variant="outline" disabled={pending}>
          {pending ? "Updating…" : "Update Password"}
        </Button>
      </div>
    </form>
  );
}
