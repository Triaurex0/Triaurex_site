import React from 'react';

export default function Hero1() {
  return (
    <section className="hero1-section" aria-label="Triaurex creative thinking and digital building">
      <img
        className="hero1-image"
        src="/hero1.jpg"
        alt="Triaurex — Where Creative Thinking Meets Digital Building."
        fetchPriority="high"
        loading="eager"
        decoding="async"
      />
    </section>
  );
}
