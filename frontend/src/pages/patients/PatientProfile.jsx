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
          <p>Manage your personal information</p>
        </div>

        {/* PROFILE CARD */}
        <div className="record-card profile-card">

          <div className="profile-top">
            <div className="profile-avatar">A</div>

            <div className="profile-info">
              <h3>Ahmed Khan</h3>
              <p>📞 +92-321-xxx</p>
              <p>Insurance: <strong>EFU</strong></p>
            </div>
          </div>

          <div className="profile-actions">
            <button className="primary-btn">Edit Profile</button>
            <button className="primary-btn outline">Upload Photo</button>
          </div>

        </div>

      </main>
    </div>
  );
}
