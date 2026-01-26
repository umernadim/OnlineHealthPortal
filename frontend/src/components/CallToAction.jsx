import React from 'react'
import doctorImg3 from "../assets/images/img3.png";
import { Link } from 'react-router';

const CallToAction = () => {
  return (
    <>
      {/* code for CTA section  */}
      <section id="cta-section">
        <div className="cta-container">
          <div className="cta-content">
            <span className="cta-tag">CONTACT US</span>

            <h2>
              Your Health, <br />
              Your Priority

            </h2>

            <div className="cta-line"></div>

            <p>
              Take the first step towards better healthcare today.
              Book your doctor online in seconds — fast, secure, and hassle-free.
            </p>



            <Link to="/login" className="cta-btn">
              <span className="icon"><i className="ri-phone-fill"></i></span>
              MAKE APPOINTMENT
            </Link>
          </div>

          <div className="cta-image">
            <img src={doctorImg3} alt="Doctor" />
          </div>
        </div>
      </section>
    </>
  )
}

export default CallToAction