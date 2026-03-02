"use client";

export default function Footer() {
  const navLinks = [
    { label: "For Contributors", href: "#" },
    { label: "For AI Companies", href: "#" },
    { label: "About", href: "#" },
    { label: "Blog", href: "#" },
  ];

  const legalLinks = [
    { label: "Terms", href: "#" },
    { label: "Privacy", href: "#" },
    { label: "Cookies", href: "#" },
  ];

  return (
    <footer style={{ borderTop: "1px solid var(--border)", padding: "48px 24px 32px", background: "var(--bg)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 32, marginBottom: 40 }}>
          {/* Brand */}
          <div style={{ flex: "0 0 auto" }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: "var(--primary)", marginBottom: 8 }}>Quirk</div>
            <p style={{ fontSize: 14, color: "var(--text-tertiary)", maxWidth: 240, lineHeight: 1.6, margin: 0 }}>
              The AI training data marketplace that pays contributors fairly.
            </p>
          </div>

          {/* Nav */}
          <div style={{ display: "flex", gap: 48, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 16 }}>Product</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {navLinks.map((l) => (
                  <a key={l.label} href={l.href} style={{ fontSize: 14, color: "var(--text-tertiary)", textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-tertiary)")}
                  >
                    {l.label}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 16 }}>Legal</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {legalLinks.map((l) => (
                  <a key={l.label} href={l.href} style={{ fontSize: 14, color: "var(--text-tertiary)", textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-tertiary)")}
                  >
                    {l.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div style={{ borderTop: "1px solid var(--border)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <span style={{ fontSize: 13, color: "var(--text-tertiary)" }}>© 2026 Quirk Labs. All rights reserved.</span>
          <div style={{ display: "flex", gap: 16 }}>
            {/* Twitter/X */}
            <a href="#" style={{ color: "var(--text-tertiary)", transition: "color 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-tertiary)")}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            {/* LinkedIn */}
            <a href="#" style={{ color: "var(--text-tertiary)", transition: "color 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-tertiary)")}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
