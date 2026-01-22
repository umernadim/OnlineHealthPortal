import { useEffect, useState } from "react";
import DoctorHeader from "./components/DoctorHeader";
import Sidebar from "./components/Sidebar";
import api from "../../service/axios";
import { useNavigate } from "react-router-dom";

export default function PatientList() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const navigate = useNavigate();

    useEffect(() => {
        loadPatients();
    }, []);

    const loadPatients = async () => {
        try {
            setLoading(true);
            const res = await api.get("/Doctor/patients"); // Doctor ke saare patients
            setPatients(res.data || []);
        } catch (err) {
            console.error("Error loading patients:", err);
        } finally {
            setLoading(false);
        }
    };

    const viewPatientRecords = (patientId) => {
        navigate(`/patientRecords?patientId=${patientId}`);
    };

    const filteredPatients = patients.filter(patient => 
        patient.fullName.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filterStatus === "all" || patient.status === filterStatus)
    );

    if (loading) {
        return (
            <div className="doctor-layout">
                <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <main className="doctor-content">
                    <DoctorHeader
                        title="Loading Patients..."
                        subtitle="Fetching patient list"
                        sidebarOpen={sidebarOpen}
                        setSidebarOpen={setSidebarOpen}
                    />
                    <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
                        <div style={{ fontSize: '24px' }}>Loading patients...</div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="doctor-layout">
            {/* SIDEBAR */}
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            {/* MAIN */}
            <main className="doctor-content">
                <DoctorHeader
                    title="My Patients"
                    subtitle={`Manage your patients (${filteredPatients.length})`}
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                />

                {/* FILTER BAR */}
                <div className="filter-bar" style={{ 
                    display: 'flex', gap: '15px', marginBottom: '20px', 
                    flexWrap: 'wrap', alignItems: 'center',
                    padding: '15px', background: '#f8f9fa', borderRadius: '8px'
                }}>
                    <input 
                        type="text" 
                        placeholder="Search patient name..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px', flex: 1, minWidth: '200px' }}
                    />
                    <select 
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px' }}
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                    </select>
                    <input 
                        type="date" 
                        style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px' }}
                    />
                    <button className="primary-btn" style={{ padding: '8px 16px' }}>
                        Export CSV
                    </button>
                </div>

                {/* PATIENT TABLE */}
                <div className="table-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                        <h3>Patients ({filteredPatients.length})</h3>
                        <button className="primary-btn" onClick={loadPatients}>
                            Refresh
                        </button>
                    </div>
                    
                    {filteredPatients.length > 0 ? (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ background: '#f8f9fa' }}>
                                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>
                                            Patient Name
                                        </th>
                                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>
                                            Last Visit
                                        </th>
                                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>
                                            Next Appointment
                                        </th>
                                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>
                                            Status
                                        </th>
                                        <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #dee2e6' }}>
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredPatients.map((patient) => (
                                        <tr key={patient.id} className="clickable" style={{ borderBottom: '1px solid #dee2e6' }}>
                                            <td style={{ padding: '12px' }}>
                                                <strong>{patient.fullName}</strong>
                                                <br />
                                                <small style={{ color: '#666' }}>ID: {patient.id}</small>
                                            </td>
                                            <td style={{ padding: '12px' }}>{patient.lastVisit || '—'}</td>
                                            <td style={{ padding: '12px' }}>{patient.nextAppointment || '—'}</td>
                                            <td style={{ padding: '12px' }}>
                                                <span style={{
                                                    padding: '4px 12px',
                                                    background: patient.status === 'active' ? '#d4edda' : '#f8d7da',
                                                    color: patient.status === 'active' ? '#155724' : '#721c24',
                                                    borderRadius: '20px',
                                                    fontSize: '12px',
                                                    fontWeight: 'bold'
                                                }}>
                                                    {patient.status}
                                                </span>
                                            </td>
                                            <td style={{ padding: '12px', textAlign: 'center' }}>
                                                <button 
                                                    onClick={() => viewPatientRecords(patient.id)}
                                                    style={{
                                                        padding: '6px 12px',
                                                        background: '#5C6A5C',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '6px',
                                                        cursor: 'pointer',
                                                        fontSize: '14px'
                                                    }}
                                                >
                                                    📋 View Records
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                            <i style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>👥</i>
                            <h3>No Patients Found</h3>
                            <p>No patients match your current filters.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
