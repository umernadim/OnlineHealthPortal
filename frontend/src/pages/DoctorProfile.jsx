import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../service/axios";

const DoctorProfile = () => {
    const { id } = useParams();
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const loadDoctor = async () => {
            try {
                const res = await api.get(`/Doctor/${id}`);
                setDoctor(res.data);
            } catch (error) {
                console.error("Doctor profile error:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) loadDoctor();
    }, [id]);

    if (loading) return <div className="loading">Loading doctor profile...</div>;
    if (!doctor) return <div>Doctor not found</div>;

    // ✅ image handling (important)
    const imageUrl = doctor.photo?.startsWith("http")
        ? doctor.photo
        : `https://localhost:7058/${doctor.photo}`;

    return (
        <section id="doctor-profile">
            <div className="profile-card">
                <div className="profile-image">
                    <img
                        src={imageUrl}
                        alt={doctor.fullName}
                        onError={(e) => (e.target.src = "/doctor-placeholder.png")}
                    />
                </div>

                <div className="profile-info">
                    <span className="section-tag">OUR DOCTOR</span>

                    <h1>Dr. {doctor.fullName}</h1>

                    <p className="specialty">{doctor.speciality || "Specialist"}</p>

                    <div className="line"></div>

                    <p className="bio">
                        Experienced doctor specializing in{" "}
                        {doctor.speciality
                            ? doctor.speciality.toLowerCase()
                            : "medical care"}
                        .
                    </p>

                    <div className="stats">
                        <div>
                            <h3>{doctor.experienceYears || 0}+</h3>
                            <span>Years Experience</span>
                        </div>
                        <div>
                            <h3>{doctor.patientsTreated}+</h3>
                            <span>Patients Treated</span>
                        </div>

                        <div>
                            <h3>{doctor.rating || "4"}</h3>
                            <span>Rating</span>
                        </div>
                    </div>

                    <button
                        className="btn-primary"
                        onClick={() => navigate(`/bookAppointment/${doctor.id}`)}
                    >
                        Make Appointment
                    </button>
                </div>
            </div>

            <div className="profile-details">
                <div className="details-card">
                    <h3>About</h3>
                    <ul>
                        <li>
                            <strong>Consultation Fee:</strong> PKR {doctor.consultationFee}
                        </li>
                        <li>
                            <strong>Language:</strong> {doctor.language || "English"}
                        </li>
                        <li>
                            <strong>Availability:</strong>{" "}
                            {doctor.availability || "Mon - Fri"}
                        </li>
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default DoctorProfile;
