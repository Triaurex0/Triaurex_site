import React from 'react';
import { Target, Compass, HeartHandshake, Award } from 'lucide-react';

export default function About({ companyData }) {
  const pillars = [
    {
      title: "Our Mission",
      icon: Target,
      text: "Empower forward-thinking companies with world-class digital platforms that outperform competition and delight users globally."
    },
    {
      title: "Our Vision",
      icon: Compass,
      text: "To redefine digital product craftsmanship by seamlessly unifying artistic elegance with resilient, modern engineering."
    },
    {
      title: "Our Values",
      icon: HeartHandshake,
      text: "Relentless curiosity, uncompromising code quality, transparent collaboration, and measurable real-world business impact."
    }
  ];

  const stats = [
    { value: "5", label: "Completed Projects" },
    { value: "2", label: "Global Clients" },
    { value: "3", label: "Years in Business" },
    { value: "100%", label: "Client Satisfaction" }
  ];

  return (
    <section className="section" id="about">
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header">
          <h2 className="section-title">A studio built for ambitious brands</h2>
          <p className="section-subtitle">
            We combine strategic thinking, user-centered design, and robust engineering to deliver digital solutions that transform businesses and accelerate sustainable growth.
          </p>
        </div>

        {/* 3 Value Pillars */}
        <div className="pillars-grid">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div key={idx} className="glass-card pillar-card">
                <div className="pillar-icon-wrap">
                  <Icon size={24} />
                </div>
                <h3 className="pillar-title">{pillar.title}</h3>
                <p className="pillar-text">{pillar.text}</p>
              </div>
            );
          })}
        </div>

        {/* 4 Stat Cards */}
        <div className="about-stats-grid">
          {stats.map((stat, idx) => (
            <div key={idx} className="glass-card about-stat-card">
              <div className="about-stat-value">{stat.value}</div>
              <div className="about-stat-label">{stat.label}</div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
