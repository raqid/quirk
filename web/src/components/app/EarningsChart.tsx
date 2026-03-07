'use client';

interface BarData {
  day: string;
  amount: number;
}

export default function EarningsChart({ data }: { data: BarData[] }) {
  const maxAmount = Math.max(...data.map(d => d.amount), 0.01);

  return (
    <div className="flex items-end gap-2 w-full" style={{ height: 80 }}>
      {data.map((bar, i) => {
        const heightPct = Math.max((bar.amount / maxAmount) * 100, 4);
        const isMax = bar.amount === maxAmount && bar.amount > 0;
        const baseOpacity = 0.08 + i * 0.04;
        const bgColor = isMax
          ? 'rgba(139, 154, 91, 0.5)'
          : `rgba(139, 154, 91, ${baseOpacity})`;

        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-2">
            <div
              className="w-full rounded-sm transition-all duration-300"
              style={{
                height: `${heightPct}%`,
                background: bgColor,
                minHeight: 3,
              }}
            />
            <span
              className="text-[10px] tracking-[0.1em]"
              style={{ color: 'rgba(255,255,255,0.2)', fontFamily: 'var(--font-sans)', fontWeight: 300 }}
            >
              {bar.day}
            </span>
          </div>
        );
      })}
    </div>
  );
}
