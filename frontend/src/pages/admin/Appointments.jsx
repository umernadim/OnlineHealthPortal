import { useState } from "react";
import AdminHeader from "./components/AdminHeader";
import SideBar from "./components/SideBar";

export default function Appointments() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    return (
        <div className={`admin-layout ${sidebarOpen ? "sidebar-open" : ""}`}>

            {/* SIDEBAR */}
            <SideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            {/* MAIN */}
            <main className="admin-content">
                <div className="appointments-page">
                    {/* HEADER */}
                    <AdminHeader
                        title="Appointments Tracker"
                        sidebarOpen={sidebarOpen}
                        setSidebarOpen={setSidebarOpen}
                    />

                    {/* FILTERS */}
                    <div className="appointment-filters">
                        <input type="date" />
                        <select>
                            <option>All Doctors</option>
                            <option>Dr. Olivia Wilson</option>
                            <option>Dr. James Carter</option>
                        </select>
                        <select>
                            <option>All Status</option>
                            <option>Upcoming</option>
                            <option>Completed</option>
                            <option>Cancelled</option>
                        </select>
                    </div>

                    {/* APPOINTMENTS LIST */}
                    <div className="appointments-list">

                        <div className="appointment-card upcoming">
                            <div>
                                <h4>John Doe</h4>
                                <span>Dr. Olivia Wilson</span>
                                <p>12 Aug 2026 • 10:30 AM</p>
                            </div>

                            <div className="status upcoming">Upcoming</div>

                            <div className="actions">
                                <button className="action-btn">View</button>
                                <button className="action-btn">Reschedule</button>
                                <button className="danger-btn">Cancel</button>
                            </div>
                        </div>

                        <div className="appointment-card completed">
                            <div>
                                <h4>Sarah Lee</h4>
                                <span>Dr. James Carter</span>
                                <p>10 Aug 2026 • 02:00 PM</p>
                            </div>

                            <div className="status completed">Completed</div>

                            <div className="actions">
                                <button className="action-btn">View</button>
                            </div>
                        </div>

                        <div className="appointment-card cancelled">
                            <div>
                                <h4>Michael Brown</h4>
                                <span>Dr. Olivia Wilson</span>
                                <p>09 Aug 2026 • 11:00 AM</p>
                            </div>

                            <div className="status cancelled">Cancelled</div>

                            <div className="actions">
                                <button className="action-btn">View</button>
                            </div>
                        </div>

                    </div>
                </div>

            </main>
        </div>
    );
}
