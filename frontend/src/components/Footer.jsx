import React from 'react'
import { Link } from 'react-router'

const Footer = () => {
    return (
        <>
            <footer className="footer">
                <div className="footer-container">
                    <div className="footer-brand">
                        <div className="logo">
                            <span className="icon"><i className="ri-service-fill"></i></span>
                            <h3>HealthCare</h3>
                        </div>

                        <div className="divider"></div>

                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit
                            tellus, luctus nec ullamcorper mattis, pulvinar dapibu
                        </p>

                        <div className="socials">
                            <Link to="https://www.facebook.com/"
                            ><i className="ri-facebook-fill"></i></Link>
                            <Link to="https://www.instagram.com/"
                            ><i className="ri-instagram-fill"></i></Link>
                            <Link to="https://www.twitter.com/"
                            ><i className="ri-twitter-fill"></i></Link>
                            <Link to="https://www.youtube.com/"
                            ><i className="ri-youtube-fill"></i></Link>
                        </div>
                    </div>

                    <div className="footer-links">
                        <h4>Quick Links</h4>
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/about">About</Link></li>
                            <li><Link to="/doctors">Doctors</Link></li>
                            <li><Link to="/contact">Contact us</Link></li>
                        </ul>
                    </div>

                    <div className="footer-links">
                        <h4>Support</h4>
                        <ul>
                            <li><Link to="#">Privacy Policy</Link></li>
                            <li><Link to="#">Terms & Conditions</Link></li>
                            <li><Link to="#">Disclaimer</Link></li>
                            <li><Link to="/about#faq-section">Faq</Link></li>
                        </ul>
                    </div>

                    <div className="footer-contact">
                        <h4>Contact Info</h4>
                        <ul>
                            <li>
                                <span><i className="ri-phone-fill"></i></span> 123-456-7890
                            </li>
                            <li>
                                <span><i className="ri-map-pin-fill"></i></span> 123 Anywhere St.,
                                Any City
                            </li>
                        </ul>
                    </div>
                </div>
            </footer>
        </>
    )
}

export default Footer