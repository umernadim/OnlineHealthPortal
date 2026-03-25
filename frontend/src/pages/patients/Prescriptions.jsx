import { useState, useEffect } from "react";
import PatientHeader from "./components/PatientHeader";
import SidebarPat from "./components/SidebarPat";
import api from "../../service/axios";

export default function Prescriptions() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("active"); // active, reminders, past

    useEffect(() => {
        loadPrescriptions();
    }, []);

    const loadPrescriptions = async () => {
        try {
            setLoading(true);
            const res = await api.get("/Prescription/patient");
            setPrescriptions(res.data || []);
        } catch (err) {
            console.error("Error loading prescriptions:", err);
        } finally {
            setLoading(false);
        }
    };

    // Filter prescriptions by tab
    const activePrescriptions = prescriptions.filter(p =>
        !p.isCompleted && new Date(p.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
    );
    const pastPrescriptions = prescriptions.filter(p =>
        p.isCompleted || new Date(p.createdAt) < new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    );

    if (loading) {
        return (
            <div className="patient-layout">
                <SidebarPat sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <main className="patient-content">
                    <PatientHeader
                        title="Loading Prescriptions..."
                        subtitle="Fetching your medical history"
                        sidebarOpen={sidebarOpen}
                        setSidebarOpen={setSidebarOpen}
                    />
                    <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
                        <div style={{ fontSize: '24px' }}>Loading...</div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="patient-layout">
            <SidebarPat sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            <main className="patient-content">
                <PatientHeader
                    title="Prescriptions"
                    subtitle={`Manage ${prescriptions.length} prescriptions`}
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                />

                {/* TABS */}
                <div style={{
                    display: 'flex', gap: '8px', marginBottom: '24px',
                    background: '#f8f9fa', padding: '8px', borderRadius: '12px',
                    maxWidth: '400px'
                }}>
                    <button
                        className={`tab-btn ${activeTab === 'active' ? 'active' : ''}`}
                        onClick={() => setActiveTab('active')}
                        style={{
                            padding: '12px 24px', border: 'none', borderRadius: '10px',
                            background: activeTab === 'active' ? '#5C6A5C' : 'transparent',
                            color: activeTab === 'active' ? 'white' : '#5C6A5C',
                            cursor: 'pointer', fontWeight: '500'
                        }}
                    >
                        Active ({activePrescriptions.length})
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'past' ? 'active' : ''}`}
                        onClick={() => setActiveTab('past')}
                        style={{
                            padding: '12px 24px', border: 'none', borderRadius: '10px',
                            background: activeTab === 'past' ? '#5C6A5C' : 'transparent',
                            color: activeTab === 'past' ? 'white' : '#5C6A5C',
                            cursor: 'pointer', fontWeight: '500'
                        }}
                    >
                        Past ({pastPrescriptions.length})
                    </button>
                </div>

                {/* ACTIVE PRESCRIPTIONS */}
                {activeTab === 'active' && (
                    <div className="record-card">
                        <h3>Active Prescriptions</h3>
                        {activePrescriptions.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                                <div style={{ fontSize: '48px', marginBottom: '16px' }}></div>
                                <p>No active prescriptions. Complete your appointments to get prescriptions!</p>
                            </div>
                        ) : (
                            activePrescriptions.map(prescription => (
                                <div key={prescription.id} className="prescription-row">
                                    <div style={{ flex: 1 }}>
                                        <strong>{prescription.medicines.split('\n')[0]}</strong>
                                        <p style={{ margin: '4px 0', color: '#666' }}>
                                            {prescription.dosageInstructions || 'Follow doctor instructions'}
                                        </p>
                                        <p style={{ margin: '4px 0', fontSize: '14px' }}>
                                            Dr. {prescription.doctorName} | {prescription.appointmentDate}
                                        </p>
                                    </div>
                                    <div className="actions" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>

                                        <span className="badge active" style={{
                                            padding: '6px 12px', background: '#d4edda', color: '#155724',
                                            borderRadius: '20px', fontSize: '12px', fontWeight: 'bold'
                                        }}>
                                            Active
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* PAST PRESCRIPTIONS */}
                {activeTab === 'past' && (
                    <div className="record-card">
                        <h3>Past Prescriptions</h3>
                        {pastPrescriptions.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                                <p>No past prescriptions found.</p>
                            </div>
                        ) : (
                            pastPrescriptions.map(prescription => (
                                <div key={prescription.id} className="prescription-row past">
                                    <div style={{ flex: 1 }}>
                                        <strong>{prescription.prescriptionDate}</strong>
                                        <p style={{ margin: '4px 0', color: '#666' }}>
                                            Dr. {prescription.doctorName}
                                        </p>
                                        <p style={{ margin: '4px 0', fontSize: '14px' }}>
                                            {prescription.medicines.split('\n')[0]}
                                        </p>
                                    </div>
                                    <div className="actions" style={{ display: 'flex', gap: '8px' }}>
                                        <button
                                            className="btn-outline"
                                            style={{
                                                padding: '8px 16px', background: 'transparent', color: '#5C6A5C',
                                                border: '1px solid #5C6A5C', borderRadius: '6px', cursor: 'pointer',
                                                fontSize: '14px'
                                            }}
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

            </main>
        </div>
    );
}
