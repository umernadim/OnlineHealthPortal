import SidebarPat from "./components/SidebarPat";

export default function MyAppointments() {
  return (
    <div className="patient-layout">

      {/* SIDEBAR */}
        <SidebarPat></SidebarPat>
      {/* MAIN */}
      <main className="patient-content">

        {/* HEADER */}
        <div className="page-header">
          <h1>My Appointments</h1>
          <p>Manage your upcoming & past consultations</p>
        </div>

        {/* UPCOMING */}
        <div className="record-card">
          <h3>Upcoming Appointments</h3>

          <div className="appointment-row">
            <div>
              <strong>10 Jan • 11:00 AM</strong>
              <p>Dr. Ahmed Khan</p>
              <span className="badge confirmed">Confirmed</span>
            </div>

            <div className="actions">
              <button className="primary-btn small">Join Video</button>
              <button className="btn-outline">Reschedule</button>
              <button className="btn-danger">Cancel</button>
            </div>
          </div>

          <div className="appointment-row">
            <div>
              <strong>12 Jan • 02:00 PM</strong>
              <p>Dr. Fatima Noor</p>
              <span className="badge pending">Pending</span>
            </div>

            <div className="actions">
              <button className="btn-outline">Reschedule</button>
              <button className="btn-danger">Cancel</button>
            </div>
          </div>
        </div>

        {/* PAST */}
        <div className="record-card">
          <h3>Past Appointments</h3>

          <div className="appointment-row past">
            <div>
              <strong>05 Jan • 10:00 AM</strong>
              <p>Dr. Ali Raza</p>
              <span className="badge completed">Completed ✓</span>
            </div>

            <div className="actions">
              <button className="btn-outline">View Prescription</button>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
