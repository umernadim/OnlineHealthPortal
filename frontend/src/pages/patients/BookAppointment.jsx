import SidebarPat from "./components/SidebarPat";

export default function BookAppointment() {
  return (
    <div className="patient-layout">

      {/* SIDEBAR */}
    <SidebarPat></SidebarPat>

      {/* MAIN */}
      <main className="patient-content">

        {/* HEADER */}
        <div className="page-header">
          <h1>Book Appointment</h1>
          <p>Choose doctor, date & consultation type</p>
        </div>

        {/* STEPS */}
        <div className="steps">
          <div className="step active">1. Doctor ✓</div>
          <div className="step active">2. Date & Time ✓</div>
          <div className="step">3. Confirm</div>
        </div>

        {/* DOCTOR */}
        <div className="record-card">
          <h3>Selected Doctor</h3>

          <div className="doctor-card">
            <div className="avatar">Dr</div>
            <div>
              <strong>Dr. Ahmed Khan</strong>
              <p>Cardiology Specialist</p>
            </div>
          </div>
        </div>

        {/* DATE & TIME */}
        <div className="record-card">
          <h3>Select Date & Time</h3>

          <div className="datetime-grid">
            <div className="form-group">
              <label>Date</label>
              <input type="date" />
            </div>

            <div className="form-group">
              <label>Time</label>
              <input type="time" />
            </div>
          </div>

          <p className="hint">
            Only available slots will be accepted automatically
          </p>
        </div>

        {/* APPOINTMENT TYPE */}
        <div className="record-card">
          <h3>Appointment Type</h3>

          <select className="dropdown">
            <option>Video Consultation</option>
            <option>In-Clinic Visit</option>
            <option>Chat Consultation</option>
          </select>
        </div>

        {/* CONFIRM */}
        <div className="confirm-box">
          <button className="primary-btn big">
            Confirm Booking
          </button>
        </div>

      </main>
    </div>
  );
}
