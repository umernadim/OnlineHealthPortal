import React from 'react'

const DoctorHeader = ({ 
  title = "", 
  subtitle = "", 
  sidebarOpen, 
  setSidebarOpen,
  className = "" 
}) => {
  return (
    <>
           <div className={`page-header ${className}`}>
                <div className="header-left">
                    <div>
                        <h1>{title}</h1>
                        <p>{subtitle}</p>
                    </div>
                    <i
                        className={`menu-btn ${sidebarOpen ? "ri-close-line" : "ri-menu-3-fill"}`}
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    ></i>
                </div>
            </div>
    </>
  )
}

export default DoctorHeader