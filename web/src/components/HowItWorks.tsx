"use client";

const steps = [
  {
    num: "01",
    title: "browse tasks",
    desc: "AI companies post specific data collection tasks — portraits, street scenes, voice recordings. you pick what fits your skills and location.",
  },
  {
    num: "02",
    title: "capture data",
    desc: "use the Quirk app to capture media that meets the task requirements. quality scoring happens automatically. higher quality means higher pay.",
  },
  {
    num: "03",
    title: "earn money",
    desc: "get paid instantly for approved submissions, plus royalties every time an AI company licenses your data. your past work keeps generating income.",
  },
];

export default function HowItWorks() {
  return (
    <section className="w-full px-6 sm:px-10 pb-36 flex flex-col items-center">
      <div className="text-left max-w-2xl w-full flex flex-col gap-20">
        {steps.map((step) => (
          <div key={step.num}>
            <p
              className="text-[11px] tracking-[0.3em] uppercase mb-5"
              style={{ color: "rgba(255,255,255,0.15)", fontFamily: "var(--font-sans)", fontWeight: 300 }}
            >
              {step.num}
            </p>
            <h2
              className="text-[26px] sm:text-[34px] leading-snug mb-5"
              style={{ fontFamily: "var(--font-serif)", fontWeight: 300, color: "rgba(255,255,255,0.8)" }}
            >
              {step.title}
            </h2>
            <p
              className="text-[15px] leading-[1.9]"
              style={{ color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-sans)", fontWeight: 300 }}
            >
              {step.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
