import React from 'react'
import './App.scss'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import { Header, Footer } from './components'
import { Home, Contact, Login, Register, Reset} from './pages' 

import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <ToastContainer/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/contact' element={<Contact />}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/reset' element={<Reset/>}/>
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App
