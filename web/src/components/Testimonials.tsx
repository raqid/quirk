"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Amara O.",
    country: "Nigeria",
    avatar: "AO",
    quote: "I've been on Quirk for 6 months and my royalty income is now covering my rent. The passive income from data I captured last year still pays out every month.",
    earned: "$312 earned",
  },
  {
    name: "Rafael M.",
    country: "Brazil",
    avatar: "RM",
    quote: "As a photography student, I already had the skills — Quirk just pays me for them. The quality scoring pushed me to improve my composition too.",
    earned: "$189 earned",
  },
  {
    name: "Priya S.",
    country: "India",
    avatar: "PS",
    quote: "Voice tasks are my go-to. I record during my commute and the submissions get approved fast. The referral bonuses for my friends added another income stream.",
    earned: "$241 earned",
  },
];

export default function Testimonials() {
  return (
    <section style={{ padding: "100px 24px", maxWidth: 1200, margin: "0 auto" }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{ textAlign: "center", marginBottom: 64 }}
      >
        <p style={{ color: "var(--primary)", fontWeight: 600, fontSize: 13, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12 }}>Testimonials</p>
        <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 800, letterSpacing: -1.5, margin: 0, color: "var(--text)" }}>
          Real contributors, real earnings
        </h2>
      </motion.div>

      <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.12 }}
            style={{ flex: "1 1 280px", minWidth: 260, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "28px 28px" }}
          >
            {/* Quote */}
            <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.7, margin: "0 0 24px", fontStyle: "italic" }}>
              &ldquo;{t.quote}&rdquo;
            </p>

            {/* Author */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 40, height: 40, background: "var(--primary-dim)", border: "1px solid rgba(0,230,118,0.3)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "var(--primary)" }}>
                  {t.avatar}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{t.country}</div>
                </div>
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--primary)", background: "var(--primary-dim)", padding: "3px 10px", borderRadius: 20 }}>{t.earned}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
