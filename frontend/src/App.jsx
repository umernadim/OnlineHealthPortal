
import React from 'react'
import MyNavbar from './components/MyNavbar'
import { Outlet } from 'react-router'
import Footer from './components/Footer'

const App = () => {
  return (
    <>
      <MyNavbar></MyNavbar>
      <Outlet></Outlet>
      <Footer></Footer>
    </>
  )
}

export default App