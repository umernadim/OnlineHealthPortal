import DoctorHeader from "./components/DoctorHeader";
import Sidebar from "./components/Sidebar";
import api from "../../service/axios";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

export default function ProfileAvailability() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // ✅ AVAILABILITY EDIT STATE
  const [availabilityEdit, setAvailabilityEdit] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get("/Doctor/profile");
      setProfile(res.data);
      setAvailabilityEdit(res.data?.availability || "");
    } catch (error) {
      console.error("Profile load error:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    try {
      setUpdating(true);
      await api.put("/Doctor/profile", profile);
      alert("✅ Profile updated successfully!");
      setEditMode(false);
      loadProfile();
    } catch (error) {
      console.error("Update failed:", error);
      alert("❌ Failed to update profile!");
    } finally {
      setUpdating(false);
    }
  };

  // ✅ FIXED PHOTO UPLOAD
  const uploadPhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("photo", file);

    try {
      setUpdating(true);
      const res = await api.post("/Doctor/profile/photo", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      // ✅ USE RETURNED URL (COMPLETE)
      setProfile({ ...profile, photo: res.data.photoUrl });
      e.target.value = "";
      alert("✅ Profile photo updated!");
    } catch (error) {
      console.error("Photo upload failed:", error);
      alert("❌ Photo upload failed!");
    } finally {
      setUpdating(false);
    }
  };

  // ✅ AVAILABILITY UPDATE
  const updateAvailability = async () => {
    try {
      setUpdating(true);
      await api.put("/Doctor/profile/availability", {
        availability: availabilityEdit
      });
      setProfile({ ...profile, availability: availabilityEdit });
      alert("✅ Availability updated!");
    } catch (error) {
      console.error("Availability update failed:", error);
      alert("❌ Failed to update availability!");
    } finally {
      setUpdating(false);
    }
  };

  const uploadDocument = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUpdating(true);
      const res = await api.post("/Doctor/documents", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      alert("✅ Document uploaded & replaced!");
      loadProfile(); // Refresh to show new document
      e.target.value = "";
    } catch (error) {
      console.error("Document upload failed:", error);
      alert(`❌ Error: ${error.response?.data || error.message}`);
    } finally {
      setUpdating(false);
    }
  };


  if (loading) {
    return (
      <div className="doctor-layout">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="doctor-content">
          <div className="loading">Loading profile...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="doctor-layout">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <main className="doctor-content">
        <DoctorHeader
          title={`Profile: Dr. ${profile?.fullName}`}
          subtitle={profile?.isApproved ? "Approved Doctor" : "Pending Approval"}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* PROFILE + AVAILABILITY GRID */}
        <div className="profile-grid">
          {/* PROFILE CARD */}
          <div className="record-card profile-card">
            <div className="profile-top">
              <div className="profile-avatar" style={{ position: 'relative' }}>
                {profile?.photo && profile.photo !== "https://i.pinimg.com/736x/98/55/b2/9855b2f0326a40e1cc9e5791902b2fd9.jpg" ? (
                  <img
                    src={profile.photo}
                    alt="Profile"
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '3px solid #007bff'
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                ) : (
                  <div style={{
                    width: '80px', height: '80px',
                    borderRadius: '50%',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold'
                  }}>
                    Dr
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={uploadPhoto}
                  style={{
                    position: 'absolute',
                    top: 0, left: 0,
                    width: '80px',
                    height: '80px',
                    opacity: 0,
                    cursor: 'pointer'
                  }}
                  title="Change Photo"
                  disabled={updating}
                />
              </div>

              <div>
                <h3>{editMode ? (
                  <input
                    value={profile?.fullName || ''}
                    onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                    style={{ fontSize: '1.5rem', border: '1px solid #ddd', padding: '5px', width: '250px' }}
                  />
                ) : profile?.fullName}</h3>
                <p>{editMode ? (
                  <input
                    value={profile?.speciality || ''}
                    onChange={(e) => setProfile({ ...profile, speciality: e.target.value })}
                    placeholder="Speciality"
                    style={{ border: '1px solid #ddd', padding: '5px', width: '250px' }}
                  />
                ) : profile?.speciality}</p>
              </div>
            </div>

            <ul className="profile-details">
              <li><strong>Email:</strong> {profile?.email}</li>
              <li><strong>Phone:</strong> {editMode ? (
                <input
                  value={profile?.phone || ''}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  style={{ border: '1px solid #ddd', padding: '3px', width: '200px' }}
                />
              ) : profile?.phone}</li>
              <li><strong>Experience:</strong> {editMode ? (
                <input
                  type="number"
                  value={profile?.experienceYears || 0}
                  onChange={(e) => setProfile({ ...profile, experienceYears: parseInt(e.target.value) })}
                  min="0" max="50"
                  style={{ border: '1px solid #ddd', padding: '3px', width: '80px' }}
                />
              ) : `${profile?.experienceYears || 0} Years`}</li>
              <li><strong>Languages:</strong> {editMode ? (
                <input
                  value={profile?.language || ''}
                  onChange={(e) => setProfile({ ...profile, language: e.target.value })}
                  style={{ border: '1px solid #ddd', padding: '3px', width: '200px' }}
                />
              ) : profile?.language}</li>
            </ul>

            <div className="profile-actions">
              <button
                className="primary-btn"
                onClick={() => setEditMode(!editMode)}
                disabled={updating}
              >
                {editMode ? 'Cancel' : 'Edit Profile'}
              </button>
              {editMode && (
                <button
                  className="primary-btn success"
                  onClick={updateProfile}
                  disabled={updating}
                >
                  {updating ? 'Saving...' : 'Save Changes'}
                </button>
              )}
            </div>
          </div>

          {/* ✅ FIXED AVAILABILITY WITH EDIT + SAVE */}
          <div className="record-card">
            <h3>Weekly Availability</h3>
            <div className="availability-row">
              <span>Monday - Friday</span>
              <span className="available">
                {availabilityEdit || profile?.availability || '9AM–1PM, 5PM–9PM'} ✓
              </span>
            </div>
            <div style={{ marginTop: '10px', padding: '10px', border: '1px solid #ddd' }}>
              <textarea
                value={availabilityEdit}
                onChange={(e) => setAvailabilityEdit(e.target.value)}
                placeholder="Enter availability (e.g., Mon-Fri: 9AM-1PM, 5PM-9PM)"
                style={{ width: '100%', minHeight: '60px', border: '1px solid #ddd', padding: '5px' }}
                rows="2"
              />
              <button
                className="primary-btn"
                onClick={updateAvailability}
                disabled={updating || !availabilityEdit}
                style={{ marginTop: '5px' }}
              >
                {updating ? 'Saving...' : 'Update Availability'}
              </button>
            </div>
          </div>
        </div>

        {/* FEES + DOCUMENTS */}
        <div className="profile-grid">
          <div className="record-card">
            <h3>Consultation Fees</h3>
            <div className="fee-box">
              <span>PKR</span>
              <input
                type="number"
                value={profile?.consultationFee || 1000}
                onChange={(e) => setProfile({
                  ...profile,
                  consultationFee: parseInt(e.target.value)
                })}
                min="500" max="5000"
              />
              <span>/ consultation</span>
            </div>
            <button
              className="primary-btn"
              onClick={updateProfile}
              disabled={updating}
            >
              Update Fees
            </button>
          </div>

          {/* ✅ SINGLE DOCUMENT DISPLAY */}
          <div className="record-card">
            <h3>Certification Document</h3>

            {/* Upload */}
            <div className="upload-box">
              <p>Upload Medical Certification (Replace existing)</p>
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={uploadDocument}
                disabled={updating}
              />
            </div>

            {/* ✅ SHOW CURRENT DOCUMENT */}
            {profile?.document && (
              <div className="document-item" style={{
                padding: '10px',
                border: '1px solid #28a745',
                marginTop: '10px',
                borderRadius: '4px',
                textAlign: 'center'
              }}>
                <strong>Current Document:</strong><br />
                <a
                  href={profile.document}
                  target="_blank"
                  style={{ color: '#28a745', fontSize: '16px' }}
                >
                  📄 {profile.document.split('/').pop()}
                  <span style={{ fontSize: '12px' }}>→ Click to View</span>
                </a>
              </div>
            )}
          </div>


        </div>
      </main>
    </div>
  );
}
