"use client";

export default function ForContributors() {
  return (
    <section className="w-full px-6 sm:px-10 pb-36 flex flex-col items-center">
      <div className="text-left max-w-2xl w-full">
        <p
          className="text-[11px] tracking-[0.3em] uppercase mb-5"
          style={{ color: "rgba(255,255,255,0.15)", fontFamily: "var(--font-sans)", fontWeight: 300 }}
        >
          04
        </p>
        <h2
          className="text-[26px] sm:text-[34px] leading-snug mb-6"
          style={{ fontFamily: "var(--font-serif)", fontWeight: 300, color: "rgba(255,255,255,0.8)" }}
        >
          build a portfolio that earns while you sleep
        </h2>
        <p
          className="text-[15px] leading-[1.9] mb-6"
          style={{ color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-sans)", fontWeight: 300 }}
        >
          unlike one-time gigs, Quirk&apos;s royalty system means your past submissions
          keep generating income. every approved photo, video, or audio clip enters
          your royalty portfolio. each time an AI company licenses a dataset containing
          your work, you earn.
        </p>
        <p
          className="text-[15px] leading-[1.9]"
          style={{ color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-sans)", fontWeight: 300 }}
        >
          contributors earn an average of{" "}
          <strong style={{ fontWeight: 400, color: "var(--color-olive)" }}>$127/month</strong>.
          reach Gold tier and unlock a{" "}
          <strong style={{ fontWeight: 400, color: "var(--color-olive)" }}>3x royalty multiplier</strong>{" "}
          on your entire portfolio. withdraw via PayPal, bank transfer, or mobile money —
          whichever works in your country.
        </p>
      </div>
    </section>
  );
}
