"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

function PhoneMockup() {
  const barHeights = [40, 65, 50, 80, 55, 70, 45];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="w-[260px] sm:w-[280px] shrink-0"
    >
      <div
        className="rounded-[40px] p-5 pb-6 flex flex-col gap-4"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Status bar */}
        <div className="flex justify-between items-center px-2 pt-1 pb-2">
          <span
            className="text-[13px] font-medium"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            9:41
          </span>
          <div className="flex gap-1">
            <div className="w-3.5 h-2 rounded-sm" style={{ background: "rgba(255,255,255,0.15)" }} />
            <div className="w-3.5 h-2 rounded-sm" style={{ background: "rgba(255,255,255,0.15)" }} />
            <div className="w-4 h-2 rounded-sm" style={{ background: "rgba(255,255,255,0.2)" }} />
          </div>
        </div>

        {/* Earnings card */}
        <div className="px-1">
          <p className="text-[11px] font-medium tracking-wide uppercase" style={{ color: "rgba(255,255,255,0.3)" }}>
            Total Earned
          </p>
          <p className="text-[28px] font-semibold mt-0.5" style={{ color: "rgba(255,255,255,0.8)", letterSpacing: "-0.02em" }}>
            $284.50
          </p>
          <div
            className="inline-block mt-2 px-2.5 py-1 rounded-full text-[10px] font-medium"
            style={{
              background: "rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.4)",
            }}
          >
            Gold Tier
          </div>
        </div>

        {/* Mini bar chart */}
        <div className="flex items-end gap-1.5 h-16 px-1 mt-1">
          {barHeights.map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-sm"
              style={{
                height: `${h}%`,
                background: `rgba(255,255,255,${0.08 + i * 0.03})`,
              }}
            />
          ))}
        </div>

        {/* Task cards */}
        <div className="flex flex-col gap-2 mt-1">
          {[
            { label: "Photo · Street Signs", amount: "$2.50" },
            { label: "Audio · Ambient Sound", amount: "$3.00" },
          ].map((task) => (
            <div
              key={task.label}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <span className="text-[12px]" style={{ color: "rgba(255,255,255,0.35)" }}>
                {task.label}
              </span>
              <span className="text-[12px] font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>
                {task.amount}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function Hero() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(id);
  }, []);

  return (
    <section
      className="pt-28 sm:pt-36 pb-20 px-6 sm:px-10 w-full flex flex-col items-center"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1)" }}
    >
      <div className="max-w-5xl w-full flex flex-col md:flex-row md:items-center md:justify-between gap-12 md:gap-16">
        <div className="max-w-xl">
          <h1
            className="text-[32px] sm:text-[42px] font-semibold leading-tight mb-5"
            style={{ color: "rgba(255,255,255,0.9)", letterSpacing: "-0.03em" }}
          >
            Your data trains AI. You should get paid.
          </h1>

          <p className="text-[15px] leading-[1.8] font-light max-w-md" style={{ color: "rgba(255,255,255,0.3)" }}>
            Capture photos, videos, and audio. Earn upfront payments plus royalties
            every time your data is licensed by an AI company.
          </p>
        </div>

        <PhoneMockup />
      </div>
    </section>
  );
}
