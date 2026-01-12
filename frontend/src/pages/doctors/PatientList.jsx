import DoctorHeader from "./components/DoctorHeader";
import Sidebar from "./components/Sidebar";
import { useState } from "react";

export default function PatientList() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    return (
        <div className="doctor-layout">

            {/* SIDEBAR */}
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />


            {/* MAIN */}
            <main className="doctor-content">

                {/* HEADER */}
                <DoctorHeader
                    title="My Patients"
                    subtitle="Manage and track your assigned patients"
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                />

                {/* FILTER BAR */}
                <div className="filter-bar">
                    <input type="text" placeholder="Search patient name..." />

                    <select>
                        <option>Status</option>
                        <option>Active</option>
                        <option>Completed</option>
                    </select>

                    <input type="date" />

                    <button className="primary-btn">Export CSV</button>
                </div>

                {/* PATIENT TABLE */}
                <div className="table-card">
                    <table>
                        <thead>
                            <tr>
                                <th>Patient Name</th>
                                <th>Last Visit</th>
                                <th>Next Appointment</th>
                                <th>Last Message</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr className="clickable">
                                <td>John Doe</td>
                                <td>10 Aug 2026</td>
                                <td>18 Aug 2026</td>
                                <td>2 days ago</td>
                            </tr>

                            <tr className="clickable">
                                <td>Emily Clark</td>
                                <td>08 Aug 2026</td>
                                <td>20 Aug 2026</td>
                                <td>Yesterday</td>
                            </tr>

                            <tr className="clickable">
                                <td>Michael Smith</td>
                                <td>05 Aug 2026</td>
                                <td>—</td>
                                <td>1 week ago</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </main>
        </div>
    );
}
