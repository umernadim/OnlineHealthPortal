import { useEffect, useState } from "react";
import SidebarPat from "./components/SidebarPat";
import api from "../../service/axios";
import { useAuth } from "../../context/AuthContext";

export default function HealthRecords() {
    const { user } = useAuth();
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [showUploadForm, setShowUploadForm] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        recordType: "Xray",
        description: "",
        recordDate: "",
        notes: ""
    });
    const [file, setFile] = useState(null);

    useEffect(() => {
        loadRecords();
    }, [user]);

    const loadRecords = async () => {
        try {
            setLoading(true);
            const res = await api.get("/HealthRecord/patient");
            setRecords(res.data || []);
        } catch (err) {
            console.error("Error loading records:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) {
            alert("Please select a file");
            return;
        }

        const data = new FormData();
        data.append("Title", formData.title);           // ✅ PascalCase
        data.append("RecordType", formData.recordType); // ✅ PascalCase
        data.append("File", file);                      // ✅ PascalCase (dto.File)
        // description, notes, recordDate optional - ignore for now

        try {
            setUploading(true);
            const response = await api.post("/HealthRecord", data, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            alert("✅ Record uploaded successfully!");
            setShowUploadForm(false);
            setFile(null);
            setFormData({ title: "", recordType: "Xray", description: "", recordDate: "", notes: "" });
            loadRecords();
        } catch (err) {
            console.error("Upload error:", err.response?.data || err.message);
            alert("❌ Upload failed: " + (err.response?.data || err.message));
        } finally {
            setUploading(false);
        }
    };


    const getRecordTypeIcon = (type) => {
        const icons = {
            "Xray": "📷",
            "LabReport": "🧪",
            "Prescription": "💊",
            "BloodTest": "🩸",
            "Scan": "🩻",
            "Discharge": "📋"
        };
        return icons[type] || "📄";
    };

    if (loading) {
        return (
            <div className="patient-layout">
                <SidebarPat />
                <main className="patient-content">
                    <div style={{ textAlign: 'center', padding: '50px' }}>
                        <div style={{ fontSize: '24px', color: '#F3F5F1' }}>Loading records...</div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="patient-layout">
            <SidebarPat />
            <main className="patient-content">
                <div className="page-header">
                    <h1>Health Records</h1>
                    <p>Upload & review your medical information ({records.length} records)</p>
                </div>

                {/* UPLOAD BUTTON */}
                <div className="record-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3>Upload New Record</h3>
                        <button
                            onClick={() => setShowUploadForm(!showUploadForm)}
                            style={{ padding: '8px 16px', background: '#5C6A5C', color: 'white', border: 'none', borderRadius: '6px' }}
                        >
                            {showUploadForm ? "Cancel" : "+ Upload"}
                        </button>
                    </div>

                    {showUploadForm && (
                        <form onSubmit={handleUpload} style={{ marginTop: '20px', padding: '20px', background: '#f8f9fa', borderRadius: '8px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                                <input
                                    type="text"
                                    placeholder="Record Title (e.g. Chest X-Ray)"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}
                                    required
                                />
                                <select
                                    value={formData.recordType}
                                    onChange={(e) => setFormData({ ...formData, recordType: e.target.value })}
                                    style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}
                                >
                                    <option value="Xray">X-Ray/Imaging</option>
                                    <option value="LabReport">Lab Report</option>
                                    <option value="Prescription">Prescription</option>
                                    <option value="BloodTest">Blood Test</option>
                                    <option value="Scan">Scan/MRI</option>
                                    <option value="Discharge">Discharge Summary</option>
                                </select>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                                <input
                                    type="date"
                                    value={formData.recordDate}
                                    onChange={(e) => setFormData({ ...formData, recordDate: e.target.value })}
                                    style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}
                                />
                                <input
                                    type="file"
                                    onChange={(e) => setFile(e.target.files[0])}
                                    style={{ padding: '10px' }}
                                    required
                                />
                            </div>
                            <textarea
                                placeholder="Description/Notes"
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                rows={3}
                                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', marginBottom: '15px' }}
                            />
                            <button
                                type="submit"
                                disabled={uploading || !file}
                                style={{
                                    width: '100%', padding: '12px', background: uploading || !file ? '#ccc' : '#5C6A5C',
                                    color: 'white', border: 'none', borderRadius: '6px', fontSize: '16px'
                                }}
                            >
                                {uploading ? "Uploading..." : "Upload Record"}
                            </button>
                        </form>
                    )}
                </div>

                {/* RECORDS TABLE */}
                <div className="record-card">
                    <h3>Your Records ({records.length})</h3>
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
                                                <span style={{ fontSize: '20px' }}>{getRecordTypeIcon(record.recordType)}</span>
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
                                                        style={{ color: '#5C6A5C', textDecoration: 'none' }}
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
                    )

                        : (
                            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                                <i style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>📋</i>
                                <p>No health records found. Upload your first record above!</p>
                            </div>
                        )}
                </div>
            </main>
        </div>
    );
}
