import AdminHeader from "./components/AdminHeader";
import SideBar from "./components/SideBar";
import { useState, useEffect } from 'react';
import api from "../../service/axios";

export default function ManagePatients() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [patients, setPatients] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [filteredPatients, setFilteredPatients] = useState([]);
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        loadPatients();
    }, []);

    useEffect(() => {
        // Filter patients by search
        const filtered = patients.filter(patient =>
            patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredPatients(filtered);
    }, [searchTerm, patients]);

    const loadPatients = async () => {
        try {
            setLoading(true);
            console.log(" Calling /Admin/patients...");

            const res = await api.get("/Admin/patients");
            console.log("✅ RAW API DATA:", res.data);
            console.log("📊 Total count:", res.data.length);
            console.table(res.data.slice(0, 3));  // First 3 patients

            setPatients(res.data || []);
        } catch (err) {
            console.error("❌ API ERROR:", err.response?.status, err.response?.data);
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
                        title="Loading Patients..."
                        subtitle="Fetching patient records"
                        sidebarOpen={sidebarOpen}
                        setSidebarOpen={setSidebarOpen}
                    />
                    <div style={{ textAlign: 'center', padding: '100px', color: '#666' }}>
                        <div style={{ fontSize: '48px', marginBottom: '20px' }}></div>
                        <div style={{ fontSize: '24px' }}>Loading patients...</div>
                    </div>
                </main>
            </div>
        );
    }

    // ✅ DELETE FUNCTION (component top mein add):

    const deletePatient = async (userId) => {
        if (!window.confirm(`⚠️ Delete patient permanently?\nThis will remove their account, appointments & prescriptions.`)) {
            return;
        }

        try {
            setDeletingId(userId);
            await api.delete(`/Admin/patients/${userId}`);

            // ✅ Refresh list
            await loadPatients();
            alert('✅ Patient deleted successfully!');
        } catch (err) {
            console.error('Delete error:', err);
            alert('❌ Delete failed: ' + (err.response?.data?.message || 'Server error'));
        } finally {
            setDeletingId(null);
        }
    };

    // ✅ VIEW FUNCTION (optional)
    const viewPatient = (userId) => {
        window.open(`/admin/patient/${userId}`, '_blank');
    };

    return (
        <div className={`admin-layout ${sidebarOpen ? "sidebar-open" : ""}`}>
            {/* SIDEBAR */}
            <SideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            {/* MAIN CONTENT */}
            <main className="admin-content">
                <div className="manage-patients">
                    {/* HEADER */}
                    <AdminHeader
                        title="Manage Patients"
                        subtitle={`${filteredPatients.length} patients found`}
                        sidebarOpen={sidebarOpen}
                        setSidebarOpen={setSidebarOpen}
                    />

                    <div className="header-bottom">
                        {/* SEARCH */}
                        <div className="search-bar">
                            <input
                                type="text"
                                placeholder="Search by name, ID, or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button
                                className="primary-btn"
                                onClick={loadPatients}
                                style={{ marginLeft: '10px' }}
                            >
                                Refresh
                            </button>
                        </div>
                    </div>

                    {/* PATIENT TABLE */}
                    <div className="table-card">
                        {filteredPatients.length === 0 ? (
                            <div style={{
                                textAlign: 'center', padding: '60px', color: '#666',
                                fontSize: '18px'
                            }}>
                                <div style={{ fontSize: '64px', marginBottom: '20px' }}></div>
                                {searchTerm ? "No patients match your search." : "No patients found."}
                                <br />
                                <button className="primary-btn" onClick={loadPatients} style={{ marginTop: '20px' }}>
                                    Reload Patients
                                </button>
                            </div>
                        ) : (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Patient</th>
                                        <th>ID</th>
                                        <th>Phone</th>
                                        <th>Status</th>
                                        <th>Appts</th>
                                        <th style={{ width: '120px' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredPatients.map((patient) => (
                                        <tr key={patient.id}>
                                            <td className="info">
                                                <img
                                                    src={`https://ui-avatars.com/api/?name=${patient.name}&background=5C6A5C&color=fff&size=40`}
                                                    alt={patient.name}
                                                    style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '12px' }}
                                                />
                                                <div>
                                                    <strong>{patient.name}</strong>
                                                    <br />
                                                    <small style={{ color: '#666' }}>{patient.email}</small>
                                                </div>
                                            </td>
                                            <td><strong>{patient.patientId}</strong></td>
                                            <td>{patient.phone}</td>
                                            <td className={`status ${patient.status.toLowerCase()}`}>
                                                {patient.status}
                                            </td>
                                            <td>{patient.appointmentsCount}</td>
                                            <td className="action-btns" style={{ display: 'flex', gap: '8px' }}>
                                                <button
                                                    className="action-btn"
                                                    style={{ padding: '6px 12px' }}
                                                    onClick={() => viewPatient(patient.id)}
                                                >
                                                    View
                                                </button>
                                                <button
                                                    className="danger-btn"
                                                    style={{
                                                        padding: '6px 12px',
                                                        background: '#f98691',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '6px',
                                                        cursor: 'pointer',
                                                        fontSize: '14px'
                                                    }}
                                                    onClick={() => deletePatient(patient.id)}
                                                >
                                                    Delete
                                                </button>
                                            </td>

                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
