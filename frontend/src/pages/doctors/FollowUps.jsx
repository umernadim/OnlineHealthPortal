export default function FollowUps() {
  return (
    <div className="doctor-layout">

      {/* SIDEBAR */}
      <aside className="sidebar">
        <h2 className="logo">PhysioDoctor</h2>
        <ul className="sidebar-menu">
          <li>Dashboard</li>
          <li>Patients</li>
          <li>Appointments</li>
          <li className="active">Follow-ups</li>
          <li>Messages</li>
        </ul>
      </aside>

      {/* MAIN */}
      <main className="doctor-content">

        {/* HEADER */}
        <div className="page-header">
          <h1>Follow-ups & Reminders</h1>
          <p>Track patient follow-ups & send reminders</p>
        </div>

        {/* FOLLOW-UP LIST */}
        <div className="record-card">
          <h3>Scheduled Follow-ups</h3>

          <div className="followup-row">
            <div>
              <strong>Ahmed Khan</strong>
              <p>17 Jan • BP Check</p>
            </div>
            <div className="actions">
              <button className="btn-outline">Resend</button>
              <button className="btn-success">Complete</button>
            </div>
          </div>

          <div className="followup-row">
            <div>
              <strong>Sara Ahmed</strong>
              <p>20 Jan • Review</p>
            </div>
            <div className="actions">
              <button className="btn-outline">Edit Date</button>
            </div>
          </div>
        </div>

        {/* BULK ACTIONS */}
        <div className="record-card">
          <h3>Bulk Actions</h3>

          <div className="bulk-grid">
            <div className="bulk-card">
              <h4>Medicine Reminder</h4>
              <p>Send reminder to all active patients</p>
              <button className="primary-btn">Send Reminder</button>
            </div>

            <div className="bulk-card">
              <h4>Next Checkup</h4>
              <p>"Next checkup in 2 weeks"</p>
              <button className="primary-btn outline">Use Template</button>
            </div>
          </div>
        </div>

        {/* AUTO FOLLOWUPS */}
        <div className="record-card">
          <h3>Auto Follow-ups</h3>

          <div className="auto-tags">
            <span>7 Days</span>
            <span>14 Days</span>
            <span>30 Days</span>
          </div>

          <p className="muted">
            Follow-ups are automatically generated based on last visit.
          </p>
        </div>

        {/* DELIVERY STATUS */}
        <div className="record-card">
          <h3>Delivery Status (Mock)</h3>

          <ul className="status-list">
            <li>SMS Sent ✔</li>
            <li>Email Delivered ✔</li>
            <li>Read Pending ⏳</li>
          </ul>
        </div>

      </main>
    </div>
  );
}
