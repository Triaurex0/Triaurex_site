import React from 'react';
import { ChevronDown } from 'lucide-react';

export default function Hero1() {
  return (
    <section className="hero1-section" id="brand-hero" aria-label="Triaurex creative thinking and digital building">
      {/* Ambient background blur for seamless edge-to-edge full viewport coverage without distortion */}
      <div className="hero1-backdrop" aria-hidden="true">
        <img
          className="hero1-bg-blur"
          src="/hero1.jpg"
          alt=""
          fetchPriority="high"
          loading="eager"
          decoding="async"
        />
        <div className="hero1-overlay" />
      </div>

      {/* Hero artwork container keeping logo and text sharp, centered, balanced, and never cropped */}
      <div className="hero1-visual-container">
        <img
          className="hero1-image"
          src="/hero1.jpg"
          alt="TRIAUREX — Where Creative Thinking Meets Digital Building."
          fetchPriority="high"
          loading="eager"
          decoding="async"
        />
      </div>

      {/* Smooth scroll prompt to next section */}
      <a href="#home" className="hero1-scroll-btn" aria-label="Scroll to overview">
        <span className="hero1-scroll-text">Explore</span>
        <ChevronDown size={18} className="hero1-scroll-icon" />
      </a>
    </section>
  );
}
