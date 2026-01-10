import React from 'react'

const NewPassword = () => {
  return (
    <>
      <section id="L-S-section">
                <div className="overlay np-overlay"></div>

                <div className="content">

                    <div className="info">
                        <h1>Secure your HealthCare account.</h1>
                        <p>It is as simple as:</p>
                        <ul>
                            <li>Enter a strong new password below.</li>
                            <li>Make sure it’s different from your old password</li>
                            <li>Use at least 8 characters</li>
                        </ul>
                    </div>

                    <div className="card">
                        <h2>Create password</h2>
                        <div className="line"></div>
                        <form className="signup-form">

                            <div className="field full">
                                <label>New Password *</label>
                                <input
                                    type="password"
                                    placeholder="Enter new password"
                                    required
                                />
                            </div>

                            <button type="submit">Reset Password</button>

                            <p className="cta-text">
                                <a href=""><i className='ri-arrow-left-line'></i> Go Back</a>
                            </p>

                        </form>
                    </div>
                </div>
            </section>
    </>
  )
}

export default NewPassword