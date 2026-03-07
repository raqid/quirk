'use client';

interface TierProgressProps {
  tier: string;
  nextTier: string;
  progress: number;
  uploadsNeeded: number | null;
}

export default function TierProgress({ tier, nextTier, progress, uploadsNeeded }: TierProgressProps) {
  const pct = Math.min(Math.max(progress, 0), 100);

  const label = uploadsNeeded != null && uploadsNeeded > 0 && nextTier
    ? `${tier} tier · ${uploadsNeeded} upload${uploadsNeeded !== 1 ? 's' : ''} to ${nextTier}`
    : `${tier} tier`;

  return (
    <div className="flex items-center gap-4">
      <span
        className="text-[13px] capitalize whitespace-nowrap"
        style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-sans)', fontWeight: 300 }}
      >
        {label}
      </span>
      <div
        className="flex-1 h-[3px] rounded-full overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.05)' }}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            background: 'var(--color-olive)',
            opacity: 0.5,
          }}
        />
      </div>
    </div>
  );
}
