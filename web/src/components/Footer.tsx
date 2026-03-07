"use client";

export default function Footer() {
  return (
    <footer className="px-6 sm:px-10 pb-12">
      <div className="flex flex-col items-center gap-2 pt-10">
        <p
          className="text-[12px] tracking-[0.1em]"
          style={{ color: "rgba(255,255,255,0.2)", fontFamily: "var(--font-sans)", fontWeight: 300 }}
        >
          quirklabs.ai
        </p>
        <div className="flex gap-5 mt-1">
          {["Terms", "Privacy"].map((link) => (
            <a
              key={link}
              href="#"
              className="text-[11px] tracking-[0.08em] lowercase transition-colors"
              style={{ color: "rgba(255,255,255,0.15)", textDecoration: "none", fontFamily: "var(--font-sans)", fontWeight: 300 }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.15)")}
            >
              {link}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
