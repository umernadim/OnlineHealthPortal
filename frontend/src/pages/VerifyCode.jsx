import React from 'react'

const VerifyCode = () => {
    return (
        <>
            <section id="L-S-section" className="login signup">
                <div className="overlay"></div>

                <div className="content">

                    <div className="info">
                        <h1>Verify Your Account</h1>
                        <p>It is as simple as:</p>
                        <ul>
                            <li>Please check your email/phone <br /> for a 4-digit verification code</li>
                            <li>Enter the code below to continue.</li>
                            <li>This step ensures your account security.</li>
                        </ul>
                    </div>

                    <div className="card">
                        <h2>Verification Code</h2>
                        <div className="line"></div>
                        <form className="signup-form">

                            <div className="field full">
                                <label>Verification Code *</label>
                                <input
                                    type="text"
                                    placeholder="Enter code"
                                    required
                                    maxlength="4"
                                    pattern="\d{4}"
                                    inputMode='numeric'
                                />
                            </div>

                            <button type="submit">Verify Code</button>

                            <p className="cta-text">
                                <a href="">Resend</a>
                            </p>

                        </form>
                    </div>
                </div>
            </section>
        </>
    )
}

export default VerifyCode