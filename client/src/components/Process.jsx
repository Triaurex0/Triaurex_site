import React, { useState } from 'react';
import { GitBranch, CheckCircle2, ArrowRight } from 'lucide-react';

export default function Process({ processSteps }) {
  const [activeStepIndex, setActiveStepIndex] = useState(3); // Default to Development (Step 04)

  const defaultProcess = [
    {
      step: "01",
      title: "Discovery",
      subtitle: "Uncover the Vision",
      description: "Deep-dive workshops to analyze your target demographic, competitive moat, business KPIs, and technical constraints.",
      milestone: "Product Blueprint & Scope Agreement"
    },
    {
      step: "02",
      title: "Research",
      subtitle: "Data & Feasibility",
      description: "Architectural blueprints, user journey mapping, and technical feasibility audits to de-risk the entire product roadmap.",
      milestone: "System Architecture & UX Strategy"
    },
    {
      step: "03",
      title: "Design",
      subtitle: "Visual Craftsmanship",
      description: "High-fidelity wireframes, interactive Figma prototypes, and comprehensive design systems with responsive motion tokens.",
      milestone: "Interactive Prototype & Component Library"
    },
    {
      step: "04",
      title: "Development",
      subtitle: "Modern Engineering",
      description: "Clean, scalable frontend implementation in React coupled with high-throughput Flask APIs and secure database models.",
      milestone: "Functional Staging Environment"
    },
    {
      step: "05",
      title: "Testing",
      subtitle: "Rigorous QA",
      description: "Automated end-to-end testing, responsive cross-browser validation, accessibility audits, and security vulnerability scans.",
      milestone: "Zero-Defect Production Sign-off"
    },
    {
      step: "06",
      title: "Launch",
      subtitle: "Seamless Deployment",
      description: "Zero-downtime production deployment, CDN caching, structured SEO indexing, and enterprise analytics configuration.",
      milestone: "Public Release & Realtime Monitoring"
    },
    {
      step: "07",
      title: "Growth",
      subtitle: "Continuous Evolution",
      description: "Ongoing conversion optimization, user heatmaps, feature expansion sprints, and 24/7 reliability monitoring.",
      milestone: "Quarterly Optimization & Scaling"
    }
  ];

  const steps = processSteps && processSteps.length > 0 ? processSteps : defaultProcess;
  const currentStep = steps[activeStepIndex] || steps[0];

  return (
    <section className="section" id="process">
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header">
          <h2 className="section-title">A proven, transparent process</h2>
          <p className="section-subtitle">
            Step-by-step methodology that guides your idea from concept to launch and beyond.
          </p>
        </div>

        {/* 7-Step Horizontal Stepper with Glowing Nodes */}
        <div className="process-timeline">
          {steps.map((st, idx) => {
            const isActive = idx === activeStepIndex;
            return (
              <div 
                key={idx} 
                className={`process-step ${isActive ? 'active' : ''}`}
                onClick={() => setActiveStepIndex(idx)}
              >
                <div className="step-node">
                  {st.step}
                </div>
                <div className="step-title">{st.title}</div>
                <div className="step-sub">{st.subtitle}</div>
              </div>
            );
          })}
        </div>

        {/* Active Step Feature Detail Card */}
        <div className="glass-card process-detail-card">
          <div style={{ maxWidth: '650px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span className="section-pill" style={{ margin: 0, padding: '3px 12px', fontSize: '0.75rem' }}>
                Phase {currentStep.step}
              </span>
              <h3 style={{ fontSize: '1.6rem', color: '#fff' }}>{currentStep.title}: {currentStep.subtitle}</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.7', marginTop: '12px' }}>
              {currentStep.description}
            </p>
          </div>

          <div style={{ minWidth: '220px', borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '24px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
              Key Deliverable
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#00f0ff', fontWeight: 600, fontSize: '0.95rem' }}>
              <CheckCircle2 size={18} />
              <span>{currentStep.milestone || "Phase Milestone Sign-off"}</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
