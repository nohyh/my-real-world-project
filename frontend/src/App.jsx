import { useState } from 'react'
import './App.css'
import Head from './components/Head'
import Footer  from './components/Footer'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from'./pages/Register'
import Settings from './pages/Settings'
import { Routes, Route } from 'react-router-dom';
import Profile from './pages/Profile'
import NewArticle from './pages/NewArticle'
import Article from './pages/Article'
import ProtectedRoute from './components/ProtectedRoute.jsx';
function App() {
  const userId =1;
  return (
    <>
      <div>
        <Head/>
        <Routes>
           <Route path='/' element={<Home/>}></Route>
           <Route path='/login' element={<Login/>}></Route>
           <Route path="/register" element={<Register/>}></Route>
           <Route path="/profile/:username" element={<Profile/>}></Route>
           <Route path ='/Article' element={<Article/>}></Route>
           <Route element={<ProtectedRoute/>}>
            <Route path="/settings" element={<Settings/>}></Route>
            <Route path="/editor" element={<NewArticle/>}></Route>
            </Route>
          </Routes>
        <Footer/>
      </div>
    </>
  )
}

export default App
