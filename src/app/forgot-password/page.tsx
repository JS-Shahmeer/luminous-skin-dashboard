import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <div className="relative grid min-h-screen lg:grid-cols-2">
      <ThemeToggle className="absolute right-5 top-5 z-10 lg:right-8 lg:top-8" />

      <div className="ambient-glow texture-grain relative hidden flex-col justify-between overflow-hidden border-r border-line bg-charcoal p-12 lg:flex">
        <Logo />
        <div className="max-w-md">
          <p className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-gold">
            <Sparkles size={14} /> Luminous SKN Academy
          </p>
          <h1 className="font-serif text-[2.75rem] leading-[1.1] text-cream">
            Clinical mastery, delivered with precision.
          </h1>
        </div>
        <div />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center bg-ink px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-10 flex justify-center lg:hidden">
            <Logo />
          </div>

          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Reset password
          </p>
          <h2 className="font-serif text-3xl text-cream">Forgot your password?</h2>
          <p className="mt-2 text-sm text-beige">
            Enter the email on your account and we&apos;ll send you a link to reset it.
          </p>

          <ForgotPasswordForm />

          <p className="mt-8 text-center text-sm text-beige">
            Remembered it?{" "}
            <Link href="/login" className="text-gold hover:text-gold-soft">
              Back to sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
