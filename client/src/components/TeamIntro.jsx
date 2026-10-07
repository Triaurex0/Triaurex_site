import React from 'react';
import { BriefcaseBusiness, Mail } from 'lucide-react';

export default function TeamIntro({ section }) {
  return (
    <section className="team-section section" id="team">
      <div className="container">
        <header className="team-section-header">
          <span className="team-eyebrow"><span />{section.eyebrow}</span>
          <h2>{section.title}</h2>
        </header>
        <div className="team-grid">
          {section.members.map((member) => (
            <article className="team-card" key={member.name}>
              <div className="team-card-meta"><span className="team-member-label">{member.label}</span><span className="team-member-number">{member.number}</span></div>
              <img className="team-photo" src={member.photo} alt={`${member.name} profile`} loading="lazy" />
              <h3 className="team-member-name">{member.name}</h3>
              <p className="team-member-designation">{member.designation}</p>
              <p className="team-member-description">{member.description}</p>
              <div className="team-card-footer">
                <span>Direct channels</span>
                <div className="team-social-links">
                  <a href={member.linkedin} aria-label={`${member.name} on LinkedIn`} target="_blank" rel="noreferrer">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.35V9h3.414v1.561h.049c.476-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                  <a href={member.portfolio} aria-label={`${member.name} portfolio`}><BriefcaseBusiness size={16} /></a>
                  <a href={member.email} aria-label={`Email ${member.name}`}><Mail size={16} /></a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
