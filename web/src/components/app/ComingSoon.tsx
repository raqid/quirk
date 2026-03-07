'use client';

interface ComingSoonProps {
  title: string;
  description: string;
}

export default function ComingSoon({ title, description }: ComingSoonProps) {
  return (
    <div
      className="flex flex-col items-center justify-center text-center px-8"
      style={{ minHeight: 'calc(100vh - 160px)' }}
    >
      <p
        className="text-[11px] tracking-[0.3em] uppercase mb-6"
        style={{ color: 'rgba(255,255,255,0.15)', fontFamily: 'var(--font-sans)', fontWeight: 300 }}
      >
        coming soon
      </p>
      <h2
        className="text-[28px] mb-4"
        style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, color: 'rgba(255,255,255,0.7)' }}
      >
        {title}
      </h2>
      <p
        className="text-[15px] leading-[1.9] max-w-[380px]"
        style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-sans)', fontWeight: 300 }}
      >
        {description}
      </p>
    </div>
  );
}
