import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { BrowserRouter, Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Hero1 from './components/Hero1';
import About from './components/About';
import Services from './components/Services';
import CaseStudies from './components/CaseStudies';
import Projrct from './components/project';
import Process from './components/Process';
import Technologies from './components/Technologies';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot/Chatbot';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000';

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
    { title: 'Projects', to: '/projects' },
    { title: 'Case Studies', to: '/case-studies' }
  ];

  return (
    <section className="portfolio-choice-section section" aria-label="Explore our work">
      <div className="container">
        <div className="portfolio-selector">
          {choices.map((choice) => (
            <Link className="portfolio-selector-card" to={choice.to} key={choice.title}>
              <span className="portfolio-choice-title">{choice.title}</span>
              <span className="portfolio-choice-view">View <ArrowRight size={14} /></span>
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
      <Services services={services} />
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
          <div className="container">
            <Link className="portfolio-back-link" to="/">Home</Link>
            <h1>{title}</h1>
          </div>
        </header>
        {children}
      </main>
    </SiteLayout>
  );
}

function RouteScrollReset() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

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

  // Fetch data from Flask backend
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
        console.warn('Could not establish connection to Flask backend on :5000. Fallback data active.');
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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
