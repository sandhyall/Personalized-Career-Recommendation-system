import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './Component/UserLayout/Layout'
import Landing from './Pages/landing'
import Login from './Pages/Login'
import Register from './Pages/Register'

const App=()=> {
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout/>}>
        <Route  index element={<Landing/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>

        </Route>
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App