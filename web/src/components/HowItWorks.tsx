"use client";

import { motion } from "framer-motion";
import { ClipboardList, Camera, DollarSign } from "lucide-react";

const steps = [
  {
    icon: ClipboardList,
    title: "Browse Tasks",
    desc: "AI companies post specific data collection tasks — portraits, street scenes, voice recordings, and more.",
  },
  {
    icon: Camera,
    title: "Capture Data",
    desc: "Use the Quirk app to capture media that meets the task requirements. Quality scoring happens automatically.",
  },
  {
    icon: DollarSign,
    title: "Earn Money",
    desc: "Get paid instantly for approved submissions, plus royalties every time an AI company licenses your data.",
  },
];

export default function HowItWorks() {
  return (
    <section style={{ padding: "100px 24px", maxWidth: 1200, margin: "0 auto" }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{ textAlign: "center", marginBottom: 64 }}
      >
        <p style={{ color: "var(--primary)", fontWeight: 600, fontSize: 13, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12 }}>How It Works</p>
        <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 800, letterSpacing: -1.5, margin: 0, color: "var(--text)" }}>
          Three steps to start earning
        </h2>
      </motion.div>

      <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              style={{ flex: "1 1 280px", minWidth: 240, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "36px 32px" }}
            >
              <div style={{ width: 52, height: 52, background: "var(--primary-dim)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
                <Icon size={24} color="var(--primary)" />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--primary)", background: "var(--primary-dim)", borderRadius: 20, width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</span>
                <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: "var(--text)" }}>{step.title}</h3>
              </div>
              <p style={{ color: "var(--text-secondary)", fontSize: 15, lineHeight: 1.65, margin: 0 }}>{step.desc}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
