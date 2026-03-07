"use client";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 sm:px-10 py-6">
      <div className="flex items-center justify-between">
        <img src="/logo.png" alt="Quirk" className="h-8 w-8 rounded-full" style={{ opacity: 0.8 }} />
        <a
          href="/login"
          className="text-[12px] tracking-[0.12em] uppercase px-5 py-2.5 rounded-full transition-colors"
          style={{
            color: "rgba(255,255,255,0.4)",
            border: "1px solid rgba(255,255,255,0.08)",
            fontFamily: "var(--font-sans)",
            fontWeight: 300,
          }}
        >
          Sign in
        </a>
      </div>
    </header>
  );
}
