import React, { useState, useEffect } from "react";

const testimonials = [
  {
    text: "As someone who was skeptical about chiropractic care, I was pleasantly surprised by the results I experienced.",
    name: "Drew Feig",
    role: "Patient",
    img: "https://i.pravatar.cc/80?img=1",
  },
  {
    text: "The staff is incredibly professional and caring. I felt relief after just a few sessions.",
    name: "Sarah Khan",
    role: "Client",
    img: "https://i.pravatar.cc/80?img=2",
  },
  {
    text: "Highly recommend their services. The environment is calm and very welcoming.",
    name: "Michael Lee",
    role: "Customer",
    img: "https://i.pravatar.cc/80?img=3",
  },
];

const Testimonial = () => {
  const [index, setIndex] = useState(0);

  // Auto change testimonial every 4s
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 4000);

    return () => clearInterval(interval); // cleanup
  }, []);

  return (
    <section id="ts-section">
      <div className="overlay"></div>

      <div className="container">
        {/* LEFT CONTENT */}
        <div className="left">
          <span className="tag">TESTIMONIAL</span>
          <h2>
            What Our <br />
            Patients Say <br />
            About Us
          </h2>
          <div className="line"></div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="right">
          <div className="testimonial-card">
            <p>{testimonials[index].text}</p>

            <div className="user">
              <img src={testimonials[index].img} alt={testimonials[index].name} />
              <div>
                <h4>{testimonials[index].name}</h4>
                <span>{testimonials[index].role}</span>
              </div>
            </div>
          </div>

          {/* Dots */}
          <div className="dots">
            {testimonials.map((_, i) => (
              <span
                key={i}
                className={`dot ${i === index ? "active" : ""}`}
                onClick={() => setIndex(i)} // allow manual click
              ></span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;