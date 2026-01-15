import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const { forgotPassword } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Submitting forgot password:", email);

        try {
            const res = await forgotPassword(email);
            console.log("API response:", res);

            alert("Reset code sent to your email");
            navigate("/verifyCode", { state: { email } });

        } catch (err) {
            console.error(err);
            alert(err.response?.data || "Error sending code");
        }
    };

    return (
        <>
            <section id="L-S-section" className="login signup">
                <div className="overlay f-overlay"></div>

                <div className="content">

                    <div className="info">
                        <h1>Your health data <br /> is safe with us.</h1>
                        <p>It is as simple as:</p>
                        <ul>
                            <li>Enter your registered email address below.</li>
                            <li>We’ll send you a Code to reset your password.</li>
                            <li>Follow the instructions to create a new password.</li>
                        </ul>
                    </div>

                    <div className="card">
                        <h2>Forgot Password ?</h2>
                        <div className="line"></div>

                        <form className="signup-form" onSubmit={handleSubmit}>

                            <div className="field full">
                                <label>EMAIL ADDRESS *</label>
                                <input type="email" placeholder="Email address" required onChange={e => setEmail(e.target.value)} />
                            </div>

                            <button type="submit">Send Code</button>

                        </form>
                    </div>
                </div>
            </section>
        </>
    )
}

export default ForgotPassword