import React, { useState } from 'react';
import { Link } from 'react-router';

const MyNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <header className="main-navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <i className="ri-service-fill"></i><span>HealthCare</span>
          </div>

          <button
            className="menu-btn"
            onClick={() => setIsOpen(!isOpen)}
          >
            <i className="ri-menu-3-fill"></i>
          </button>

          <nav className={`nav-links ${isOpen ? 'open' : ''}`}>
            <div className="links">
              <Link to="/">Home</Link>
              <Link to="about">About</Link>
              <Link to="doctors">Doctor</Link>
              <Link to="contact">Contact</Link>
            </div>

            <div className="nav-actions">
              <Link to="login" className="nav-btn outline">Get Started</Link>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
};

export default MyNavbar;