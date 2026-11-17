import { cn } from "@/lib/utils";

export function ProgressBar({
  value,
  className,
  trackClassName,
  fillClassName,
}: {
  value: number;
  className?: string;
  trackClassName?: string;
  fillClassName?: string;
}) {
  return (
    <div
      className={cn("h-1.5 w-full overflow-hidden rounded-full bg-line", trackClassName, className)}
    >
      <div
        className={cn("h-full rounded-full bg-gradient-to-r from-gold-soft to-gold transition-all duration-500", fillClassName)}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
