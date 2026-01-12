import DoctorHeader from "./components/DoctorHeader";
import Sidebar from "./components/Sidebar";
import { useState } from "react";

export default function AppointmentManagement() {
   const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="doctor-layout">

      {/* SIDEBAR */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* MAIN */}
      <main className="doctor-content">

        {/* HEADER */}
        <DoctorHeader
          title="Appointment Management"
          subtitle="Manage bookings, availability & requests"
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* ACTION BAR */}
        <div className="action-bar">
          <button className="primary-btn">Accept Selected</button>
          <button className="secondary-btn">Reject Selected</button>
        </div>

        {/* APPOINTMENT LIST */}
        <div className="table-card">
          <h3>Pending Appointments</h3>

          <table>
            <thead>
              <tr>
                <th></th>
                <th>Patient</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td><input type="checkbox" /></td>
                <td>John Doe</td>
                <td>16 Aug 2026</td>
                <td>10:00 AM</td>
                <td className="status pending">Pending</td>
              </tr>

              <tr>
                <td><input type="checkbox" /></td>
                <td>Emily Clark</td>
                <td>16 Aug 2026</td>
                <td>11:30 AM</td>
                <td className="status pending">Pending</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* AVAILABILITY + SUGGESTIONS */}
        <div className="appointment-grid">

          {/* AVAILABILITY */}
          <div className="dashboard-card">
            <h3>Update Availability</h3>

            <div className="availability-grid">
              <input type="date" />
              <input type="time" />
              <input type="time" />
            </div>

            <button className="primary-btn">Save Availability</button>
          </div>

          {/* AUTO SUGGEST */}
          <div className="dashboard-card">
            <h3>Suggested Free Slots</h3>

            <ul className="slot-list">
              <li>17 Aug • 09:00 AM</li>
              <li>17 Aug • 12:30 PM</li>
              <li>18 Aug • 03:00 PM</li>
            </ul>
          </div>

        </div>

      </main>
    </div>
  );
}
