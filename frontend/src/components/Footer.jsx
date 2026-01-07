import React from 'react'

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
                            <a href="https://www.facebook.com/"
                            ><i className="ri-facebook-fill"></i></a>
                            <a href="https://www.instagram.com/"
                            ><i className="ri-instagram-fill"></i></a>
                            <a href="https://www.twitter.com/"
                            ><i className="ri-twitter-fill"></i></a>
                            <a href="https://www.youtube.com/"
                            ><i className="ri-youtube-fill"></i></a>
                        </div>
                    </div>

                    <div className="footer-links">
                        <h4>Quick Links</h4>
                        <ul>
                            <li><a href="/">Home</a></li>
                            <li><a href="/about">About</a></li>
                            <li><a href="/doctors">Doctors</a></li>
                            <li><a href="/contact">Contact us</a></li>
                        </ul>
                    </div>

                    <div className="footer-links">
                        <h4>Support</h4>
                        <ul>
                            <li><a href="#">Privacy Policy</a></li>
                            <li><a href="#">Terms & Conditions</a></li>
                            <li><a href="#">Disclaimer</a></li>
                            <li><a href="/about#faq-section">Faq</a></li>
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