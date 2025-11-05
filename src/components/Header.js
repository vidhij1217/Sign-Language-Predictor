import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  const [navExpanded, setNavExpanded] = useState(false);

  const toggleNav = () => {
    setNavExpanded(!navExpanded);
  };

  const closeNav = () => {
    setNavExpanded(false);
  };

  return (
    <header className="site-header">
      <div className="container">
        <nav className="main-nav" aria-label="Main navigation">
          <Link to="/" className="site-logo" onClick={closeNav}>
            SignBridge
          </Link>
          <button
            className="nav-toggle"
            aria-controls="primary-navigation"
            aria-expanded={navExpanded}
            aria-label="Toggle navigation menu"
            onClick={toggleNav}
          >
            <span className="hamburger"></span>
          </button>
          <ul
            id="primary-navigation"
            className={`nav-list ${navExpanded ? 'expanded' : ''}`}
          >
            <li>
              <Link to="/chatbot" className="nav-link" onClick={closeNav}>
                Chatbot
              </Link>
            </li>
            <li>
              <Link to="/learn-signs" className="nav-link" onClick={closeNav}>
                Learn Signs
              </Link>
            </li>
            <li>
              <Link to="/about-us" className="nav-link" onClick={closeNav}>
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact-us" className="nav-link" onClick={closeNav}>
                Contact
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
