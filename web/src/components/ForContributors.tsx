"use client";

import { motion } from "framer-motion";
import { TrendingUp, Shield, Wallet } from "lucide-react";

const features = [
  {
    icon: TrendingUp,
    title: "Royalty Portfolio",
    desc: "Every approved submission enters your royalty portfolio. Each AI license deal distributes earnings automatically.",
  },
  {
    icon: Shield,
    title: "Tier Multipliers",
    desc: "Reach Gold or Platinum tier and earn up to 3x royalty multipliers on your entire portfolio.",
  },
  {
    icon: Wallet,
    title: "Flexible Payouts",
    desc: "Withdraw via PayPal, bank transfer, or mobile money — whichever works best in your country.",
  },
];

const stats = [
  { value: "$127", label: "avg. monthly earnings" },
  { value: "3×", label: "royalty multiplier at Gold" },
  { value: "47+", label: "countries represented" },
];

export default function ForContributors() {
  return (
    <section style={{ padding: "100px 24px", background: "var(--surface)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: 80, flexWrap: "wrap", alignItems: "center" }}>
          {/* Left */}
          <div style={{ flex: "1 1 400px", minWidth: 300 }}>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p style={{ color: "var(--primary)", fontWeight: 600, fontSize: 13, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12 }}>For Contributors</p>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, letterSpacing: -1.5, margin: "0 0 20px", lineHeight: 1.1, color: "var(--text)" }}>
                Build a portfolio that earns while you sleep
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: 16, lineHeight: 1.7, margin: "0 0 40px" }}>
                Unlike one-time gigs, Quirk's royalty system means your past submissions keep generating income. The more you contribute, the larger your earning base grows.
              </p>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              style={{ display: "flex", gap: 32, flexWrap: "wrap", marginBottom: 40 }}
            >
              {stats.map((s) => (
                <div key={s.label}>
                  <div style={{ fontSize: 28, fontWeight: 800, color: "var(--primary)", letterSpacing: -1 }}>{s.value}</div>
                  <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Feature cards */}
          <div style={{ flex: "1 1 340px", minWidth: 280, display: "flex", flexDirection: "column", gap: 16 }}>
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: i * 0.1 }}
                  style={{ background: "var(--surface-elevated)", border: "1px solid var(--border)", borderRadius: 14, padding: "22px 24px", display: "flex", gap: 16, alignItems: "flex-start" }}
                >
                  <div style={{ width: 42, height: 42, background: "var(--primary-dim)", borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={20} color="var(--primary)" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 4px", color: "var(--text)" }}>{f.title}</h3>
                    <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
