import React from 'react'
import './App.scss'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import { 
  Header, 
  Footer, 
  AdminOnlyRoute, 
  ProductDetail, 
  ReviewProduct } from './components'
import {
  Home, 
  Contact, 
  Login, 
  Register, 
  Reset, 
  Admin,
  Cart, 
  CheckoutDetails, 
  Checkout, 
  CheckoutSuccess, 
  OrderHistory, 
  OrderDetails, 
  NotFound} from './pages' 

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

        <Route 
          path='/admin/*' 
          element={ 
          <AdminOnlyRoute>
            <Admin/>
          </AdminOnlyRoute> }
        />
        <Route path='/product-details/:id' element={<ProductDetail />} />
        <Route path='/cart' element={<Cart />}/>
        <Route path='/checkout-details' element={<CheckoutDetails />} />
        <Route path='/checkout' element={<Checkout />} />
        <Route path='/checkout-success' element={<CheckoutSuccess />} />
        <Route path='/order-history' element={<OrderHistory />}/>
        <Route path='/order-details/:id' element={<OrderDetails />}/>
        <Route path='/review-product/:id' element={<ReviewProduct />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App
