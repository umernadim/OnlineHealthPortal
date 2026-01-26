import React, { useState } from "react";
import CallToAction from "../components/CallToAction";

const faqs = [
  {
    question: "Q: How do I book a video consultation?",
    answer:
      "Simply choose your preferred doctor from our portal, select a suitable time slot, and confirm your booking. You will receive a secure link to join the video consultation.",
  },
  {
    question: "Q: Can I consult with any doctor?",
    answer:
      "Yes, our healthcare portal allows you to book appointments with a wide range of qualified doctors across different specialties.",
  },
  {
    question: "Q: Is my video consultation secure?",
    answer:
      "Absolutely. All consultations are conducted through encrypted channels to ensure your privacy and data security.",
    green: true,
  },
];
const About = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFAQ = (index) => {
    setActiveIndex(index);
  };

  return (
    <>
      {/* code for About section  */}
      <section id="about-section">
        <div className="about-container">
          <div className="about-text">
            <span className="about-top">ABOUT US</span>
            <h2>We Provide<br /> Trusted Healthcare Services</h2>
            <div className="about-line"></div>
            <p>
              Our Online Health Portal is built to make healthcare simple, secure, and accessible.
              From booking doctor appointments to receiving expert physiotherapy care,
              we ensure every patient gets personalized attention and reliable support.
              Your health, our priority.
            </p>

            <div className="about-features">
              <div className="feature">
                <h4>Vision</h4>
                <p>
                  To create a modern, patient-centered healthcare platform that connects people
                  with trusted doctors and physiotherapists, ensuring convenience, transparency,
                  and quality care for everyone.
                </p>
              </div>

              <div className="feature">
                <h4>Mission</h4>
                <p>
                  To simplify healthcare through technology — offering easy appointment booking,
                  secure access to medical services, and personalized treatment plans that
                  empower patients to take control of their health journey.
                </p>
              </div>
            </div>
          </div>

          <div className="about-images">
            <img
              src="https://i.pinimg.com/736x/b4/a7/60/b4a76087b40e0319221a393ec28fabc6.jpg"
              alt=""
            />
            <img
              src="https://i.pinimg.com/736x/27/4b/db/274bdbe0ffd8db7bd401db82ba05b356.jpg"
              alt=""
            />
            <img
              src="https://i.pinimg.com/736x/67/2b/9a/672b9a970e0c93c427e6cfc96a0a950f.jpg"
              alt=""
            />
          </div>
        </div>
      </section>

      {/* code for FAQ section  */}
      <section id="faq-section" className="faq-section">
        <div className="faq-container">
          <div className="faq-image">
            <img
              src="https://i.pinimg.com/736x/d6/46/44/d646446af48780429aa33ec74d38d0e0.jpg"
              alt="FAQ Illustration"
            />
          </div>

          <div className="faq-content">
            <span className="faq-tag">FAQS</span>
            <h2>
              Frequently Asked <br /> Question
            </h2>
            <div className="faq-line"></div>

            <p className="faq-desc">
              Have questions about how our Online Health Portal works?
              We’ve got the answers. From booking appointments to connecting with trusted doctors,
              our FAQ section is here to guide you every step of the way.

            </p>

            {/* FAQ Items */}
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`faq-item ${activeIndex === index ? "active" : ""}`}
              >
                <div
                  className={`faq-question ${faq.green ? "green" : ""}`}
                  onClick={() => toggleFAQ(index)}
                >
                  <span>{faq.question}</span>
                  <span className="icon">
                    {activeIndex === index ? "⌃" : "⌄"}
                  </span>
                </div>
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* code for CTA section  */}
      <CallToAction></CallToAction>

    </>
  );
};

export default About;