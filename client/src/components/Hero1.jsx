import React from 'react';
import { ChevronDown } from 'lucide-react';

export default function Hero1() {
  return (
    <section className="hero1-section" id="brand-hero" aria-label="TRIAUREX Brand Hero">
      {/* Seamless Ambient Background Layer for Edge-to-Edge Displays */}
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

      {/* Main Hero Artwork with Navbar Cropped & Brand Name Perfectly Centered */}
      <div className="hero1-visual-container">
        <img
          className="hero1-image"
          src="/hero1.jpg"
          alt="TRIAUREX — Creative Thinking. Digital Building."
          fetchPriority="high"
          loading="eager"
          decoding="async"
        />
      </div>

      {/* Explore with Down Arrow at the Bottom of the Section */}
      <a href="#home" className="hero1-scroll-btn" aria-label="Explore TRIAUREX">
        <span className="hero1-scroll-text">Explore</span>
        <ChevronDown size={20} className="hero1-scroll-icon" />
      </a>
    </section>
  );
}
