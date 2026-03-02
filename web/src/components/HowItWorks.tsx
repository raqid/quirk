"use client";

const steps = [
  {
    num: "01",
    title: "Browse tasks",
    desc: "AI companies post specific data collection tasks — portraits, street scenes, voice recordings. You pick what fits your skills and location.",
  },
  {
    num: "02",
    title: "Capture data",
    desc: "Use the Quirk app to capture media that meets the task requirements. Quality scoring happens automatically. Higher quality means higher pay.",
  },
  {
    num: "03",
    title: "Earn money",
    desc: "Get paid instantly for approved submissions, plus royalties every time an AI company licenses your data. Your past work keeps generating income.",
  },
];

export default function HowItWorks() {
  return (
    <section className="w-full px-6 sm:px-10 pb-32 flex flex-col items-center">
      <div className="text-left max-w-2xl w-full flex flex-col gap-[3.75rem]">
        {steps.map((step) => (
          <div key={step.num}>
            <p className="font-mono text-[12px] tracking-wider mb-4" style={{ color: "rgba(255,255,255,0.2)" }}>
              {step.num}
            </p>
            <h2
              className="text-[22px] sm:text-[26px] font-semibold leading-snug mb-5"
              style={{ color: "rgba(255,255,255,0.9)", letterSpacing: "-0.02em" }}
            >
              {step.title}
            </h2>
            <p className="text-[15px] leading-[1.85] font-light" style={{ color: "rgba(255,255,255,0.4)" }}>
              {step.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
