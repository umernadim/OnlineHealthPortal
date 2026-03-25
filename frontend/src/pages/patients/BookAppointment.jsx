import SidebarPat from "./components/SidebarPat";
import api from "../../service/axios";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PatientHeader from "./components/PatientHeader";

export default function BookAppointment() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { doctorId } = useParams();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    doctorId,
    date: "",
    time: "",
    type: "Video Consultation",
  });

  useEffect(() => {
    loadDoctor();
  }, [doctorId]);

  const loadDoctor = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/Doctor/${doctorId}`);
      setDoctor(res.data);
    } catch {
      navigate("/doctors");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.date || !form.time) {
      alert("Please select date and time");
      return;
    }

    try {
      const appointmentDate = `${form.date}T${form.time}:00.000Z`;

      await api.post("/Appointment", {
        doctorId: parseInt(doctorId),
        appointmentDate,
        type: form.type,
      });

      alert("✅ Appointment booked successfully!");
      navigate("/myAppointments");
    } catch (err) {
      alert(err.response?.data?.message || "Booking failed");
    }
  };

  if (loading) return <div className="loading">Loading doctor...</div>;
  if (!doctor) return <div className="no-results">Doctor not found</div>;

  return (
    <div className="patient-layout">
      <SidebarPat sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main className="patient-content book-appointment">
        <PatientHeader
          title="Book Appointment"
          subtitle={`with Dr. ${doctor.fullName}`}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* Doctor Card */}
        <div className="doctor-card">
          <img
            src={
              doctor.photo ||
              "https://i.pinimg.com/736x/f1/63/8a/f1638a3b734fa2c73a05cc1893f5796e.jpg"
            }
            alt={doctor.fullName}
          />

          <div className="doctor-info">
            <h3>Dr. {doctor.fullName}</h3>
            <p>
              {doctor.speciality} • {doctor.experienceYears} years experience
            </p>

            <div className="doctor-meta">
              <span className="pill rating">
                ★ {doctor.rating?.toFixed(1) || 0}
              </span>
              <span className="pill fee">
                PKR {doctor.consultationFee || 1000}
              </span>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <form onSubmit={handleSubmit}>
          <div className="record-card">
            <h3>Select Date & Time</h3>
            <div className="datetime-grid">
              <input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={form.date}
                onChange={(e) =>
                  setForm({ ...form, date: e.target.value })
                }
              />
              <input
                type="time"
                value={form.time}
                onChange={(e) =>
                  setForm({ ...form, time: e.target.value })
                }
              />
            </div>
          </div>

          <div className="record-card">
            <h3>Appointment Type</h3>
            <select
              value={form.type}
              onChange={(e) =>
                setForm({ ...form, type: e.target.value })
              }
            >
              <option>Video Consultation</option>
              <option>In-Clinic Visit</option>
              <option>Chat Consultation</option>
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
