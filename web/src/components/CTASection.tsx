"use client";

import { useState } from "react";

export default function CTASection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
  };

  return (
    <section className="pb-28 px-6 flex flex-col items-center">
      <p
        className="text-[12px] tracking-[0.25em] uppercase mb-8"
        style={{ color: "rgba(255,255,255,0.2)", fontFamily: "var(--font-sans)", fontWeight: 300 }}
      >
        join the waitlist
      </p>

      {!submitted ? (
        <form
          onSubmit={handleSubmit}
          className="flex items-center w-full max-w-md rounded-full overflow-hidden"
          style={{
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.03)",
          }}
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="flex-1 h-12 px-6 text-[14px] outline-none bg-transparent"
            style={{
              color: "rgba(255,255,255,0.6)",
              fontFamily: "var(--font-sans)",
              fontWeight: 300,
            }}
          />
          <button
            type="submit"
            className="h-10 px-6 mr-1 rounded-full text-[13px] cursor-pointer transition-all"
            style={{
              background: "var(--color-olive-dim)",
              color: "var(--color-olive)",
              border: "1px solid rgba(139, 154, 91, 0.2)",
              fontFamily: "var(--font-sans)",
              fontWeight: 400,
            }}
          >
            get in
          </button>
        </form>
      ) : (
        <p
          className="text-[14px]"
          style={{ color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-sans)", fontWeight: 300 }}
        >
          we&apos;ll be in touch.
        </p>
      )}
    </section>
  );
}
