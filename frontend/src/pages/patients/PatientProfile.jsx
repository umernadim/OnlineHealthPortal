import SidebarPat from "./components/SidebarPat";

export default function PatientProfile() {
  return (
    <div className="patient-layout">

      {/* SIDEBAR */}
    <SidebarPat></SidebarPat>

      {/* MAIN */}
      <main className="patient-content">

        {/* HEADER */}
        <div className="page-header">
          <h1>My Profile</h1>
          <p>Manage your personal information & preferences</p>
        </div>

        {/* PERSONAL DETAILS */}
        <div className="record-card">
          <h3>Personal Details</h3>

          <div className="info-row">
            <span>Name</span>
            <strong>Ahmed Khan ✓</strong>
          </div>

          <div className="info-row">
            <span>Phone</span>
            <strong>+92-321-xxx-xxxx ✓</strong>
          </div>

          <div className="info-row">
            <span>CNIC</span>
            <strong>12345-xxxxxxx ✓</strong>
          </div>

          <div className="info-row">
            <span>Address</span>
            <button className="btn-outline small">Edit</button>
          </div>
        </div>

        {/* INSURANCE */}
        <div className="record-card">
          <h3>Insurance</h3>

          <div className="info-row">
            <span>Company</span>
            <strong>EFU General</strong>
          </div>

          <div className="info-row">
            <span>Policy #</span>
            <strong>ABC123</strong>
          </div>

          <div className="info-row">
            <span>Coverage</span>
            <strong>80%</strong>
          </div>

          <button className="primary-btn outline">
            Upload Policy
          </button>
        </div>

        {/* PREFERENCES */}
        <div className="record-card">
          <h3>Preferences</h3>

          <div className="preference-group">
            <label>Language</label>
            <div className="option-group">
              <span className="pill active">English ✓</span>
              <span className="pill">Urdu</span>
            </div>
          </div>

          <div className="preference-group">
            <label>Reminders</label>
            <div className="option-group">
              <span className="pill active">SMS</span>
              <span className="pill active">Email</span>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
