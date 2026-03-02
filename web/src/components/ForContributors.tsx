"use client";

export default function ForContributors() {
  return (
    <section className="w-full px-6 sm:px-10 pb-32 flex flex-col items-center">
      <div className="text-left max-w-2xl w-full">
        <p className="font-mono text-[12px] tracking-wider mb-4" style={{ color: "rgba(255,255,255,0.2)" }}>
          04
        </p>
        <h2
          className="text-[22px] sm:text-[26px] font-semibold leading-snug mb-5"
          style={{ color: "rgba(255,255,255,0.9)", letterSpacing: "-0.02em" }}
        >
          Build a portfolio that earns while you sleep
        </h2>
        <p className="text-[15px] leading-[1.85] font-light mb-6" style={{ color: "rgba(255,255,255,0.4)" }}>
          Unlike one-time gigs, Quirk&apos;s royalty system means your past submissions
          keep generating income. Every approved photo, video, or audio clip enters
          your royalty portfolio. Each time an AI company licenses a dataset containing
          your work, you earn.
        </p>
        <p className="text-[15px] leading-[1.85] font-light" style={{ color: "rgba(255,255,255,0.4)" }}>
          Contributors earn an average of{" "}
          <strong className="font-semibold" style={{ color: "rgba(255,255,255,0.8)" }}>$127/month</strong>.
          Reach Gold tier and unlock a{" "}
          <strong className="font-semibold" style={{ color: "rgba(255,255,255,0.8)" }}>3x royalty multiplier</strong>{" "}
          on your entire portfolio. Withdraw via PayPal, bank transfer, or mobile money —
          whichever works in your country.
        </p>
      </div>
    </section>
  );
}
