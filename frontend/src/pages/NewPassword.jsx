import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';

const NewPassword = () => {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const emailFromRoute = location.state?.email || "";

  const [data, setData] = useState({
    email: emailFromRoute,
    newPassword: ""
  });

  const submit = async (e) => {
    e.preventDefault();
    await resetPassword(data);
    alert("Password updated");
    navigate("/login");
  };

  return (
    <>
      <section id="L-S-section">
        <div className="overlay np-overlay"></div>
        <div className="content">
          <div className="info">
            <h1>Secure your HealthCare account.</h1>
            <ul>
              <li>Enter a strong new password below.</li>
              <li>Make sure it’s different from your old password</li>
              <li>Use at least 8 characters</li>
            </ul>
          </div>

          <div className="card">
            <h2>Create password</h2>
            <div className="line"></div>

            <form className="signup-form" onSubmit={submit}>
              <div className="field full">
                <label>New Password *</label>
                <input
                  type="password"
                  required
                  onChange={e => setData({ ...data, newPassword: e.target.value })}
                />
              </div>

              <button type="submit">Reset Password</button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default NewPassword;
