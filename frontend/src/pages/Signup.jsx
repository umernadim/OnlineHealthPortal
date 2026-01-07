import React from 'react'

const Signup = () => {
    return (
        <>
            <section id="L-S-section" className='login signup'>
                <div className="overlay"></div>
                <div className="card">
                    <span className="tag">CREATE ACCOUNT</span>
                    <h2>Sign Up</h2>
                    <div className="line"></div>

                    <form className="signup-form">
                        <div className="row">
                            <div className="field">
                                <label>NAME *</label>
                                <input type="text" placeholder="Enter name" required />
                            </div>
                        </div>

                        <div className="field full">
                            <label>EMAIL ADDRESS *</label>
                            <input type="email" placeholder="Email address" required />
                        </div>

                        <div className="field full">
                            <label>PASSWORD *</label>
                            <input type="password" placeholder="Password" required />
                        </div>

                        <button type="submit">CREATE ACCOUNT</button>

                        <p className="login-text">
                            Already have an account? <a href="login">Login</a>
                        </p>
                    </form>
                </div>
            </section>
        </>
    )
}

export default Signup

