import { useEffect, useState } from "react";
import SidebarPat from "./components/SidebarPat";
import api from "../../service/axios";
import { useAuth } from "../../context/AuthContext";
import PatientHeader from "./components/PatientHeader";
import { Link } from "react-router";

export default function MyAppointments() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showReschedule, setShowReschedule] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);

    useEffect(() => {
        if (user) {
            loadAppointments();
        }
    }, [user]);

    const loadAppointments = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await api.get("/Appointment/patient");
            setAppointments(res.data || []);
        } catch (err) {
            console.error("Error loading appointments:", err);
            setError("Failed to load appointments");
        } finally {
            setLoading(false);
        }
    };

    // Categorize
    const today = new Date();
    const upcoming = appointments.filter(
        (appt) => new Date(appt.appointmentDate) >= today && appt.status !== "Cancelled"
    );
    const past = appointments.filter(
        (appt) => new Date(appt.appointmentDate) < today || appt.status === "Completed" || appt.status === "Cancelled"
    );

    const handleCancel = async (appointmentId) => {
        const appointment = appointments.find(appt => appt.id === appointmentId);
        if (!window.confirm(`Cancel appointment with Dr. ${appointment?.doctorName || ''}?`)) return;

        try {
            await api.put(`/Appointment/${appointmentId}/cancel`);
            loadAppointments();
            alert("✅ Appointment cancelled successfully!");
        } catch (err) {
            alert("❌ Cancel failed: " + (err.response?.data?.message || "Try again"));
        }
    };

    // ✅ FIXED VIDEO CALL HANDLER
    const handleJoinVideo = (appointment) => {
        if (appointment.meetingLink && appointment.status === "Confirmed") {
            window.open(`/patient/video/${appointment.meetingLink}`, '_blank');
        } else {
            alert("Video call available only for confirmed appointments with Meeting link");
        }
    };

    const handleRescheduleClick = async (appt) => {
        setSelectedAppointment(appt);
        setShowReschedule(true);
        setAvailableSlots([]);

        try {
            const todayStr = new Date().toISOString().split('T')[0];
            const res = await api.get(`/Appointment/${appt.id}/available-slots?preferredDate=${todayStr}`);
            setAvailableSlots(res.data);
        } catch (err) {
            alert("Could not load available slots");
            setShowReschedule(false);
        }
    };

    const handleConfirmReschedule = async () => {
        if (!selectedSlot) return;

        try {
            await api.put(`/Appointment/${selectedAppointment.id}/reschedule`, selectedSlot);
            loadAppointments();
            setShowReschedule(false);
            setSelectedSlot(null);
            alert("✅ Appointment rescheduled successfully!");
        } catch (err) {
            alert("❌ Reschedule failed");
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            "Pending": "bg-yellow-100 text-yellow-800",
            "Confirmed": "bg-green-100 text-green-800",
            "Completed": "bg-blue-100 text-blue-800",
            "Cancelled": "bg-red-100 text-red-800"
        };
        return `badge ${badges[status] || "bg-gray-100 text-gray-800"}`;
    };

    if (loading) {
        return (
            <div className="patient-layout">
                <SidebarPat sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <main className="patient-content">
                    <PatientHeader
                        title="My Appointments"
                        subtitle="Loading appointments..."
                        sidebarOpen={sidebarOpen}
                        setSidebarOpen={setSidebarOpen}
                    />
                    <div style={{ textAlign: 'center', padding: '50px' }}>
                        <div style={{ fontSize: '24px', color: '#5c6a5c' }}>Loading...</div>
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
                    title="My Appointments"
                    subtitle={`Manage your upcoming & past consultations(${appointments.length} total)`}
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                />

                {error && (
                    <div style={{ background: '#fee', color: '#c33', padding: '15px', marginBottom: '20px', borderRadius: '8px' }}>
                        ⚠️ {error}
                        <button onClick={loadAppointments} style={{ marginLeft: '10px', padding: '5px 15px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
                            Retry
                        </button>
                    </div>
                )}

                {/* UPCOMING */}
                <div className="record-card">
                    <h3>Upcoming Appointments ({upcoming.length})</h3>
                    {upcoming.length > 0 ? (
                        upcoming.map((appt) => (
                            <div key={appt.id} className="appointment-row" style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '20px',
                                borderBottom: '1px solid #eee',
                                borderRadius: '8px',
                                marginBottom: '12px',
                                background: 'white'
                            }}>
                                <div style={{ flex: 1 }}>
                                    <strong style={{ fontSize: '16px', color: '#333' }}>
                                        {new Date(appt.appointmentDate).toLocaleDateString('en-PK')} •
                                        {new Date(appt.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </strong>
                                    <p style={{ margin: '8px 0 12px 0', fontSize: '16px', color: '#007bff', fontWeight: '500' }}>
                                        Dr. {appt.doctorName}
                                    </p>
                                    <span style={{
                                        padding: '6px 14px',
                                        background: '#d4edda',
                                        color: '#155724',
                                        borderRadius: '20px',
                                        fontSize: '13px',
                                        fontWeight: '500'
                                    }}>
                                        {appt.status}
                                    </span>
                                </div>

                                {/* ✅ VIDEO BUTTON + WHATSAPP SHARE + ACTIONS */}
                                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                                    {appt.status === "Confirmed" && appt.meetingLink && (
                                        <>
                                            {/* Video Call Button */}
                                            <button
                                                onClick={() => handleJoinVideo(appt)}
                                                style={{
                                                    padding: '10px 18px',
                                                    background: '#5c6f5c',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    fontSize: '14px',
                                                    fontWeight: '500',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '8px',                                                    transition: 'all 0.2s ease'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.target.style.transform = 'translateY(-2px)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.target.style.transform = 'translateY(0)';
                                                }}
                                            >
                                                Video Call
                                            </button>

                                            {/* ✅ WHATSAPP SHARE BUTTON - NEW! */}
                                            <button
                                                onClick={() => {
                                                    const doctorName = appt.doctorName || 'Your Doctor';
                                                    const dateTime = new Date(appt.appointmentDate).toLocaleString('en-PK');
                                                    const msg = `*Video Consultation Started!*\n\nDoctor: ${doctorName}\nDate & Time: ${dateTime}\nJoin now: ${window.location.origin}/patient/video/${appt.meetingLink}\n\n*Don't miss your appointment!*`;
                                                    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
                                                }}
                                                style={{
                                                    padding: '10px 14px',
                                                    background: '#5c6f5c',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    fontSize: '14px',
                                                    fontWeight: '500',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    transition: 'all 0.2s ease'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.target.style.transform = 'translateY(-2px)';
                                                    e.target.style.boxShadow = '0 6px 20px rgba(37,211,102,0.5)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.target.style.transform = 'translateY(0)';
                                                    e.target.style.boxShadow = '0 4px 12px rgba(37,211,102,0.4)';
                                                }}
                                                title="Share with Family/Group on WhatsApp"
                                            >
                                                Share
                                            </button>
                                        </>
                                    )}

                                    {/* Reschedule + Cancel */}
                                    {appt.status !== "Cancelled" && (
                                        <>
                                            <button
                                                onClick={() => handleRescheduleClick(appt)}
                                                style={{
                                                    padding: '10px 16px',
                                                    border: '1px solid #ddd',
                                                    background: 'white',
                                                    borderRadius: '8px',
                                                    fontSize: '14px',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s ease'
                                                }}
                                            >
                                                Reschedule
                                            </button>
                                            <button
                                                onClick={() => handleCancel(appt.id)}
                                                style={{
                                                    padding: '10px 16px',
                                                    background: '#b22836',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    fontSize: '14px',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s ease'
                                                }}
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    )}
                                </div>


                            </div>
                        ))
                    ) : (
                        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#666' }}>
                            <i style={{ fontSize: '64px', display: 'block', marginBottom: '20px' }}></i>
                            <h3 style={{ marginBottom: '12px', color: '#333' }}>No upcoming appointments</h3>
                            <p>Book your first consultation with a doctor</p>
                            <Link to="/doctors" style={{
                                color: '#5c6a5c',
                                textDecoration: 'none',
                                padding: '12px 24px',
                                border: '2px solid #5c6a5c',
                                borderRadius: '8px',
                                fontWeight: '500',
                                display: 'inline-block',
                                marginTop: '16px'
                            }}>
                                Book Appointment →
                            </Link>
                        </div>
                    )}
                </div>

                {/* PAST APPOINTMENTS - SAME STRUCTURE */}
                <div className="record-card" style={{ marginTop: '24px' }}>
                    <h3>Past Appointments ({past.length})</h3>
                    {past.length > 0 ? (
                        past.slice(0, 5).map((appt) => (
                            <div key={appt.id} className="appointment-row past" style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '20px',
                                borderBottom: '1px solid #eee',
                                borderRadius: '8px'
                            }}>
                                <div style={{ flex: 1 }}>
                                    <strong style={{ fontSize: '16px', color: '#666' }}>
                                        {new Date(appt.appointmentDate).toLocaleDateString('en-PK')} •
                                        {new Date(appt.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </strong>
                                    <p style={{ margin: '8px 0 12px 0', fontSize: '16px', color: '#333' }}>
                                        Dr. {appt.doctorName}
                                    </p>
                                    <span style={{
                                        padding: '6px 14px',
                                        background: '#dee1de',
                                        color: '#5c6a5c',
                                        borderRadius: '20px',
                                        fontSize: '13px'
                                    }}>
                                        {appt.status}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <Link to="/prescriptions" style={{
                                        padding: '10px 16px',
                                        border: '1px solid #ddd',
                                        background: 'white',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        cursor: 'pointer',
                                        textDecoration: 'none',
                                        color: '#5c6a5c'
                                    }}>
                                        View Prescription
                                    </Link>

                                </div>
                            </div>
                        ))
                    ) : (
                        <p style={{ textAlign: 'center', color: '#666', padding: '40px 20px' }}>
                            No past appointments found
                        </p>
                    )}
                </div>

                {/* RESCHEDULE MODAL - SAME AS BEFORE */}
                {showReschedule && selectedAppointment && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.5)', zIndex: 1000,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
                    }}>
                        <div style={{
                            background: 'white', padding: '30px', borderRadius: '12px',
                            maxWidth: '500px', width: '100%', maxHeight: '80vh', overflowY: 'auto'
                        }}>
                            <h3>Reschedule Appointment</h3>
                            <p style={{ marginBottom: '20px' }}>Dr. {selectedAppointment.doctorName}</p>

                            <div style={{ marginBottom: '20px' }}>
                                <strong>Available Slots:</strong>
                                {availableSlots.length > 0 ? (
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px', marginTop: '10px' }}>
                                        {availableSlots.map((slot, index) => (
                                            <button
                                                key={index}
                                                type="button"
                                                onClick={() => setSelectedSlot(slot)}
                                                style={{
                                                    padding: '12px',
                                                    border: selectedSlot?.toString() === slot.toString() ? '2px solid #007bff' : '1px solid #ddd',
                                                    background: selectedSlot?.toString() === slot.toString() ? '#e3f2fd' : 'white',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                {new Date(slot).toLocaleString('en-PK', {
                                                    weekday: 'short', month: 'short', day: 'numeric',
                                                    hour: '2-digit', minute: '2-digit'
                                                })}
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <p>No available slots. Please try another time.</p>
                                )}
                            </div>

                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                <button
                                    onClick={() => { setShowReschedule(false); setSelectedSlot(null); }}
                                    style={{ padding: '10px 20px', border: '1px solid #ddd', background: 'white', borderRadius: '6px' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleConfirmReschedule}
                                    disabled={!selectedSlot}
                                    style={{
                                        padding: '10px 20px',
                                        background: selectedSlot ? '#007bff' : '#ccc',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '6px',
                                        cursor: selectedSlot ? 'pointer' : 'not-allowed'
                                    }}
                                >
                                    Confirm New Time
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
