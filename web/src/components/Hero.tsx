"use client";

import { useState, useEffect } from "react";

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
      <div className="max-w-2xl w-full">
        <h1
          className="text-[32px] sm:text-[42px] font-semibold leading-tight max-w-xl mb-5"
          style={{ color: "rgba(255,255,255,0.9)", letterSpacing: "-0.03em" }}
        >
          Your data trains AI. You should get paid.
        </h1>

        <p className="text-[15px] leading-[1.8] font-light max-w-md" style={{ color: "rgba(255,255,255,0.3)" }}>
          Capture photos, videos, and audio. Earn upfront payments plus royalties
          every time your data is licensed by an AI company.
        </p>
      </div>
    </section>
  );
}
