import React, { useMemo, useState } from 'react';
import { ArrowRight, X } from 'lucide-react';
import pranaraDoc from '../assets/case-study-doc/PRANARA.docx?url';
import visitmaxDoc from '../assets/case-study-doc/VISITMAX.docx?url';
import yrcDoc from '../assets/case-study-doc/YRC XEROX app design.docx?url';

export default function CaseStudies({ caseStudies, sectionId = 'case-studies' }) {
  const [activeModalProject, setActiveModalProject] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');

  const defaultCases = [
    {
      id: 'pranara',
      title: 'PRANARA',
      tag: 'Travel & Tourism',
      client: 'PRANARA',
      year: '2026',
      image: '/images/casestudy/paranara.png',
      category: 'Frontend',
      description: 'A responsive travel and tourism website that helps visitors discover Munnar destinations, experiences, and tour packages.',
      stats: [],
      techStack: ['Figma', 'HTML', 'CSS', 'JavaScript', 'Vercel', 'Hostinger'],
      challenge: 'Travelers need one clear place to explore Munnar destinations, compare experiences, find tour packages, and enquire about trips.',
      process: 'Designed a mobile-responsive experience around spacious layouts, nature-inspired visuals, clear navigation, destination storytelling, and a simple enquiry flow.',
      solution: 'A travel platform organized into destination, tour package, experience, gallery, and contact sections, with trip planning information easy to find.',
      outcome: 'PRANARA gives the travel brand a modern digital presence and makes it easier for visitors to discover and enquire about travel offerings.',
      features: ['Munnar destination discovery', 'Tour packages and travel experiences', 'Destination details and gallery', 'Responsive layouts', 'Trip enquiry flow'],
      documentUrl: pranaraDoc,
      externalLinks: [{ label: 'Visit Website', url: 'https://www.pranaramunnar.com/' }]
    },
    {
      id: 'visitmax',
      title: 'VisitMax',
      tag: 'Healthcare · Mobile Application',
      client: 'VisitMax',
      year: '2025',
      image: '/images/casestudy/Visitmax.png',
      category: 'Design',
      description: 'A mobile field-visit management app for healthcare executives to record visits, validate locations, upload evidence, and manage reports.',
      stats: [],
      techStack: ['Figma', 'React Native', 'Web API', 'MySQL', 'Android Studio'],
      challenge: 'Healthcare field executives need a structured way to manage daily visits and replace scattered manual tracking with reliable visit records.',
      process: 'Designed a mobile-first flow with quick actions, clear information hierarchy, OTP login, GPS validation, evidence capture, and minimal steps for recording a visit.',
      solution: 'A centralized app experience for visit tracking, visit reasons, photo evidence, visit history, reports, profiles, and settings.',
      outcome: 'VisitMax makes field-visit reporting more structured and brings visit management into one mobile application.',
      features: ['Login and OTP authentication', 'Daily dashboard and visit tracking', 'GPS location validation', 'Evidence photo upload', 'Visit reasons, history, and reports', 'Profile and settings'],
      documentUrl: visitmaxDoc,
      externalLinks: [{ label: 'View Figma Design', url: 'https://www.figma.com/design/KOfwcWwrgEqqUZwfbwfHiq/visitmax?node-id=0-1&p=f&t=b5PNiqgyHCgXPBaQ-0' }]
    },
    {
      id: 'yrc-xerox',
      title: 'YRC Xerox',
      tag: 'E-Commerce · Marketplace',
      client: 'YRC Xerox',
      year: '2026',
      image: '/images/casestudy/YRC.png',
      category: 'Design',
      description: 'A product-focused e-commerce marketplace design for browsing and purchasing Xerox and printing machines.',
      stats: [],
      techStack: ['Figma', 'Adobe Photoshop', 'Canva'],
      challenge: 'Customers need a straightforward way to discover printing machines, understand product details, compare options, and complete a purchase.',
      process: 'Designed a professional responsive shopping experience around clear product hierarchy, simple navigation, consistent UI, product discovery, and a structured checkout.',
      solution: 'A marketplace flow that connects product listings and categories to product details, cart, checkout, payment, accounts, and order management.',
      outcome: 'The design gives YRC Xerox a structured digital marketplace for showcasing machines and supporting a clearer purchasing journey.',
      features: ['Product listing and categories', 'Search and filtering', 'Detailed product pages', 'Shopping cart and checkout', 'Payment flow', 'User accounts and order management'],
      documentUrl: yrcDoc,
      externalLinks: [{ label: 'View Figma Design', url: 'https://www.figma.com/design/dYvw5l0RVObm1x7BNiMsUc/Untitled?node-id=0-1&p=f&t=oWIpgip7a7YusCA9-0' }]
    },
  ];

  const filterTabs = ['All', 'Mobile Apps', 'Web Apps', 'UX Design', 'E-Commerce'];

  const imageById = {
    pranara: '/images/casestudy/paranara.png',
    visitmax: '/images/casestudy/Visitmax.png',
    'yrc-xerox': '/images/casestudy/YRC.png'
  };
  const documentById = {
    pranara: pranaraDoc,
    visitmax: visitmaxDoc,
    'yrc-xerox': yrcDoc
  };
  const categoriesById = {
    pranara: ['Web Apps'],
    visitmax: ['Mobile Apps', 'UX Design'],
    'yrc-xerox': ['Web Apps', 'UX Design', 'E-Commerce']
  };
  const projects = (caseStudies && caseStudies.length > 0 ? caseStudies : defaultCases).map((item, index) => ({
    ...item,
    image: item.image || imageById[item.id] || '/images/casestudy/YRC.png',
    documentUrl: item.documentUrl || documentById[item.id],
    categories: item.categories || categoriesById[item.id] || [item.category || (index === 0 ? 'Web Apps' : 'UX Design')]
  }));

  const filteredProjects = useMemo(() => {
    if (activeFilter === 'All') return projects;
    return projects.filter((item) => item.categories?.includes(activeFilter));
  }, [activeFilter, projects]);

  return (
    <section className="section" id={sectionId}>
      <div className="container">
        <div className="project-filter-row case-filter-row">
          {filterTabs.map((filter) => (
            <button
              key={filter}
              type="button"
              className={`project-filter-btn ${activeFilter === filter ? 'active' : ''}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="case-studies-list">
          {filteredProjects.map((item, index) => {
            return (
              <div
                key={item.id}
                className={`glass-card case-study-card ${index % 2 === 1 ? 'case-study-card-reversed' : ''}`}
                onClick={() => setActiveModalProject(item)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActiveModalProject(item);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label={`Open case study ${item.title}`}
              >
                <div className="case-study-image-wrap">
                  <img src={item.image} alt={item.title} loading="lazy" />
                  <div className="case-study-overlay" />
                </div>

                <div className="case-study-content">
                  <div>
                    <span className="case-tag">{item.tag}</span>
                    <h3 className="case-title" style={{ marginTop: '6px' }}>{item.title}</h3>
                  </div>

                  <p className="case-desc">{item.description}</p>

                  {item.stats?.length > 0 && <div className="case-metrics-grid">
                    {item.stats?.map((st, sIdx) => (
                      <div key={sIdx}>
                        <div className="case-metric-value">{st.value}</div>
                        <div className="case-metric-label">{st.label}</div>
                      </div>
                    ))}
                  </div>}

                  <div className="case-tags-flex">
                    {item.techStack?.map((tech, tIdx) => (
                      <span key={tIdx} className="case-pill">{tech}</span>
                    ))}
                  </div>

                  <div>
                    <button
                      className="btn-primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveModalProject(item);
                      }}
                    >
                      <span>View Project</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
        {filteredProjects.length === 0 && (
          <p className="portfolio-empty-state">No {activeFilter.toLowerCase()} case studies are available yet.</p>
        )}
      </div>

      {activeModalProject && (
        <div className="modal-backdrop portfolio-detail-backdrop" onClick={() => setActiveModalProject(null)}>
          <div className="modal-content portfolio-detail-modal case-study-detail-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setActiveModalProject(null)}>
              <X size={18} />
            </button>

            <div className="portfolio-detail-hero">
              <img className="portfolio-detail-hero-image" src={activeModalProject.image} alt={activeModalProject.title} />
            </div>

            <div className="case-study-detail-content">
              <span className="portfolio-detail-eyebrow">{activeModalProject.tag} Case Study</span>
              <h3 className="case-study-detail-title">{activeModalProject.title}</h3>
              <p className="case-study-detail-meta">
                Client: {activeModalProject.client} · Released {activeModalProject.year}
              </p>
              <p className="case-study-detail-description">{activeModalProject.description}</p>

              <div className="case-study-detail-body">
                {[
                  ['Challenge', activeModalProject.challenge],
                  ['Process', activeModalProject.process],
                  ['Solution', activeModalProject.solution],
                  ['Outcome', activeModalProject.outcome]
                ].filter(([, content]) => content).map(([heading, content]) => (
                  <div className="case-study-detail-section" key={heading}>
                    <h4>{heading}</h4>
                    <p>{content}</p>
                  </div>
                ))}
              </div>

              {activeModalProject.features?.length > 0 && <div className="case-study-detail-features">
                <h4>Key Features</h4>
                <ul>{activeModalProject.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
              </div>}

              {activeModalProject.stats?.length > 0 && <div className="case-metrics-grid case-study-detail-metrics">
                {activeModalProject.stats.map((st, i) => (
                  <div key={i}>
                    <div className="case-metric-value">{st.value}</div>
                    <div className="case-metric-label">{st.label}</div>
                  </div>
                ))}
              </div>}

              <div className="case-study-detail-actions">
                {activeModalProject.externalLinks?.map((link) => (
                  <a key={link.url} className="btn-secondary" href={link.url} target="_blank" rel="noreferrer">
                    {link.label}
                  </a>
                ))}
                {activeModalProject.documentUrl && (
                  <a className="btn-secondary" href={activeModalProject.documentUrl} download>
                    Download Case Study Document
                  </a>
                )}
                <button className="btn-secondary" onClick={() => setActiveModalProject(null)}>
                  Close
                </button>
                <a href="/#contact" className="btn-primary" onClick={() => setActiveModalProject(null)}>
                  Build Similar Solution
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
