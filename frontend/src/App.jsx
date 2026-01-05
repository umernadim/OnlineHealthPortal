
import React from 'react'
import MyNavbar from './components/MyNavbar'
import { Outlet } from 'react-router'

const App = () => {
  return (
    <>
      <MyNavbar></MyNavbar>
      <Outlet></Outlet>
    </>
  )
}

export default App