import { useState } from 'react'
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import {Toaster} from 'react-hot-toast'
import React from 'react'
import Login from './pages/Auth/Login'
import LandingPage from './pages/LandingPage'
import Signup from './pages/Auth/Signup'
import Dashboard from './pages/Home/Dashboard'
import EditResume from './pages/ResumeUpdate/EditResume'
import UserProvider from './context/userContext'
import ResumeAnalyzer from './pages/Home/ResumeAnalyzer';
import ATSScoreChecker from './pages/Home/ATSScoreChecker';

function App() {

  return (
    <UserProvider>
    <div>
      <Router>
        <Routes>
          <Route path='/' element={<LandingPage/>} />
          <Route path='/login' element={<Login/>} />
          <Route path='/signup' element={<Signup/>} />
          <Route path='/dashboard' element={<Dashboard/>} />
          <Route path='/resume/:resumeId' element={<EditResume/>} />
          <Route path='/resume-analyzer' element={<ResumeAnalyzer/>} />
          <Route path='/ats-score-checker' element={<ATSScoreChecker/>} />

        </Routes>
      </Router>
    </div>

    <Toaster 
      toastOptions={{
        className:"",
        style: {
          fontSize: '13px',
        }
      }} 
    />
    </UserProvider>
  )
}

export default App
