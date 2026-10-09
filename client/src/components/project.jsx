import React, { useMemo, useState } from 'react';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { projects } from '../data/projects';

const projectFilters = ['All', 'Mobile Apps', 'Web Apps', 'UX Design', 'Branding', 'Analytics'];

function ProjectVisual({ project, large = false }) {
  if (large && project.image) {
    return (
      <img
        className="portfolio-detail-hero-image"
        src={project.image}
        alt={project.title}
        style={{ objectFit: project.imageFit || 'contain' }}
      />
    );
  }

  return (
    <div className="project-preview project-preview-pink">
      <div className="project-preview-topbar">
        <span className="project-badge">{project.tags[0]}</span>
        <span className="project-domain-pill">Project</span>
      </div>

      {project.image ? (
        <img
          className="project-preview-image"
          src={project.image}
          alt={project.title}
          style={{ objectFit: project.imageFit || 'contain' }}
        />
      ) : (
        <div className="project-mini-graph">
          <div className="mini-bars">
            {[42, 58, 48, 66, 72, 54, 75].map((height, index) => (
              <span key={index} style={{ height: `${height}%` }} />
            ))}
          </div>
          <div className="mini-ring" />
        </div>
      )}

      <div className="project-preview-metrics">
        <div>
          <span className="metric-mini-title">{project.impactLabel}</span>
          <strong>{project.impact}</strong>
        </div>
      </div>
    </div>
  );
}

export default function Projrct({ sectionId = 'projects' }) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [activeProject, setActiveProject] = useState(null);

  const filteredProjects = useMemo(() => {
    if (activeFilter === 'All') return projects;
    return projects.filter((project) => (project.categories || [project.role]).includes(activeFilter.toLowerCase()));
  }, [activeFilter]);

  const externalLinks = activeProject
    ? Object.entries(activeProject.links || {}).flatMap(([type, urls]) =>
        (Array.isArray(urls) ? urls : [urls]).map((url) => ({
          type,
          url,
          label: type[0].toUpperCase() + type.slice(1)
        }))
      )
    : [];

  return (
    <section className="section" id={sectionId}>
      <div className="container">
        <div className="project-filter-row">
          {projectFilters.map((filter) => (
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

        <div className="project-grid">
          {filteredProjects.map((project) => (
            <article
              key={project.title}
              className="glass-card project-card"
              tabIndex={0}
              role="button"
              aria-label={`Open project ${project.title}`}
              onClick={() => setActiveProject(project)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  setActiveProject(project);
                }
              }}
            >
              <ProjectVisual project={project} />

              <div className="project-body">
                <div className="project-chips">
                  {project.tags.slice(0, 3).map((tag, index) => (
                    <span key={tag} className={`project-chip ${index === 0 ? 'project-chip-main' : ''}`}>
                      {tag}
                    </span>
                  ))}
                </div>

                <p className="project-kicker">{project.role}</p>
                <h3 className="project-title">{project.title}</h3>
                <p className="project-description">{project.summary}</p>

                <div className="project-footer-row">
                  <button
                    type="button"
                    className="btn-primary project-view-button"
                    onClick={(event) => {
                      event.stopPropagation();
                      setActiveProject(project);
                    }}
                  >
                    <span>View case study</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
        {filteredProjects.length === 0 && (
          <p className="portfolio-empty-state">No {activeFilter.toLowerCase()} projects are available yet.</p>
        )}
      </div>

      {activeProject && (
        <div className="modal-backdrop portfolio-detail-backdrop" onClick={() => setActiveProject(null)}>
          <div className="modal-content portfolio-detail-modal project-detail-modal" onClick={(event) => event.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setActiveProject(null)} aria-label="Close project details">
              ×
            </button>

            <div className="portfolio-detail-hero">
              <ProjectVisual project={activeProject} large />
            </div>

            <div className="project-detail-content">
              <span className="portfolio-detail-eyebrow">{activeProject.role} project</span>
              <h3 className="project-detail-title">{activeProject.title}</h3>
              <p className="project-detail-meta">{activeProject.tags.join(' · ')}</p>
              <p className="project-detail-description">{activeProject.description}</p>

              <div className="project-detail-body">
                <div className="project-detail-information">
                  <div className="project-case-study">
                    <h4>Case Study</h4>
                    {Object.entries(activeProject.caseStudy).map(([section, content]) => (
                      <div className="project-case-study-block" key={section}>
                        <h5>{section[0].toUpperCase() + section.slice(1)}</h5>
                        <p>{content}</p>
                      </div>
                    ))}
                  </div>

                  <div className="project-features">
                    <h4>Features</h4>
                    <ul>
                      {activeProject.features.map((feature) => <li key={feature}>{feature}</li>)}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="project-detail-actions">
                {externalLinks.map((link) => (
                  <a key={`${link.type}-${link.url}`} className="btn-secondary" href={link.url} target="_blank" rel="noreferrer">
                    {link.label} <ExternalLink size={15} />
                  </a>
                ))}
                <button className="btn-secondary" onClick={() => setActiveProject(null)}>
                  Close
                </button>
                <a href="/#contact" className="btn-primary" onClick={() => setActiveProject(null)}>
                  Build Similar Project
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}