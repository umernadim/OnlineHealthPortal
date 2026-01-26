import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../service/axios";
import { useAuth } from "../context/AuthContext";

const Doctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        loadDoctors();
    }, []);

    // ✅ NULL-SAFE SEARCH FILTER
    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredDoctors(doctors);
        } else {
            const filtered = doctors.filter(doctor => {
                const name = (doctor.fullName || "").toLowerCase();
                const specialty = (doctor.speciality || "").toLowerCase();
                const term = searchTerm.toLowerCase().trim();

                return name.includes(term) || specialty.includes(term);
            });
            setFilteredDoctors(filtered);
        }
    }, [searchTerm, doctors]);

    const loadDoctors = async () => {
        try {
            const res = await api.get("/Doctor");

            const doctorsArray = res.data.doctors || res.data || [];
            setDoctors(doctorsArray);
            setFilteredDoctors(doctorsArray);

        } catch (error) {
            console.error("❌ Error:", error);
            setDoctors([]);
            setFilteredDoctors([]);
        }
    };

    const clearSearch = () => {
        setSearchTerm("");
    };

    const handleBookNow = (doctorId) => {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        console.log("🔍 Token:", !!token);
        console.log("🔍 StoredUser:", storedUser);

        if (!token || !storedUser) {
            navigate(`/login?returnUrl=/bookAppointment/${doctorId}`);
            return;
        }

        const userData = JSON.parse(storedUser);
        console.log("🔍 Role from user object:", userData.role);

        if (userData.role?.toLowerCase() !== "patient") {
            alert("❌ Only patients can book appointments!");
            return;
        }

        navigate(`/bookAppointment/${doctorId}`);
    };


    return (
        <>
            <section id="doctors-page">
                <div className="doctors-header">
                    <span className="section-tag">OUR TEAM</span>
                    <h2>Meet Our Expert Doctors</h2>
                    <div className="line"></div>
                    <p>
                        Our experienced doctors are dedicated to helping you stay healthy and live better.
                    </p>

                    {/* ✅ SEARCH BAR */}
                    <div className="search-wrapper">
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search doctor by name or speciality..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
                            <button
                                type="button"
                                className="clear-btn"
                                onClick={clearSearch}
                            >
                                ✕
                            </button>
                        )}
                        <i className="ri-search-line search-icon"></i>
                    </div>

                    {/* ✅ SEARCH RESULTS */}
                    {searchTerm && (
                        <p className="search-results">
                            Found {filteredDoctors.length} of {doctors.length} doctors
                        </p>
                    )}
                </div>

                <div className="doctors-grid">
                    {filteredDoctors.length > 0 ? (
                        filteredDoctors.map(doctor => (
                            <div className="doctor-card" key={doctor.id}>
                                <div className="doctor-image">
                                    <img
                                        src={doctor.photo || "https://i.pinimg.com/736x/18/3b/59/183b590ac65cf71f947f33c9de8f7bc8.jpg"}
                                        alt={doctor.fullName || "Doctor"}
                                    />
                                </div>

                                <h3>Dr. {doctor.fullName || "Specialist"}</h3>

                                <p className="specialty">
                                    {doctor.speciality || "General Physician"} •
                                    {doctor.experienceYears || 0} years exp
                                </p>

                                <div className="">
                                    {doctor.bio}
                                </div>

                                <div className="btn-container">
                                    <button
                                        className="btn btn-fill"
                                        onClick={() => navigate(`/doctorProfile/${doctor.id}`)}
                                    >
                                        View Profile
                                    </button>

                                    <button
                                        className="btn outline"
                                        onClick={() => handleBookNow(doctor.id)}
                                    >
                                        Book Now
                                        <span className="fee">
                                            PKR {doctor.consultationFee || 1000}
                                        </span>
                                    </button>

                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-results">
                            <i className="ri-search-eye-line"></i>
                            <h3>No doctors found</h3>
                            <p>
                                {searchTerm
                                    ? `No doctors match "${searchTerm}". Try different keywords.`
                                    : "Loading doctors..."
                                }
                            </p>
                            {searchTerm && (
                                <button className="btn btn-fill" onClick={clearSearch}>
                                    Clear Search
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </section>
        </>
    );
};

export default Doctors;
