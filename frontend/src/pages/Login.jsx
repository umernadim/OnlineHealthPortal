import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    passwordHash: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const user = await login(form);

    const role =
      user.role ||
      user.Role ||
      user["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

    const normalizedRole = role?.toLowerCase();

    if (normalizedRole === "admin") navigate("/adminPanel");
    else if (normalizedRole === "doctor") navigate("/doctorDashboard");
    else if (normalizedRole === "patient") navigate("/patientDashboard");
    else navigate("/");

  } catch (err) {
    alert(err.response?.data || "Login failed");
  }
};


  return (
    <>
      <section id="L-S-section" className="login signup">
        <div className="overlay"></div>

        <div className="content">
          <div className="info">
            <h1>Ask Questions <br /> About Your Health <br />
              Get Free Counselling</h1>
            <p>It is as simple as:</p>
            <ul>
              <li>Book Appointments</li>
              <li>Consult Doctor online</li>
              <li>Find Healthcare Facilities Near You</li>
              <li>Store Health records</li>
            </ul>
          </div>

          <div className="card">
            <h2>Login Account</h2>
            <div className="line"></div>

            <form className="signup-form" onSubmit={handleSubmit}>

              <div className="field full">
                <label>EMAIL ADDRESS *</label>
                <input name="email" type="email" onChange={handleChange} placeholder="Email address" required />
              </div>

              <div className="field full">
                <label>PASSWORD *</label>
                <input name="passwordHash" type="password" onChange={handleChange} placeholder="Password" required />
              </div>

              <button type="submit">Login ACCOUNT</button>

              <p className="cta-text">
                Don't have an account ? <a href="signup">Signup</a>
              </p>
              <p className="cta-text">
                <a href="forgotPassword">Forgot password</a>
              </p>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}

export default Login