import { useEffect, useState } from "react";
import DoctorHeader from "./components/DoctorHeader";
import Sidebar from "./components/Sidebar";
import api from "../../service/axios";
import { useSearchParams } from "react-router-dom";

export default function PatientRecords() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const patientId = searchParams.get("patientId"); 

    useEffect(() => {
        if (patientId) {
            loadPatientRecords();
        }
    }, [patientId]);

    const loadPatientRecords = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/HealthRecord/patient/${patientId}`);
            setRecords(res.data || []);
        } catch (err) {
            console.error("Error loading patient records:", err);
        } finally {
            setLoading(false);
        }
    };

    const getRecordTypeIcon = (type) => {
        const icons = {
            "Xray": "📷", "LabReport": "🧪", "Prescription": "💊",
            "BloodTest": "🩸", "Scan": "🩻", "Discharge": "📋"
        };
        return icons[type] || "📄";
    };

    if (loading) {
        return (
            <div className="doctor-layout">
                <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <main className="doctor-content">
                    <DoctorHeader
                        title="Loading Patient Records..."
                        subtitle="Fetching medical history"
                        sidebarOpen={sidebarOpen}
                        setSidebarOpen={setSidebarOpen}
                    />
                    <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
                        <div style={{ fontSize: '24px' }}>Loading records...</div>
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
                    title="Patient Records"
                    subtitle={`Medical history & reports (${records.length} records)`}
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                />

                {/* RECORDS OVERVIEW */}
                <div className="records-grid">
                    <div className="record-card">
                        <h3>Summary</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div>
                                <strong>Total Records:</strong> {records.length}
                            </div>
                            <div>
                                <strong>Recent Upload:</strong> {records[0]?.uploadedAt || 'None'}
                            </div>
                        </div>
                    </div>

                    <div className="record-card">
                        <h3>Record Types</h3>
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            {records.map(r => (
                                <span key={r.id} style={{
                                    padding: '4px 12px', background: '#e3f2fd', 
                                    borderRadius: '20px', fontSize: '14px'
                                }}>
                                    {r.recordType}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ALL RECORDS TABLE */}
                <div className="record-card">
                    <h3>All Records ({records.length})</h3>
                    {records.length > 0 ? (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ background: '#f8f9fa' }}>
                                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Type</th>
                                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Title</th>
                                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Date</th>
                                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>File</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {records.map((record) => (
                                        <tr key={record.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                                            <td style={{ padding: '12px' }}>
                                                <span style={{ fontSize: '20px', marginRight: '8px' }}>
                                                    {getRecordTypeIcon(record.recordType)}
                                                </span>
                                                {record.recordType}
                                            </td>
                                            <td style={{ padding: '12px' }}>{record.title}</td>
                                            <td style={{ padding: '12px' }}>{record.uploadedAt}</td>
                                            <td style={{ padding: '12px' }}>
                                                {record.hasFile ? (
                                                    <a 
                                                        href={`https://localhost:7224${record.filePath}`} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        style={{ 
                                                            color: '#5C6A5C', 
                                                            textDecoration: 'none',
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: '5px'
                                                        }}
                                                    >
                                                        📎 {record.fileName}
                                                    </a>
                                                ) : "No file"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                            <i style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>📋</i>
                            <p>No health records found for this patient.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
