import { useEffect, useState } from "react";
import SidebarPat from "./components/SidebarPat";
import api from "../../service/axios";

export default function PatientProfile() {

  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  // 🔹 Load Profile
  const loadProfile = async () => {
    try {
      const res = await api.get("/Patient/profile");
      setProfile(res.data);
      setForm(res.data); // keep original copy
    } catch (err) {
      console.error("Profile load failed", err);
    }
  };

  // 🔹 Handle Input Change
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // 🔹 Save Profile
  const saveProfile = async () => {
    try {
      setLoading(true);
      await api.put("/Patient/profile", form);
      setEditing(false);
      await loadProfile();
    } catch (err) {
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Cancel Edit (RESET)
  const cancelEdit = () => {
    setForm(profile); // reset form
    setEditing(false);
  };

  if (!profile) return <p>Loading...</p>;

  return (
    <div className="patient-layout">

      {/* SIDEBAR */}
      <SidebarPat />

      {/* MAIN */}
      <main className="patient-content patient-profile">

        <div className="page-header">
          <h1>My Profile</h1>
          <p>Manage your personal information</p>
        </div>

        <div className="record-card">
          <h3>Personal Details</h3>

          {/* EMAIL */}
          <div className="info-row">
            <span>Email</span>
            <strong>{profile.email}</strong>
          </div>

          {/* NAME */}
          <div className="info-row">
            <span>Name</span>
            {editing ? (
              <input
                name="fullName"
                value={form.fullName || ""}
                onChange={handleChange}
              />
            ) : (
              <strong>{profile.fullName}</strong>
            )}
          </div>

          {/* PHONE */}
          <div className="info-row">
            <span>Phone</span>
            {editing ? (
              <input
                name="phone"
                value={form.phone || ""}
                onChange={handleChange}
              />
            ) : (
              <strong>{profile.phone || "—"}</strong>
            )}
          </div>

          {/* GENDER */}
          <div className="info-row">
            <span>Gender</span>
            {editing ? (
              <select
                name="gender"
                value={form.gender || ""}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            ) : (
              <strong>{profile.gender || "—"}</strong>
            )}
          </div>

          {/* DOB */}
          <div className="info-row">
            <span>Date of Birth</span>
            {editing ? (
              <input
                type="date"
                name="dateOfBirth"
                value={form.dateOfBirth?.substring(0, 10) || ""}
                onChange={handleChange}
              />
            ) : (
              <strong>
                {profile.dateOfBirth
                  ? new Date(profile.dateOfBirth).toLocaleDateString()
                  : "—"}
              </strong>
            )}
          </div>

          {/* ACTION BUTTONS */}
          {!editing ? (
            <button
              className="primary-btn outline"
              onClick={() => setEditing(true)}
            >
              Edit Profile
            </button>
          ) : (
            <div className="btn-group">
              <button
                className="primary-btn"
                onClick={saveProfile}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>

              <button
                className="secondary-btn"
                onClick={cancelEdit}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
