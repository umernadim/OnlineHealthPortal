import api from "../../service/axios";
import DoctorHeader from "./components/DoctorHeader";
import Sidebar from "./components/Sidebar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/* 🎨 THEME COLORS */
const theme = {
  primary: "#4f6f52",
  primaryDark: "#3f5f45",
  primaryLight: "#e8f1ec",
  success: "#6b9f71",
  warning: "#ffb74d",
  danger: "#e57373",
  gray: "#9e9e9e",
};

export default function AppointmentManagement() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const res = await api.get("/Appointment/doctor");
      setAppointments(res.data || []);
    } catch (error) {
      console.error("Error loading appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    await api.put(`/Appointment/${id}/status`, { status });
    loadAppointments();
  };

  const handleJoinVideo = (a) => {
    if (a.meetingLink && a.status === "Confirmed") {
      window.open(`/doctor/video/${a.meetingLink}`, "_blank");
    } else {
      alert("Video call available only for confirmed appointments");
    }
  };

// ✅ SHARE FUNCTION ADD
const shareOnWhatsApp = (appointment) => {
  const message = `🩺 Appointment Confirmed!\n\n` +
    
    `Date: ${new Date(appointment.appointmentDate).toLocaleDateString('en-GB')}\n` +
    `Time: ${new Date(appointment.appointmentDate).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}\n\n` +
    `Join Video Call: ${window.location.origin}/doctor/video/${appointment.meetingLink}\n\n` +
    `See you soon! 👋`;

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank');
};



  const handleBatchStatus = async (status) => {
    await Promise.all(
      selected.map((id) => api.put(`/Appointment/${id}/status`, { status }))
    );
    setSelected([]);
    loadAppointments();
  };

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const filteredAppointments = appointments.filter(
    (a) => statusFilter === "all" || a.status.toLowerCase() === statusFilter
  );

  if (loading) {
    return (
      <div className="doctor-layout">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="doctor-content">
          <DoctorHeader title="Loading..." />
          <div style={{ textAlign: "center", padding: 60 }}>
            Loading appointments...
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="doctor-layout">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main className="doctor-content">
        <DoctorHeader
          title="Appointments"
          subtitle={`${appointments.length} total | ${selected.length} selected`}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* ACTION BAR */}
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", marginBottom: 20 }}>
          {selected.length > 0 && (
            <div>
              <strong>{selected.length} selected</strong>
              <button
                style={btn(theme.primary)}
                onClick={() => handleBatchStatus("Confirmed")}
              >
                Accept
              </button>
              <button
                style={btn(theme.danger)}
                onClick={() => handleBatchStatus("Rejected")}
              >
                Reject
              </button>
            </div>
          )}

          <div style={{ display: "flex", gap: 10 }}>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={selectStyle}
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <button style={btn(theme.primaryDark)} onClick={loadAppointments}>
              Refresh
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="table-card">
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th />
                <th>Patient</th>
                <th>Date & Time</th>
                <th>Type</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredAppointments.map((a) => (
                <tr key={a.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selected.includes(a.id)}
                      onChange={() => toggleSelect(a.id)}
                    />
                  </td>

                  <td>
                    <strong>{a.patientName}</strong>
                    <div style={{ fontSize: 13, color: "#777" }}>
                      {a.patientPhone}
                    </div>
                  </td>

                  <td>
                    {new Date(a.appointmentDate).toLocaleDateString("en-GB")}
                    <div style={{ fontSize: 13, color: "#777" }}>
                      {new Date(a.appointmentDate).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </td>

                  <td>
                    <span style={pill(theme.primaryLight, theme.primaryDark)}>
                      {a.type}
                    </span>
                  </td>

                  <td>
                    <span style={pill(getStatusColor(a.status), "white")}>
                      {a.status}
                    </span>
                  </td>

                  <td style={{ whiteSpace: "nowrap" }}>
                    {a.status === "Confirmed" && a.meetingLink && (
                      <>
                        <button
                          style={btn(theme.primary)}
                          onClick={() => handleJoinVideo(a)}
                        >
                          Call
                        </button>
                        <button
                          style={btn(theme.success)}
                          onClick={() => shareOnWhatsApp(a)}
                        >
                          Share
                        </button>
                        <button
                          style={btn(theme.warning)}
                          onClick={() => updateStatus(a.id, "Completed")}
                        >
                          Complete
                        </button>
                      </>
                    )}

                    {a.status === "Pending" && (
                      <>
                        <button
                          style={btn(theme.primary)}
                          onClick={() => updateStatus(a.id, "Confirmed")}
                        >
                          Accept
                        </button>
                        <button
                          style={btn(theme.danger)}
                          onClick={() => updateStatus(a.id, "Rejected")}
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {a.status === "Completed" && !a.hasPrescription && (
                      <button
                        style={btn(theme.primaryDark)}
                        onClick={() => navigate(`/prescriptionWriter/${a.id}`)}
                      >
                        Prescription
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

/* 🔧 HELPERS */
const btn = (bg) => ({
  padding: "8px 14px",
  margin: "0 4px",
  background: bg,
  color: "white",
  border: "none",
  borderRadius: "20px",
  fontSize: 13,
  cursor: "pointer",
});

const pill = (bg, color) => ({
  padding: "6px 14px",
  background: bg,
  color,
  borderRadius: "20px",
  fontSize: 13,
  fontWeight: "600",
});

const selectStyle = {
  padding: "8px 12px",
  borderRadius: "20px",
  border: "1px solid #ccc",
};

/* STATUS COLORS */
function getStatusColor(status) {
  return {
    Pending: "#ffb74d",
    Confirmed: "#4f6f52",
    Completed: "#3f5f45",
    Rejected: "#e57373",
    Cancelled: "#9e9e9e",
  }[status];
}
