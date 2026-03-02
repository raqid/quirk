"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";

const stats = [
  { end: 10000, suffix: "+", label: "Contributors", prefix: "" },
  { end: 2, suffix: "M+", label: "Data Points", prefix: "" },
  { end: 50, suffix: "+", label: "AI Companies", prefix: "" },
  { end: 500, suffix: "K+", label: "Paid Out", prefix: "$" },
];

function AnimatedCounter({ end, suffix, prefix, active }: { end: number; suffix: string; prefix: string; active: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    const duration = 1800;
    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [active, end]);

  const display = end >= 1000 ? (count / 1000).toFixed(count >= end ? 0 : 1) : count;
  const displaySuffix = end >= 1000 ? `K${suffix}` : suffix;

  return (
    <span style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 800, color: "var(--primary)", letterSpacing: -2 }}>
      {prefix}{end >= 1000 ? display : count}{displaySuffix}
    </span>
  );
}

export default function StatsBar() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} style={{ background: "var(--surface)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "64px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: 40 }}>
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            style={{ textAlign: "center" }}
          >
            <AnimatedCounter end={s.end} suffix={s.suffix} prefix={s.prefix} active={inView} />
            <div style={{ fontSize: 14, color: "var(--text-secondary)", marginTop: 4 }}>{s.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
