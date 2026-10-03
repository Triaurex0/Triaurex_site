import React, { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';

export default function FAQ({ faqs }) {
  const [openIndex, setOpenIndex] = useState(0);

  const defaultFaqs = [
    {
      question: "What is the typical project timeline?",
      answer: "Our standard project engagements range from 4 to 12 weeks depending on scope complexity. Rapid MVP launches can be accomplished in 4 to 6 weeks, while enterprise-grade platforms with comprehensive design systems and custom backend integrations typically average 8 to 12 weeks."
    },
    {
      question: "How do you handle pricing & project milestones?",
      answer: "We offer transparent milestone-based fixed pricing as well as dedicated agile sprint retainers. Every project proposal includes detailed deliverables, defined acceptance criteria, and clear phase sign-offs so there are never any unexpected surprises."
    },
    {
      question: "Do you provide ongoing support & maintenance?",
      answer: "Yes, absolutely! Following launch, we provide complimentary 30-day warranty coverage. Afterwards, clients can select from our Growth & Maintenance SLAs covering security patches, feature iterations, uptime monitoring, and infrastructure scaling."
    },
    {
      question: "Can you collaborate with our existing in-house team?",
      answer: "Yes, we frequently co-create with internal engineering and design teams. Whether you need specialized UI/UX design leadership, frontend React development, or robust Flask API backends, we integrate cleanly into your GitHub workflows."
    },
    {
      question: "Why do you recommend React frontend and Flask backend?",
      answer: "React delivers a fluid, responsive client-side experience with rich animations and reusable components. Flask provides a clean, Python-powered REST API that is lightweight, highly maintainable, and easily extendable for AI/ML pipelines and data science features."
    }
  ];

  const items = faqs && faqs.length > 0 ? faqs : defaultFaqs;

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="section" id="faq">
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header">
          <h2 className="section-title">Frequently asked questions</h2>
          <p className="section-subtitle">
            Everything you need to know about our collaboration model, delivery cycles, and technical stack.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="faq-list">
          {items.map((item, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div key={idx} className={`faq-item ${isOpen ? 'open' : ''}`}>
                <button 
                  className="faq-question-btn" 
                  onClick={() => toggle(idx)}
                  aria-expanded={isOpen}
                >
                  <span>{item.question}</span>
                  <div style={{
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease',
                    color: isOpen ? '#00f0ff' : 'var(--text-muted)'
                  }}>
                    <ChevronDown size={20} />
                  </div>
                </button>

                {isOpen && (
                  <div className="faq-answer">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
