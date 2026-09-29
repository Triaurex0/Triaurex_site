import React, { useState } from 'react';
import { Layers, Server, Terminal, Cpu, Box, PenTool, Cloud, Sparkles, Code2 } from 'lucide-react';

const iconTechMap = {
  Layers: Layers,
  Server: Server,
  Terminal: Terminal,
  Cpu: Cpu,
  Box: Box,
  PenTool: PenTool,
  Cloud: Cloud,
  Sparkles: Sparkles,
};

export default function Technologies({ techList }) {
  const [activeCategory, setActiveCategory] = useState('All');

  const defaultTech = [
    { name: "React", category: "Frontend", icon: "Layers", description: "Component-driven reactive UI architecture with modern hooks" },
    { name: "Flask", category: "Backend", icon: "Server", description: "Lightweight WSGI Python web framework powering REST APIs" },
    { name: "Python", category: "Backend", icon: "Terminal", description: "High-performance data engineering and backend logic" },
    { name: "Node.js", category: "Runtime", icon: "Cpu", description: "Asynchronous runtime for fast tooling and build chains" },
    { name: "Docker", category: "DevOps", icon: "Box", description: "Containerized environments for zero-drift deployments" },
    { name: "Figma", category: "Design", icon: "PenTool", description: "Collaborative design systems and motion prototyping" },
    { name: "AWS Cloud", category: "DevOps", icon: "Cloud", description: "Elastic serverless compute, CDN edge, and S3 assets" },
    { name: "AI / LLMs", category: "AI & ML", icon: "Sparkles", description: "Context-aware LLM agents, vector embeddings, and RAG" }
  ];

  const items = techList && techList.length > 0 ? techList : defaultTech;

  const categories = ['All', 'Frontend', 'Backend', 'DevOps', 'Design', 'AI & ML'];

  const filteredItems = activeCategory === 'All' 
    ? items 
    : items.filter(t => t.category.toLowerCase().includes(activeCategory.toLowerCase()));

  return (
    <section className="section" id="technologies">
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header">
          <div className="section-pill">
            <Code2 size={14} />
            <span>Tech Stack</span>
          </div>
          <h2 className="section-title">Technologies we master</h2>
          <p className="section-subtitle">
            A modern, battle-tested toolkit engineered to deliver unrivaled velocity, security, and scale.
          </p>

          {/* Category Filter Pills */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '24px' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '7px 16px',
                  borderRadius: '999px',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  transition: 'all 0.2s',
                  background: activeCategory === cat ? 'linear-gradient(135deg, #00f0ff 0%, #0070f3 100%)' : 'rgba(255,255,255,0.05)',
                  color: activeCategory === cat ? '#060913' : 'var(--text-secondary)',
                  border: activeCategory === cat ? 'none' : '1px solid rgba(255,255,255,0.1)'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Tech Grid */}
        <div className="tech-grid">
          {filteredItems.map((tech, idx) => {
            const Icon = iconTechMap[tech.icon] || Layers;
            return (
              <div key={idx} className="glass-card tech-card">
                <div className="tech-icon-wrap">
                  <Icon size={24} />
                </div>
                <div>
                  <div className="tech-name">{tech.name}</div>
                  <div className="tech-category">{tech.category}</div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
