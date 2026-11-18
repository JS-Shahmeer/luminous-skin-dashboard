import { Sparkles } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { ResetPasswordForm } from "./ResetPasswordForm";

export default async function ResetPasswordPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

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
          <h2 className="font-serif text-3xl text-cream">Choose a new password</h2>

          <ResetPasswordForm token={token} />
        </div>
      </div>
    </div>
  );
}
