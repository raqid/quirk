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
    <section className="w-full px-6 sm:px-10 pb-32 flex flex-col items-center">
      <div className="text-left max-w-2xl w-full flex flex-col gap-10">
        <p className="font-mono text-[12px] tracking-wider" style={{ color: "rgba(255,255,255,0.2)" }}>
          06
        </p>

        {testimonials.map((t) => (
          <div key={t.name}>
            <p className="text-[15px] leading-[1.85] font-light mb-3" style={{ color: "rgba(255,255,255,0.4)" }}>
              &ldquo;{t.quote}&rdquo;
            </p>
            <p className="text-[12px] font-light" style={{ color: "rgba(255,255,255,0.2)" }}>
              — {t.name}, {t.country}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
