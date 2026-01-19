import SidebarPat from "./components/SidebarPat";

export default function PatientProfile() {
  return (
    <div className="patient-layout">

      {/* SIDEBAR */}
    <SidebarPat></SidebarPat>

      {/* MAIN */}
      <main className="patient-content patient-profile">

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
          <button className="primary-btn outline">
            Upload Policy
          </button>
        </div>

      </main>
    </div>
  );
}
