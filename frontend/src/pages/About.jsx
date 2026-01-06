import React, { useState } from "react";
import CallToAction from "../components/CallToAction";

const faqs = [
  {
    question: "Q: How many sessions will I need?",
    answer:
      "The number of sessions varies depending on your condition and treatment goals. During your initial consultation, our chiropractors will assess your needs and recommend a personalized treatment plan.",
  },
  {
    question: "Q: Is chiropractic care safe?",
    answer:
      "Yes, chiropractic care is widely considered safe when performed by licensed and trained professionals.",
  },
  {
    question: "Q: Will my insurance cover chiropractic care?",
    answer:
      "Coverage varies by provider. Please contact your insurance company to confirm chiropractic benefits.",
    green: true, // optional styling flag
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
            <h2>We Are The Best<br />Physiotheraphy in Town</h2>
            <div className="about-line"></div>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam,
            </p>

            <div className="about-features">
              <div className="feature">
                <h4>Vision</h4>
                <p>
                  Lorem ipsum dolor sit amet, anamka consectetur adipiscing elit
                  ala. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar
                  dapibus leo.
                </p>
              </div>

              <div className="feature">
                <h4>Mission</h4>
                <p>
                  Lorem ipsum dolor sit amet, anamka consectetur adipiscing elit
                  ala. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar
                  dapibus leo.
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
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
              ad minim veniam.
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