import { cn } from "@/lib/utils";

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border border-gold/40 font-serif text-lg text-gold">
        L
      </span>
      {!compact && (
        <span className="leading-tight">
          <span className="block font-serif text-[17px] tracking-wide text-cream">Luminous</span>
          <span className="block -mt-1 text-[9px] font-semibold uppercase tracking-[0.25em] text-beige">
            Academy
          </span>
        </span>
      )}
    </div>
  );
}
