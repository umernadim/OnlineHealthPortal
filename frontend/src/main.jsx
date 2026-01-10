import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'remixicon/fonts/remixicon.css'
import './assets/styles/style.css'
import './assets/styles/admin.css'
import './assets/styles/doctors.css'
import App from './App.jsx'
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import About from './pages/About.jsx';
import Home from './pages/Home.jsx';
import Doctors from './pages/Doctors.jsx'
import Contact from './pages/Contact.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import AdminPanel from './pages/admin/AdminPanel.jsx'
import ManageDoctors from './pages/admin/ManageDoctors.jsx'
import ManagePatients from './pages/admin/ManagePatients.jsx'
import Appointments from './pages/admin/Appointments.jsx'
import Notifications from './pages/admin/Notifications.jsx'
import SystemSettings from './pages/admin/SystemSettings.jsx'
import DoctorDashboard from './pages/doctors/DoctorDashboard.jsx'
import PatientList from './pages/doctors/PatientList.jsx'
import AppointmentManagement from './pages/doctors/AppointmentManagemenmt.jsx'
import Consultation from './pages/doctors/Consultation.jsx'
import Messages from './pages/doctors/Messages.jsx'
import PatientRecords from './pages/doctors/PatientRecords.jsx'
import ProfileAvailability from './pages/doctors/ProfileAvailibility.jsx'
import FollowUps from './pages/doctors/FollowUps.jsx'
import PrescriptionWriter from './pages/doctors/PrescriptionWriter.jsx'
import ForgotPassword from './pages/forgotPassword.jsx'
import VerifyCode from './pages/VerifyCode.jsx'


const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      {
        index: true,
        Component: Home
      },
      {
        path: "/about",
        Component: About
      },
      {
        path: "/doctors",
        Component: Doctors
      },
      {
        path: "/contact",
        Component: Contact
      },

    ]
  },
  {
    path: "/adminPanel",
    Component: AdminPanel
  },
  {
    path: "/manageDoctors",
    Component: ManageDoctors
  },
  {
    path: "/managePatients",
    Component: ManagePatients
  },
  {
    path: "/appointments",
    Component: Appointments
  },
  {
    path: "/notifications",
    Component: Notifications
  },
  {
    path: "/systemSettings",
    Component: SystemSettings
  },
  {
    path: "/login",
    Component: Login
  },
  {
    path: "/signup",
    Component: Signup
  },
  {
    path: "/forgotPassword",
    Component: ForgotPassword
  },
  {
    path: "/verifyCode",
    Component: VerifyCode
  },
  {
    path: "/doctorDashboard",
    Component: DoctorDashboard
  },
  {
    path: "/patientList",
    Component: PatientList
  },
  {
    path: "/DoctorsAppointments",
    Component: AppointmentManagement
  },
  {
    path: "/consultation",
    Component: Consultation
  },
  {
    path: "/messages",
    Component: Messages
  },
  {
    path: "/patientRecords",
    Component: PatientRecords
  },
  {
    path: "/profileAvailibility",
    Component: ProfileAvailability
  },
  {
    path: "/followUps",
    Component: FollowUps
  },
  {
    path: "/prescriptionWriter",
    Component: PrescriptionWriter
  },

]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
