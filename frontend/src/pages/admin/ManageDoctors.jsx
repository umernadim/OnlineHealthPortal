import { useState, useEffect } from "react";
import SideBar from "./components/SideBar";
import AdminHeader from "./components/AdminHeader";
import api from "../../service/axios";

export default function ManageDoctors() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        password: "",
        speciality: "",
        experienceYears: "",
        consultationFee: "",
        language: "",
        availability: ""
    });
    const [filterSpecialty, setFilterSpecialty] = useState("All Specialties");
    const [filterStatus, setFilterStatus] = useState("All Status");

    useEffect(() => {
        loadDoctors();
    }, []);

    const loadDoctors = async () => {
        try {
            setLoading(true);
            const res = await api.get("/Doctor/admin", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            const doctorData = Array.isArray(res.data) ? res.data : [];
            setDoctors(doctorData);
        } catch (error) {
            console.error("Error loading doctors:", error);
            setDoctors([]);
        } finally {
            setLoading(false);
        }
    };

    const parseDecimal = (value) => {
        const num = parseFloat(value);
        return isNaN(num) ? 0 : num;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const submitData = {
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
            Speciality: formData.speciality,
            experienceYears: parseInt(formData.experienceYears),
            consultationFee: parseDecimal(formData.consultationFee),
            language: formData.language || null,
            availability: formData.availability || null
        };

        console.log("Sending data:", submitData);

        try {
            await api.post("/Doctor", submitData, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            alert("✅ Doctor added successfully! (Pending Approval)");
            setShowAddForm(false);
            setFormData({
                fullName: "", email: "", phone: "", password: "",
                speciality: "", experienceYears: "", consultationFee: "",
                language: "", availability: ""
            });
            loadDoctors();
        } catch (error) {
            console.error("Error:", error.response?.data);
            alert(error.response?.data?.message || "Error adding doctor");
        }
    };

    const updateDoctorStatus = async (doctorId, status) => {
        try {
            await api.put(`/Doctor/${doctorId}/status`, { isApproved: status === "Approved" }, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            alert(`${status} successful!`);
            loadDoctors();
        } catch (error) {
            alert("Error updating status");
        }
    };

    const filteredDoctors = doctors.filter(doctor => {
        const matchesSpecialty = filterSpecialty === "All Specialties" ||
            (doctor.speciality || "").toLowerCase().includes(filterSpecialty.toLowerCase());
        const matchesStatus = filterStatus === "All Status" ||
            (doctor.isApproved ? "Approved" : "Pending") === filterStatus;
        return matchesSpecialty && matchesStatus;
    });

    return (
        <>
            <div className={`admin-layout ${sidebarOpen ? "sidebar-open" : ""}`}>
                <SideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <main className="admin-content">
                    <div className="manage-doctors">
                        <AdminHeader
                            title="Manage Doctors"
                            subtitle="Overview of Doctors performance"
                            sidebarOpen={sidebarOpen}
                            setSidebarOpen={setSidebarOpen}
                        />

                        {/* Filters */}
                        <div className="filters">
                            <select value={filterSpecialty} onChange={(e) => setFilterSpecialty(e.target.value)}>
                                <option>All Specialties</option>
                                <option>Cardiology</option>
                                <option>General Physician</option>
                                <option>Orthopedic</option>
                                <option>Physiotherapy</option>
                            </select>

                            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                                <option>All Status</option>
                                <option>Approved</option>
                                <option>Pending</option>
                            </select>

                            <button
                                className="primary-btn"
                                onClick={() => setShowAddForm(!showAddForm)}
                            >
                                {showAddForm ? "Cancel" : "+ Add Doctor"}
                            </button>
                        </div>

                        {/* Doctors Table */}
                        <div className="table-card">
                            {loading ? (
                                <div className="loading">Loading doctors...</div>
                            ) : filteredDoctors.length === 0 ? (
                                <div className="empty-state">
                                    <p>No doctors found matching your filters</p>
                                </div>
                            ) : (
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Doctor</th>
                                            <th>Specialty</th>
                                            <th>Experience</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredDoctors.map(doctor => (
                                            <tr key={doctor.id}>
                                                <td className="info">
                                                    <img
                                                        src={doctor.photo || "https://i.pinimg.com/1200x/77/9f/23/779f23ae620f11a2fca378dcf3fe580d.jpg"}
                                                        alt={doctor.fullName}
                                                    />
                                                    <span>Dr. {doctor.fullName || "Doctor"}</span>
                                                </td>
                                                <td>{doctor.speciality || "N/A"}</td>
                                                <td>{doctor.experienceYears || 0} Years</td>
                                                <td className={`status ${doctor.isApproved ? 'approved' : 'pending'}`}>
                                                    {doctor.isApproved ? 'Approved' : 'Pending'}
                                                </td>
                                                <td className="action-btns">
                                                    <button className="action-btn">View</button>
                                                    {doctor.isApproved ? (
                                                        <button
                                                            className="danger-btn"
                                                            onClick={() => updateDoctorStatus(doctor.id, "Pending")}
                                                        >
                                                            Deactivate
                                                        </button>
                                                    ) : (
                                                        <>
                                                            <button
                                                                className="action-btn"
                                                                onClick={() => updateDoctorStatus(doctor.id, "Approved")}
                                                            >
                                                                Approve
                                                            </button>
                                                            <button
                                                                className="danger-btn"
                                                                onClick={() => updateDoctorStatus(doctor.id, "Rejected")}
                                                            >
                                                                Reject
                                                            </button>
                                                        </>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        {/* ✅ COMPLETE ADD DOCTOR FORM */}
                        {showAddForm && (
                            <div className="form-card">
                                <h2>Add New Doctor</h2>
                                <form onSubmit={handleSubmit}>
                                    <div className="form-grid">
                                        {/* Row 1 */}
                                        <div>
                                            <label>Full Name *</label>
                                            <input
                                                type="text"
                                                placeholder="Dr. Ahmed Khan"
                                                value={formData.fullName}
                                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label>Email *</label>
                                            <input
                                                type="email"
                                                placeholder="doctor@example.com"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                required
                                            />
                                        </div>

                                        {/* Row 2 */}
                                        <div>
                                            <label>Phone *</label>
                                            <input
                                                type="tel"
                                                placeholder="+923001234567"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label>Password *</label>
                                            <input
                                                type="password"
                                                placeholder="Enter password"
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                required
                                            />
                                        </div>

                                        {/* Row 3 */}
                                        <div>
                                            <label>Speciality *</label>
                                            <select
                                                value={formData.speciality}
                                                onChange={(e) => setFormData({ ...formData, speciality: e.target.value })}
                                                required
                                            >
                                                <option value="">Select Speciality</option>
                                                <option value="Cardiology">Cardiology</option>
                                                <option value="General Physician">General Physician</option>
                                                <option value="Orthopedic">Orthopedic</option>
                                                <option value="Physiotherapy">Physiotherapy</option>
                                                <option value="Dentistry">Dentistry</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label>Experience (Years) *</label>
                                            <input
                                                type="number"
                                                min="0"
                                                max="50"
                                                placeholder="5"
                                                value={formData.experienceYears}
                                                onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                                                required
                                            />
                                        </div>

                                        {/* Row 4 */}
                                        <div>
                                            <label>Consultation Fee (PKR) *</label>
                                            <input
                                                type="number"
                                                min="500"
                                                max="10000"
                                                placeholder="1500"
                                                value={formData.consultationFee}
                                                onChange={(e) => setFormData({ ...formData, consultationFee: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label>Languages</label>
                                            <input
                                                type="text"
                                                placeholder="English, Urdu"
                                                value={formData.language}
                                                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                                            />
                                        </div>

                                 
                                    </div>

                                    <div className="form-actions">
                                        <button type="button" className="secondary-btn" onClick={() => setShowAddForm(false)}>
                                            Cancel
                                        </button>
                                        <button type="submit" className="primary-btn">
                                            Save Doctor
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </>
    );
}
