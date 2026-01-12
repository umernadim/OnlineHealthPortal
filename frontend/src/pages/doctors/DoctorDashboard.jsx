import DoctorHeader from "./components/DoctorHeader";
import Sidebar from "./components/Sidebar";
import { useState } from "react";
export default function DoctorDashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    return (
        <div className="doctor-layout">

            {/* SIDEBAR */}

            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            {/* MAIN */}

            <main className="doctor-content">

                {/* HEADER */}
                <DoctorHeader
                    title="Hey, Dr. Alex"
                    subtitle="Here’s your schedule overview for today"
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen} />

                {/* QUICK STATS */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <h3>Patients Today</h3>
                        <span>12</span>
                    </div>

                    <div className="stat-card">
                        <h3>Upcoming Appointments</h3>
                        <span>5</span>
                    </div>

                    <div className="stat-card">
                        <h3>Earnings Today</h3>
                        <span>$420</span>
                    </div>

                    <div className="stat-card">
                        <h3>Unread Messages</h3>
                        <span>3</span>
                    </div>
                </div>

                {/* SCHEDULE + ACTIONS */}
                <div className="dashboard-grid">

                    {/* TODAY SCHEDULE */}
                    <div className="dashboard-card">
                        <h3>Today's Schedule</h3>

                        <ul className="schedule-list">
                            <li>
                                <span>09:00 AM</span>
                                <p>John Doe</p>
                                <small className="status confirmed">Confirmed</small>
                            </li>

                            <li>
                                <span>10:30 AM</span>
                                <p>Emily Clark</p>
                                <small className="status pending">Pending</small>
                            </li>

                            <li>
                                <span>01:00 PM</span>
                                <p>Michael Smith</p>
                                <small className="status completed">Completed</small>
                            </li>
                        </ul>
                    </div>

                    {/* UPCOMING + ACTIONS */}
                    <div className="dashboard-card">
                        <h3>Pending Actions</h3>

                        <div className="action-item">
                            <p>2 Appointment Requests</p>
                            <button>Review</button>
                        </div>

                        <div className="action-item">
                            <p>3 Unread Messages</p>
                            <button>Open</button>
                        </div>

                        <div className="action-item">
                            <p>1 Reschedule Request</p>
                            <button>Respond</button>
                        </div>
                    </div>

                </div>

                {/* UPCOMING APPOINTMENTS */}
                <div className="dashboard-card">
                    <h3>Upcoming Appointments (Next 48 Hours)</h3>

                    <table>
                        <thead>
                            <tr>
                                <th>Patient</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <td>Sarah Khan</td>
                                <td>Tomorrow</td>
                                <td>11:00 AM</td>
                                <td className="status confirmed">Confirmed</td>
                            </tr>

                            <tr>
                                <td>David Lee</td>
                                <td>Tomorrow</td>
                                <td>03:30 PM</td>
                                <td className="status pending">Pending</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </main>
        </div>
    );
}
