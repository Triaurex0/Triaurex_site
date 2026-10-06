import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import CaseStudies from './components/CaseStudies';
import Projrct from './components/projrct';
import Process from './components/Process';
import Technologies from './components/Technologies';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot/Chatbot';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000';

export default function App() {
  const [activePortfolio, setActivePortfolio] = useState('projects');
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
    <div className="app-layout">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section with interactive analytics */}
      <Hero companyData={companyInfo} />

      {/* About Us: Studio built for ambitious brands */}
      <About companyData={companyInfo} />

      {/* Services engineered for impact */}
      <Services services={services} />

      <section className="portfolio-section" aria-label="Portfolio">
        <div className="container">
          <div className="portfolio-selector" role="tablist" aria-label="Portfolio type">
            <button
              type="button"
              role="tab"
              aria-selected={activePortfolio === 'projects'}
              className={`portfolio-selector-card ${activePortfolio === 'projects' ? 'active' : ''}`}
              onClick={() => setActivePortfolio('projects')}
            >
              Project
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activePortfolio === 'case-studies'}
              className={`portfolio-selector-card ${activePortfolio === 'case-studies' ? 'active' : ''}`}
              onClick={() => setActivePortfolio('case-studies')}
            >
              Case Study
            </button>
          </div>
        </div>
        {activePortfolio === 'projects' ? <Projrct /> : <CaseStudies caseStudies={caseStudies} />}
      </section>

      {/* A proven, transparent process */}
      <Process processSteps={processSteps} />

      {/* Technologies we master */}
      <Technologies techList={techList} />

      {/* Voice of our partners (Testimonials) */}
      <Testimonials testimonials={testimonials} apiBaseUrl={API_BASE_URL} />

      {/* Frequently Asked Questions */}
      <FAQ faqs={faqs} />

      {/* Contact & Project Kickoff with live Flask API */}
      <Contact apiBaseUrl={API_BASE_URL} />

      {/* Footer */}
      <Footer apiBaseUrl={API_BASE_URL} />

      {/* Production-Ready AI Chatbot */}
      <Chatbot apiBaseUrl={API_BASE_URL} />
    </div>
  );
}
