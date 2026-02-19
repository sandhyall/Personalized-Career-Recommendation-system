import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './Component/UserLayout/Layout'
import Landing from './Pages/landing'

const App=()=> {
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout/>}>
        <Route  index element={<Landing/>}/>

        </Route>
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App