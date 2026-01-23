import api from "../../service/axios";
import DoctorHeader from "./components/DoctorHeader";
import Sidebar from "./components/Sidebar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Fixed import

export default function AppointmentManagement() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const res = await api.get("/Appointment/doctor");
      setAppointments(res.data || []);
    } catch (error) {
      console.error("Error loading appointments:", error);
    } finally {
      setLoading(false);
    }
  };

 const updateStatus = async (id, status) => {
    await api.put(`/Appointment/${id}/status`, { status });  // ✅ Object!
    loadAppointments();
};


  const handleBatchStatus = async (status) => {
    try {
      await Promise.all(selected.map(id =>
        api.put(`/Appointment/${id}/status`, { status })
      ));
      setSelected([]);
      loadAppointments();
    } catch (error) {
      console.error("Batch update failed:", error);
    }
  };

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const filteredAppointments = appointments.filter(a =>
    statusFilter === "all" || a.status.toLowerCase() === statusFilter
  );

  if (loading) {
    return (
      <div className="doctor-layout">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="doctor-content">
          <DoctorHeader title="Loading..." sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
            <div style={{ fontSize: '24px' }}>Loading appointments...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="doctor-layout">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main className="doctor-content">
        <DoctorHeader
          title="👨‍⚕️ Appointment Management"
          subtitle={`${appointments.length} total | ${selected.length} selected`}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* ACTION BAR */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: '20px', flexWrap: 'wrap', gap: '15px'
        }}>
          <div>
            {selected.length > 0 && (
              <>
                <span style={{ marginRight: '15px', fontWeight: 'bold' }}>
                  {selected.length} selected
                </span>
                <button
                  className="primary-btn"
                  style={{ padding: '8px 16px', marginRight: '10px' }}
                  onClick={() => handleBatchStatus("Confirmed")}
                >
                  ✓ Accept Selected
                </button>
                <button
                  className="secondary-btn"
                  style={{ padding: '8px 16px' }}
                  onClick={() => handleBatchStatus("Rejected")}
                >
                  ✗ Reject Selected
                </button>
              </>
            )}
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px' }}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button
              onClick={loadAppointments}
              style={{
                padding: '8px 16px', background: '#5C6A5C', color: 'white',
                border: 'none', borderRadius: '6px', cursor: 'pointer'
              }}
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="table-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
            <h3>
              {statusFilter === "all" ? "All Appointments" : `${statusFilter.toUpperCase()} Appointments`}
              ({filteredAppointments.length})
            </h3>
            <div style={{ color: '#666' }}>
              Revenue: PKR {filteredAppointments.filter(a => a.status === "Completed").length * 1000}
            </div>
          </div>

          {filteredAppointments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📅</div>
              <h3>No appointments found</h3>
              <p>No {statusFilter} appointments for this filter.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8f9fa' }}>
                    <th style={{ padding: '12px', width: '40px' }}>
                      <input
                        type="checkbox"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelected(filteredAppointments.map(a => a.id));
                          } else {
                            setSelected([]);
                          }
                        }}
                      />
                    </th>
                    <th style={{ padding: '12px' }}>Patient</th>
                    <th style={{ padding: '12px' }}>Date & Time</th>
                    <th style={{ padding: '12px' }}>Type</th>
                    <th style={{ padding: '12px' }}>Status</th>
                    <th style={{ padding: '12px' }}>Duration</th>
                    <th style={{ padding: '12px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.map(a => (
                    <tr key={a.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <input
                          type="checkbox"
                          checked={selected.includes(a.id)}
                          onChange={() => toggleSelect(a.id)}
                        />
                      </td>

                      <td style={{ padding: '12px' }}>
                        <strong>#{a.patientId}</strong>
                        {a.patientName && <div>{a.patientName}</div>}
                        {a.patientPhone && <div style={{ color: '#666', fontSize: '14px' }}>{a.patientPhone}</div>}
                      </td>

                      <td style={{ padding: '12px' }}>
                        <div>{new Date(a.appointmentDate).toLocaleDateString('en-GB')}</div>
                        <div style={{ color: '#666', fontSize: '14px' }}>
                          {new Date(a.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>

                      <td style={{ padding: '12px' }}>
                        <span style={{
                          padding: '4px 12px', background: '#e3f2fd', color: '#1976d2',
                          borderRadius: '20px', fontSize: '14px', fontWeight: '500'
                        }}>
                          {a.type}
                        </span>
                      </td>

                      <td style={{ padding: '12px' }}>
                        <span style={{
                          padding: '6px 12px',
                          background: getStatusColor(a.status),
                          color: 'white',
                          borderRadius: '20px',
                          fontSize: '14px',
                          fontWeight: 'bold'
                        }}>
                          {a.status}
                        </span>
                      </td>

                      <td style={{ padding: '12px' }}>{a.duration || "30 min"}</td>

                      <td style={{ padding: '12px', whiteSpace: 'nowrap' }}>
                        {/* PENDING */}
                        {a.status === "Pending" && (
                          <>
                            <button
                              onClick={() => updateStatus(a.id, "Confirmed")}
                              style={{
                                padding: '6px 12px', marginRight: '5px',
                                background: '#4caf50', color: 'white',
                                border: 'none', borderRadius: '6px', fontSize: '13px', cursor: 'pointer'
                              }}
                            >
                              ✓ Accept
                            </button>
                            <button
                              onClick={() => updateStatus(a.id, "Rejected")}
                              style={{
                                padding: '6px 12px',
                                background: '#f44336', color: 'white',
                                border: 'none', borderRadius: '6px', fontSize: '13px', cursor: 'pointer'
                              }}
                            >
                              ✗ Reject
                            </button>
                          </>
                        )}

                        {/* CONFIRMED */}
                        {a.status === "Confirmed" && (
                          <button
                            onClick={() => updateStatus(a.id, "Completed")}
                            style={{
                              padding: '6px 12px',
                              background: '#ff9800', color: 'white',
                              border: 'none', borderRadius: '6px', fontSize: '13px', cursor: 'pointer'
                            }}
                          >
                            ✅ Complete
                          </button>
                        )}

                        {/* ✅ PRESCRIPTION BUTTONS */}
                        {a.status === "Completed" && !a.hasPrescription && (
                          <button
                            onClick={() => navigate(`/prescriptionWriter/${a.id}`)}
                            style={{
                              padding: '6px 12px',
                              background: '#5C6A5C', color: 'white',
                              border: 'none', borderRadius: '6px', fontSize: '13px', cursor: 'pointer'
                            }}
                          >
                            📝 Write Prescription
                          </button>
                        )}

                        {a.status === "Completed" && a.hasPrescription && (
                          <button
                            onClick={() => navigate(`/patientRecords?patientId=${a.patientId}`)}
                            style={{
                              padding: '6px 12px',
                              background: '#2196f3', color: 'white',
                              border: 'none', borderRadius: '6px', fontSize: '13px', cursor: 'pointer'
                            }}
                          >
                            👁 View Records
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// ✅ Status color helper
function getStatusColor(status) {
  const colors = {
    'Pending': '#ff9800',
    'Confirmed': '#4caf50',
    'Completed': '#2196f3',
    'Rejected': '#f44336',
    'Cancelled': '#9e9e9e'
  };
  return colors[status] || '#9e9e9e';
}
