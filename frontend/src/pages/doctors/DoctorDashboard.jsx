import DoctorHeader from "./components/DoctorHeader";
import Sidebar from "./components/Sidebar";
import { useEffect, useState } from "react";
import api from "../../service/axios";
import { useAuth } from "../../context/AuthContext";

export default function DoctorDashboard() {

  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ===============================
  // LOAD DOCTOR APPOINTMENTS
  // ===============================
  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const res = await api.get("/Appointment/doctor");
      setAppointments(res.data);
    } catch (error) {
      console.error("Error loading appointments:", error);
    }
  };

  // ===============================
  // UPDATE STATUS
  // ===============================
  const updateStatus = async (id, status) => {
    try {
      await api.put(`/Appointment/${id}/status`, status, {
        headers: { "Content-Type": "application/json" }
      });
      loadAppointments();
    } catch (err) {
      console.error(err);
    }
  };

  // ===============================
  // DERIVED DATA
  // ===============================
  const todayAppointments = appointments.filter(
    a => new Date(a.appointmentDate).toDateString() === new Date().toDateString()
  );

  const pendingAppointments = appointments.filter(
    a => a.status === "Pending"
  );

  return (
    <div className="doctor-layout">

      {/* SIDEBAR */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* MAIN */}
      <main className="doctor-content">

        {/* HEADER */}
        <DoctorHeader
          title={`Hey, Dr. ${user?.name || user?.FullName || "Doctor"}`}
          subtitle="Here’s your schedule overview for today"
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* QUICK STATS */}
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Patients Today</h3>
            <span>{todayAppointments.length}</span>
          </div>

          <div className="stat-card">
            <h3>Pending Requests</h3>
            <span>{pendingAppointments.length}</span>
          </div>

          <div className="stat-card">
            <h3>Total Appointments</h3>
            <span>{appointments.length}</span>
          </div>

          <div className="stat-card">
            <h3>Earnings</h3>
            <span>$0</span>
          </div>
        </div>

        {/* DASHBOARD GRID */}
        <div className="dashboard-grid">

          {/* TODAY SCHEDULE */}
          <div className="dashboard-card">
            <h3>Today's Schedule</h3>

            {todayAppointments.length === 0 && (
              <p>No appointments today</p>
            )}

            <ul className="schedule-list">
              {todayAppointments.map(a => (
                <li key={a.id}>
                  <span>
                    {new Date(a.appointmentDate).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </span>

                  <p>{a.patientName}</p>

                  <small className={`status ${a.status.toLowerCase()}`}>
                    {a.status}
                  </small>
                </li>
              ))}
            </ul>
          </div>

          {/* PENDING ACTIONS */}
          <div className="dashboard-card">
            <h3>Pending Actions</h3>

            {pendingAppointments.length === 0 && (
              <p>No pending requests</p>
            )}

            {pendingAppointments.map(a => (
              <div className="action-item" key={a.id}>
                <p>
                  {a.patientName} —{" "}
                  {new Date(a.appointmentDate).toLocaleDateString()}{" "}
                  {new Date(a.appointmentDate).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </p>

                <div className="action-buttons">
                  <button
                    onClick={() => updateStatus(a.id, "Confirmed")}
                    className="primary-btn"
                  >
                    Accept
                  </button>

                  <button
                    onClick={() => updateStatus(a.id, "Rejected")}
                    className="secondary-btn"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* UPCOMING APPOINTMENTS */}
        <div className="dashboard-card">
          <h3>All Appointments</h3>

          <table>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Date</th>
                <th>Time</th>
                <th>Type</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {appointments.map(a => (
                <tr key={a.id}>
                  <td>{a.patientName}</td>
                  <td>{new Date(a.appointmentDate).toLocaleDateString()}</td>
                  <td>
                    {new Date(a.appointmentDate).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </td>
                  <td>{a.type}</td>
                  <td className={`status ${a.status.toLowerCase()}`}>
                    {a.status}
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
