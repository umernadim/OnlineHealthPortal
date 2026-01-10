import React from 'react'

const Login = () => {
  return (
    <>
      <section id="L-S-section" className="login signup">
        <div className="overlay"></div>

        <div className="content">
          <div className="info">
            <h1>Ask Questions <br/> About Your Health <br/>
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

            <form className="signup-form">

              <div className="field full">
                <label>EMAIL ADDRESS *</label>
                <input type="email" placeholder="Email address" required />
              </div>

              <div className="field full">
                <label>PASSWORD *</label>
                <input type="password" placeholder="Password" required />
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