import React, { useMemo, useState } from 'react';
import './LearnSigns.css';

function LearnSigns() {
  const signs = useMemo(
    () => [
      { key: 'hello', title: 'Hello', category: 'greetings', poster: '/assets/images/sign_hello_poster.jpg', src: '/assets/videos/sign_hello.mp4', description: 'A common greeting, waving your open hand from your ear outwards.' },
      { key: 'yes', title: 'Yes', category: 'basics', poster: '/assets/images/sign_yes_poster.jpg', src: '/assets/videos/sign_yes.mp4', description: 'Form a fist, and nod it up and down as if saying yes with your head.' },
      { key: 'no', title: 'No', category: 'basics', poster: '/assets/images/sign_no_poster.jpg', src: '/assets/videos/sign_no.mp4', description: 'Bring your thumb and first two fingers together, then pull them apart.' },
      { key: 'thankyou', title: 'Thank You', category: 'greetings', poster: '/assets/images/sign_thankyou_poster.jpg', src: '/assets/videos/sign_thankyou.mp4', description: 'Place your open hand on your chin, then move it forward and down.' },
    ],
    []
  );

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const filtered = signs.filter(s => {
    const matchesSearch = !search || s.title.toLowerCase().includes(search.toLowerCase()) || s.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'all' || s.category === category;
    return matchesSearch && matchesCategory;
  });
  return (
    <main id="main-content">
      {/* Hero */}
      <section id="learn-signs-hero" className="section-padded text-center">
        <div className="container">
          <h1 className="display-6 fw-semibold mb-3">Your Journey to Sign Language Fluency</h1>
          <p className="lead text-muted">Explore our comprehensive library of signs with video examples and interactive practice.</p>
        </div>
      </section>

      {/* Library */}
      <section id="sign-library" className="section-padded bg-light">
        <div className="container">
          <div className="d-flex flex-column flex-md-row gap-2 mb-4">
            <input type="text" className="form-control" placeholder="Search for a sign (e.g., 'hello')..." aria-label="Search signs" value={search} onChange={(e) => setSearch(e.target.value)} />
            <select className="form-select" aria-label="Filter by category" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="all">All Categories</option>
              <option value="basics">Basics</option>
              <option value="greetings">Greetings</option>
              <option value="family">Family</option>
              <option value="food">Food</option>
              <option value="emotions">Emotions</option>
            </select>
          </div>

          <div className="lesson-grid">
            {filtered.map(sign => (
              <div key={sign.key} className="card shadow-sm">
                <div className="ratio ratio-16x9">
                  <video controls muted loop playsInline preload="none" poster={sign.poster}>
                    <source src={sign.src} type="video/mp4" />
                  </video>
                </div>
                <div className="card-body">
                  <h3 className="h5 card-title">{sign.title}</h3>
                  <p className="card-text">{sign.description}</p>
                  <button className="btn btn-outline-primary">Practice This Sign</button>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center mt-4">
              <p>No signs found matching your criteria. Try a different search or filter.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default LearnSigns;
