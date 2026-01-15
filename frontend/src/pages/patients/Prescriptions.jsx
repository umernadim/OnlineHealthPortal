import SidebarPat from "./components/SidebarPat";

export default function Prescriptions() {
  return (
    <div className="patient-layout">

      {/* SIDEBAR */}
     <SidebarPat></SidebarPat>

      {/* MAIN */}
      <main className="patient-content">

        {/* HEADER */}
        <div className="page-header">
          <h1>Prescriptions</h1>
          <p>Track your medicines & reminders</p>
        </div>

        {/* ACTIVE */}
        <div className="record-card">
          <h3>Active Prescriptions</h3>

          <div className="prescription-row">
            <div>
              <strong>Panadol 500mg</strong>
              <p>1 tablet × 3 daily</p>
              <p>Ends: <strong>12-Jan</strong></p>
            </div>

            <div className="actions">
              <button className="primary-btn small">Set Reminder</button>
              <span className="badge active">Active</span>
            </div>
          </div>

          <div className="prescription-row">
            <div>
              <strong>Metformin 500mg</strong>
              <p>After meals</p>
              <p>Ends: <strong>20-Jan</strong></p>
            </div>

            <div className="actions">
              <button className="primary-btn small">Set Reminder</button>
              <span className="badge active">Active</span>
            </div>
          </div>
        </div>

        {/* REMINDERS */}
        <div className="record-card">
          <h3>Medicine Reminders</h3>

          <div className="reminder-row">
            <p>⏰ Today 8:00 PM — <strong>Panadol</strong></p>
            <div className="actions">
              <button className="btn-outline">Taken</button>
              <button className="btn-danger">Skipped</button>
            </div>
          </div>

          <div className="reminder-options">
            <label>
              Reminder Frequency
              <select>
                <option>Daily</option>
                <option>Weekly</option>
              </select>
            </label>
          </div>
        </div>

        {/* PAST */}
        <div className="record-card">
          <h3>Past Prescriptions</h3>

          <div className="prescription-row past">
            <div>
              <strong>05-Jan</strong>
              <p>Amoxicillin</p>
            </div>

            <div className="actions">
              <button className="btn-outline">View PDF</button>
            </div>
          </div>
        </div>

        {/* PHARMACY */}
        <div className="record-card pharmacy-card">
          <h3>Nearby Pharmacies</h3>
          <p>Find pharmacies near your location</p>

          <div className="pharmacy-links">
            <a to="#">D-Watson Pharmacy</a>
            <a to="#">Servaid Pharmacy</a>
            <a to="#">Shaheen Chemist</a>
          </div>
        </div>

      </main>
    </div>
  );
}
