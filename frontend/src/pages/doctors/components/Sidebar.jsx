import React from 'react'
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../../../context/AuthContext';

const Sidebar = ({ sidebarOpen }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (!confirmLogout) return;

    logout();
    navigate("/login");
  };
    return (
        <>
            {/* SIDEBAR */}
            <aside className={`d-sidebar ${sidebarOpen ? "open" : ""}`}>
                <h2 className="logo"><i className="ri-service-fill"></i> HealthCare</h2>
                <ul className="sidebar-menu">
                    <li>
                        <Link to="/doctorDashboard">
                            <i className="ri-dashboard-fill"></i>Home</Link></li>
                    <li>
                        <Link to="/patientList">
                            <i className="ri-user-fill"></i>Patients</Link></li>
                    <li>
                        <Link to="/doctorsAppointments">
                            <i className="ri-calendar-schedule-fill"></i>Appointments</Link></li>
                    <li><Link to="/messages">
                        <i className="ri-chat-3-fill"></i>
                        Messages
                    </Link>
                    </li>
                    <li><Link to="/consultation">
                        <i className="ri-chat-3-fill"></i>
                        Follow Ups
                    </Link>
                    </li>

                    <li>
                        <Link to="/profileAvailibility">
                            <i className="ri-account-circle-fill"></i>
                            Profile
                        </Link>
                    </li>
                    <li>
                        <button onClick={handleLogout} className='logout-btn'>
                            <i className="ri-logout-box-r-fill"></i>
                            <span>Logout</span>
                        </button>
                    </li>
                </ul>
            </aside>
        </>
    )
}

export default Sidebar