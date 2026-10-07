import React, { useState, useEffect } from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const homePath = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: homePath ? '#about' : '/#about' },
    { name: 'Services', href: homePath ? '#services' : '/#services' },
    { name: 'Case Studies', href: '/projects' },
    { name: 'Technologies', href: homePath ? '#technologies' : '/#technologies' },
    { name: 'FAQ', href: homePath ? '#faq' : '/#faq' },
    { name: 'Contact', href: homePath ? '#contact' : '/#contact' },
  ];

  return (
    <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-container">
        <Link to="/" className="nav-logo">
          <img src="/triaurex-logo.png" alt="TRIAUREX Logo" className="logo-brand-img" />
          <span>TRIAUREX</span>
        </Link>

        {/* Desktop Nav */}
        <nav>
          <ul className="nav-menu">
            {navLinks.map((link) => {
              const isInternal = link.href.startsWith('/') && !link.href.includes('#');
              return (
                <li key={link.name}>
                  {isInternal ? (
                    <Link to={link.href} className="nav-link">
                      {link.name}
                    </Link>
                  ) : (
                    <a href={link.href} className="nav-link">
                      {link.name}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Actions */}
        <div className="nav-actions">
          <a href={homePath ? '#contact' : '/#contact'} className="btn-primary" style={{ padding: '9px 20px', fontSize: '0.88rem' }}>
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
          {navLinks.map((link) => {
            const isInternal = link.href.startsWith('/') && !link.href.includes('#');
            return isInternal ? (
              <Link 
                key={link.name} 
                to={link.href}
                className="nav-link"
                onClick={() => setMobileMenuOpen(false)}
                style={{ fontSize: '1.1rem', padding: '8px 0' }}
              >
                {link.name}
              </Link>
            ) : (
              <a 
                key={link.name} 
                href={link.href}
                className="nav-link"
                onClick={() => setMobileMenuOpen(false)}
                style={{ fontSize: '1.1rem', padding: '8px 0' }}
              >
                {link.name}
              </a>
            );
          })}
          <a 
            href={homePath ? '#contact' : '/#contact'}
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
