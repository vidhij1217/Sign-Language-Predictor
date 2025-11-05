import React, { useEffect } from 'react';
import './AboutUs.css';

function AboutUs() {
  useEffect(() => {
    const sections = document.querySelectorAll('#our-story, #our-vision, #our-team');
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.style.opacity = '1';
            e.target.style.transform = 'translateY(0)';
            e.target.style.transition = 'opacity .6s ease-out, transform .6s ease-out';
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    sections.forEach(s => {
      s.style.opacity = '0';
      s.style.transform = 'translateY(20px)';
      observer.observe(s);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <main id="main-content">
      {/* Hero */}
      <section id="about-hero" className="section-padded text-center">
        <div className="container">
          <h1 className="display-5 fw-semibold mb-3">About SignBridge</h1>
          <p className="lead text-muted">
            Our journey to connect communities through universal communication.
          </p>
        </div>
      </section>

      {/* Story & Mission */}
      <section id="our-story" className="section-padded bg-light">
        <div className="container">
          <div className="row gy-4">
            <div className="col-12">
              <h2 className="h3 mb-3">Our Story & Mission</h2>
              <p>
                SignBridge was found with a simple but powerful belief — communication should have no barriers. 
                We saw how the deaf and hard-of-hearing communities often struggled to connect with the world in real time, 
                and we decided to bridge that gap using technology and empathy.
              </p>
              <p>
                Our mission is to build a more inclusive future through AI-powered sign language translation, 
                interactive learning, and seamless communication tools — empowering everyone to express and connect effortlessly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Values */}
      <section id="our-vision" className="section-padded">
        <div className="container">
          <div className="row gy-4">
            <div className="col-12">
              <h2 className="h3 mb-3">Our Vision & Values</h2>
              <p>
                We envision a world where inclusivity is the norm — where language differences 
                never hinder understanding or connection. 
                Our values revolve around <strong>Accessibility</strong>, <strong>Innovation</strong>, 
                <strong>Empathy</strong>, and <strong>Community</strong>.
              </p>
              <p>
                Through continuous innovation, we aim to make SignBridge a global leader in 
                bridging communication gaps and empowering people with the gift of understanding.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section id="our-team" className="section-padded bg-light">
        <div className="container text-center">
          <h2 className="h3 mb-2">Meet Our Team</h2>
          <p className="text-muted mb-5">
            Behind SignBridge is a team of passionate individuals driven by innovation, inclusivity, 
            and a shared goal — to make communication universal and accessible for all.
          </p>

          <div className="team-grid justify-content-center">
            <div className="team-card">
              <img src="/assets/images/vidhi.jpg" alt="Vidhi" className="img-fluid" />
              <h3 className="h5 mt-3 mb-1">Vidhi Jain</h3>
              <p className="text-muted">
                Final-year Computer Science student with a deep interest in backend development and system design. 
                Believes in building technology that truly serves people.
              </p>
            </div>

            <div className="team-card">
              <img src="/assets/images/kalpesh.jpg" alt="Kalpesh" className="img-fluid" />
              <h3 className="h5 mt-3 mb-1">Kalpesh Jain</h3>
              <p className="text-muted">
                Final-year Computer Science student passionate about web development and human–AI interaction. 
                Dedicated to designing intuitive, inclusive, and impactful digital experiences.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default AboutUs;
