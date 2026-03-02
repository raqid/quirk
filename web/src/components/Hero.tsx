"use client";

import { motion } from "framer-motion";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] },
});

export default function Hero() {
  return (
    <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", padding: "120px 24px 80px", maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 80, width: "100%", flexWrap: "wrap" }}>
        {/* Left */}
        <div style={{ flex: "1 1 480px", minWidth: 300 }}>
          <motion.div {...fadeUp(0)}>
            <span style={{ display: "inline-block", background: "var(--primary-dim)", color: "var(--primary)", fontSize: 13, fontWeight: 600, padding: "4px 12px", borderRadius: 20, marginBottom: 24, border: "1px solid rgba(0,230,118,0.25)" }}>
              Now in Beta · 10,000+ Contributors
            </span>
          </motion.div>

          <motion.h1 {...fadeUp(0.1)} style={{ fontSize: "clamp(36px, 5vw, 62px)", fontWeight: 800, lineHeight: 1.08, letterSpacing: -2, margin: "0 0 20px", color: "var(--text)" }}>
            Your data trains AI.{" "}
            <span style={{ color: "var(--primary)" }}>You should get paid.</span>
          </motion.h1>

          <motion.p {...fadeUp(0.2)} style={{ fontSize: 18, color: "var(--text-secondary)", lineHeight: 1.65, maxWidth: 480, margin: "0 0 40px" }}>
            Capture photos, videos, and audio. Earn upfront payments plus royalties every time your data is licensed by an AI company.
          </motion.p>

          <motion.div {...fadeUp(0.3)} style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a href="#" style={{ display: "flex", alignItems: "center", gap: 10, background: "#fff", color: "#0A0A0A", fontWeight: 600, padding: "12px 22px", borderRadius: 10, textDecoration: "none", fontSize: 15 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
              App Store
            </a>
            <a href="#" style={{ display: "flex", alignItems: "center", gap: 10, background: "var(--surface-elevated)", color: "var(--text)", fontWeight: 600, padding: "12px 22px", borderRadius: 10, textDecoration: "none", fontSize: 15, border: "1px solid var(--border)" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-1.303a1 1 0 010 1.192L15.57 14.17l-2.37-2.37L15.57 9.43l2.128 1.974zM5.864 2.658L16.8 8.99l-2.302 2.302-8.635-8.635z"/></svg>
              Google Play
            </a>
          </motion.div>
        </div>

        {/* Phone mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          style={{ flex: "0 0 auto" }}
        >
          <div style={{ width: 260, height: 520, background: "var(--surface)", border: "2px solid var(--border)", borderRadius: 44, padding: 12, boxShadow: "0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)" }}>
            <div style={{ background: "var(--surface-elevated)", borderRadius: 36, height: "100%", overflow: "hidden", display: "flex", flexDirection: "column" }}>
              {/* Status bar */}
              <div style={{ height: 44, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", flexShrink: 0 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text)" }}>9:41</span>
                <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                  <div style={{ width: 14, height: 8, borderRadius: 2, border: "1.5px solid var(--text-secondary)" }}><div style={{ width: "80%", height: "100%", background: "var(--primary)", borderRadius: 1 }}/></div>
                </div>
              </div>
              {/* App content preview */}
              <div style={{ padding: "8px 16px 16px", flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>Total Earned</div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: "var(--primary)" }}>$284.50</div>
                  </div>
                  <div style={{ background: "var(--primary-dim)", borderRadius: 20, padding: "4px 10px", fontSize: 11, color: "var(--primary)", fontWeight: 600 }}>Gold</div>
                </div>
                {/* Fake chart bar */}
                <div style={{ display: "flex", gap: 4, alignItems: "flex-end", height: 50 }}>
                  {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                    <div key={i} style={{ flex: 1, background: i === 5 ? "var(--primary)" : "var(--border)", borderRadius: 3, height: `${h}%` }} />
                  ))}
                </div>
                {/* Task cards */}
                {[
                  { task: "Street photos", pay: "$2.50", status: "Active" },
                  { task: "Voice samples", pay: "$1.80", status: "Active" },
                  { task: "Indoor video", pay: "$5.00", status: "New" },
                ].map((t) => (
                  <div key={t.task} style={{ background: "var(--surface)", borderRadius: 10, padding: "10px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text)" }}>{t.task}</div>
                      <div style={{ fontSize: 10, color: "var(--text-secondary)" }}>{t.status}</div>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "var(--primary)" }}>{t.pay}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
