import React from 'react'
import { Link } from 'react-router'

const Contact = () => {
    return (
        <>
            {/* code for contact section  */}
            <section id="contact-section">
                <div className="contact-container">
                    <div className="contact-info">
                        <span className="section-tag">ABOUT US</span>
                        <h2>Get In Touch With Us</h2>
                        <div className="line"></div>

                        <div className="info-grid">
                            <div className="info-block">
                                <h4>Our Contact</h4>
                                <p>123-456-7890</p>
                                <p>+123-456-7890</p>
                            </div>

                            <div className="info-block">
                                <h4>Address</h4>
                                <p>123 Anywhere St., Any City</p>
                                <p>Lorem State</p>
                            </div>
                        </div>

                        <div className="social-icons">
                            <Link to="https://www.facebook.com/"
                            ><i className="ri-facebook-fill"></i></Link>
                            <Link to="https://www.instagram.com/"
                            ><i className="ri-instagram-line"></i></Link>
                            <Link to="https://www.twitter.com/"
                            ><i className="ri-twitter-line"></i></Link>
                            <Link to="https://www.youtube.com/"
                            ><i className="ri-youtube-line"></i></Link>
                        </div>
                    </div>

                    <div className="map-box">
                        <iframe
                            src="https://www.google.com/maps?q=London%20Eye&output=embed"
                            loading="lazy"
                        >
                        </iframe>
                    </div>
                </div>
            </section>

            {/* code for Contact Form  */}
            <section className="ct-form-section">
                <div className="form-wrapper">
                    <span className="section-tag">CONTACT US</span>
                    <h2>Make an Appointment</h2>
                    <div className="line"></div>

                    <form className="contact-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label>Enter your Name</label>
                                <input type="text" placeholder="Your name here" />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Email Address *</label>
                            <input type="email" placeholder="Add email" />
                        </div>

                        <div className="form-group">
                            <label>Comments / Questions *</label>
                            <textarea placeholder="Comments"></textarea>
                        </div>

                        <button type="submit" className="submit-btn">SEND MESSAGE</button>
                    </form>
                </div>
            </section> 
        </>
    )
}

export default Contact