"use client";

export default function Footer() {
  return (
    <footer className="px-6 sm:px-10 pb-12">
      <div className="flex flex-col items-center gap-1 pt-8">
        <p className="text-[11px] font-light" style={{ color: "rgba(255,255,255,0.4)" }}>
          &copy; {new Date().getFullYear()} Quirk Labs
        </p>
        <div className="flex gap-4 mt-1">
          {["Terms", "Privacy"].map((link) => (
            <a
              key={link}
              href="#"
              className="text-[11px] font-light transition-colors"
              style={{ color: "rgba(255,255,255,0.25)", textDecoration: "none" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.25)")}
            >
              {link}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
