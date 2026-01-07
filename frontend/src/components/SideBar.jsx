import React from 'react'

const SideBar = () => {
    return (
        <>
            <aside className="sidebar">
                <h2 className="logo">PhysioAdmin</h2>

                <ul className="sidebar-menu">

                    <li><a href="adminPanel"></a>Dashboard</li>
                    <li><a href="manageDoctors"></a>Doctors</li>
                    <li><a href="managePatients"></a>Patients</li>
                    <li>Appointments</li>
                    <li>Settings</li>
                </ul>
            </aside>
        </>
    )
}

export default SideBar
