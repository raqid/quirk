"use client";

const testimonials = [
  {
    name: "Amara O.",
    country: "Nigeria",
    quote: "I've been on Quirk for 6 months and my royalty income is now covering my rent. The passive income from data I captured last year still pays out every month.",
  },
  {
    name: "Rafael M.",
    country: "Brazil",
    quote: "As a photography student, I already had the skills — Quirk just pays me for them. The quality scoring pushed me to improve my composition too.",
  },
  {
    name: "Priya S.",
    country: "India",
    quote: "Voice tasks are my go-to. I record during my commute and the submissions get approved fast. The referral bonuses added another income stream.",
  },
];

export default function Testimonials() {
  return (
    <section className="w-full px-6 sm:px-10 pb-36 flex flex-col items-center">
      <div className="text-left max-w-2xl w-full flex flex-col gap-12">
        <p
          className="text-[11px] tracking-[0.3em] uppercase"
          style={{ color: "rgba(255,255,255,0.15)", fontFamily: "var(--font-sans)", fontWeight: 300 }}
        >
          06
        </p>

        {testimonials.map((t) => (
          <div key={t.name}>
            <p
              className="text-[17px] leading-[1.85] mb-4"
              style={{ color: "rgba(255,255,255,0.35)", fontFamily: "var(--font-serif)", fontWeight: 300, fontStyle: "italic" }}
            >
              &ldquo;{t.quote}&rdquo;
            </p>
            <p
              className="text-[12px] tracking-[0.1em]"
              style={{ color: "rgba(255,255,255,0.15)", fontFamily: "var(--font-sans)", fontWeight: 300 }}
            >
              — {t.name}, {t.country}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
