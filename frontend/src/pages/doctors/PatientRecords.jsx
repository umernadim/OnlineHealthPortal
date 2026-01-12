import { useState } from "react";
import DoctorHeader from "./components/DoctorHeader";
import Sidebar from "./components/Sidebar";

export default function PatientRecords() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="doctor-layout">

      {/* SIDEBAR */}
      <Sidebar
        sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}
      />

      {/* MAIN */}
      <main className="doctor-content">

        {/* HEADER */}
        <div className="page-header">
          <h1>Patient Records</h1>
          <p>Read-only medical history & reports</p>
        </div>
        <DoctorHeader
          title="Patient records"
          subtitle="read-only medical history & reports"
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* TOP GRID */}
        <div className="records-grid">

          {/* MEDICAL HISTORY */}
          <div className="record-card">
            <h3>Medical History</h3>
            <ul>
              <li><strong>Diabetes</strong> (2024) — HbA1c: 7.2</li>
              <li>Blood Pressure Reports Uploaded</li>
              <li>Previous Prescriptions Available</li>
            </ul>
          </div>

          {/* ALLERGIES */}
          <div className="record-card">
            <h3>Allergies</h3>
            <p>No known allergies</p>
          </div>

        </div>

        {/* REPORTS */}
        <div className="record-card">
          <h3>Lab Reports</h3>

          <div className="report-list">
            <div className="report-item">
              <span>BP_Report_March.pdf</span>
              <button>View</button>
            </div>

            <div className="report-item">
              <span>Blood_Test_April.pdf</span>
              <button>View</button>
            </div>
          </div>
        </div>

        {/* IMAGES */}
        <div className="record-card">
          <h3>X-Ray / Imaging</h3>

          <div className="image-grid">
            <div className="image-box">X-Ray Image</div>
            <div className="image-box">MRI Scan</div>
          </div>
        </div>

        {/* TIMELINE */}
        <div className="record-card">
          <h3>Visit Timeline</h3>

          <ul className="timeline">
            <li>
              <span>12 Aug 2026</span>
              <p>Follow-up Consultation</p>
            </li>

            <li>
              <span>28 Jul 2026</span>
              <p>Initial Assessment</p>
            </li>
          </ul>
        </div>

      </main>
    </div>
  );
}
