import React, { useState } from 'react'
import {
    LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";
import SideBar from './components/SideBar';
import AdminHeader from './components/AdminHeader';

const data = [
    { day: "Mon", appointments: 30 },
    { day: "Tue", appointments: 45 },
    { day: "Wed", appointments: 38 },
    { day: "Thu", appointments: 50 },
    { day: "Fri", appointments: 42 }
];

const AdminPanel = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    
    return (
        <div className={`admin-layout ${sidebarOpen ? "sidebar-open" : ""}`}>

            <SideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            <main className="admin-content">
                <div className="dashboard">

                    {/* HEADER */}
                    <AdminHeader
                        title="Admin Dashboard"
                        subtitle="Overview of clinic performance"
                        sidebarOpen={sidebarOpen}
                        setSidebarOpen={setSidebarOpen}
                    />

                    {/* STATS */}
                    <div className="stats-grid">
                        <div className="stat-card">
                            <h4>Total Users</h4>
                            <h2>24</h2>
                        </div>
                        <div className="stat-card">
                            <h4>Total Doctors</h4>
                            <h2>18</h2>
                        </div>
                        <div className="stat-card">
                            <h4>Total Patients</h4>
                            <h2>29</h2>
                        </div>
                        <div className="stat-card">
                            <h4>Active Appointments</h4>
                            <h2>86</h2>
                        </div>
                    </div>

                    {/* CHART + QUICK ACTIONS */}
                    <div className="dashboard-lower">
                        <div className="chart-card">
                            <h3>Weekly Appointments</h3>
                            <ResponsiveContainer width="100%" height={250}>
                                <LineChart data={data}>
                                    <XAxis dataKey="day" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line
                                        type="monotone"
                                        dataKey="appointments"
                                        stroke="#556b57"
                                        strokeWidth={3}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="quick-actions">
                            <h3>Quick Actions</h3>
                            <button>View Recent Appointments</button>
                            <button>Pending Doctor Approvals</button>
                            <button>New Patient Registrations</button>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default AdminPanel;
