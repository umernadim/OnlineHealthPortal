import SidebarPat from "./components/SidebarPat";

export default function PatientDashboard() {
  return (
    <div className="patient-layout">

      {/* SIDEBAR */}
     <SidebarPat></SidebarPat>

      {/* MAIN */}
      <main className="patient-content">

        {/* HEADER */}
        <div className="page-header">
          <h1>Welcome Back 👋</h1>
          <p>Your health overview & upcoming care</p>
        </div>

        {/* STATS */}
        <div className="stats-grid">

          <div className="stat-card">
            <h3>Upcoming Appointments</h3>
            <p className="stat-number">2</p>
          </div>

          <div className="stat-card warning">
            <h3>Pending Reminders</h3>
            <p className="stat-number">1</p>
          </div>

        </div>

        {/* QUICK ACTIONS */}
        <div className="record-card">
          <h3>Quick Actions</h3>

          <div className="actions-grid">
            <button className="primary-btn">
              Book Doctor
            </button>

            <button className="primary-btn outline">
              My Records
            </button>

            <button className="primary-btn outline">
              Messages
            </button>
          </div>
        </div>

        {/* UPCOMING */}
        <div className="record-card">
          <h3>Next Appointment</h3>

          <div className="appointment-card">
            <div>
              <strong>Dr. Ahmed Khan</strong>
              <p>Cardiology • 18 Jan, 10:30 AM</p>
            </div>

            <button className="btn-outline">
              View Details
            </button>
          </div>
        </div>

      </main>
    </div>
  );
}
