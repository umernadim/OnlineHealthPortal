import { useState, useEffect } from "react";
import AdminHeader from "./components/AdminHeader";
import SideBar from "./components/SideBar";
import api from "../../service/axios";

export default function Appointments() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [appointments, setAppointments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        date: "",
        doctor: "",
        status: ""
    });

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            console.log("Loading dashboard data...");
            
            const [appointmentsRes, doctorsRes] = await Promise.all([
                api.get("/Admin/appointments"),
                api.get("/Admin/doctors")
            ]);
            
            console.log("✅ Appointments:", appointmentsRes.data?.length);
            console.log("✅ Doctors:", doctorsRes.data);
            console.table(doctorsRes.data);
            
            setAppointments(appointmentsRes.data || []);
            setDoctors(doctorsRes.data || []);
        } catch (err) {
            console.error("❌ Dashboard load error:", err.response?.data || err);
        } finally {
            setLoading(false);
        }
    };

    // ✅ FIXED DATE FILTERING + DOCTOR MATCHING
    const filteredAppointments = appointments.filter(appointment => {
        const matchesDate = !filters.date || 
            appointment.appointmentDate.startsWith(filters.date.split('T')[0]);
        
        const matchesDoctor = !filters.doctor || 
            appointment.doctorName === filters.doctor;
        
        const matchesStatus = !filters.status || appointment.status === filters.status;
        
        return matchesDate && matchesDoctor && matchesStatus;
    });

    if (loading) {
        return (
            <div className={`admin-layout ${sidebarOpen ? "sidebar-open" : ""}`}>
                <SideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <main className="admin-content">
                    <AdminHeader
                        title="Loading Appointments..."
                        subtitle="Fetching appointment records"
                        sidebarOpen={sidebarOpen}
                        setSidebarOpen={setSidebarOpen}
                    />
                    <div style={{ textAlign: 'center', padding: '100px', color: '#666' }}>
                        <div style={{ fontSize: '48px', marginBottom: '20px' }}>📅</div>
                        <div style={{ fontSize: '24px' }}>Loading appointments...</div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className={`admin-layout ${sidebarOpen ? "sidebar-open" : ""}`}>
            <SideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <main className="admin-content">
                <div className="appointments-page">
                    <AdminHeader
                        title="Appointments Tracker"
                        subtitle={`${filteredAppointments.length} appointments | ${appointments.length} total`}
                        sidebarOpen={sidebarOpen}
                        setSidebarOpen={setSidebarOpen}
                    />

                    {/* ✅ FIXED FILTERS */}
                    <div className="appointment-filters" style={{ 
                        display: 'flex', gap: '16px', marginBottom: '24px', 
                        flexWrap: 'wrap', padding: '20px', background: '#f8f9fa', 
                        borderRadius: '12px' 
                    }}>
                    
                        
                        {/* ✅ DYNAMIC DOCTORS - FIXED */}
                        <select 
                            value={filters.doctor}
                            onChange={(e) => setFilters({...filters, doctor: e.target.value})}
                            style={{ padding: '10px 14px', border: '1px solid #ddd', 
                                borderRadius: '8px', minWidth: '250px' }}
                        >
                            <option value="">All Doctors ({doctors.length})</option>
                            {doctors.map((doctor) => (
                                <option key={doctor.id} value={doctor.name}>
                                    {doctor.name} ({doctor.speciality})
                                </option>
                            ))}
                        </select>
                        
                        <select 
                            value={filters.status}
                            onChange={(e) => setFilters({...filters, status: e.target.value})}
                            style={{ padding: '10px 14px', border: '1px solid #ddd', 
                                borderRadius: '8px', minWidth: '160px' }}
                        >
                            <option value="">All Status</option>
                            <option>Pending</option>
                            <option>Confirmed</option>
                            <option>Completed</option>
                            <option>Cancelled</option>
                        </select>
                        
                        <button 
                            className="primary-btn"
                            onClick={loadDashboardData}
                            style={{ padding: '10px 24px', background: '#007bff', color: 'white',
                                border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                        >
                            Refresh
                        </button>
                    </div>

                    {/* APPOINTMENTS LIST */}
                    <div className="appointments-list">
                        {filteredAppointments.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '80px', color: '#666',
                                background: '#f8f9fa', borderRadius: '12px', margin: '20px 0' }}>
                                <div style={{ fontSize: '64px', marginBottom: '20px' }}>📅</div>
                                <h3 style={{ margin: '0 0 10px 0' }}>No appointments found</h3>
                                <p style={{ margin: '0 0 30px 0' }}>
                                    {filters.date || filters.doctor || filters.status ? 
                                        'Try adjusting your filters' : 
                                        'No appointments in the system yet'
                                    }
                                </p>
                                <button className="primary-btn" onClick={loadDashboardData}
                                    style={{ padding: '12px 24px', background: '#28a745', color: 'white',
                                        border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px' }}>
                                    Reload Appointments
                                </button>
                            </div>
                        ) : (
                            filteredAppointments.map((appointment) => (
                                <div key={appointment.id} className={`appointment-card ${appointment.status.toLowerCase()}`}
                                    style={{
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                                        padding: '24px', marginBottom: '16px', background: 'white', 
                                        borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                        borderLeft: `5px solid ${
                                            appointment.status === 'Confirmed' ? '#28a745' :
                                            appointment.status === 'Completed' ? '#007bff' :
                                            appointment.status === 'Cancelled' ? '#dc3545' : '#ffc107'
                                        }`
                                    }}
                                >
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ margin: '0 0 4px 0', color: '#333', fontSize: '18px' }}>
                                            {appointment.patientName}
                                        </h4>
                                        <div style={{ color: '#666', marginBottom: '8px', fontSize: '15px' }}>
                                            👨‍⚕️ {appointment.doctorName}
                                            <span style={{ fontSize: '14px', opacity: 0.7, fontStyle: 'italic' }}>
                                                ({appointment.doctorSpeciality})
                                            </span>
                                        </div>
                                        <p style={{ margin: '0', color: '#666', fontSize: '15px' }}>
                                            📅 {appointment.appointmentDate} • {appointment.appointmentTime}
                                            <br />
                                            <small style={{ color: '#999' }}>
                                                {appointment.type} • Created: {appointment.createdAt}
                                            </small>
                                        </p>
                                    </div>

                                    <div style={{
                                        padding: '12px 20px', borderRadius: '25px', fontWeight: 'bold', 
                                        fontSize: '14px', minWidth: '120px', textAlign: 'center',
                                        background: appointment.status === 'Confirmed' ? '#d4edda' :
                                                   appointment.status === 'Completed' ? '#cce7ff' :
                                                   appointment.status === 'Cancelled' ? '#f8d7da' : '#fff3cd',
                                        color: appointment.status === 'Confirmed' ? '#155724' :
                                              appointment.status === 'Completed' ? '#004085' :
                                              appointment.status === 'Cancelled' ? '#721c24' : '#856404'
                                    }}>
                                        {appointment.status}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
