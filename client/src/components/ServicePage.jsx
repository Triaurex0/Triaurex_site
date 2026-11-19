import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { serviceIconMap } from './Services';
import { Layout } from 'lucide-react';
import { servicesData } from '../data/servicesData';
import './ServicePage.css';

const DEFAULT_SITE = 'https://triaurexsite.vercel.app';

function setMeta(selector, create, value) {
  let el = document.head.querySelector(selector);
  if (!el) { el = create(); document.head.appendChild(el); }
  el.setAttribute(el.tagName === 'LINK' ? 'href' : 'content', value);
}

export default function ServicePage({ service }) {
  // Per-page SEO (title, description, canonical, social tags, schema)
  useEffect(() => {
    const siteUrl = (typeof window !== 'undefined' && window.location.origin && !window.location.origin.includes('localhost') && !window.location.origin.includes('127.0.0.1'))
      ? window.location.origin
      : (import.meta.env.VITE_SITE_URL || DEFAULT_SITE);

    const url = `${siteUrl}/services/${service.slug}`;
    const prevTitle = document.title;
    document.title = service.seoTitle;
    const meta = (attr, name) => () => { const m = document.createElement('meta'); m.setAttribute(attr, name); return m; };

    setMeta('meta[name="description"]', meta('name', 'description'), service.seoDescription);
    setMeta('meta[property="og:title"]', meta('property', 'og:title'), service.seoTitle);
    setMeta('meta[property="og:description"]', meta('property', 'og:description'), service.seoDescription);
    setMeta('meta[property="og:url"]', meta('property', 'og:url'), url);
    setMeta('meta[property="og:image"]', meta('property', 'og:image'), `${siteUrl}/hero1.jpg`);
    setMeta('meta[name="twitter:title"]', meta('name', 'twitter:title'), service.seoTitle);
    setMeta('meta[name="twitter:description"]', meta('name', 'twitter:description'), service.seoDescription);
    setMeta('meta[name="twitter:image"]', meta('name', 'twitter:image'), `${siteUrl}/hero1.jpg`);
    setMeta('link[rel="canonical"]', () => { const l = document.createElement('link'); l.rel = 'canonical'; return l; }, url);

    const ld = document.createElement('script');
    ld.type = 'application/ld+json';
    ld.id = 'service-schema';
    ld.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: service.title,
      description: service.seoDescription,
      url,
      provider: { '@type': 'Organization', name: 'TRIAUREX', url: siteUrl }
    });
    document.head.appendChild(ld);

    return () => {
      document.title = prevTitle;
      const existingLd = document.getElementById('service-schema');
      if (existingLd) existingLd.remove();
    };
  }, [service]);

  const Icon = serviceIconMap[service.icon] || Layout;
  const others = servicesData.filter((s) => s.slug !== service.slug);

  return (
    <main className="service-page">
      <header className="portfolio-route-heading">
        <div className="container portfolio-route-header-container">
          <Link className="portfolio-back-btn" to="/#services" aria-label="Back to Services" title="Back to Services">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="portfolio-route-title">{service.title}</h1>
          <div className="portfolio-route-spacer" aria-hidden="true" />
        </div>
      </header>

      <section className="section">
        <div className="container">
          <div className="sp-intro glass-card">
            <div className="service-icon-box">{Icon && <Icon size={28} />}</div>
            <p>{service.intro}</p>
          </div>

          <h2 className="section-title sp-h2">What you get</h2>
          <div className="sp-grid">
            {service.deliverables.map((d) => (
              <div className="glass-card sp-item" key={d}>
                <CheckCircle2 size={18} color="#00f0ff" />
                <span>{d}</span>
              </div>
            ))}
          </div>

          <h2 className="section-title sp-h2">How we work</h2>
          <div className="sp-grid">
            {service.process.map(([name, text], i) => (
              <div className="glass-card sp-step" key={name}>
                <span className="sp-num">{String(i + 1).padStart(2, '0')}</span>
                <h3>{name}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>

          <h2 className="section-title sp-h2">Tools & technologies</h2>
          <div className="sp-tags">
            {service.tech.map((t) => <span key={t} className="sp-tag">{t}</span>)}
          </div>

          <div className="sp-cta glass-card">
            <h2>Need {service.title.toLowerCase()}?</h2>
            <p>Tell us about your project and we'll get back to you with a plan and quote.</p>
            <Link to="/#contact" className="btn-primary">Get in touch</Link>
          </div>

          <h2 className="section-title sp-h2">Other services</h2>
          <div className="sp-tags">
            {others.map((s) => (
              <Link key={s.slug} to={`/services/${s.slug}`} className="sp-tag sp-link">{s.title}</Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

