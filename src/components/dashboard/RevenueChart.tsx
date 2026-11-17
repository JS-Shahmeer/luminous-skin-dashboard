import { formatCurrency } from "@/lib/utils";

export function RevenueChart({ data }: { data: { month: string; value: number }[] }) {
  const max = Math.max(...data.map((d) => d.value));

  return (
    <div className="flex h-56 items-end gap-3 md:gap-5">
      {data.map((d, i) => {
        const isLast = i === data.length - 1;
        const heightPct = Math.max(6, (d.value / max) * 100);
        return (
          <div key={d.month} className="flex flex-1 flex-col items-center gap-2">
            <span className="text-[11px] text-beige">{formatCurrency(d.value)}</span>
            <div className="flex h-40 w-full items-end">
              <div
                className={`w-full rounded-t-sm transition-all ${
                  isLast ? "bg-gradient-to-t from-gold to-gold-soft" : "bg-line"
                }`}
                style={{ height: `${heightPct}%` }}
              />
            </div>
            <span className="text-xs text-beige">{d.month}</span>
          </div>
        );
      })}
    </div>
  );
}
