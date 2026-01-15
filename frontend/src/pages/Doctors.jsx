import React from 'react'

const Doctors = () => {
    return (
        <>
            <section id="doctors-page">
                <div className="doctors-header">
                    <span className="section-tag">OUR TEAM</span>
                    <h2>Meet Our Expert Doctors</h2>
                    <div className="line"></div>
                    <p>
                        Our experienced physiotherapists and specialists are dedicated to
                        helping you move better, feel stronger, and live pain-free.
                    </p>
                    <div className="search-wrapper">
                        <input
                            type="text"
                            placeholder="Search doctor by name or speciality..."
                        />
                        <button type="submit"><i className="ri-search-line"></i></button>
                    </div>
                </div>

                <div className="doctors-grid">
                    <div className="doctor-card">
                        <div className="doctor-image">
                            <img
                                src="https://i.pinimg.com/736x/f1/63/8a/f1638a3b734fa2c73a05cc1893f5796e.jpg"
                                alt="Doctor"
                            />
                        </div>
                        <h3>Dr. Yael Amari</h3>
                        <span>APA Physiotherapist</span>
                        <p>
                            Specialized in musculoskeletal rehabilitation with over 10 years
                            of experience.
                        </p>
                        <div className="btn-container">
                            <a to="#" className="btn btn-fill">View Profile</a>
                            <a to="#" className="btn outline">Book Appointment</a>
                        </div>
                    </div>

                    <div className="doctor-card">
                        <div className="doctor-image">
                            <img
                                src="https://i.pinimg.com/736x/40/9f/b1/409fb1eecf38d68d9a8aace27b2497ba.jpg"
                                alt="Doctor"
                            />
                        </div>
                        <h3>Dr. Kyrie Petrakis</h3>
                        <span>Chiropractor</span>
                        <p>Expert in spinal alignment and posture correction treatments.</p>
                        <div className="btn-container">
                            <a to="#" className="btn btn-fill">View Profile</a>
                            <a to="#" className="btn outline">Book Appointment</a>
                        </div>
                    </div>

                    <div className="doctor-card">
                        <div className="doctor-image">
                            <img
                                src="https://i.pinimg.com/736x/c6/81/5e/c6815efc00543194bb52e808a4c6ea7b.jpg"
                                alt="Doctor"
                            />
                        </div>
                        <h3>Dr. Olivia Wilson</h3>
                        <span>Physical Therapist</span>
                        <p>
                            Focused on recovery, mobility improvement, and injury prevention.
                        </p>
                        <div className="btn-container">
                            <a to="#" className="btn btn-fill">View Profile</a>
                            <a to="#" className="btn outline">Book Appointment</a>
                        </div>
                    </div>
                </div>
            </section>

        </>
    )
}

export default Doctors