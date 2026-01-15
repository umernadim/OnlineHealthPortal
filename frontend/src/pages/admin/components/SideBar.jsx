import React from 'react'
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../../../context/AuthContext';

const SideBar = ({ sidebarOpen }) => {

  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (!confirmLogout) return;

    logout();
    navigate("/login");
  };


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
          <Link to="adminPanel">
            <i className="ri-dashboard-fill"></i>
            <span>Dashboard</span>
          </Link>
        </li>
        <li>
          <Link to="manageDoctors">
            <i className="ri-stethoscope-line"></i>
            <span>Doctors</span>
          </Link>
        </li>
        <li>
          <Link to="managePatients">
            <i className="ri-user-fill"></i>
            <span>Patients</span>
          </Link>
        </li>
        <li>
          <Link to="appointments">
            <i className="ri-calendar-event-fill"></i>
            <span>Appointments</span>
          </Link>
        </li>
        <li>
          <Link to="notifications">
          <i className="ri-notification-2-fill"></i>
          <span>Notifications</span>
          </Link>
        </li>
        <li>
          <Link to="systemSettings">
          <i className="ri-settings-5-fill"></i>
          <span>Settings</span>
          </Link>
        </li>
        <li>
          <button onClick={handleLogout} className='logout-btn'>
            <i className='ri-logout-box-r-fill'></i> <span>Logout</span>
          </button>
        </li>
      </ul>

    </aside>
  );
};


export default SideBar
