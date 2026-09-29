import React from 'react';
import { MessageSquare, Star, Quote } from 'lucide-react';

export default function Testimonials({ testimonials }) {
  const defaultTestimonials = [
    {
      id: 1,
      name: "Alexander Wright",
      role: "Chief Technology Officer",
      company: "FinScale Systems",
      avatarPos: '50% 50%',
      quote: "The TRAVIX team exceeded our expectations on every front. Their blend of sophisticated UI design and robust Flask backend architecture delivered a 180% surge in user engagement within three months of release.",
      rating: 5
    },
    {
      id: 2,
      name: "Samantha Chen",
      role: "Founder & CEO",
      company: "VoyageLab Global",
      avatarPos: '0% 50%',
      quote: "Their attention to design fidelity and performance is unmatched. They took our complex travel booking concept and converted it into a frictionless, elegant web app that loads in under 1.2 seconds.",
      rating: 5
    },
    {
      id: 3,
      name: "Michael Torres",
      role: "VP of Digital Product",
      company: "HyperCore Media",
      avatarPos: '100% 50%',
      quote: "From discovery to final deployment, TRAVIX operated with incredible precision and speed. The communication was transparent and the resulting product has set a new benchmark in our industry.",
      rating: 5
    }
  ];

  const items = testimonials && testimonials.length > 0 ? testimonials.map((t, i) => ({
    ...t,
    avatarPos: i === 0 ? '50% 50%' : i === 1 ? '0% 50%' : '100% 50%'
  })) : defaultTestimonials;

  return (
    <section className="section" id="testimonials">
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header">
          <div className="section-pill">
            <MessageSquare size={14} />
            <span>Testimonials</span>
          </div>
          <h2 className="section-title">Voice of our Partners</h2>
          <p className="section-subtitle">
            Read what visionary founders, CTOs, and product leaders say about working with our studio.
          </p>
        </div>

        {/* 3 Testimonials Grid */}
        <div className="testimonials-grid">
          {items.map((item) => (
            <div key={item.id} className="glass-card testimonial-card">
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                  <Quote size={28} className="quote-icon" />
                  <div style={{ display: 'flex', gap: '3px' }}>
                    {[...Array(5)].map((_, starIdx) => (
                      <Star key={starIdx} size={15} fill="#00f0ff" color="#00f0ff" />
                    ))}
                  </div>
                </div>

                <p className="testimonial-quote">
                  "{item.quote}"
                </p>
              </div>

              {/* Author Info */}
              <div className="testimonial-author">
                <div 
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '50%',
                    border: '2px solid rgba(0, 240, 255, 0.4)',
                    boxShadow: '0 0 12px rgba(0, 240, 255, 0.25)',
                    backgroundImage: 'url(/images/avatars.jpg)',
                    backgroundSize: '300% 100%',
                    backgroundPosition: item.avatarPos,
                    flexShrink: 0
                  }}
                />
                <div className="author-info">
                  <span className="author-name">{item.name}</span>
                  <span className="author-role">{item.role}, {item.company}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
