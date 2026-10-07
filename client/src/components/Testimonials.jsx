import React, { useState, useEffect } from 'react';
import { Star, Quote, Plus, X, CheckCircle2, MessageSquarePlus, ArrowLeft, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Testimonials({ testimonials, apiBaseUrl = 'https://triaurex-site.onrender.com' }) {
  const defaultTestimonials = [
    {
      id: 1,
      name: "Alexander Wright",
      role: "Chief Technology Officer",
      company: "FinScale Systems",
      avatarPos: '50% 50%',
      quote: "The TRIAUREX team exceeded our expectations on every front. Their blend of sophisticated UI design and robust Flask backend architecture delivered a 180% surge in user engagement within three months of release.",
      rating: 5,
      service: "Web Development"
    },
    {
      id: 2,
      name: "Samantha Chen",
      role: "Founder & CEO",
      company: "VoyageLab Global",
      avatarPos: '0% 50%',
      quote: "Their attention to design fidelity and performance is unmatched. They took our complex travel booking concept and converted it into a frictionless, elegant web app that loads in under 1.2 seconds.",
      rating: 5,
      service: "UI/UX Design"
    },
    {
      id: 3,
      name: "Michael Torres",
      role: "VP of Digital Product",
      company: "HyperCore Media",
      avatarPos: '100% 50%',
      quote: "From discovery to final deployment, TRIAUREX operated with incredible precision and speed. The communication was transparent and the resulting product has set a new benchmark in our industry.",
      rating: 5,
      service: "Android App Development"
    },
    {
      id: 4,
      name: "Priya Nair",
      role: "Marketing Director",
      company: "KiteFlow Studio",
      avatarPos: '0% 50%',
      quote: "The TRIAUREX team translated our rough product vision into a polished, conversion-focused digital experience. Their UX thinking and engineering execution felt like an extension of our internal team.",
      rating: 5,
      service: "Branding & Identity"
    },
    {
      id: 5,
      name: "Daniel Brooks",
      role: "Founder",
      company: "NorthPeak Labs",
      avatarPos: '100% 50%',
      quote: "We needed a partner who could move quickly without sacrificing quality. TRIAUREX delivered a scalable product, improved performance, and a clean system our team could confidently grow.",
      rating: 5,
      service: "Web Development"
    }
  ];

  const [reviewsList, setReviewsList] = useState(defaultTestimonials);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const visibleReviews = reviewsList.length <= 3
    ? reviewsList
    : Array.from({ length: 3 }, (_, index) => reviewsList[(activeIndex + index) % reviewsList.length]);

  const goToPreviousReview = () => {
    setActiveIndex((current) => (current - 1 + reviewsList.length) % reviewsList.length);
  };

  const goToNextReview = () => {
    setActiveIndex((current) => (current + 1) % reviewsList.length);
  };

  const [newReview, setNewReview] = useState({
    name: '',
    role: '',
    company: '',
    rating: 5,
    service: 'Web Development',
    quote: ''
  });

  useEffect(() => {
    if (testimonials && testimonials.length > 0) {
      setReviewsList(testimonials.map((t, i) => ({
        ...t,
        avatarPos: t.avatarPos || (i === 0 ? '50% 50%' : i === 1 ? '0% 50%' : '100% 50%')
      })));
    }
  }, [testimonials]);

  useEffect(() => {
    if (reviewsList.length <= 1) return;

    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % reviewsList.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [reviewsList.length]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.name.trim() || !newReview.quote.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`${apiBaseUrl}/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReview)
      });
      const data = await res.json();

      const createdReview = data.review || {
        id: `rev-${Date.now()}`,
        name: newReview.name,
        role: newReview.role || 'Client',
        company: newReview.company || 'Partner',
        rating: newReview.rating,
        service: newReview.service,
        quote: newReview.quote,
        avatarPos: '50% 50%'
      };

      // Add to front of reviews list
      setReviewsList(prev => [createdReview, ...prev]);
      setSubmitSuccess(true);

      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } catch (err) {}

      setTimeout(() => {
        setSubmitSuccess(false);
        setShowReviewModal(false);
        setNewReview({
          name: '',
          role: '',
          company: '',
          rating: 5,
          service: 'Web Development',
          quote: ''
        });
      }, 1500);
    } catch (err) {
      console.warn("Using offline review fallback:", err);
      const fallbackReview = {
        id: `rev-${Date.now()}`,
        name: newReview.name,
        role: newReview.role || 'Client',
        company: newReview.company || 'Partner',
        rating: newReview.rating,
        service: newReview.service,
        quote: newReview.quote,
        avatarPos: '50% 50%'
      };
      setReviewsList(prev => [fallbackReview, ...prev]);
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setShowReviewModal(false);
      }, 1500);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="section" id="testimonials">
      <div className="container">
        
        {/* Section Header with Add Review Action */}
        <div className="section-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h2 className="section-title">Voice of our Partners</h2>
          <p className="section-subtitle">
            Read what visionary founders, CTOs, and product leaders say about working with our studio.
          </p>

          <button 
            className="btn-primary" 
            onClick={() => setShowReviewModal(true)}
            style={{ marginTop: '18px', padding: '10px 22px', fontSize: '0.88rem' }}
          >
            <MessageSquarePlus size={16} />
            <span>Add Your Review</span>
          </button>
        </div>

        {/* Testimonials Carousel */}
        <div className="testimonial-carousel-wrapper">
          <div className="testimonial-carousel-controls">
            <button type="button" className="carousel-arrow" onClick={goToPreviousReview} aria-label="Previous testimonial">
              <ArrowLeft size={18} />
            </button>
            <button type="button" className="carousel-arrow" onClick={goToNextReview} aria-label="Next testimonial">
              <ArrowRight size={18} />
            </button>
          </div>

          <div className="testimonials-grid testimonial-carousel-track">
            {visibleReviews.map((item) => (
              <div key={item.id} className="glass-card testimonial-card">
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                    <Quote size={28} className="quote-icon" />
                    <div style={{ display: 'flex', gap: '3px' }}>
                      {[...Array(item.rating || 5)].map((_, starIdx) => (
                        <Star key={starIdx} size={15} fill="#00f0ff" color="#00f0ff" />
                      ))}
                    </div>
                  </div>

                  <p className="testimonial-quote">
                    "{item.quote}"
                  </p>

                  {item.service && (
                    <div style={{ fontSize: '0.74rem', color: '#00f0ff', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
                      Service: {item.service}
                    </div>
                  )}
                </div>

                <div className="testimonial-author">
                  <div 
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      border: '2px solid rgba(0, 240, 255, 0.4)',
                      boxShadow: '0 0 12px rgba(0, 240, 255, 0.25)',
                      background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.3), rgba(0, 112, 243, 0.3))',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      flexShrink: 0
                    }}
                  >
                    {item.name ? item.name.charAt(0).toUpperCase() : 'T'}
                  </div>
                  <div className="author-info">
                    <span className="author-name">{item.name}</span>
                    <span className="author-role">
                      {item.role ? item.role : 'Client'}{item.company ? `, ${item.company}` : ''}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="testimonial-dots" aria-label="Testimonial carousel pagination">
            {reviewsList.map((item, index) => (
              <button
                key={item.id}
                type="button"
                className={`testimonial-dot ${index === activeIndex ? 'active' : ''}`}
                aria-label={`Go to testimonial ${index + 1}`}
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </div>
        </div>

      </div>

      {/* Add Review Modal */}
      {showReviewModal && (
        <div className="modal-backdrop" onClick={() => setShowReviewModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px' }}>
            <button className="modal-close-btn" onClick={() => setShowReviewModal(false)}>
              <X size={18} />
            </button>

            <h3 style={{ fontSize: '1.75rem', marginBottom: '6px', color: '#fff' }}>
              Review Our <span className="text-gradient">Services</span>
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '22px' }}>
              Share your project experience, collaboration feedback, and ratings with TRIAUREX.
            </p>

            {submitSuccess ? (
              <div style={{ textAlign: 'center', padding: '30px 10px' }}>
                <CheckCircle2 size={52} color="#10b981" style={{ margin: '0 auto 16px auto' }} />
                <h4 style={{ color: '#fff', fontSize: '1.3rem', marginBottom: '8px' }}>Thank You for Your Feedback!</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
                  Your review has been successfully added to our testimonials showcase.
                </p>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Your Name *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. John Doe" 
                      className="form-input"
                      value={newReview.name}
                      onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Role / Title</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Founder, CTO" 
                      className="form-input"
                      value={newReview.role}
                      onChange={(e) => setNewReview({ ...newReview, role: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Company / Brand</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Acme Corp" 
                      className="form-input"
                      value={newReview.company}
                      onChange={(e) => setNewReview({ ...newReview, company: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Service Received</label>
                    <select
                      className="form-select"
                      value={newReview.service}
                      onChange={(e) => setNewReview({ ...newReview, service: e.target.value })}
                    >
                      <option value="Web Development">Web Development</option>
                      <option value="Android App Development">Android App Development</option>
                      <option value="UI/UX Design">UI/UX Design</option>
                      <option value="Branding & Identity">Branding & Identity</option>
                    </select>
                  </div>
                </div>

                {/* Star Rating Picker */}
                <div className="form-group">
                  <label className="form-label">Your Rating (1 to 5 Stars)</label>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewReview({ ...newReview, rating: star })}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '4px'
                        }}
                      >
                        <Star 
                          size={24} 
                          fill={(hoverRating || newReview.rating) >= star ? '#00f0ff' : 'none'} 
                          color={(hoverRating || newReview.rating) >= star ? '#00f0ff' : 'rgba(255,255,255,0.25)'}
                          style={{ transition: 'transform 0.15s ease' }}
                        />
                      </button>
                    ))}
                    <span style={{ color: '#00f0ff', fontSize: '0.9rem', fontWeight: 600, marginLeft: '8px', alignSelf: 'center' }}>
                      {newReview.rating} / 5 Stars
                    </span>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Your Review / Testimonial *</label>
                  <textarea
                    required
                    rows="3"
                    className="form-textarea"
                    placeholder="Describe your collaboration with TRIAUREX, project delivery, and results..."
                    value={newReview.quote}
                    onChange={(e) => setNewReview({ ...newReview, quote: e.target.value })}
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="btn-primary" 
                  style={{ width: '100%', marginTop: '6px', justifyContent: 'center' }}
                >
                  <span>{isSubmitting ? 'Submitting...' : 'Submit Review'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
