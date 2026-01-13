import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'remixicon/fonts/remixicon.css'
import './assets/styles/style.css'
import './assets/styles/admin.css'
import './assets/styles/doctors.css'
import './assets/styles/patient.css'
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
import NewPassword from './pages/NewPassword.jsx'
import PatientDashboard from './pages/patients/patientDashboard.jsx'
import BookAppointment from './pages/patients/BookAppointment.jsx'
import HealthRecords from './pages/patients/HealthRecords.jsx'
import PatientProfile from './pages/patients/PatientProfile.jsx'
import MyAppointments from './pages/patients/MyAppointments.jsx'
import Prescriptions from './pages/patients/Prescriptions.jsx'
import Invoice from './pages/patients/Invoice.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import ProtectedRoute from "./routes/ProtectedRoute";

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
  //routes for admin panel
  {
    path: "/adminPanel",
    element: (
      <ProtectedRoute allowedRoles={["Admin"]}>
        <AdminPanel />
      </ProtectedRoute>
    ),
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
  //routes for login/signup pages
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
    path: "/newPassword",
    Component: NewPassword
  },
  //routes for doctor dashboard
  {
    path: "/doctorDashboard",
    element: (
      <ProtectedRoute allowedRoles={["Doctor"]}>
        <DoctorDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/patientList",
    Component: PatientList
  },
  {
    path: "/doctorsAppointments",
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
  //routes for patients pages
  {
    path: "/patientDashboard",
    element: (
      <ProtectedRoute allowedRoles={["Patient"]}>
        <PatientDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/bookAppointment",
    Component: BookAppointment
  },
  {
    path: "/healthRecords",
    Component: HealthRecords
  },
  {
    path: "/patientProfile",
    Component: PatientProfile
  },
  {
    path: "/myAppointments",
    Component: MyAppointments
  },
  {
    path: "/prescriptions",
    Component: Prescriptions
  },
  {
    path: "/invoice",
    Component: Invoice
  },

]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
