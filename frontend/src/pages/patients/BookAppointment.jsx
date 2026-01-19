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
    doctorId: "",
    date: "",
    time: "",
    type: "Video Consultation"
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("");

  // Load doctor info + check auth
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    setIsLoggedIn(!!token);
    setUserRole(role || "");

    // Load doctor details
    loadDoctor();
  }, [doctorId]);

  const loadDoctor = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/Doctor/${doctorId}`);
      setDoctor(res.data);
      setForm(prev => ({ ...prev, doctorId }));
    } catch (error) {
      console.error("Doctor not found:", error);
      navigate("/doctors");
    } finally {
      setLoading(false);
    }
  };

  // Auth check + redirect
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role")?.toLowerCase();

    if (!token) {
      // Not logged in → Redirect to login with return URL
      const returnUrl = `/bookAppointment/${doctorId}`;
      navigate(`/login?returnUrl=${encodeURIComponent(returnUrl)}`);
      return;
    }

    if (role !== "patient") {
      alert("Only patients can book appointments");
      navigate("/doctors");
    }
  }, [isLoggedIn, userRole, doctorId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ DEBUG TOKEN
    const token = localStorage.getItem('token');
    console.log('🔑 Token present:', !!token);
    console.log('👤 Role:', localStorage.getItem('role'));

    try {
      const appointmentDate = `${form.date}T${form.time}:00.000Z`;

      const response = await api.post("/Appointment", {
        doctorId: parseInt(form.doctorId),
        appointmentDate: appointmentDate,
        type: form.type
      });

      alert(`✅ Appointment booked! ID: ${response.data.appointmentId}`);
      navigate("/myAppointments");
    } catch (err) {
      console.error('❌ Full error:', err.response);
      alert(err.response?.data || "Booking failed");
    }
  };


  if (loading) {
    return <div className="loading">Loading doctor details...</div>;
  }

  if (!doctor) {
    return <div className="no-results">Doctor not found</div>;
  }

  return (
    <div className="patient-layout">
      <SidebarPat />
      <main className="patient-content">
        <div className="page-header">
          <h1>Book Appointment</h1>
          <p>with <strong>Dr. {doctor.fullName}</strong></p>
        </div>

        {/* ✅ DOCTOR INFO CARD */}
        <div className="doctor-preview">
          <div className="doctor-image">
            <img src={doctor.photo} alt={doctor.fullName} />
          </div>
          <div className="doctor-details">
            <h3>Dr. {doctor.fullName}</h3>
            <p>{doctor.speciality} • {doctor.experienceYears} years exp</p>
            <div className="rating">★ {doctor.rating?.toFixed(1)}</div>
            <div className="fee">PKR {doctor.consultationFee}/session</div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="record-card">
            <h3>Select Date & Time</h3>
            <div className="datetime-grid">
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                onChange={e => setForm({ ...form, date: e.target.value })}
                required
              />
              <input
                type="time"
                onChange={e => setForm({ ...form, time: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="record-card">
            <h3>Appointment Type</h3>
            <select
              className="dropdown"
              value={form.type}
              onChange={e => setForm({ ...form, type: e.target.value })}
              required
            >
              <option value="Video Consultation">Video Consultation</option>
              <option value="In-Clinic Visit">In-Clinic Visit</option>
              <option value="Chat Consultation">Chat Consultation</option>
            </select>
          </div>

          <div className="confirm-box">
            <button type="submit" className="primary-btn big">
              Confirm Booking - PKR {doctor.consultationFee}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
