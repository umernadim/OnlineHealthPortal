import React, { useState } from 'react';

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
              <a href="/">Home</a>
              <a href="/about">About</a>
              <a href="/doctors">Doctor</a>
              <a href="/#services-section">Services</a>
              <a href="/contact">Contact</a>
            </div>

            <div className="nav-actions">
              <a href="#" className="nav-btn outline">Login</a>
              <a href="#" className="nav-btn filled">Appointment</a>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
};

export default MyNavbar;