import React, { useState } from 'react';
import { Layers, Server, Terminal, Cpu, PenTool, Database, Palette } from 'lucide-react';

const iconTechMap = {
  Layers: Layers,
  Server: Server,
  Terminal: Terminal,
  Cpu: Cpu,
  PenTool: PenTool,
  Database: Database,
  Palette: Palette,
};

export default function Technologies({ techList }) {
  const [activeCategory, setActiveCategory] = useState('All');

  const defaultTech = [
    { name: "React", category: "Frontend", icon: "Layers", description: "Component-driven reactive UI architecture with modern hooks" },
    { name: "Django", category: "Frontend", icon: "Layers", description: "Dynamic web templates, forms, and responsive frontend views" },
    { name: "Flask", category: "Backend", icon: "Server", description: "Lightweight WSGI Python web framework powering REST APIs" },
    { name: "Python", category: "Backend", icon: "Terminal", description: "High-performance data engineering and backend logic" },
    { name: "Node.js", category: "Backend", icon: "Cpu", description: "Asynchronous runtime for fast tooling, services, and APIs" },
    { name: "MySQL", category: "Database", icon: "Database", description: "ACID-compliant relational database management system for structured data" },
    { name: "Supabase", category: "Database", icon: "Database", description: "Open-source Firebase alternative with instant Postgres, realtime subscriptions, and auth" },
    { name: "Figma", category: "Design", icon: "PenTool", description: "Collaborative design systems and UI/UX prototyping" },
    { name: "Mural", category: "Design", icon: "Layers", description: "Collaborative visual workspace for workshops, mapping, and ideation" },
    { name: "Balsamiq", category: "Design", icon: "PenTool", description: "Low-fidelity wireframing for rapid interface planning" },
    { name: "Whimsical", category: "Design", icon: "Layers", description: "Visual collaboration for flowcharts, wireframes, and product planning" },
    { name: "CorelDRAW", category: "Design", icon: "Palette", description: "Vector illustration, page layout, and graphic design" },
    { name: "Penpot", category: "Design", icon: "PenTool", description: "Open-source interface design and interactive prototyping" },
    { name: "Stitch", category: "Design", icon: "Layers", description: "AI-assisted interface design and UI prototyping" },
    { name: "Adobe XD", category: "Design", icon: "PenTool", description: "UI/UX design and interactive prototyping" },
    { name: "Framer", category: "Design", icon: "Layers", description: "Interactive website design and visual prototyping" },
    { name: "Canva", category: "Design", icon: "Palette", description: "Visual graphics, brand identity collateral, and marketing assets" },
    { name: "Power BI", category: "Analytics", icon: "Database", description: "Business intelligence dashboards, reporting, and data visualization" },
    { name: "Excel", category: "Analytics", icon: "Database", description: "Spreadsheet application for data analysis and visualization" },
    { name: "Tableau", category: "Analytics", icon: "Database", description: "Data visualization and business intelligence platform" }
  ];

  const items = techList && techList.length > 0 ? techList : defaultTech;

  const categories = ['All', 'Frontend', 'Backend', 'Database', 'Design', 'Analytics'];

  const filteredItems = activeCategory === 'All' 
    ? items 
    : items.filter(t => t.category.toLowerCase().includes(activeCategory.toLowerCase()));

  // Seamless looping requires the track width to exceed viewport width even when filtered
  const loopedItems = React.useMemo(() => {
    const base = filteredItems.length > 0 ? filteredItems : items;
    let list = [...base];
    while (list.length < 12) {
      list = [...list, ...base];
    }
    return list;
  }, [filteredItems, items]);

  const renderTechCards = (copy) => loopedItems.map((tech, idx) => {
    const Icon = iconTechMap[tech.icon] || Layers;
    return (
      <div key={`${copy}-${tech.name}-${idx}`} className="glass-card tech-card">
        <div className="tech-icon-wrap">
          <Icon size={24} />
        </div>
        <div>
          <div className="tech-name">{tech.name}</div>
          <div className="tech-category">{tech.category}</div>
        </div>
      </div>
    );
  });

  return (
    <section className="section" id="technologies">
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header">
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

        <div className="tech-marquee" role="region" aria-label="Technology stack">
          <div className="tech-track">
            <div className="tech-marquee-group">
              {renderTechCards('primary')}
            </div>
            <div className="tech-marquee-group" aria-hidden="true">
              {renderTechCards('duplicate')}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
