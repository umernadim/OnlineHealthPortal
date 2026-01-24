import React, { useState, useEffect } from 'react';
import {
    LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";
import SideBar from './components/SideBar';
import AdminHeader from './components/AdminHeader';
import api from "../../service/axios";  // ✅ Your axios instance

const AdminPanel = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [stats, setStats] = useState({
        totalUsers: 0, totalDoctors: 0, totalPatients: 0,
        totalAppointments: 0, activeAppointments: 0,
        pendingDoctors: 0, totalPrescriptions: 0
    });
    const [weeklyData, setWeeklyData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            
            // Fetch all data in parallel
            const [statsRes, weeklyRes] = await Promise.all([
                api.get("/Admin/stats"),
                api.get("/Admin/weekly-appointments")
            ]);

            setStats(statsRes.data);
            setWeeklyData(weeklyRes.data);
        } catch (err) {
            console.error("Dashboard load error:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className={`admin-layout ${sidebarOpen ? "sidebar-open" : ""}`}>
                <SideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <main className="admin-content">
                    <AdminHeader
                        title="Loading Dashboard..."
                        subtitle="Fetching clinic statistics"
                        sidebarOpen={sidebarOpen}
                        setSidebarOpen={setSidebarOpen}
                    />
                    <div style={{ textAlign: 'center', padding: '100px', color: '#666' }}>
                        <div style={{ fontSize: '48px', marginBottom: '20px' }}>📊</div>
                        <div style={{ fontSize: '24px' }}>Loading dashboard...</div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className={`admin-layout ${sidebarOpen ? "sidebar-open" : ""}`}>
            <SideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            <main className="admin-content">
                <div className="dashboard">
                    {/* HEADER */}
                    <AdminHeader
                        title="📊 Admin Dashboard"
                        subtitle={`Clinic overview - Last updated ${new Date().toLocaleTimeString()}`}
                        sidebarOpen={sidebarOpen}
                        setSidebarOpen={setSidebarOpen}
                    />

                    {/* STATS */}
                    <div className="stats-grid">
                        <div className="stat-card">
                            <h4>Total Users</h4>
                            <h2>{stats.totalUsers.toLocaleString()}</h2>
                        </div>
                        <div className="stat-card">
                            <h4>Verified Doctors</h4>
                            <h2>{stats.totalDoctors.toLocaleString()}</h2>
                        </div>
                        <div className="stat-card">
                            <h4>Total Patients</h4>
                            <h2>{stats.totalPatients.toLocaleString()}</h2>
                        </div>
                        <div className="stat-card">
                            <h4>Active Appointments</h4>
                            <h2 style={{ color: '#28a745' }}>{stats.activeAppointments.toLocaleString()}</h2>
                        </div>
                    </div>

                    {/* CHART + QUICK ACTIONS */}
                    <div className="dashboard-lower">
                        <div className="chart-card">
                            <h3>Weekly Appointments Trend</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={weeklyData}>
                                    <XAxis dataKey="day" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line
                                        type="monotone"
                                        dataKey="appointments"
                                        stroke="#5C6A5C"
                                        strokeWidth={4}
                                        dot={{ fill: '#5C6A5C', strokeWidth: 2 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="quick-actions">
                            <h3>Quick Actions</h3>
                            <button 
                                className="primary-btn"
                                onClick={() => window.location.href = '/appointments'}
                            >
                                 Recent Appointments ({stats.totalAppointments})
                            </button>
                            <button 
                                className="primary-btn"
                                onClick={() => window.location.href = '/manageDoctors'}
                            >
                                Pending Doctors ({stats.pendingDoctors})
                            </button>
                            <button 
                                className="primary-btn"
                                onClick={() => window.location.href = '/managePatients'}
                            >
                                New Registrations ({stats.totalUsers})
                            </button>
                            <button 
                                className="primary-btn"
                                onClick={loadDashboardData}
                            >
                                Refresh Data
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminPanel;
