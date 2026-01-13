import React from 'react'
import { useNavigate } from 'react-router';
import { useAuth } from '../../../context/AuthContext';

const SidebarPat = () => {

    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const handleLogout = () => {
        logout();
        navigate("/");
    };
    return (
        <>
            <aside className="sidebar">
                <h2 className="logo"><i class="ri-service-fill"></i> HealthCare</h2>
                <ul className="sidebar-menu">
                    <li>
                        <a href="patientDashboard">

                            <i className="ri-dashboard-fill"></i>Dashboard
                        </a>
                    </li>

                    <li>
                        <a href="myAppointments">
                            <i className="ri-calendar-schedule-fill">Appointments</i>
                        </a>
                    </li>
                    <li>
                        <a href="healthRecords">
                            <i className="ri-calendar-schedule-fill"></i>My Records
                        </a>
                    </li>
                    <li>
                        <a href="messages">
                            <i className="ri-chat-3-fill">Messages</i>
                        </a>
                    </li>

                    <li>
                        <a href="invoice">
                            <i className="ri-chat-3-fill"></i>Invoice
                        </a>
                    </li>

                    <li>
                        <a href="patientProfile">
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