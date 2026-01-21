import { useEffect, useState } from "react";
import SidebarPat from "./components/SidebarPat";
import api from "../../service/axios";
import { useAuth } from "../../context/AuthContext";

export default function PatientDashboard() {
  const { user } = useAuth(); // Logged-in patient
  const [appointments, setAppointments] = useState([]);

  // Load patient appointments
  useEffect(() => {
    loadAppointments();
  }, []);

const loadAppointments = async () => {
  try {
    const res = await api.get("/Appointment/patient");
    setAppointments(res.data || []);
  } catch (err) {
    console.error("Error loading appointments", err);
    setAppointments([]);
  }
};


  // Calculate stats
  const today = new Date();
  const upcomingAppointments = appointments.filter(
    (a) => new Date(a.appointmentDate) >= today && a.status !== "Cancelled"
  );
  const completedAppointments = appointments.filter(
    (a) => a.status === "Completed"
  );

  // Next appointment
  const nextAppointment = upcomingAppointments.sort(
    (a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate)
  )[0];

  return (
    <div className="patient-layout">

      {/* SIDEBAR */}
      <SidebarPat />

      {/* MAIN */}
      <main className="patient-content">

        {/* HEADER */}
        <div className="page-header">
          <h1>Hey! {user?.name || "Patient"}</h1>
          <p>Your health overview & upcoming care</p>
        </div>

        {/* STATS */}
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Upcoming Appointments</h3>
            <p className="stat-number">{upcomingAppointments.length}</p>
          </div>

          <div className="stat-card">
            <h3>Completed Appointments</h3>
            <p className="stat-number">{completedAppointments.length}</p>
          </div>
        </div>

        {/* NEXT APPOINTMENT */}
        <div className="record-card">
          <h3>Next Appointment</h3>
          {nextAppointment ? (
            <div className="appointment-card">
              <div>
                <strong>Dr. {nextAppointment.doctorName || "Doctor"}</strong>
                <p>
                  {nextAppointment.speciality || "—"} •{" "}
                  {new Date(nextAppointment.appointmentDate).toLocaleString()}
                </p>
              </div>
            </div>
          ) : (
            <p>No upcoming appointments</p>
          )}
        </div>

      </main>
    </div>
  );
}
