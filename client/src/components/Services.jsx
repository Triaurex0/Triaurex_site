import React, { useState } from 'react';
import { Palette, Code, Smartphone, Cpu, Sparkles, CheckCircle2, ArrowUpRight, X } from 'lucide-react';

const iconMap = {
  Palette: Palette,
  Code: Code,
  Smartphone: Smartphone,
  Cpu: Cpu,
  Sparkles: Sparkles,
};

const slugifyServiceTitle = (title) =>
  title
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export default function Services({ services }) {
  const [selectedService, setSelectedService] = useState(null);

  const defaultServices = [
    {
      id: "ui-ux",
      title: "UI/UX Design",
      icon: "Palette",
      description: "User-first digital experiences engineered for maximum conversion, visual delight, and effortless human interaction.",
      deliverables: ["User Research & Personas", "Wireframing & Interactive Prototypes", "Design Systems & Token Libraries", "Micro-interactions & UX Audits"]
    },
    {
      id: "web-dev",
      title: "Web Development",
      icon: "Code",
      description: "Blazing-fast modern web applications built on scalable React, Next.js, and rock-solid Python backend architectures.",
      deliverables: ["High-Performance Single Page Apps", "Full-Stack API Integration", "Headless CMS & E-Commerce", "Core Web Vitals & SEO Optimization"]
    },
    {
      id: "mobile-dev",
      title: "Android App Development",
      icon: "Smartphone",
      description: "Native and high-performance Android mobile apps with fluid UI, offline persistence, and seamless push ecosystem integration.",
      deliverables: ["Native Android Engineering", "Jetpack Compose & Architecture", "Google Play Store Optimization", "Realtime Sync & Device Hardware APIs"]
    },
    {
      id: "branding",
      title: "Branding & Identity",
      icon: "Sparkles",
      description: "Strategic brand positioning, cohesive visual identities, typography, and guidelines that make your company unforgettable.",
      deliverables: ["Brand Strategy & Voice", "Logo Design & Visual Language", "Brand Style Guides & Assets", "Pitch Decks & Marketing Collateral"]
    },
    {
      id: "data-analysis",
      title: "Data Analysis",
      icon: "Cpu",
      description: "Turn raw business data into clear insights with reliable analysis, interactive dashboards, and practical recommendations.",
      deliverables: ["Data Cleaning & Preparation", "Exploratory Data Analysis", "Power BI Dashboards & Reporting", "Trend Analysis & Business Insights"]
    }
  ];

  const displayServices = services && services.length > 0 ? services : defaultServices;

  return (
    <section className="section" id="services">
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header">
          <h2 className="section-title">Services engineered for impact</h2>
          <p className="section-subtitle">
            End-to-end digital solutions that propel your business forward — with precision, velocity, and care.
          </p>
        </div>

        {/* 5 Cards in 3 + 2 Grid Layout */}
        <div className="services-container-custom">
          {displayServices.map((service, idx) => {
            const Icon = iconMap[service.icon] || Code;
            const isTopRow = idx < 3;

            const serviceAnchorId = slugifyServiceTitle(service.title);

            return (
              <div
                key={service.id || serviceAnchorId}
                id={serviceAnchorId}
                className={`glass-card service-card ${isTopRow ? 'service-col-top' : 'service-col-bottom'}`}
                onClick={() => setSelectedService(service)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div className="service-icon-box">
                    <Icon size={26} />
                  </div>
                  <div style={{ color: 'var(--text-muted)', transition: 'transform 0.2s', padding: '6px' }}>
                    <ArrowUpRight size={20} />
                  </div>
                </div>

                <h3 className="service-title">{service.title}</h3>
                <p className="service-desc">{service.description}</p>

                <ul className="service-deliverables">
                  {service.deliverables?.map((item, itemIdx) => (
                    <li key={itemIdx} className="deliverable-item">
                      <span className="deliverable-dot"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

      </div>

      {/* Service Detail Modal */}
      {selectedService && (
        <div className="modal-backdrop" onClick={() => setSelectedService(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setSelectedService(null)}>
              <X size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
              <div className="service-icon-box" style={{ marginBottom: 0 }}>
                {React.createElement(iconMap[selectedService.icon] || Code, { size: 28 })}
              </div>
              <div>
                <h3 style={{ fontSize: '1.8rem', color: '#fff' }}>{selectedService.title}</h3>
              </div>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '24px' }}>
              {selectedService.description}
            </p>

            <h4 style={{ fontSize: '1.1rem', marginBottom: '14px', color: '#00f0ff' }}>Key Capabilities & Deliverables:</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '32px' }}>
              {selectedService.deliverables?.map((d, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <CheckCircle2 size={16} color="#00f0ff" />
                  <span style={{ fontSize: '0.9rem', color: '#e2e8f0' }}>{d}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button className="btn-secondary" onClick={() => setSelectedService(null)}>
                Close
              </button>
              <a href="#contact" className="btn-primary" onClick={() => setSelectedService(null)}>
                Inquire About {selectedService.title}
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
