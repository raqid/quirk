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
    <section className="pb-24 px-6 flex flex-col items-center">
      {!submitted ? (
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-3 w-full max-w-sm"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="flex-1 h-11 px-4 rounded-lg text-sm font-light outline-none transition-colors"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.8)",
            }}
          />
          <button
            type="submit"
            className="h-11 px-5 rounded-lg text-sm font-medium cursor-pointer transition-colors"
            style={{ background: "#fff", color: "#000" }}
          >
            Get Early Access
          </button>
        </form>
      ) : (
        <p className="text-sm font-light" style={{ color: "rgba(255,255,255,0.4)" }}>
          We&apos;ll be in touch.
        </p>
      )}
    </section>
  );
}
