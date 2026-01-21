import SidebarPat from "./components/SidebarPat";
import api from "../../service/axios";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function BookAppointment() {
    const navigate = useNavigate();
    const { doctorId } = useParams();

    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);

    const [form, setForm] = useState({
        doctorId: doctorId,
        date: "",
        time: "",
        type: "Video Consultation",
    });

    // ✅ LOAD DOCTOR (Backend already checks auth)
    useEffect(() => {
        loadDoctor();
    }, [doctorId]);

    const loadDoctor = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/Doctor/${doctorId}`);
            setDoctor(res.data);
        } catch (error) {
            console.error("Doctor not found", error);
            navigate("/doctors");
        } finally {
            setLoading(false);
        }
    };

    // ✅ BOOK APPOINTMENT
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.date || !form.time) {
            alert("Please select date and time");
            return;
        }

        try {
            const appointmentDate = `${form.date}T${form.time}:00.000Z`;

            const res = await api.post("/Appointment", {
                doctorId: parseInt(doctorId),
                appointmentDate,
                type: form.type,
            });

            alert("✅ Appointment booked successfully!");
            navigate("/myAppointments");
        } catch (err) {
            console.error("Booking error:", err.response);
            alert(err.response?.data?.message || "Booking failed. Please try again.");
        }
    };

    if (loading) return <div className="loading">Loading doctor...</div>;
    if (!doctor) return <div className="no-results">Doctor not found</div>;

    return (
        <div className="patient-layout">
            <SidebarPat />

            <main className="patient-content">
                <div className="page-header">
                    <h1>Book Appointment</h1>
                    <p>with <strong>Dr. {doctor.fullName}</strong></p>
                </div>

                {/* DOCTOR PREVIEW */}
                <div className="doctor-preview">
                    <div className="doctor-image">
                        <img
                            src={doctor.photo || "https://i.pinimg.com/736x/f1/63/8a/f1638a3b734fa2c73a05cc1893f5796e.jpg"}
                            alt={doctor.fullName}
                        />
                    </div>

                    <div className="doctor-details">
                        <h3>Dr. {doctor.fullName}</h3>
                        <p>{doctor.speciality} • {doctor.experienceYears} years experience</p>
                        <div className="rating">★ {doctor.rating?.toFixed(1) || 0}</div>
                        <div className="fee">PKR {doctor.consultationFee || 1000}</div>
                    </div>
                </div>

                {/* BOOKING FORM */}
                <form onSubmit={handleSubmit}>
                    <div className="record-card">
                        <h3>Select Date & Time</h3>
                        <div className="datetime-grid">
                            <input
                                type="date"
                                min={new Date().toISOString().split("T")[0]}
                                value={form.date}
                                onChange={(e) => setForm({ ...form, date: e.target.value })}
                                required
                            />
                            <input
                                type="time"
                                value={form.time}
                                onChange={(e) => setForm({ ...form, time: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="record-card">
                        <h3>Appointment Type</h3>
                        <select
                            className="dropdown"
                            value={form.type}
                            onChange={(e) => setForm({ ...form, type: e.target.value })}
                        >
                            <option value="Video Consultation">Video Consultation</option>
                            <option value="In-Clinic Visit">In-Clinic Visit</option>
                            <option value="Chat Consultation">Chat Consultation</option>
                        </select>
                    </div>

                    <div className="confirm-box">
                        <button type="submit" className="primary-btn big">
                            Confirm Booking – PKR {doctor.consultationFee}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}
