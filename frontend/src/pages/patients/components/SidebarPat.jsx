import React from 'react'
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../../../context/AuthContext';

const SidebarPat = () => {

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
            <aside className="d-sidebar">
                <h2 className="logo"><i className="ri-service-fill"></i> HealthCare</h2>
                <ul className="sidebar-menu">
                    <li>
                        <Link to="/patientDashboard">
                            <i className="ri-dashboard-fill"></i>Dashboard
                        </Link>
                    </li>

                    <li>
                        <Link to="/myAppointments">
                            <i className="ri-calendar-schedule-fill"></i>Appointments
                        </Link>
                    </li>

                    <li>
                        <Link to="/healthRecords">
                            <i className="ri-calendar-schedule-fill"></i>My Records
                        </Link>
                    </li>
                    <li>
                        <Link to="/doctors">
                            <i className="ri-calendar-schedule-fill"></i>Doctors
                        </Link>
                    </li>
                    <li>
                        <Link to="/messages">
                            <i className="ri-chat-3-fill"></i>Message
                        </Link>
                    </li>
                    <li>
                        <Link to="/prescriptions">
                            <i className="ri-chat-3-fill"></i>Prescriptions
                        </Link>
                    </li>

                    <li>
                        <Link to="/invoice">
                            <i className="ri-chat-3-fill"></i>Invoice
                        </Link>
                    </li>

                    <li>
                        <Link to="/patientProfile">
                            <i className="ri-account-circle-fill"></i>Profile
                        </Link>
                    </li>
                    <li>
                        <button onClick={handleLogout} className='logout-btn'>
                            <i className="ri-logout-box-r-fill"></i><span>Logout</span>
                        </button>
                    </li>
                </ul>
            </aside>
        </>
    )
}

export default SidebarPat