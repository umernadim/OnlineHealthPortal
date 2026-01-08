import React from 'react'

const Sidebar = () => {
    return (
        <>
            {/* SIDEBAR */}
            <aside className="sidebar">
                <h2 className="logo"><i class="ri-service-fill"></i> HealthCare</h2>
                <ul className="sidebar-menu">
                    <li>
                        <i className="ri-dashboard-fill"></i> <a href="adminPanel"></a>Dashboard</li>
                    <li>
                        <i className="ri-user-fill"></i><a href="managePatients"></a>Patients</li>
                    <li>
                        <i className="ri-calendar-schedule-fill"></i><a href="manageDoctors"></a>Appointments</li>
                    <li>
                       <i className="ri-chat-3-fill"></i> <a href="">Messages</a></li>
                    
                    <li>
                       <i className="ri-account-circle-fill"></i><a href="">Profile</a></li>
                    <li>
                       <i className="ri-logout-box-r-fill"></i><a href="">Logout</a></li>
                </ul>
            </aside>
        </>
    )
}

export default Sidebar