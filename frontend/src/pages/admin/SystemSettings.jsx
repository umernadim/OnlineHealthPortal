import SideBar from "../../components/SideBar";

export default function SystemSettings() {
  return (
    <div className="admin-layout">

      {/* SIDEBAR */}
      <SideBar></SideBar>

      {/* MAIN CONTENT */}
      <main className="admin-content">
        <div className="setting-page">
          <div className="page-header">
            <h1>System Settings</h1>
            <p>Manage roles, site configuration & audit logs</p>
          </div>

          {/* USER ROLES */}
          <div className="settings-card table-card">
            <h3>User Roles & Permissions</h3>

            <table>
              <thead>
                <tr>
                  <th>Role</th>
                  <th>Permissions</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Super Admin</td>
                  <td>Full Access</td>
                  <td className="status active">Active</td>
                </tr>
                <tr>
                  <td>Support Admin</td>
                  <td>Doctors, Patients, Appointments</td>
                  <td className="status active">Active</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* SITE CONFIG */}
          <div className="settings-card">
            <h3>Site Configuration</h3>

            <div className="config-grid">
              <div>
                <label>Doctor Availability Slot</label>
                <select>
                  <option>30 Minutes</option>
                  <option>45 Minutes</option>
                  <option>60 Minutes</option>
                </select>
              </div>

              <div>
                <label>Notification Preference</label>
                <select>
                  <option>Email + SMS</option>
                  <option>Email Only</option>
                  <option>SMS Only</option>
                </select>
              </div>
            </div>

            <button className="primary-btn">Save Settings</button>
          </div>

          {/* ACTIVITY LOGS */}
          <div className="settings-card table-card">
            <h3>Activity Logs</h3>

            <table>
              <thead>
                <tr>
                  <th>Admin</th>
                  <th>Action</th>
                  <th>Date & Time</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Super Admin</td>
                  <td>Approved Doctor Profile</td>
                  <td>12 Aug 2026 • 11:45 AM</td>
                </tr>
                <tr>
                  <td>Support Admin</td>
                  <td>Updated Appointment Slot</td>
                  <td>11 Aug 2026 • 04:20 PM</td>
                </tr>
                <tr>
                  <td>Super Admin</td>
                  <td>Sent System Notification</td>
                  <td>10 Aug 2026 • 09:10 AM</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}
