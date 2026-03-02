"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export default function CTASection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
  };

  return (
    <section style={{ padding: "100px 24px", background: "var(--surface)", borderTop: "1px solid var(--border)" }}>
      <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
        >
          <p style={{ color: "var(--primary)", fontWeight: 600, fontSize: 13, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 16 }}>Get Started</p>
          <h2 style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 800, letterSpacing: -2, margin: "0 0 20px", color: "var(--text)", lineHeight: 1.05 }}>
            Start earning today
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: 17, lineHeight: 1.65, margin: "0 0 48px" }}>
            Join thousands of contributors building passive income from their data. Download the app or drop your email for early access to our web portal.
          </p>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ background: "var(--primary-dim)", border: "1px solid rgba(0,230,118,0.3)", borderRadius: 12, padding: "16px 24px", color: "var(--primary)", fontWeight: 600 }}
            >
              You&apos;re on the list! We&apos;ll be in touch soon.
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", gap: 10, maxWidth: 480, margin: "0 auto 40px", flexWrap: "wrap" }}>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ flex: "1 1 220px", background: "var(--surface-elevated)", border: "1px solid var(--border)", borderRadius: 10, padding: "13px 16px", color: "var(--text)", fontSize: 15, outline: "none" }}
              />
              <button
                type="submit"
                style={{ background: "var(--primary)", color: "#0A0A0A", fontWeight: 700, fontSize: 15, padding: "13px 24px", borderRadius: 10, border: "none", cursor: "pointer", whiteSpace: "nowrap" }}
              >
                Get Early Access
              </button>
            </form>
          )}

          {/* App badges */}
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="#" style={{ display: "flex", alignItems: "center", gap: 10, background: "var(--surface-elevated)", color: "var(--text)", fontWeight: 600, padding: "12px 22px", borderRadius: 10, textDecoration: "none", fontSize: 14, border: "1px solid var(--border)" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
              App Store
            </a>
            <a href="#" style={{ display: "flex", alignItems: "center", gap: 10, background: "var(--surface-elevated)", color: "var(--text)", fontWeight: 600, padding: "12px 22px", borderRadius: 10, textDecoration: "none", fontSize: 14, border: "1px solid var(--border)" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-1.303a1 1 0 010 1.192L15.57 14.17l-2.37-2.37L15.57 9.43l2.128 1.974zM5.864 2.658L16.8 8.99l-2.302 2.302-8.635-8.635z"/></svg>
              Google Play
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
