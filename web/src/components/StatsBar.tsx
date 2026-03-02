"use client";

const stats = [
  { value: "10,000+", label: "contributors" },
  { value: "2M+", label: "data points" },
  { value: "50+", label: "AI companies" },
  { value: "$500K+", label: "paid out" },
];

export default function StatsBar() {
  return (
    <section className="w-full px-6 sm:px-10 pb-32 flex flex-col items-center">
      <div className="max-w-2xl w-full flex flex-wrap gap-x-12 gap-y-6">
        {stats.map((s) => (
          <div key={s.label}>
            <span
              className="text-[22px] font-semibold"
              style={{ color: "rgba(255,255,255,0.8)", letterSpacing: "-0.02em" }}
            >
              {s.value}
            </span>
            <span className="text-[13px] font-light ml-2" style={{ color: "rgba(255,255,255,0.25)" }}>
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
