import { useState } from 'react'
import './App.css'
import Head from './components/Head'
import Footer  from './components/Footer'
//import Home from './pages/Home'
import Login from './pages/Login'

function App() {
  return (
    <>
      <div>
        <Head/>
        <Login/>
        <Footer/>
      </div>
    </>
  )
}

export default App
