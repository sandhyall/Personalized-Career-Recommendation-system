import React from 'react'
import Header from '../Common/Header'
import { Outlet } from 'react-router-dom'

const Layout=()=> {
  return (
    <div>
        <Header/>
        <main>
            <Outlet/>
        </main>
    </div>
  )
}

export default Layout