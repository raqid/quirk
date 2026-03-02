"use client";

export default function ForCompanies() {
  return (
    <section className="w-full px-6 sm:px-10 pb-32 flex flex-col items-center">
      <div className="text-left max-w-2xl w-full">
        <p className="font-mono text-[12px] tracking-wider mb-4" style={{ color: "rgba(255,255,255,0.2)" }}>
          05
        </p>
        <h2
          className="text-[22px] sm:text-[26px] font-semibold leading-snug mb-5"
          style={{ color: "rgba(255,255,255,0.9)", letterSpacing: "-0.02em" }}
        >
          Diverse, ethical, real-world training data
        </h2>
        <p className="text-[15px] leading-[1.85] font-light mb-6" style={{ color: "rgba(255,255,255,0.4)" }}>
          Stop scraping the web and hoping for the best. Quirk gives you custom datasets
          built to spec — the right demographics, environments, and data types — from
          contributors who consent and get compensated.
        </p>
        <p className="text-[15px] leading-[1.85] font-light mb-10" style={{ color: "rgba(255,255,255,0.4)" }}>
          Every submission is quality-scored, geographically tagged, and linked to a
          verified contributor. Full provenance, licensing terms, and consent documentation
          for every data point. Photo, video, audio across{" "}
          <strong className="font-semibold" style={{ color: "rgba(255,255,255,0.8)" }}>47 countries</strong> and
          dozens of languages.
        </p>

        <a
          href="/enterprise"
          className="inline-block h-11 px-5 rounded-lg text-sm font-medium transition-colors cursor-pointer"
          style={{ background: "#fff", color: "#000" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.9)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
        >
          Request a Dataset
        </a>
      </div>
    </section>
  );
}
