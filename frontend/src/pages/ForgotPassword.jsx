import React from 'react'

const ForgotPassword = () => {
  return (
            <>
            <section id="L-S-section" className="login signup">
                <div className="overlay"></div>

                <div className="content">

                    <div className="info">
                        <h1>Your health data <br/> is safe with us.</h1>
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

                        <form className="signup-form">

                            <div className="field full">
                                <label>EMAIL ADDRESS *</label>
                                <input type="email" placeholder="Email address" required />
                            </div>

                            <button type="submit">Send Code</button>

                            <p className="cta-text">
                                <a href="signup">Login / Sign Up</a>
                            </p>
                    
                        </form>
                    </div>
                </div>
            </section>
        </>
  )
}

export default ForgotPassword