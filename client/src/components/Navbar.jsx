import React, { useState, useEffect } from 'react';
import { Layers, ArrowRight, Menu, X, Sparkles, Activity } from 'lucide-react';

export default function Navbar({ apiStatus }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Case Studies', href: '#case-studies' },
    { name: 'Process', href: '#process' },
    { name: 'Tech Stack', href: '#technologies' },
    { name: 'FAQ', href: '#faq' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-container">
        <a href="#" className="nav-logo">
          <div className="logo-icon-wrap">
            <Layers size={20} />
          </div>
          <span>TRAVIX</span>
        </a>

        {/* Desktop Nav */}
        <nav>
          <ul className="nav-menu">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a href={link.href} className="nav-link">
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Actions & API Indicator */}
        <div className="nav-actions">
          <div className="backend-status-pill" title={apiStatus.connected ? "Connected to Flask API on :5000" : "Attempting Flask connection..."}>
            <span className={`status-dot ${apiStatus.connected ? '' : 'disconnected'}`} style={{ background: apiStatus.connected ? '#10b981' : '#f59e0b', boxShadow: apiStatus.connected ? '0 0 8px #10b981' : '0 0 8px #f59e0b' }}></span>
            <span>{apiStatus.connected ? 'Flask API Online' : 'Connecting API...'}</span>
          </div>

          <a href="#contact" className="btn-primary" style={{ padding: '9px 20px', fontSize: '0.88rem' }}>
            <span>Start a Project</span>
            <ArrowRight size={15} />
          </a>

          <button 
            className="mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          background: 'rgba(6, 9, 19, 0.98)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px',
          backdropFilter: 'blur(20px)'
        }}>
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              className="nav-link"
              onClick={() => setMobileMenuOpen(false)}
              style={{ fontSize: '1.1rem', padding: '8px 0' }}
            >
              {link.name}
            </a>
          ))}
          <a 
            href="#contact" 
            className="btn-primary" 
            style={{ width: '100%', marginTop: '10px' }}
            onClick={() => setMobileMenuOpen(false)}
          >
            <span>Start a Project</span>
            <ArrowRight size={16} />
          </a>
        </div>
      )}
    </header>
  );
}
