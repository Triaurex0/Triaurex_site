import React from 'react';
import { Link } from 'react-router-dom';
import {
  Code,
  Smartphone,
  Server,
  Palette,
  Sparkles,
  Bot,
  BarChart3,
  ShieldCheck,
  Layout,
  ArrowUpRight
} from 'lucide-react';
import { servicesData } from '../data/servicesData';

export const serviceIconMap = {
  Code,
  Smartphone,
  Server,
  Palette,
  Sparkles,
  Bot,
  BarChart3,
  ShieldCheck,
  Layout
};

export default function Services() {
  return (
    <section className="section" id="services">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Services engineered for impact</h2>
          <p className="section-subtitle">
            End-to-end digital solutions that propel your business forward — with precision, velocity, and care.
          </p>
        </div>

        <div className="services-grid-8" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px'
        }}>
          {servicesData.map((service) => {
            const Icon = serviceIconMap[service.icon] || Layout;
            return (
              <Link
                key={service.slug}
                to={`/services/${service.slug}`}
                id={service.slug}
                className="glass-card service-card"
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '32px 26px',
                  borderRadius: '16px',
                  transition: 'transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div className="service-icon-box">
                    <Icon size={26} />
                  </div>
                  <div style={{ color: 'var(--text-muted)', padding: '6px' }}>
                    <ArrowUpRight size={20} />
                  </div>
                </div>

                <h3 className="service-title" style={{ fontSize: '1.25rem', margin: '14px 0 10px' }}>
                  {service.title}
                </h3>
                <p className="service-desc" style={{ fontSize: '0.92rem', lineHeight: '1.6', marginBottom: '18px', flexGrow: 1 }}>
                  {service.summary}
                </p>

                <ul className="service-deliverables" style={{ marginTop: 'auto' }}>
                  {service.deliverables.slice(0, 3).map((item) => (
                    <li key={item} className="deliverable-item">
                      <span className="deliverable-dot"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
