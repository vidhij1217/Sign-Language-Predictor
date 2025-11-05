import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <main id="main-content">
      <section id="hero-section" className="hero-section flow">
        <div className="container hero-content-wrapper">
          <div className="hero-text-content">
            <h1 className="hero-title">Empowering Connections Through Sign Language.</h1>
            <p className="hero-subtitle">
              Unlock seamless communication with real-time translation
              and a comprehensive learning platform.
            </p>
            <div className="hero-actions">
              <Link to="/chatbot" className="btn btn-primary">
                Start Translating Now
              </Link>
              <Link to="/learn-signs" className="btn btn-secondary">
                Begin Learning
              </Link>
            </div>
          </div>
          <div className="hero-visual">
            <img
              src="/assets/images/homeimage.jpg"
              alt="Inclusive communication with sign language at home."
            />
          </div>
        </div>
      </section>

      <section id="features-overview-section" className="features-overview-section section-padded bg-light flow">
        <div className="container">
          <h2 className="section-title">Our Core Features</h2>
          <p className="section-description">
            SignBridge offers a suite of tools designed to make sign language communication and
            learning accessible to everyone.
          </p>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-emoji" aria-hidden="true">🤖</div>
              <h3 className="feature-title">Real-time Chatbot</h3>
              <p className="feature-description">
                Instantly translate signs to text or speech using your webcam for effortless conversations.
                Designed for clarity and speed, the chatbot overlays predictions in real time with confidence
                scores so you always know what is being detected.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-emoji" aria-hidden="true">📚</div>
              <h3 className="feature-title">Learn Sign Language</h3>
              <p className="feature-description">
                Explore a growing library of signs with concise video explanations and interactive practice
                modes. Track what you’ve viewed and revisit lessons to build lasting muscle memory.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="cta-section" className="cta-section section-padded bg-primary-dark flow">
        <div className="container">
          <div className="cta-content">
            <h2 className="section-title">Ready to Bridge the Gap?</h2>
            <p className="section-description">
              Join our growing community and experience the future of inclusive communication.
            </p>
            <Link to="/chatbot" className="btn btn-cta">
              Get Started for Free
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
