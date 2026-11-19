import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { BrowserRouter, Link, Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Hero1 from './components/Hero1';
import About from './components/About';
import Services from './components/Services';
import ServicePage from './components/ServicePage';
import { getServiceBySlug } from './data/servicesData';
import CaseStudies from './components/CaseStudies';
import Projrct from './components/project';
import Process from './components/Process';
import Technologies from './components/Technologies';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot/Chatbot';
import SEO from './components/SEO';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://triaurex-site.onrender.com';

function SiteLayout({ children, apiBaseUrl }) {
  return (
    <div className="app-layout">
      <Navbar />
      {children}
      <Footer apiBaseUrl={apiBaseUrl} />
      <Chatbot apiBaseUrl={apiBaseUrl} />
    </div>
  );
}

function PortfolioChooser() {
  const choices = [
    {
      title: 'Projects',
      badge: 'Client Work & Web Platforms',
      desc: 'Explore shipped client solutions across modern web platforms, healthcare mobile apps, and high-conversion e-commerce marketplaces.',
      to: '/projects'
    },
    {
      title: 'Case Studies',
      badge: 'Data & Analytics Deep Dives',
      desc: 'Dive into technical architectures, Power BI sales & election dashboards, Flutter fintech apps, and data-driven business results.',
      to: '/case-studies'
    }
  ];

  return (
    <section className="portfolio-choice-section section" id="projects" aria-label="Explore our work">
      <div id="portfolio" style={{ position: 'absolute' }} aria-hidden="true" />
      <div className="container">
        <div className="section-header" style={{ marginBottom: '32px' }}>
          <h2 className="section-title">Our Work & Case Studies</h2>
          <p className="section-subtitle">
            Explore our curated portfolio of client deliverables and deep-dive technical analytics case studies.
          </p>
        </div>
        <div className="portfolio-selector">
          {choices.map((choice) => (
            <Link className="portfolio-selector-card" to={choice.to} key={choice.title}>
              <span className="portfolio-choice-badge">{choice.badge}</span>
              <span className="portfolio-choice-title">{choice.title}</span>
              <p className="portfolio-choice-desc">{choice.desc}</p>
              <span className="portfolio-choice-view">View {choice.title} <ArrowRight size={14} /></span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function HomePage({ companyInfo, services, processSteps, techList, testimonials, faqs, apiBaseUrl }) {
  return (
    <SiteLayout apiBaseUrl={apiBaseUrl}>
      <Hero1 />
      <Hero companyData={companyInfo} />
      <About companyData={companyInfo} />
      <Services />
      <PortfolioChooser />
      <Process processSteps={processSteps} />
      <Technologies techList={techList} />
      <Testimonials testimonials={testimonials} apiBaseUrl={apiBaseUrl} />
      <FAQ faqs={faqs} />
      <Contact apiBaseUrl={apiBaseUrl} />
    </SiteLayout>
  );
}

function PortfolioPage({ title, apiBaseUrl, children }) {
  return (
    <SiteLayout apiBaseUrl={apiBaseUrl}>
      <main>
        <header className="portfolio-route-heading">
          <div className="container portfolio-route-header-container">
            <Link
              className="portfolio-back-btn"
              to="/#portfolio"
              aria-label="Back to Portfolio section"
              title="Back to Portfolio"
            >
              <ArrowLeft size={20} />
            </Link>
            <h1 className="portfolio-route-title">{title}</h1>
            <div className="portfolio-route-spacer" aria-hidden="true" />
          </div>
        </header>
        {children}
      </main>
    </SiteLayout>
  );
}

function ServiceRoute({ apiBaseUrl }) {
  const { slug } = useParams();
  const service = getServiceBySlug(slug);
  if (!service) return <Navigate to="/#services" replace />;
  return (
    <SiteLayout apiBaseUrl={apiBaseUrl}>
      <ServicePage service={service} />
    </SiteLayout>
  );
}

function RouteScrollReset() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const timer = setTimeout(() => {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 80);
      return () => clearTimeout(timer);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}

export default function App() {
  const [apiStatus, setApiStatus] = useState({ connected: false, loading: true });
  const [companyInfo, setCompanyInfo] = useState(null);
  const [services, setServices] = useState([]);
  const [caseStudies, setCaseStudies] = useState([]);
  const [processSteps, setProcessSteps] = useState([]);
  const [techList, setTechList] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [faqs, setFaqs] = useState([]);

  // Fetch data from Flask backend (hosted on Render in production)
  useEffect(() => {
    const checkApiAndLoadData = async () => {
      try {
        const healthRes = await fetch(`${API_BASE_URL}/api/health`);
        if (healthRes.ok) {
          setApiStatus({ connected: true, loading: false });

          // Fetch all content in parallel
          const [infoRes, servRes, caseRes, procRes, techRes, testRes, faqRes] = await Promise.all([
            fetch(`${API_BASE_URL}/api/company-info`),
            fetch(`${API_BASE_URL}/api/services`),
            fetch(`${API_BASE_URL}/api/case-studies`),
            fetch(`${API_BASE_URL}/api/process`),
            fetch(`${API_BASE_URL}/api/technologies`),
            fetch(`${API_BASE_URL}/api/testimonials`),
            fetch(`${API_BASE_URL}/api/faqs`),
          ]);

          if (infoRes.ok) setCompanyInfo(await infoRes.json());
          if (servRes.ok) setServices(await servRes.json());
          if (caseRes.ok) setCaseStudies(await caseRes.json());
          if (procRes.ok) setProcessSteps(await procRes.json());
          if (techRes.ok) setTechList(await techRes.json());
          if (testRes.ok) setTestimonials(await testRes.json());
          if (faqRes.ok) setFaqs(await faqRes.json());
        } else {
          setApiStatus({ connected: false, loading: false });
        }
      } catch (err) {
        console.warn('Could not establish connection to Flask backend on Render. Fallback data active.');
        setApiStatus({ connected: false, loading: false });
      }
    };

    checkApiAndLoadData();
    // Poll health every 10s to reflect backend startup
    const interval = setInterval(checkApiAndLoadData, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <BrowserRouter>
      <SEO />
      <RouteScrollReset />
      <Routes>
        <Route
          path="/"
          element={(
            <HomePage
              companyInfo={companyInfo}
              services={services}
              processSteps={processSteps}
              techList={techList}
              testimonials={testimonials}
              faqs={faqs}
              apiBaseUrl={API_BASE_URL}
            />
          )}
        />
        <Route
          path="/projects"
          element={(
            <PortfolioPage title="Projects" apiBaseUrl={API_BASE_URL}>
              <CaseStudies caseStudies={caseStudies} sectionId="projects" />
            </PortfolioPage>
          )}
        />
        <Route
          path="/case-studies"
          element={(
            <PortfolioPage title="Case Studies" apiBaseUrl={API_BASE_URL}>
              <Projrct sectionId="case-studies" />
            </PortfolioPage>
          )}
        />
        <Route path="/services/:slug" element={<ServiceRoute apiBaseUrl={API_BASE_URL} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
