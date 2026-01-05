import React from 'react'
import bannerImg from "../assets/images/banner-img.jpg";
import doctorImg1 from "../assets/images/img1.png";
import doctorImg4 from "../assets/images/img4.png";
import doctorImg3 from "../assets/images/img3.png";
import Testimonial from '../components/Testimonial';
import CallToAction from './CallToAction';
import Footer from '../components/Footer';


const Home = () => {
  return (
    <>
      {/* Code for hero seciton   */}
      <section id="hero-banner">
        <div className="hero-container">
          <div className="hero-text">
            <span className="hero-top">WELCOME TO HealthCare</span>
            <h1>Destination<br />For Relief<br />& Wellness</h1>
            <div className="underline"></div>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit
              tellus, luctus nec ullamcorper.
            </p>
            <button className="hero-btn">
              <i className="ri-phone-fill"></i>
              MAKE APPOINTMENT
            </button>
          </div>

          <div className="hero-image">
            <img src={bannerImg} alt="Doctor" />
          </div>

          <div className="hero-stats">
            <div className="stat-card">
              <h2>48+</h2>
              <p>PROFESSIONAL STAFF</p>
            </div>
            <div className="stat-card">
              <h2>24</h2>
              <p>YEARS OF EXPERIENCE</p>
            </div>
            <div className="stat-card">
              <h2>3,578</h2>
              <p>SATISFIED CLIENTS</p>
            </div>
          </div>
        </div>
      </section>

      {/* code for about section */}
      <section id="abt-section">
        <div className="about-container">
          <div className="about-content">
            <span className="section-tag">ABOUT US</span>
            <h2>We Are The Best<br />Physiotheraphy in Town</h2>
            <div className="line"></div>

            <div className="features">
              <ul>
                <li>✔ Lorem ipsum dolor sit amet</li>
                <li>✔ Lorem ipsum dolor sit amet</li>
                <li>✔ Lorem ipsum dolor sit amet</li>
              </ul>
              <ul>
                <li>✔ Lorem ipsum dolor sit amet</li>
                <li>✔ Lorem ipsum dolor sit amet</li>
                <li>✔ Lorem ipsum dolor sit amet</li>
              </ul>
            </div>
          </div>

          <div className="about-images">
            <div className="image image-one">
              <img
                src="https://i.pinimg.com/736x/64/c8/89/64c8893222bef2fadd7ca6e2470145d7.jpg"
                alt="Physiotherapy spine"
              />
            </div>
            <div className="image image-two">
              <img
                src="https://i.pinimg.com/736x/ea/dd/24/eadd242c2b44da180373cc4989ca9f2e.jpg"
                alt="Physiotherapy treatment"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="services-section">
        <div className="s-overlay"></div>
        <div className="services-overlay">
          <span className="services-top">OUR SERVICES</span>
          <h2>We Provide The Best Services</h2>
          <div className="services-line"></div>
        </div>

        <div className="services-cards">
          <div className="service-card">
            <div className="icon"><i className="ri-stethoscope-fill"></i></div>
            <h3>Online Consultation</h3>
            <p>
              Instant video, audio, or chat with doctors for quick, secure, and
              convenient healthcare access anytime, anywhere.
            </p>
            <button>LEARN MORE</button>
          </div>

          <div className="service-card">
            <div className="icon"><i className="ri-alarm-fill"></i></div>
            <h3>Appointment Booking</h3>
            <p>
              Book, reschedule, and receive reminders effortlessly, ensuring
              organized, stress‑free scheduling with trusted doctors.
            </p>
            <button>LEARN MORE</button>
          </div>

          <div className="service-card">
            <div className="icon"><i className="ri-article-fill"></i></div>
            <h3>Digital Health Records</h3>
            <p>
              Securely store prescriptions, reports, and history in one place,
              accessible anytime, ensuring privacy and continuity of care.
            </p>
            <button>LEARN MORE</button>
          </div>
        </div>
      </section>


      {/* code for Why-choose section  */}
      <section id="why-choose">
        <div className="wc-container">
          <div className="wc-image">
            <img
              src="https://i.pinimg.com/736x/50/01/6a/50016a8c9ef67cd3dbf61f9097cbf942.jpg"
              alt="Doctor"
            />
          </div>

          <div className="wc-content">
            <span className="wc-tag">WHY CHOOSE US</span>

            <h2>
              Individually Tailored Treatment:<br />
              Your Path to Wellness
            </h2>

            <div className="wc-line"></div>

            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam.
            </p>

            <div className="progress-item">
              <div className="label">
                <span>Professional Team</span>
                <span className="percent">87%</span>
              </div>
              <div className="progress">
                <div className="bar" style={{ width: "87%" }}></div>
              </div>
            </div>

            <div className="progress-item">
              <div className="label">
                <span>Comprehensive Services</span>
                <span className="percent">90%</span>
              </div>
              <div className="progress">
                <div className="bar" style={{ width: "90%" }}></div>
              </div>
            </div>

            <div className="progress-item">
              <div className="label">
                <span>Affordable Package</span>
                <span className="percent">88%</span>
              </div>
              <div className="progress">
                <div className="bar" style={{ width: "88%" }}></div>
              </div>
            </div>

            <div className="progress-item">
              <div className="label">
                <span>Satisfied Client</span>
                <span className="percent">95%</span>
              </div>
              <div className="progress">
                <div className="bar" style={{ width: "95%" }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Code for Doctor's Section  */}
      <section id="team-section">
        <div className="team-container">
          <span className="team-tag">OUR TEAM</span>
          <h2>Meet Our Specialist</h2>
          <div className="team-line"></div>

          <div className="team-grid">
            <div className="team-card">
              <div className="image-wrap">
                <img src={doctorImg1} alt="Doctor's Image" />
              </div>
              <span className="role">APA Physiotherapist</span>
              <h4>Yael Amari</h4>
            </div>

            <div className="team-card">
              <div className="image-wrap">
                <img src={doctorImg4} alt="Doctor's image" />
              </div>
              <span className="role">Chiropractor</span>
              <h4>Kyrie Petrakis</h4>
            </div>

            <div className="team-card">
              <div className="image-wrap">
                <img src={doctorImg3} alt="Doctor's Image" />
              </div>
              <span className="role">Physical Therapist</span>
              <h4>Olivia Wilson</h4>
            </div>
          </div>
        </div>
      </section>

        {/* Code for Testimonial Section  */}
        <Testimonial></Testimonial>
        {/* Code for CTA Section  */}
        <CallToAction></CallToAction>
        {/* Code for FOoter Section  */}
        <Footer></Footer>
         </>
  )
}

export default Home