"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: "background 0.3s, border-color 0.3s",
        background: scrolled ? "rgba(10,10,10,0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        <span style={{ fontSize: 22, fontWeight: 700, color: "var(--primary)", letterSpacing: -0.5 }}>Quirk</span>

        <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
          <nav style={{ display: "flex", gap: 28 }}>
            {["For Contributors", "For AI Companies", "About"].map((item) => (
              <a
                key={item}
                href="#"
                style={{ color: "var(--text-secondary)", fontSize: 14, fontWeight: 500, textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
              >
                {item}
              </a>
            ))}
          </nav>
          <a
            href="#"
            style={{
              background: "var(--primary)",
              color: "#0A0A0A",
              fontWeight: 600,
              fontSize: 14,
              padding: "8px 18px",
              borderRadius: 8,
              textDecoration: "none",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Get the App
          </a>
        </div>
      </div>
    </motion.nav>
  );
}
