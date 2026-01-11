import React from 'react'

const SideBar = ({ sidebarOpen }) => {
  return (
    <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>

      {/* HEADER */}
      <div className="sidebar-header">
        <h2 className="logo">
          <i className="ri-service-fill"></i> HealthCare
        </h2>
      </div>

      {/* MENU */}
      <ul className="sidebar-menu">
        <li className="active">
          <a href="adminPanel">
            <i className="ri-dashboard-fill"></i>
            <span>Dashboard</span>
          </a>
        </li>
        <li>
          <a href="manageDoctors">
            <i className="ri-stethoscope-line"></i>
            <span>Doctors</span>
          </a>
        </li>
        <li>
          <a href="managePatients">
            <i className="ri-user-fill"></i>
            <span>Patients</span>
          </a>
        </li>
        <li>
          <a href="appointments">
            <i className="ri-calendar-event-fill"></i>
            <span>Appointments</span>
          </a>
        </li>
        <li>
          <a href="notifications">
          <i className="ri-notification-2-fill"></i>
          <span>Notifications</span>
          </a>
        </li>
        <li>
          <a href="systemSettings">
          <i className="ri-settings-5-fill"></i>
          <span>Settings</span>
          </a>
        </li>
      </ul>

    </aside>
  );
};


export default SideBar
