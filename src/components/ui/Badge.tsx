import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Tone = "gold" | "sage" | "rust" | "neutral" | "outline";

const tones: Record<Tone, string> = {
  gold: "bg-gold/15 text-gold border border-gold/30",
  sage: "bg-sage/15 text-sage border border-sage/30",
  rust: "bg-rust/15 text-rust border border-rust/30",
  neutral: "bg-charcoal text-beige border border-line",
  outline: "bg-transparent text-beige border border-line",
};

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
