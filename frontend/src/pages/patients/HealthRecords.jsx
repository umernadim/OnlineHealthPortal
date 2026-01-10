import SidebarPat from "./components/SidebarPat";

export default function HealthRecords() {
  return (
    <div className="patient-layout">

      {/* SIDEBAR */}
      <SidebarPat></SidebarPat>

      {/* MAIN */}
      <main className="patient-content">

        {/* HEADER */}
        <div className="page-header">
          <h1>Health Records</h1>
          <p>Upload & review your medical information</p>
        </div>

        {/* UPLOAD */}
        <div className="record-card">
          <h3>Upload Records</h3>

          <div className="upload-grid">
            <div className="upload-box">
              <p>X-ray / Imaging (PDF, Image)</p>
              <input type="file" />
            </div>

            <div className="upload-box">
              <p>Lab Report</p>
              <input type="file" />
            </div>
          </div>
        </div>

        {/* HISTORY */}
        <div className="record-card">
          <h3>Medical History</h3>

          <ul className="history-list">
            <li>Diabetes — Diagnosed 2024</li>
            <li>Blood Pressure Readings Uploaded</li>
          </ul>
        </div>

        {/* ALLERGIES */}
        <div className="record-card">
          <h3>Allergies</h3>

          <div className="allergy-tag">
            Penicillin
          </div>
        </div>

      </main>
    </div>
  );
}
