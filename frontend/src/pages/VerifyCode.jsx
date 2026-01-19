import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext';
import { useLocation, useNavigate } from 'react-router';

const VerifyCode = () => {
    const { verifyCode, resendCode } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || "";

    const [code, setCode] = useState("");

    const submit = async (e) => {
        e.preventDefault();
        await verifyCode({ email, code });
        navigate("/newPassword", { state: { email } });
    };

    const resend = async () => {
        await resendCode(email);
        alert("New code sent to your email");
    };
    return (
        <>
            <section id="L-S-section">
                <div className="overlay v-overlay"></div>

                <div className="content">

                    <div className="info">
                        <h1>Verify Your Account</h1>
                        <p>It is as simple as:</p>
                        <ul>
                            <li>Please check your email/phone <br /> for a 6-digit verification code</li>
                            <li>Enter the code below to continue.</li>
                            <li>This step ensures your account security.</li>
                        </ul>
                    </div>

                    <div className="card">
                        <h2>Verification Code</h2>
                        <div className="line"></div>
                        <form onSubmit={submit}>

                            <div className="field full">
                                <label>Verification Code *</label>
                                <input
                                    type="text"
                                    placeholder="Enter code"
                                    required
                                    maxLength="6"
                                    pattern="\d{6}"
                                    inputMode='numeric'
                                    onChange={e => setCode(e.target.value)}
                                />
                            </div>

                            <button type="submit">Verify Code</button>

                        </form>
                        <p className="cta-text">
                            Didn’t receive code?{" "}
                            <button type="button" onClick={resend} className="link-btn">
                                Resend
                            </button>
                        </p>

                    </div>
                </div>
            </section>
        </>
    )
}

export default VerifyCode