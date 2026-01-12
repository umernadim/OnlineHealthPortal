import React from 'react'

const Sidebar = ({ sidebarOpen }) => {
    return (
        <>
            {/* SIDEBAR */}
            <aside className={`d-sidebar ${sidebarOpen ? "open" : ""}`}>
                <h2 className="logo"><i className="ri-service-fill"></i> HealthCare</h2>
                <ul className="sidebar-menu">
                    <li>
                        <a href="doctorDashboard">
                            <i className="ri-dashboard-fill"></i>Home</a></li>
                    <li>
                        <a href="patientList">
                            <i className="ri-user-fill"></i>Patients</a></li>
                    <li>
                        <a href="doctorsAppointments">
                            <i className="ri-calendar-schedule-fill"></i>Appointments</a></li>
                    <li><a href="messages">
                        <i className="ri-chat-3-fill"></i>
                        Messages
                    </a>
                    </li>

                    <li>
                        <a href="">
                            <i className="ri-account-circle-fill"></i>
                            Profile
                        </a>
                    </li>
                    <li>
                        <a href="">
                            <i className="ri-logout-box-r-fill"></i>
                            Logout
                        </a>
                    </li>
                </ul>
            </aside>
        </>
    )
}

export default Sidebar