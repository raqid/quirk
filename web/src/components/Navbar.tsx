"use client";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 sm:px-10 py-6">
      <div className="flex items-center gap-1.5">
        <p
          className="text-[13px] font-semibold tracking-tight"
          style={{ color: "rgba(255,255,255,0.6)", letterSpacing: "-0.02em" }}
        >
          Quirk
        </p>
      </div>
    </header>
  );
}
