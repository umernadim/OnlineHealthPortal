import AdminHeader from "./components/AdminHeader";
import SideBar from "./components/SideBar";
import { useState } from "react";

export default function Notifications() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className={`admin-layout ${sidebarOpen ? "sidebar-open" : ""}`}>

      {/* SIDEBAR */}
      <SideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* MAIN CONTENT */}
      <main className="admin-content">
        <div className="notify-page">
          {/* HEADER */}
          <AdminHeader
            title="Notifications"
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />

          {/* COMPOSER */}
          <div className="composer-card">
            <h3>Create Notification</h3>

            <div className="composer-grid">
              <select>
                <option>Select Template</option>
                <option>Appointment Reminder</option>
                <option>Medicine Alert</option>
                <option>Follow-up Reminder</option>
              </select>

              <select>
                <option>Target Audience</option>
                <option>All Patients</option>
                <option>Specific Doctor</option>
                <option>Specific Patient</option>
              </select>

              <input type="datetime-local" />

              <textarea
                placeholder="Write message here..."
                rows="4"
              ></textarea>
            </div>

            <button className="primary-btn">Schedule Notification</button>
          </div>

          {/* SCHEDULED LIST */}
          <div className="table-card">
            <h3>Scheduled Notifications</h3>

            <table>
              <thead>
                <tr>
                  <th>Message</th>
                  <th>Target</th>
                  <th>Schedule</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>Appointment Reminder</td>
                  <td>All Patients</td>
                  <td>14 Aug 2026 • 09:00 AM</td>
                  <td className="status sent">Sent</td>
                </tr>

                <tr>
                  <td>Medicine Alert</td>
                  <td>John Doe</td>
                  <td>15 Aug 2026 • 08:00 AM</td>
                  <td className="status pending">Pending</td>
                </tr>

                <tr>
                  <td>Follow-up Reminder</td>
                  <td>Dr. Olivia Wilson</td>
                  <td>13 Aug 2026 • 06:00 PM</td>
                  <td className="status failed">Failed</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}
