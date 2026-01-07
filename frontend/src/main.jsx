import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'remixicon/fonts/remixicon.css'
import './assets/styles/style.css'
import './assets/styles/admin.css'
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


const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children:[
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
      {
        path: "/login",
        Component: Login
      },
      {
        path: "/signup",
        Component: Signup
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
    ]
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
