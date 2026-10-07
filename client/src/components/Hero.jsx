import React, { useState } from 'react';
import { ArrowRight, Play, CheckCircle, Sparkles, Zap, Globe, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Hero({ companyData }) {
  const [activeTab, setActiveTab] = useState('Projects');

  // Interactive work datasets representing completed projects, disciplines, and career milestones
  const chartDatasets = {
    'Projects': [
      { label: 'FinTech', height: '94%', val: 'FinScale Platform • 100% Deployed' },
      { label: 'Travel', height: '88%', val: 'VoyageLab Web App • 100% Deployed' },
      { label: 'Media', height: '96%', val: 'HyperCore Analytics • 100% Deployed' },
      { label: 'Cloud', height: '90%', val: 'NovaCloud SaaS • 100% Deployed' },
      { label: 'Studio TR', height: '100%', val: 'Design System & UI • 100% Deployed' },
    ],
    'Disciplines': [
      { label: 'UI/UX', height: '98%', val: 'Figma & Design Systems • 98%' },
      { label: 'React', height: '100%', val: 'Frontend Web Engineering • 100%' },
      { label: 'Django', height: '96%', val: 'Django Full-Stack & ORM • 96%' },
      { label: 'Python', height: '95%', val: 'Flask Backend & APIs • 95%' },
      { label: 'Database', height: '90%', val: 'MySQL & Supabase Architecture • 90%' },
    ],
    'Timeline': [
      { label: 'Year 1', height: '70%', val: 'Web Foundations & UI • Year 1' },
      { label: 'Year 2', height: '85%', val: 'Full-Stack Scalability • Year 2' },
      { label: 'Year 3', height: '100%', val: 'Global Client Delivery • Year 3' },
    ],
  };

  const currentData = chartDatasets[activeTab] || chartDatasets['Projects'];

  const stats = [
    { value: "5", label: "Projects Completed" },
    { value: "2", label: "Global Clients" },
    { value: "3", label: "Years Experience" },
    { value: "100%", label: "On-Time Delivery" }
  ];

  return (
    <section className="hero-section" id="home">
      <div className="container">
        <div className="hero-grid">
          
          {/* Left Column: Heading, Subtitle & CTAs */}
          <div className="hero-content">
            <h1 className="hero-title">
              We build digital <span className="text-gradient">experiences</span> that move brands forward
            </h1>

            <p className="hero-description">
              {companyData?.description || "We build high-performance digital products that scale businesses. From cutting-edge websites to intuitive apps and design systems, we craft solutions that elevate your brand."}
            </p>

            <div className="hero-ctas">
              <a href="#contact" className="btn-primary">
                <span>Start Your Project</span>
                <ArrowRight size={17} />
              </a>

              <Link to="/projects" className="btn-secondary">
                <Play size={16} fill="currentColor" />
                <span>View Case Studies</span>
              </Link>

              <Link to="/case-studies" className="btn-secondary">
                <Briefcase size={16} />
                <span>View Portfolio</span>
              </Link>
            </div>

          </div>

          {/* Right Column: Interactive Work Representation Card */}
          <div className="hero-visual">
            <div className="dashboard-card">
              <div className="card-topbar">
                <div className="card-metric-badge">
                  <span className="metric-big">5</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#00f0ff', fontSize: '0.82rem', fontWeight: 600 }}>
                    <CheckCircle size={15} color="#00f0ff" />
                    <span>Projects Delivered</span>
                  </div>
                </div>

                <div className="card-tabs">
                  {['Projects', 'Disciplines', 'Timeline'].map((tab) => (
                    <button
                      key={tab}
                      className={`card-tab ${activeTab === tab ? 'active' : ''}`}
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Glowing Interactive Bar Chart representing Work */}
              <div className="chart-container">
                {currentData.map((item, idx) => (
                  <div key={idx} className="chart-bar-wrap" title={`${item.label}: ${item.val}`}>
                    <div 
                      className="chart-bar" 
                      style={{ 
                        height: item.height,
                        background: idx === currentData.length - 1 
                          ? 'linear-gradient(180deg, #00f0ff 0%, #0070f3 100%)' 
                          : 'linear-gradient(180deg, rgba(0, 240, 255, 0.8) 0%, rgba(59, 130, 246, 0.45) 100%)'
                      }}
                    />
                    <span className="chart-bar-label">{item.label}</span>
                  </div>
                ))}
              </div>

              <div className="hero-stats-bar">
                {stats.map((s, index) => (
                  <div key={index} className="stat-item">
                    <div className="stat-number">{s.value}</div>
                    <div className="stat-label">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Work Metrics Footer */}
              <div className="dashboard-footer">
                <div className="mini-metric">
                  <span className="mini-metric-title">Client Reach</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Globe size={14} color="#00f0ff" />
                    <span className="mini-metric-value">2 Global Clients</span>
                  </div>
                </div>

                <div className="mini-metric" style={{ textAlign: 'right' }}>
                  <span className="mini-metric-title">Track Record</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end' }}>
                    <Briefcase size={14} color="#10b981" />
                    <span className="mini-metric-value">3 Years Experience</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
