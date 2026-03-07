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
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        {/* Status bar */}
        <div className="flex justify-between items-center px-2 pt-1 pb-2">
          <span
            className="text-[13px]"
            style={{ color: "rgba(255,255,255,0.2)", fontFamily: "var(--font-sans)", fontWeight: 300 }}
          >
            9:41
          </span>
          <div className="flex gap-1">
            <div className="w-3.5 h-2 rounded-sm" style={{ background: "rgba(255,255,255,0.1)" }} />
            <div className="w-3.5 h-2 rounded-sm" style={{ background: "rgba(255,255,255,0.1)" }} />
            <div className="w-4 h-2 rounded-sm" style={{ background: "rgba(255,255,255,0.15)" }} />
          </div>
        </div>

        {/* Earnings card */}
        <div className="px-1">
          <p
            className="text-[11px] tracking-[0.15em] uppercase"
            style={{ color: "rgba(255,255,255,0.2)", fontFamily: "var(--font-sans)", fontWeight: 300 }}
          >
            Total Earned
          </p>
          <p
            className="text-[28px] mt-1"
            style={{ color: "rgba(255,255,255,0.6)", fontFamily: "var(--font-serif)", fontWeight: 300 }}
          >
            $284.50
          </p>
          <div
            className="inline-block mt-2 px-2.5 py-1 rounded-full text-[10px] tracking-[0.1em] uppercase"
            style={{
              background: "var(--color-olive-dim)",
              color: "var(--color-olive)",
              fontFamily: "var(--font-sans)",
              fontWeight: 400,
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
                background: `rgba(139, 154, 91, ${0.1 + i * 0.05})`,
              }}
            />
          ))}
        </div>

        {/* Task cards */}
        <div className="flex flex-col gap-2 mt-1">
          {[
            { label: "photo · street signs", amount: "$2.50" },
            { label: "audio · ambient sound", amount: "$3.00" },
          ].map((task) => (
            <div
              key={task.label}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <span
                className="text-[12px] tracking-wide"
                style={{ color: "rgba(255,255,255,0.25)", fontFamily: "var(--font-sans)", fontWeight: 300 }}
              >
                {task.label}
              </span>
              <span
                className="text-[12px]"
                style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-sans)", fontWeight: 400 }}
              >
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
      className="pt-32 sm:pt-44 pb-24 px-6 sm:px-10 w-full flex flex-col items-center"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 1s cubic-bezier(0.16, 1, 0.3, 1)" }}
    >
      <div className="max-w-5xl w-full flex flex-col md:flex-row md:items-center md:justify-between gap-16 md:gap-20">
        <div className="max-w-xl text-center md:text-left">
          <p
            className="text-[12px] tracking-[0.25em] uppercase mb-8"
            style={{ color: "rgba(255,255,255,0.25)", fontFamily: "var(--font-sans)", fontWeight: 300 }}
          >
            Your data has value
          </p>

          <h1
            className="text-[38px] sm:text-[56px] leading-[1.1] mb-7"
            style={{ fontFamily: "var(--font-serif)", fontWeight: 300, color: "rgba(255,255,255,0.85)" }}
          >
            your data trains AI.{" "}
            <span style={{ color: "var(--color-olive)" }}>
              you should get paid.
            </span>
          </h1>

          <p
            className="text-[15px] leading-[1.9] max-w-md mx-auto md:mx-0"
            style={{ color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-sans)", fontWeight: 300 }}
          >
            capture photos, videos, and audio. get paid upfront.
            <br />
            earn royalties every time it&apos;s licensed again.
          </p>
        </div>

        <PhoneMockup />
      </div>
    </section>
  );
}
