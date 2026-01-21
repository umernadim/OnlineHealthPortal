import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

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

      const role = user.role?.toLowerCase();

      const urlParams = new URLSearchParams(window.location.search);
      const returnUrl = urlParams.get("returnUrl");

      if (returnUrl) {
        navigate(decodeURIComponent(returnUrl), { replace: true });
        return;
      }

      if (role === "admin") {
        navigate("/adminPanel");
      }
      else if (role === "doctor") {
        navigate("/doctorDashboard");
      }
      else if (role === "patient") {
        navigate("/patientDashboard");
      }
      else {
        console.error("❌ Unknown role:", role);
        navigate("/");
      }

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

            </form>
            <p className="cta-text">
              Don't have an account ? <Link to="/signup">Signup</Link>
            </p>
            <p className="cta-text">
              <Link to="/forgotPassword">Forgot password</Link>
            </p>
          </div>
        </div>
      </section>
    </>
  )
}

export default Login