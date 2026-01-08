import React from 'react'

const SideBar = () => {
    return (
        <>
            <aside className="sidebar">
                <h2 className="logo"><i className="ri-service-fill"></i> HealthCare</h2>

                <ul className="sidebar-menu">
                    <li>
                        <i className="ri-dashboard-fill"></i> <a href="adminPanel"></a>Dashboard</li>
                    <li>
                        <i className="ri-stethoscope-line"></i><a href="manageDoctors"></a>Doctors</li>
                    <li>
                        <i className="ri-user-fill"></i><a href="managePatients"></a>Patients</li>
                    <li>
                       <i className="ri-notification-2-fill"></i> <a href="">Appointments</a></li>
                    
                    <li>
                       <i className="ri-calendar-event-fill"></i> <a href="">Notifications</a></li>
                    
                    <li>
                        <i className="ri-settings-5-fill"></i><a href="">Setting</a></li>
                </ul>
            </aside>
        </>
    )
}

export default SideBar
