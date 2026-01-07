import React from 'react'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer
} from "recharts";
import SideBar from '../../components/SideBar';

const data = [
    { day: "Mon", appointments: 30 },
    { day: "Tue", appointments: 45 },
    { day: "Wed", appointments: 38 },
    { day: "Thu", appointments: 50 },
    { day: "Fri", appointments: 42 }
];


const AdminPanel = () => {
    return (
        <div className='admin-layout'>
            <SideBar></SideBar>
            <main className="admin-content">
                <div className="dashboard">

                    {/* HEADER */}
                    <div className="dashboard-header">
                        <h1>Admin Dashboard</h1>
                        <p>Overview of clinic performance</p>
                    </div>

                    {/* STATS */}
                    <div className="stats-grid">
                        <div className="stat-card">
                            <h4>Total Users</h4>
                            <h2>1,245</h2>
                        </div>
                        <div className="stat-card">
                            <h4>Active Appointments</h4>
                            <h2>86</h2>
                        </div>
                        <div className="stat-card">
                            <h4>Doctors</h4>
                            <h2>18</h2>
                        </div>
                        <div className="stat-card">
                            <h4>Revenue</h4>
                            <h2>$12,450</h2>
                        </div>
                    </div>

                    {/* CHART + QUICK ACTIONS */}
                    <div className="dashboard-lower">

                        {/* CHART */}
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

                        {/* QUICK ACTIONS */}
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
    )
}

export default AdminPanel



