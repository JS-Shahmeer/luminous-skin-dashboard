import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="relative grid min-h-screen lg:grid-cols-2">
      <ThemeToggle className="absolute right-5 top-5 z-10 lg:right-8 lg:top-8" />

      {/* Brand panel */}
      <div className="ambient-glow texture-grain relative hidden flex-col justify-between overflow-hidden border-r border-line bg-charcoal p-12 lg:flex">
        <Logo />

        <div className="max-w-md">
          <p className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-gold">
            <Sparkles size={14} /> Luminous SKN Academy
          </p>
          <h1 className="font-serif text-[2.75rem] leading-[1.1] text-cream">
            Clinical mastery, delivered with precision.
          </h1>
          <p className="mt-5 text-[15px] leading-relaxed text-beige">
            Online courses and in-clinic certification for dermal therapists —
            protocols, contraindications and treatment methods taught by the
            Luminous SKN clinical team.
          </p>
        </div>

        <div className="flex items-center gap-8 border-t border-line pt-6">
          <div>
            <p className="font-serif text-2xl text-cream">600+</p>
            <p className="text-xs text-beige">Certified students</p>
          </div>
          <div>
            <p className="font-serif text-2xl text-cream">8</p>
            <p className="text-xs text-beige">Accredited courses</p>
          </div>
          <div>
            <p className="font-serif text-2xl text-cream">4.9</p>
            <p className="text-xs text-beige">Average rating</p>
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex flex-1 flex-col items-center justify-center bg-ink px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-10 flex justify-center lg:hidden">
            <Logo />
          </div>

          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Welcome back
          </p>
          <h2 className="font-serif text-3xl text-cream">Sign in to your academy</h2>
          <p className="mt-2 text-sm text-beige">
            Continue your courses, view certificates and manage your training.
          </p>

          <LoginForm />

          <p className="mt-8 text-center text-sm text-beige">
            New to Luminous SKN?{" "}
            <Link href="/signup" className="text-gold hover:text-gold-soft">
              Create an account
            </Link>
          </p>
          <p className="mt-1 text-center text-xs text-beige/70">
            Just browsing?{" "}
            <Link href="/catalog" className="text-beige hover:text-gold">
              Explore the course catalog
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
