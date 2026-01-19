import api from "../../service/axios";  // ✅ Token auto
import DoctorHeader from "./components/DoctorHeader";
import Sidebar from "./components/Sidebar";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function AppointmentManagement() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load ALL appointments for logged-in doctor
  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      // ✅ Backend auto-detects doctor from token
      const res = await api.get("/Appointment/doctor");
      setAppointments(res.data || []);
    } catch (error) {
      console.error("Error loading appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  // Update single appointment status
  const updateStatus = async (id, status) => {
    try {
      await api.put(`/Appointment/${id}/status`, status);
      loadAppointments();
      setSelected(prev => prev.filter(x => x !== id)); 
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // Batch update
  const handleBatchStatus = async (status) => {
    try {
      await Promise.all(selected.map(id => 
        api.put(`/Appointment/${id}/status`, status)
      ));
      setSelected([]);
      loadAppointments();
    } catch (error) {
      console.error("Batch update failed:", error);
    }
  };

  // Toggle selection
  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // Filter by status
  const [statusFilter, setStatusFilter] = useState("all");
  const filteredAppointments = appointments.filter(a => 
    statusFilter === "all" || a.status.toLowerCase() === statusFilter
  );

  if (loading) {
    return (
      <div className="doctor-layout">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="doctor-content">
          <DoctorHeader title="Loading..." sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <div className="loading">Loading appointments...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="doctor-layout">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main className="doctor-content">
        <DoctorHeader
          title="Appointment Management"
          subtitle={`${appointments.length} total bookings | ${selected.length} selected`}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* ACTION BAR */}
        <div className="action-bar">
          <div className="selection-info">
            {selected.length > 0 && (
              <>
                <span>{selected.length} selected</span>
                <button
                  className="primary-btn"
                  onClick={() => handleBatchStatus("Confirmed")}
                >
                  Accept Selected
                </button>
                <button
                  className="secondary-btn"
                  onClick={() => handleBatchStatus("Rejected")}
                >
                  Reject Selected
                </button>
              </>
            )}
          </div>

          {/* STATUS FILTER */}
          <div className="filter-bar">
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="status-filter"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button className="refresh-btn" onClick={loadAppointments}>
              Refresh
            </button>
          </div>
        </div>

        {/* ✅ COMPLETE APPOINTMENTS TABLE */}
        <div className="table-card">
          <div className="table-header">
            <h3>{statusFilter === "all" ? "All Appointments" : `${statusFilter.toUpperCase()} Appointments`} ({filteredAppointments.length})</h3>
            <span>Total Revenue: PKR {filteredAppointments.filter(a => a.status === "Completed").length * 1000}</span>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th><input 
                    type="checkbox" 
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelected(filteredAppointments.map(a => a.id));
                      } else {
                        setSelected([]);
                      }
                    }}
                  /></th>
                  <th>Patient Details</th>
                  <th>Date & Time</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Duration</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredAppointments.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="no-data">
                      No appointments found for "{statusFilter}"
                    </td>
                  </tr>
                ) : (
                  filteredAppointments.map(a => (
                    <tr key={a.id} className={`status-${a.status.toLowerCase()}`}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selected.includes(a.id)}
                          onChange={() => toggleSelect(a.id)}
                        />
                      </td>
                      
                      {/* ✅ PATIENT DETAILS */}
                      <td className="patient-info">
                        <strong>Patient #{a.patientId}</strong>
                        {a.patientName && <p>{a.patientName}</p>}
                        {a.patientPhone && <small>{a.patientPhone}</small>}
                      </td>

                      {/* DATE TIME */}
                      <td>
                        <div>{new Date(a.appointmentDate).toLocaleDateString()}</div>
                        <div className="time">
                          {new Date(a.appointmentDate).toLocaleTimeString([], 
                            { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>

                      <td>
                        <span className={`type ${a.type.toLowerCase().replace(' ', '-')}`}>
                          {a.type}
                        </span>
                      </td>

                      {/* STATUS */}
                      <td>
                        <span className={`status ${a.status.toLowerCase()}`}>
                          {a.status}
                        </span>
                      </td>

                      {/* DURATION */}
                      <td>{a.duration || "30 min"}</td>

                      {/* ✅ ACTIONS */}
                      <td className="actions">
                        {a.status === "Pending" && (
                          <>
                            <button 
                              className="btn-sm confirm"
                              onClick={() => updateStatus(a.id, "Confirmed")}
                            >
                              ✓ Accept
                            </button>
                            <button 
                              className="btn-sm reject"
                              onClick={() => updateStatus(a.id, "Rejected")}
                            >
                              ✗ Reject
                            </button>
                          </>
                        )}
                        {a.status === "Confirmed" && (
                          <>
                            <button 
                              className="btn-sm complete"
                              onClick={() => updateStatus(a.id, "Completed")}
                            >
                              ✅ Complete
                            </button>
                            <button 
                              className="btn-sm cancel"
                              onClick={() => updateStatus(a.id, "Cancelled")}
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        {["Completed", "Rejected", "Cancelled"].includes(a.status) && (
                          <span className="action-disabled">Done</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* AVAILABILITY + STATS */}
        <div className="appointment-grid">
          <div className="dashboard-card">
            <h3>Quick Stats</h3>
            <div className="stats-mini">
              <div className="stat-item">
                <span>Pending</span>
                <strong>{appointments.filter(a => a.status === "Pending").length}</strong>
              </div>
              <div className="stat-item">
                <span>Confirmed</span>
                <strong>{appointments.filter(a => a.status === "Confirmed").length}</strong>
              </div>
              <div className="stat-item">
                <span>Completed</span>
                <strong>{appointments.filter(a => a.status === "Completed").length}</strong>
              </div>
            </div>
          </div>

          <div className="dashboard-card">
            <h3>Update Availability</h3>
            <div className="form-group">
              <input type="date" placeholder="Date" />
              <input type="time" placeholder="Start Time" />
              <input type="time" placeholder="End Time" />
              <button className="primary-btn">Save Slots</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
