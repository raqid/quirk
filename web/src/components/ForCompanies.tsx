"use client";

import { motion } from "framer-motion";
import { Globe, CheckCircle, FileText } from "lucide-react";

const pillars = [
  {
    icon: Globe,
    title: "Global & Diverse",
    desc: "Contributors across 47 countries, capturing real-world scenes in dozens of languages and environments.",
  },
  {
    icon: CheckCircle,
    title: "Quality Verified",
    desc: "Every submission is scored on quality, diversity, and metadata completeness before entering the marketplace.",
  },
  {
    icon: FileText,
    title: "Fully Compliant",
    desc: "Contributor consent, compensation records, and licensing terms are documented for every data point.",
  },
];

export default function ForCompanies() {
  return (
    <section style={{ padding: "100px 24px", maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ display: "flex", gap: 80, flexWrap: "wrap", alignItems: "center" }}>
        {/* Feature grid */}
        <div style={{ flex: "1 1 340px", minWidth: 280, display: "flex", flexDirection: "column", gap: 16 }}>
          {pillars.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.1 }}
                style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: "22px 24px", display: "flex", gap: 16, alignItems: "flex-start" }}
              >
                <div style={{ width: 42, height: 42, background: "var(--primary-dim)", borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon size={20} color="var(--primary)" />
                </div>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 4px", color: "var(--text)" }}>{p.title}</h3>
                  <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>{p.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Right text */}
        <div style={{ flex: "1 1 400px", minWidth: 300 }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p style={{ color: "var(--primary)", fontWeight: 600, fontSize: 13, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12 }}>For AI Companies</p>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, letterSpacing: -1.5, margin: "0 0 20px", lineHeight: 1.1, color: "var(--text)" }}>
              Diverse, ethical, real-world training data
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: 16, lineHeight: 1.7, margin: "0 0 32px" }}>
              Stop scraping the web and hoping for the best. Quirk gives you custom datasets built to spec — the right demographics, environments, and data types — from contributors who consent and get compensated.
            </p>

            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              {["Photo", "Video", "Audio", "3D", "Text"].map((type) => (
                <span key={type} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 20, padding: "5px 14px", fontSize: 13, fontWeight: 500, color: "var(--text-secondary)" }}>
                  {type}
                </span>
              ))}
            </div>

            <motion.a
              href="#"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              style={{ display: "inline-block", marginTop: 36, background: "var(--primary)", color: "#0A0A0A", fontWeight: 700, fontSize: 15, padding: "13px 28px", borderRadius: 10, textDecoration: "none" }}
            >
              Request a Dataset
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
