import DoctorHeader from "./components/DoctorHeader";
import Sidebar from "./components/Sidebar";
import api from "../../service/axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function PrescriptionWriter() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [appointment, setAppointment] = useState(null);
  const [form, setForm] = useState({
    medicines: "",
    dosageInstructions: "",
    notes: ""
  });

  useEffect(() => {
    if (appointmentId) {
      loadAppointment();
    } else {
      setError("No appointment ID provided");
      setLoading(false);
    }
  }, [appointmentId]);

  const loadAppointment = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.get(`/Appointment/appointment/${appointmentId}`);
      console.log("✅ Appointment loaded:", res.data);

      // Already prescribed check
      if (res.data.hasPrescription) {
        alert("✅ Prescription already exists!");
        navigate("/doctorsAppointments");
        return;
      }

      setAppointment(res.data);
    } catch (err) {
      console.error("❌ Load appointment error:", err);
      setError(err.response?.data?.message || "Invalid appointment");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.medicines.trim()) {
      alert("⚠️ Medicine field is required");
      return;
    }

    try {
      await api.post("/Prescription", {
        appointmentId: Number(appointmentId),
        medicines: form.medicines,
        dosageInstructions: form.dosageInstructions,
        notes: form.notes
      });

      alert("✅ Prescription saved successfully!");
      navigate("/doctorsAppointments");
    } catch (err) {
      console.error("❌ Save error:", err);
      alert(err.response?.data || "Failed to save prescription");
    }
  };

  if (loading) {
    return (
      <div className="doctor-layout">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="doctor-content">
          <DoctorHeader title="Loading..." sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <div style={{ fontSize: '24px', color: '#666' }}>Loading appointment...</div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="doctor-layout">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="doctor-content">
          <DoctorHeader title="Error" sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <div className="record-card" style={{ textAlign: 'center', padding: '40px', color: '#d32f2f' }}>
            <div>{error || "Appointment not found"}</div>
            <button onClick={loadAppointment} className="primary-btn" style={{ marginTop: '15px' }}>
              🔄 Retry
            </button>
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
          title="📝 Prescription Writer"
          subtitle="Create digital prescription"
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <div className="table-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
          {/* PATIENT HEADER */}
          <div style={{
            background: 'linear-gradient(135deg, #5C6A5C 0%, #4A554A 100%)',
            color: 'white', padding: '20px', borderRadius: '12px', marginBottom: '25px'
          }}>
            <h2 style={{ margin: 0, fontSize: '24px' }}>Patient: {appointment.patientName}</h2>
            <div style={{ fontSize: '16px', opacity: 0.9 }}>
              Date: {new Date(appointment.appointmentDate).toLocaleDateString('en-GB')}
              {' | '} Status: <span style={{ fontWeight: 'bold' }}>{appointment.status}</span>
            </div>
          </div>

          {/* MEDICINES */}
          <div className="form-group">
            <label style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '8px', display: 'block' }}>
              💊 Medicines (Required)
            </label>
            <textarea
              rows="4"
              placeholder="e.g.:
Panadol 500mg - 1 tablet twice daily after meals
Augmentin 625mg - 1 tablet three times daily
"
              value={form.medicines}
              onChange={(e) => setForm({ ...form, medicines: e.target.value })}
              style={{
                width: '100%', padding: '12px', border: '2px solid #e0e0e0',
                borderRadius: '8px', fontSize: '15px', fontFamily: 'monospace',
                resize: 'vertical', minHeight: '120px'
              }}
            />
          </div>

          {/* DOSAGE */}
          <div className="form-group">
            <label style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '8px', display: 'block' }}>
              📋 Dosage Instructions
            </label>
            <textarea
              rows="3"
              placeholder="Take after meals. Complete full course. Contact if side effects."
              value={form.dosageInstructions}
              onChange={(e) => setForm({ ...form, dosageInstructions: e.target.value })}
              style={{
                width: '100%', padding: '12px', border: '2px solid #e0e0e0',
                borderRadius: '8px', fontSize: '15px', resize: 'vertical'
              }}
            />
          </div>

          {/* NOTES */}
          <div className="form-group">
            <label style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '8px', display: 'block' }}>
              ✍️ Doctor Notes
            </label>
            <textarea
              rows="3"
              placeholder="Additional instructions, diet advice, follow-up..."
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              style={{
                width: '100%', padding: '12px', border: '2px solid #e0e0e0',
                borderRadius: '8px', fontSize: '15px', resize: 'vertical'
              }}
            />
          </div>

          {/* ACTIONS */}
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '30px' }}>
            <button
              onClick={handleSubmit}
              style={{
                padding: '15px 40px', background: '#5C6A5C', color: 'white',
                border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: 'bold',
                cursor: 'pointer', minWidth: '180px'
              }}
            >
              ✅ Save Prescription
            </button>
            <button
              onClick={() => navigate("/doctorsAppointments")}
              style={{
                padding: '15px 40px', background: 'transparent', color: '#5C6A5C',
                border: '2px solid #5C6A5C', borderRadius: '10px', fontSize: '16px',
                cursor: 'pointer', minWidth: '180px'
              }}
            >
              ❌ Cancel
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
