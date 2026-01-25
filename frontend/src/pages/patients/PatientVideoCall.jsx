// Patient/VideoCall.jsx - ✅ PERFECT!
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";  // ✅ MISSING IMPORT
import PatientHeader from "./components/PatientHeader";
import SidebarPat from "./components/SidebarPat";

export default function PatientVideoCall() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [roomId, setRoomId] = useState("health-portal-123");
    const [doctorName, setDoctorName] = useState("Dr. Ahmed Khan");
    const { roomId: urlRoomId } = useParams(); 

    useEffect(() => {
        if (urlRoomId) {
            setRoomId(urlRoomId);  
        }
    }, [urlRoomId]);

    // ✅ Patient hardcoded (no isPatient variable needed)
    const jitsiUrl = `https://meet.jit.si/${roomId}?username=Patient&password=123456`;

    return (
        <div className="patient-layout">
            <SidebarPat sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <main className="patient-content">
                <PatientHeader
                    title="🎥 Video Consultation"
                    subtitle={`Room: ${roomId}`}  
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                />

                <div className="video-call-container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    {/* VIDEO PLAYER */}
                    <iframe
                        src={jitsiUrl}
                        width="100%"
                        height="600px"
                        allow="camera; microphone; fullscreen; display-capture"
                        style={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                    />

                    {/* CONTROLS */}
                    <div style={{ 
                        textAlign: 'center', 
                        marginTop: '20px', 
                        padding: '24px', 
                        background: '#f8f9fa', 
                        borderRadius: '12px',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
                    }}>
                        <h4 style={{ margin: '0 0 12px 0', color: '#333' }}>Consultation Room: <strong>{roomId}</strong></h4>
                        <p style={{ margin: '0 0 20px 0', color: '#666' }}>
                            Share this link with your doctor: 
                            <br />
                            <strong>{`${window.location.origin}/patient/video/${roomId}`}</strong>
                        </p>
                        <button 
                            className="primary-btn" 
                            onClick={() => window.open(jitsiUrl, '_blank')}
                            style={{ padding: '12px 24px', fontSize: '16px' }}
                        >
                            🔗 Open in New Tab
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
