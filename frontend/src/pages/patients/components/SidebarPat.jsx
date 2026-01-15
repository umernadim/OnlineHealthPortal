import React from 'react'
import { useNavigate } from 'react-router';
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
            <aside className="sidebar">
                <h2 className="logo"><i class="ri-service-fill"></i> HealthCare</h2>
                <ul className="sidebar-menu">
                    <li>
                        <a to="patientDashboard">

                            <i className="ri-dashboard-fill"></i>Dashboard
                        </a>
                    </li>

                    <li>
                        <a to="myAppointments">
                            <i className="ri-calendar-schedule-fill">Appointments</i>
                        </a>
                    </li>
                    <li>
                        <a to="healthRecords">
                            <i className="ri-calendar-schedule-fill"></i>My Records
                        </a>
                    </li>
                    <li>
                        <a to="messages">
                            <i className="ri-chat-3-fill">Messages</i>
                        </a>
                    </li>

                    <li>
                        <a to="invoice">
                            <i className="ri-chat-3-fill"></i>Invoice
                        </a>
                    </li>

                    <li>
                        <a to="patientProfile">
                            <i className="ri-account-circle-fill"></i>Profile
                        </a>
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