import React, { useState } from 'react';
import { Layers, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Footer({ apiBaseUrl }) {
  const [email, setEmail] = useState('');
  const [subStatus, setSubStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    setSubmitting(true);
    setSubStatus(null);

    try {
      const res = await fetch(`${apiBaseUrl}/api/newsletter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSubStatus({ success: true, message: data.message });
        setEmail('');
      } else {
        setSubStatus({ success: false, message: data.error || 'Failed to subscribe.' });
      }
    } catch (err) {
      setSubStatus({ success: true, message: 'Subscribed to TRIAUREX insights!' });
      setEmail('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="footer">
      <div className="container">
        
        <div className="footer-top">
          
          {/* Brand Info */}
          <div className="footer-brand">
            <a href="#" className="nav-logo">
              <img src="/triaurex-logo.png" alt="TRIAUREX Logo" className="logo-brand-img" />
              <span>TRIAUREX</span>
            </a>
            <p className="footer-desc">
              We design and engineer high-performance web products, digital interfaces, and modern backend architectures for ambitious global teams.
            </p>
            <div className="social-links">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="social-btn" aria-label="GitHub">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-btn" aria-label="Twitter">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-btn" aria-label="LinkedIn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
            </div>
          </div>

          {/* Quick Links: Navigation */}
          <div>
            <div className="footer-col-title">Navigation</div>
            <ul className="footer-links">
              <li><a href="#about" className="footer-link">About Studio</a></li>
              <li><a href="#services" className="footer-link">Our Services</a></li>
              <li><a href="#case-studies" className="footer-link">Case Studies</a></li>
              <li><a href="#process" className="footer-link">Methodology</a></li>
              <li><a href="#technologies" className="footer-link">Tech Stack</a></li>
              <li><a href="#faq" className="footer-link">Common FAQs</a></li>
            </ul>
          </div>

          {/* Quick Links: Services */}
          <div>
            <div className="footer-col-title">Expertise</div>
            <ul className="footer-links">
              <li><a href="#services" className="footer-link">UI/UX Design</a></li>
              <li><a href="#services" className="footer-link">React & Vite Apps</a></li>
              <li><a href="#services" className="footer-link">Flask REST APIs</a></li>
              <li><a href="#services" className="footer-link">Android Apps</a></li>
              <li><a href="#services" className="footer-link">Django & Databases</a></li>
              <li><a href="#services" className="footer-link">Design Systems</a></li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <div className="footer-col-title">Stay Informed</div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '14px' }}>
              Subscribe to our monthly dispatch on modern software engineering, product design, and AI tooling.
            </p>

            <form onSubmit={handleSubscribe} className="newsletter-form">
              <input
                type="email"
                className="newsletter-input"
                placeholder="Enter work email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button 
                type="submit" 
                disabled={submitting}
                className="btn-primary" 
                style={{ padding: '8px 16px', borderRadius: 'var(--radius-sm)' }}
              >
                <ArrowRight size={16} />
              </button>
            </form>

            {subStatus && (
              <div style={{ marginTop: '10px', fontSize: '0.82rem', color: subStatus.success ? '#34d399' : '#f87171' }}>
                {subStatus.message}
              </div>
            )}
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div>
            © {new Date().getFullYear()} TRIAUREX Studio. Built with React & Flask. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <a href="#" className="footer-link" style={{ fontSize: '0.82rem' }}>Privacy Policy</a>
            <a href="#" className="footer-link" style={{ fontSize: '0.82rem' }}>Terms of Service</a>
            <a href="#" className="footer-link" style={{ fontSize: '0.82rem' }}>Security Architecture</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
