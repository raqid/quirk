"use client";

const stats = [
  { value: "10,000+", label: "contributors" },
  { value: "2M+", label: "data points" },
  { value: "50+", label: "AI companies" },
  { value: "$500K+", label: "paid out" },
];

export default function StatsBar() {
  return (
    <section className="w-full px-6 sm:px-10 pb-36 flex flex-col items-center">
      <div className="max-w-2xl w-full flex flex-wrap gap-x-14 gap-y-8">
        {stats.map((s) => (
          <div key={s.label}>
            <span
              className="text-[24px]"
              style={{ color: "var(--color-olive)", fontFamily: "var(--font-serif)", fontWeight: 300 }}
            >
              {s.value}
            </span>
            <span
              className="text-[13px] ml-2.5"
              style={{ color: "rgba(255,255,255,0.2)", fontFamily: "var(--font-sans)", fontWeight: 300 }}
            >
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
