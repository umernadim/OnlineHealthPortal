import React from 'react'
import doctorImg3 from "../assets/images/img3.png";

const CallToAction = () => {
  return (
    <>
    {/* code for CTA section  */}
      <section id="cta-section">
        <div className="cta-container">
          <div className="cta-content">
            <span className="cta-tag">CONTACT US</span>

            <h2>
              Unlock Your Body’s<br />
              Potential, Embrace<br />
              Pain-Free Living
            </h2>

            <div className="cta-line"></div>

            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor anakam incididunt ut labore et dolore magna aliqua.
              Ut enim ad minim veniam.
            </p>

            <a href="#" className="cta-btn">
              <span className="icon"><i className="ri-phone-fill"></i></span>
              MAKE APPOINTMENT
            </a>
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