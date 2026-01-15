import React from 'react'

const Appointment = () => {
  return (
    <>
     <section className="appointment-section">
      <div className="appointment-wrapper">
        <h2>Make an Appointment</h2>
        <div className="section-line"></div>

        <form className="appointment-form">
          <div className="row">
            <div className="field">
              <label>FIRST NAME <span>*</span></label>
              <input type="text" placeholder="First name here" />
            </div>

            <div className="field">
              <label>LAST NAME <span>*</span></label>
              <input type="text" placeholder="Last name here" />
            </div>
          </div>

          <div className="field full">
            <label>EMAIL ADDRESS <span>*</span></label>
            <input type="email" placeholder="Add email" />
          </div>

          <div className="field full">
            <label>COMMENTS / QUESTIONS <span>*</span></label>
            <textarea placeholder="Comments"></textarea>
          </div>

          <button type="submit">SEND MESSAGE</button>
        </form>
      </div>
    </section>
    </>
  )
}

export default Appointment