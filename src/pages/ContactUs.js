import React, { useState } from 'react';
import './ContactUs.css';

function ContactUs() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState({ type: '', text: '' });

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const onChange = (e) => setForm({ ...form, [e.target.id]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    setStatus({ type: '', text: '' });
    const { name, email, subject, message } = form;
    if (!name || !email || !subject || !message) {
      setStatus({ type: 'error', text: 'Please fill in all fields.' });
      return;
    }
    if (!isValidEmail(email)) {
      setStatus({ type: 'error', text: 'Please enter a valid email address.' });
      return;
    }
    setTimeout(() => {
      setStatus({ type: 'success', text: 'Thank you for your message! We will get back to you soon.' });
      setForm({ name: '', email: '', subject: '', message: '' });
    }, 800);
  };
  return (
    <main id="main-content">
      {/* Hero */}
      <section id="contact-hero" className="section-padded text-center">
        <div className="container">
          <h1 className="display-6 fw-semibold mb-3">Get in Touch</h1>
          <p className="lead text-muted">Have questions, feedback, or need support? We'd love to hear from you!</p>
        </div>
      </section>

      {/* Content */}
      <section id="contact-info-form" className="section-padded bg-light">
        <div className="container">
          <div className="row g-4 align-items-start contact-card">
            <div className="col-lg-8 col-xl-8 mx-auto">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h2 className="h4 card-title mb-3">Send Us a Message</h2>
                  <form className="contact-form" onSubmit={onSubmit}>
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">Your Name</label>
                      <input type="text" id="name" className="form-control" placeholder="John Doe" value={form.name} onChange={onChange} required />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">Your Email</label>
                      <input type="email" id="email" className="form-control" placeholder="john.doe@example.com" value={form.email} onChange={onChange} required />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="subject" className="form-label">Subject</label>
                      <input type="text" id="subject" className="form-control" placeholder="Inquiry about SignBridge features" value={form.subject} onChange={onChange} required />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="message" className="form-label">Your Message</label>
                      <textarea id="message" rows="6" className="form-control" placeholder="Type your message here..." value={form.message} onChange={onChange} required></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary">Send Message</button>
                    {status.text && (
                      <div className={`mt-3 alert ${status.type === 'success' ? 'alert-success' : 'alert-danger'}`} role="alert">
                        {status.text}
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ContactUs;
