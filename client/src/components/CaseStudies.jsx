import React, { useState } from 'react';
import { ArrowRight, Layers, CheckCircle2, X, ExternalLink, Activity } from 'lucide-react';

export default function CaseStudies({ caseStudies }) {
  const [activeModalProject, setActiveModalProject] = useState(null);

  const defaultCases = [
    {
      id: "pranara",
      title: "PRANARA",
      tag: "Fintech SaaS",
      client: "Pranara Global Financial Inc.",
      year: "2025",
      image: "/images/pranara.jpg",
      description: "A high-velocity financial analytics platform providing real-time multi-currency portfolio tracking, automated risk mitigation, and instant settlement flows.",
      stats: [
        { label: "User Growth", value: "+180%" },
        { label: "App Store Rating", value: "4.9" },
        { label: "Delivery Timeline", value: "12wk" }
      ],
      techStack: ["React", "Flask", "TypeScript", "PostgreSQL", "TailwindCSS", "Chart.js"],
      challenge: "Pranara needed to transition from legacy spreadsheets to a zero-latency web dashboard capable of processing 25,000 live market transactions per second without frame drops.",
      solution: "We designed an obsidian glassmorphic UI paired with optimized WebSockets and cached Python endpoints, decreasing user onboarding drop-off by 62%."
    },
    {
      id: "visitmax",
      title: "VisitMax",
      tag: "Travel & Hospitality",
      client: "VisitMax International",
      year: "2024",
      image: "/images/visitmax.jpg",
      description: "An intuitive booking and travel recommendation engine delivering bespoke itineraries, immersive destination previews, and lightning-fast checkout.",
      stats: [
        { label: "Conversion Rate", value: "2.5x" },
        { label: "Bounce Rate", value: "-40%" },
        { label: "Avg Load Time", value: "1.2s" }
      ],
      techStack: ["React", "Python", "Vite", "Redis", "Figma", "Stripe API"],
      challenge: "VisitMax faced severe mobile cart abandonment due to cluttered layouts and slow search queries across 1.4 million hotel inventories worldwide.",
      solution: "We restructured the discovery funnel with tactile micro-interactions, responsive modular filters, and a unified 2-step booking flow."
    }
  ];

  const projects = caseStudies && caseStudies.length > 0 ? caseStudies.map((c, i) => ({
    ...c,
    image: i === 0 ? "/images/pranara.jpg" : "/images/visitmax.jpg"
  })) : defaultCases;

  return (
    <section className="section" id="case-studies">
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header">
          <h2 className="section-title">Case studies that speak for themselves</h2>
          <p className="section-subtitle">
            A curated showcase of high-impact products where design precision meets technical excellence.
          </p>
        </div>

        {/* Case Studies List */}
        <div className="case-studies-list">
          {projects.map((item, index) => {
            const isReversed = index % 2 === 1;

            return (
              <div key={item.id} className="glass-card case-study-card">
                
                {/* Left/Right Media depending on reverse */}
                {!isReversed && (
                  <div className="case-study-image-wrap">
                    <img src={item.image} alt={item.title} loading="lazy" />
                    <div className="case-study-overlay" />
                  </div>
                )}

                {/* Content Block */}
                <div className="case-study-content">
                  <div>
                    <span className="case-tag">{item.tag}</span>
                    <h3 className="case-title" style={{ marginTop: '6px' }}>{item.title}</h3>
                  </div>

                  <p className="case-desc">{item.description}</p>

                  {/* 3 Metrics Grid */}
                  <div className="case-metrics-grid">
                    {item.stats?.map((st, sIdx) => (
                      <div key={sIdx}>
                        <div className="case-metric-value">{st.value}</div>
                        <div className="case-metric-label">{st.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Tech stack pills */}
                  <div className="case-tags-flex">
                    {item.techStack?.map((tech, tIdx) => (
                      <span key={tIdx} className="case-pill">{tech}</span>
                    ))}
                  </div>

                  <div>
                    <button
                      className="btn-primary"
                      onClick={() => setActiveModalProject(item)}
                    >
                      <span>View Project</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>

                {/* Right Media if reversed */}
                {isReversed && (
                  <div className="case-study-image-wrap">
                    <img src={item.image} alt={item.title} loading="lazy" />
                    <div className="case-study-overlay" />
                  </div>
                )}

              </div>
            );
          })}
        </div>

      </div>

      {/* Case Study Full Modal */}
      {activeModalProject && (
        <div className="modal-backdrop" onClick={() => setActiveModalProject(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setActiveModalProject(null)}>
              <X size={18} />
            </button>

            <span className="section-pill" style={{ marginBottom: '12px' }}>{activeModalProject.tag}</span>
            <h3 style={{ fontSize: '2.2rem', marginBottom: '8px' }}>{activeModalProject.title}</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '20px', fontSize: '0.9rem' }}>
              Client: {activeModalProject.client} • Released {activeModalProject.year}
            </p>

            <div style={{ borderRadius: '14px', overflow: 'hidden', marginBottom: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <img src={activeModalProject.image} alt={activeModalProject.title} style={{ width: '100%', height: '260px', objectFit: 'cover' }} />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ color: '#00f0ff', marginBottom: '8px', fontSize: '1.1rem' }}>The Challenge</h4>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '0.95rem' }}>
                {activeModalProject.challenge}
              </p>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ color: '#00f0ff', marginBottom: '8px', fontSize: '1.1rem' }}>The Solution</h4>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '0.95rem' }}>
                {activeModalProject.solution}
              </p>
            </div>

            <div className="case-metrics-grid" style={{ marginBottom: '28px' }}>
              {activeModalProject.stats?.map((st, i) => (
                <div key={i}>
                  <div className="case-metric-value">{st.value}</div>
                  <div className="case-metric-label">{st.label}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button className="btn-secondary" onClick={() => setActiveModalProject(null)}>
                Close
              </button>
              <a href="#contact" className="btn-primary" onClick={() => setActiveModalProject(null)}>
                Build Similar Solution
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
