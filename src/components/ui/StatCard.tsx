import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  trendLabel,
  className,
}: {
  label: string;
  value: string;
  icon?: LucideIcon;
  trend?: number;
  trendLabel?: string;
  className?: string;
}) {
  const positive = (trend ?? 0) >= 0;
  return (
    <div className={cn("rounded-lg border border-line bg-charcoal p-5", className)}>
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium uppercase tracking-wider text-beige">{label}</p>
        {Icon && (
          <span className="flex h-9 w-9 items-center justify-center rounded-sm bg-gold/10 text-gold">
            <Icon size={16} strokeWidth={1.75} />
          </span>
        )}
      </div>
      <p className="mt-4 font-serif text-3xl text-cream">{value}</p>
      {trend !== undefined && (
        <div className="mt-2 flex items-center gap-1.5 text-xs">
          <span
            className={cn(
              "flex items-center gap-0.5 font-medium",
              positive ? "text-sage" : "text-rust"
            )}
          >
            {positive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
            {Math.abs(trend)}%
          </span>
          <span className="text-beige">{trendLabel}</span>
        </div>
      )}
    </div>
  );
}
