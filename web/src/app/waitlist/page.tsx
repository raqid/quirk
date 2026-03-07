'use client';

import { useState } from 'react';

export default function WaitlistPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: '#0A0A0A' }}
    >
      <div className="flex flex-col items-center text-center max-w-2xl">
        {/* Logo */}
        <img
          src="/logo.png"
          alt="Quirk"
          className="h-28 w-28 rounded-full mb-10"
          style={{ opacity: 0.85 }}
        />

        {/* Coming soon label */}
        <p
          className="text-[12px] tracking-[0.35em] uppercase mb-10"
          style={{ color: 'rgba(255,255,255,0.25)', fontFamily: 'var(--font-sans)', fontWeight: 300 }}
        >
          for enterprises
        </p>

        {/* Headline */}
        <h1
          className="text-[42px] sm:text-[72px] leading-[1.1] mb-8"
          style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, color: 'rgba(255,255,255,0.85)' }}
        >
          training data,
          <br />
          <span style={{ color: 'var(--color-olive)' }}>built to spec.</span>
        </h1>

        {/* Subtitle */}
        <p
          className="text-[15px] sm:text-[16px] leading-[1.8] mb-10"
          style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-sans)', fontWeight: 300 }}
        >
          custom datasets from consenting, compensated contributors.
          <br />
          diverse, ethical, real-world data across 47 countries.
        </p>

        {/* Get in touch label */}
        <p
          className="text-[12px] tracking-[0.35em] uppercase mb-8"
          style={{ color: 'rgba(255,255,255,0.2)', fontFamily: 'var(--font-sans)', fontWeight: 300 }}
        >
          get in touch
        </p>

        {/* Email form */}
        {!submitted ? (
          <form
            onSubmit={handleSubmit}
            className="flex items-center w-full max-w-md rounded-xl overflow-hidden"
            style={{
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.03)',
            }}
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="flex-1 h-14 px-6 text-[15px] outline-none bg-transparent"
              style={{
                color: 'rgba(255,255,255,0.6)',
                fontFamily: 'var(--font-sans)',
                fontWeight: 300,
              }}
            />
            <button
              type="submit"
              className="h-11 px-6 mr-1.5 rounded-lg text-[14px] cursor-pointer transition-all"
              style={{
                background: 'rgba(139, 154, 91, 0.35)',
                color: 'var(--color-olive)',
                border: 'none',
                fontFamily: 'var(--font-sans)',
                fontWeight: 400,
              }}
            >
              reach out
            </button>
          </form>
        ) : (
          <p
            className="text-[15px]"
            style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-sans)', fontWeight: 300 }}
          >
            we&apos;ll be in touch.
          </p>
        )}
      </div>

      {/* Footer */}
      <p
        className="absolute bottom-8 text-[12px] tracking-[0.1em]"
        style={{ color: 'rgba(255,255,255,0.15)', fontFamily: 'var(--font-sans)', fontWeight: 300 }}
      >
        quirklabs.ai
      </p>
    </div>
  );
}
