import React, { useState } from 'react';
import { Layers, ArrowRight, CheckCircle2, Mail } from 'lucide-react';

const expertiseLinks = [
  { label: 'UI/UX Design', anchor: 'ui-ux-design' },
  { label: 'React & Vite Apps', anchor: 'web-development' },
  { label: 'Flask REST APIs', anchor: 'web-development' },
  { label: 'Android Apps', anchor: 'android-app-development' },
  { label: 'Django & Databases', anchor: 'web-development' },
  { label: 'Design Systems', anchor: 'ui-ux-design' },
  { label: 'Data Analysis', anchor: 'data-analysis' },
];

const legalContent = {
  privacy: {
    title: 'Privacy Policy',
    body: [
      'TRIAUREX respects the privacy of our clients, partners, and website visitors. This policy explains how we collect, use, and protect information when you interact with our site or services.',
      'We may collect basic contact information such as name, email address, company name, and project requirements when you fill out a form or contact us. This information is used to respond to inquiries, provide services, and maintain communication related to your project.',
      'We may also collect limited technical information such as browser type, IP address, device information, and usage data to improve performance, understand engagement, and maintain site security. We do not sell personal information.',
      'Any information you provide may be stored securely and used only for business communication, contract fulfillment, service improvement, and legal compliance. We may retain records as required by applicable law or internal business needs.',
      'We use reasonable administrative, technical, and organizational safeguards to protect data. However, no method of transmission or storage is completely secure, and we cannot guarantee absolute security.',
      'If you have any questions about privacy, please contact us through the website contact form or the email listed in our official communications.'
    ]
  },
  terms: {
    title: 'Terms of Service',
    body: [
      'By using the TRIAUREX website or engaging our services, you agree to these Terms of Service. These terms outline the responsibilities of both parties during the project lifecycle.',
      'TRIAUREX provides product design, web development, mobile app development, and related digital services. Scope, deliverables, timeline, and pricing are defined in the project agreement or proposal agreed upon by both parties.',
      'All content, visuals, branding, code, design assets, and documentation created for a client project remain subject to the agreed project terms. We may reuse general knowledge, internal methodologies, and non-confidential design patterns unless specifically restricted in writing.',
      'Clients are responsible for providing timely approvals, assets, access, and required business information. Delays caused by missing input or incomplete requirements may affect milestones and delivery dates.',
      'We aim to deliver high-quality work, but we do not guarantee specific financial outcomes, user acquisition results, or market performance. Any performance claims should be treated as estimates based on project scope and assumptions.',
      'These terms are governed by the applicable laws of the jurisdiction in which the engagement is performed, and any dispute should first be addressed through good-faith negotiation before formal legal action.'
    ]
  }
};

export default function Footer({ apiBaseUrl }) {
  const [email, setEmail] = useState('');
  const [subStatus, setSubStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [activeLegal, setActiveLegal] = useState(null);

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
              <a href="mailto:triaurex0@gmail.com" className="social-btn" aria-label="Email TRIAUREX">
                <Mail size={16} />
              </a>
              <a href="https://www.linkedin.com/company/triaurex/" target="_blank" rel="noreferrer" className="social-btn" aria-label="LinkedIn">
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
              {expertiseLinks.map((service) => (
                <li key={service.label}>
                  <a href={`#${service.anchor}`} className="footer-link">{service.label}</a>
                </li>
              ))}
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
            <button type="button" className="footer-link" style={{ fontSize: '0.82rem', background: 'transparent', border: 'none', padding: 0 }} onClick={() => setActiveLegal('privacy')}>Privacy Policy</button>
            <button type="button" className="footer-link" style={{ fontSize: '0.82rem', background: 'transparent', border: 'none', padding: 0 }} onClick={() => setActiveLegal('terms')}>Terms of Service</button>
            <a href="#" className="footer-link" style={{ fontSize: '0.82rem' }}>Security Architecture</a>
          </div>
        </div>

      </div>

      {activeLegal && (
        <div className="modal-backdrop" onClick={() => setActiveLegal(null)} style={{ zIndex: 2000 }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '900px', maxHeight: '85vh', overflowY: 'auto', padding: '32px 28px' }}>
            <button className="modal-close-btn" onClick={() => setActiveLegal(null)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>

            <h3 style={{ fontSize: '2rem', marginBottom: '20px', color: '#fff' }}>{legalContent[activeLegal].title}</h3>

            <div style={{ display: 'grid', gap: '16px', color: '#e2e8f0', lineHeight: '1.8' }}>
              {legalContent[activeLegal].body.map((paragraph, index) => (
                <p key={index} style={{ fontSize: '0.98rem' }}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
