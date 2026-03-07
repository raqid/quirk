"use client";

export default function ForCompanies() {
  return (
    <section className="w-full px-6 sm:px-10 pb-36 flex flex-col items-center">
      <div className="text-left max-w-2xl w-full">
        <p
          className="text-[11px] tracking-[0.3em] uppercase mb-5"
          style={{ color: "rgba(255,255,255,0.15)", fontFamily: "var(--font-sans)", fontWeight: 300 }}
        >
          05
        </p>
        <h2
          className="text-[26px] sm:text-[34px] leading-snug mb-6"
          style={{ fontFamily: "var(--font-serif)", fontWeight: 300, color: "rgba(255,255,255,0.8)" }}
        >
          diverse, ethical, real-world training data
        </h2>
        <p
          className="text-[15px] leading-[1.9] mb-6"
          style={{ color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-sans)", fontWeight: 300 }}
        >
          stop scraping the web and hoping for the best. Quirk gives you custom datasets
          built to spec — the right demographics, environments, and data types — from
          contributors who consent and get compensated.
        </p>
        <p
          className="text-[15px] leading-[1.9] mb-12"
          style={{ color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-sans)", fontWeight: 300 }}
        >
          every submission is quality-scored, geographically tagged, and linked to a
          verified contributor. full provenance, licensing terms, and consent documentation
          for every data point. photo, video, audio across{" "}
          <strong style={{ fontWeight: 400, color: "var(--color-olive)" }}>47 countries</strong> and
          dozens of languages.
        </p>

        <a
          href="/enterprise"
          className="inline-flex items-center h-12 px-7 rounded-full text-[13px] tracking-[0.1em] uppercase cursor-pointer transition-all"
          style={{
            background: "var(--color-olive-dim)",
            color: "var(--color-olive)",
            border: "1px solid rgba(139, 154, 91, 0.2)",
            fontFamily: "var(--font-sans)",
            fontWeight: 400,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(139, 154, 91, 0.25)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "var(--color-olive-dim)";
          }}
        >
          request a dataset
        </a>
      </div>
    </section>
  );
}
