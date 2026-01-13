import DoctorHeader from "./components/DoctorHeader";
import Sidebar from "./components/Sidebar";
import { useState } from "react";

export default function PrescriptionWriter() {
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
        <DoctorHeader
          title="Prescription Writer"
          subtitle="Create & send digital prescription"
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* PRESCRIPTION CARD */}
        <div className="record-card prescription-card">

          {/* PATIENT INFO */}
          <div className="prescription-header">
            <div>
              <strong>Patient:</strong> Ahmed Khan
            </div>
            <div>
              <strong>Date:</strong> 10-Jan-2026
            </div>
          </div>

          {/* FORM */}
          <div className="form-grid">

            <div className="form-group">
              <label>Medicine</label>
              <input
                type="text"
                placeholder="Panadol 500mg"
              />
              <small className="hint">
                Autocomplete from medicine database
              </small>
            </div>

            <div className="form-group">
              <label>Dosage</label>
              <input
                type="text"
                placeholder="1 tablet after meal"
              />
            </div>

            <div className="form-group">
              <label>Duration</label>
              <input
                type="text"
                placeholder="5 days"
              />
            </div>

            <div className="form-group">
              <label>Dosage Calculator</label>
              <button className="btn-outline">
                Open Calculator
              </button>
            </div>

          </div>

          {/* INSTRUCTIONS */}
          <div className="form-group full">
            <label>Instructions</label>
            <textarea
              rows="4"
              placeholder="Additional instructions for patient..."
            ></textarea>
          </div>

          {/* ACTIONS */}
          <div className="prescription-actions">
            <button className="primary-btn">
              Generate PDF
            </button>
            <button className="primary-btn outline">
              Email / Send
            </button>
            <button className="primary-btn success">
              Save to Records
            </button>
          </div>

        </div>

      </main>
    </div>
  );
}
