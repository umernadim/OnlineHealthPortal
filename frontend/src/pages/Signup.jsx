import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",           // ✅ NEW: Phone field
    passwordHash: "",
    role: "Patient",     // ✅ Fixed Patient only
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      alert("Registered successfully! Please login.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data || "Registration failed");
    }
  };

  return (
    <>
      <section id="L-S-section" className="login signup">
        <div className="overlay"></div>

        <div className="content">
          <div className="info">
            <h1>Fill in your details and<br />Get Started</h1>
            <p>It is as simple as:</p>
            <ul>
              <li>Book Appointments</li>
              <li>Consult Doctor online</li>
              <li>Find Healthcare Facilities Near You</li>
              <li>Store Health records</li>
            </ul>
          </div>

          <div className="card">
            <span className="tag">CREATE ACCOUNT</span>
            <h2>Sign Up</h2>
            <div className="line"></div>

            <form className="signup-form" onSubmit={handleSubmit}>
              <div className="row">
                <div className="field">
                  <label>NAME *</label>
                  <input 
                    type="text" 
                    placeholder="Enter name" 
                    name="fullName" 
                    required 
                    onChange={handleChange} 
                  />
                </div>
              </div>

              <div className="field full">
                <label>PHONE NUMBER *</label>
                <input 
                  type="tel" 
                  placeholder="+92 321 1234567" 
                  name="phone" 
                  required 
                  onChange={handleChange} 
                />
              </div>

              <div className="field full">
                <label>EMAIL ADDRESS *</label>
                <input 
                  type="email" 
                  placeholder="Email address" 
                  name="email" 
                  required 
                  onChange={handleChange} 
                />
              </div>

              <div className="field full">
                <label>PASSWORD *</label>
                <input 
                  type="password" 
                  placeholder="Password" 
                  name="passwordHash" 
                  required 
                  onChange={handleChange} 
                />
              </div>

              {/* Role hidden field Patient only */}
              <input type="hidden" name="role" value="Patient" />

              <button type="submit">CREATE ACCOUNT</button>

              <p className="cta-text">
                Already have an account? <Link to="/login">Login</Link>
              </p>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default Signup;
