import DoctorHeader from "./components/DoctorHeader";
import Sidebar from "./components/Sidebar";
import { useState } from "react";

export default function ProfileAvailability() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="doctor-layout">

      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* MAIN CONTENT */}
      <main className="doctor-content">

        {/* HEADER */}
        <DoctorHeader
          title="Profile & Availibility"
          subtitle="Manage your professional details & schedule"
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* PROFILE + AVAILABILITY GRID */}
        <div className="profile-grid">

          {/* PROFILE CARD */}
          <div className="record-card profile-card">
            <div className="profile-top">
              <div className="profile-avatar">Dr</div>
              <div>
                <h3>Dr. Ahmed Khan</h3>
                <p>Cardiology Specialist</p>
              </div>
            </div>

            <ul className="profile-details">
              <li><strong>Experience:</strong> 10 Years</li>
              <li><strong>Languages:</strong> English, Urdu</li>
            </ul>

            <button className="primary-btn">Edit Profile</button>
          </div>

          {/* AVAILABILITY */}
          <div className="record-card">
            <h3>Weekly Availability</h3>

            <div className="availability-row">
              <span>Monday - Friday</span>
              <span className="available">
                9AM–1PM, 5PM–9PM ✓
              </span>
            </div>

            <div className="availability-row">
              <span>Saturday</span>
              <span className="unavailable">
                Off ✗
              </span>
            </div>

            <div className="availability-row">
              <span>Sunday</span>
              <span className="unavailable">
                Off ✗
              </span>
            </div>

            <button className="primary-btn outline">
              Update Availability
            </button>
          </div>

        </div>

        {/* FEES + CERTIFICATION */}
        <div className="profile-grid">

          {/* FEES */}
          <div className="record-card">
            <h3>Consultation Fees</h3>

            <div className="fee-box">
              <span>PKR</span>
              <input type="number" value="1000" />
              <span>/ consultation</span>
            </div>

            <button className="primary-btn">
              Update Fees
            </button>
          </div>

          {/* CERTIFICATION */}
          <div className="record-card">
            <h3>Certifications</h3>

            <div className="upload-box">
              <p>Upload Medical Certification (PDF/Image)</p>
              <input type="file" />
            </div>

            <button className="primary-btn outline">
              Upload Certificate
            </button>
          </div>

        </div>

        {/* CALENDAR */}
        <div className="record-card">
          <h3>Availability Calendar</h3>

          <div className="calendar-placeholder">
            Weekly / Monthly Calendar View
          </div>
        </div>

      </main>
    </div>
  );
}
