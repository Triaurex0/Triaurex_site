import React, { useState } from 'react';
import { ArrowRight, Play, TrendingUp, Sparkles, Zap, ShieldCheck } from 'lucide-react';

export default function Hero({ companyData }) {
  const [activeTab, setActiveTab] = useState('30D');

  // Chart data sets based on selected filter
  const chartDatasets = {
    '7D': [
      { day: 'Mon', height: '45%', val: '$18.4k' },
      { day: 'Tue', height: '62%', val: '$24.1k' },
      { day: 'Wed', height: '55%', val: '$21.8k' },
      { day: 'Thu', height: '78%', val: '$32.5k' },
      { day: 'Fri', height: '90%', val: '$41.2k' },
      { day: 'Sat', height: '70%', val: '$28.6k' },
      { day: 'Sun', height: '95%', val: '$46.9k' },
    ],
    '30D': [
      { day: 'W1', height: '52%', val: '$112k' },
      { day: 'W2', height: '68%', val: '$148k' },
      { day: 'W3', height: '82%', val: '$185k' },
      { day: 'W4', height: '98%', val: '$248k' },
      { day: 'W5', height: '74%', val: '$162k' },
      { day: 'W6', height: '88%', val: '$196k' },
      { day: 'W7', height: '92%', val: '$220k' },
    ],
    '1Y': [
      { day: 'Q1', height: '40%', val: '$480k' },
      { day: 'Q2', height: '60%', val: '$720k' },
      { day: 'Q3', height: '85%', val: '$960k' },
      { day: 'Q4', height: '100%', val: '$1.4M' },
      { day: 'Q5', height: '75%', val: '$890k' },
      { day: 'Q6', height: '90%', val: '$1.1M' },
      { day: 'Q7', height: '95%', val: '$1.3M' },
    ],
  };

  const currentData = chartDatasets[activeTab] || chartDatasets['30D'];

  const stats = companyData?.stats?.slice(0, 4) || [
    { value: "120+", label: "Projects Completed" },
    { value: "45", label: "Global Clients" },
    { value: "8", label: "Years Experience" },
    { value: "99%", label: "Client Retention" }
  ];

  return (
    <section className="hero-section" id="home">
      <div className="container">
        <div className="hero-grid">
          
          {/* Left Column: Heading, Subtitle & CTAs */}
          <div className="hero-content">
            <div>
              <div className="section-pill">
                <Sparkles size={14} />
                <span>Next-Gen Digital Studio</span>
              </div>
            </div>

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

              <a href="#case-studies" className="btn-secondary">
                <Play size={16} fill="currentColor" />
                <span>View Case Studies</span>
              </a>
            </div>

            {/* Metric counters directly under hero */}
            <div className="hero-stats-bar">
              {stats.map((s, index) => (
                <div key={index} className="stat-item">
                  <div className="stat-number">{s.value}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Interactive Dark Mode Glass Dashboard Card */}
          <div className="hero-visual">
            <div className="dashboard-card">
              <div className="card-topbar">
                <div className="card-metric-badge">
                  <span className="metric-big">+248%</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10b981', fontSize: '0.82rem', fontWeight: 600 }}>
                    <TrendingUp size={15} />
                    <span>Growth</span>
                  </div>
                </div>

                <div className="card-tabs">
                  {['7D', '30D', '1Y'].map((tab) => (
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

              {/* Glowing Interactive Bar Chart */}
              <div className="chart-container">
                {currentData.map((item, idx) => (
                  <div key={idx} className="chart-bar-wrap" title={`${item.day}: ${item.val}`}>
                    <div 
                      className="chart-bar" 
                      style={{ 
                        height: item.height,
                        background: idx === currentData.length - 1 
                          ? 'linear-gradient(180deg, #00f0ff 0%, #0070f3 100%)' 
                          : 'linear-gradient(180deg, rgba(0, 240, 255, 0.7) 0%, rgba(59, 130, 246, 0.4) 100%)'
                      }}
                    />
                    <span className="chart-bar-label">{item.day}</span>
                  </div>
                ))}
              </div>

              {/* Mini Metrics Footer */}
              <div className="dashboard-footer">
                <div className="mini-metric">
                  <span className="mini-metric-title">Performance Index</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Zap size={14} color="#00f0ff" />
                    <span className="mini-metric-value">99.8% Speed</span>
                  </div>
                </div>

                <div className="mini-metric" style={{ textAlign: 'right' }}>
                  <span className="mini-metric-title">Security & Uptime</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end' }}>
                    <ShieldCheck size={14} color="#10b981" />
                    <span className="mini-metric-value">Enterprise Tier</span>
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
