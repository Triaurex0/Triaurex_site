import React from 'react';
import { BriefcaseBusiness, Linkedin, Mail } from 'lucide-react';

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
                  <a href={member.linkedin} aria-label={`${member.name} on LinkedIn`} target="_blank" rel="noreferrer"><Linkedin size={16} /></a>
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
