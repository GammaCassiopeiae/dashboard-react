import React from 'react';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Blog from './pages/Blog';
import Sidebar from './components/Sidebar';
import Logout from './components/Logout';
import Dashboard from './components/Dashboard'; //
import Finance from './components/Finance'; //
import FetchAPI from './components/FetchAPI';
import Calculator from './components/Calculator';
import Users from './components/Users';
import Account from './components/Account';
import './App.scss';

function App() {
  //const [statistics, setStatistics] = useState([]);
  return (
    <>
    <Sidebar />
    <Router>
      <nav className="navbar">
        <div className="nav-container">
          <ul className="nav-menu">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/finance">Finance</Link></li>
            <li><Link to="/fetchapi">FetchAPI</Link></li>
            <li><Link to="/users">Users</Link></li>
            <li><Link to="/logout">Logout</Link></li>
          </ul>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/finance" element={<Finance />} />
        <Route path="/fetchapi" element={<FetchAPI />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/users" element={<Users />} />

        <Route path="/" element={<Users />} />
        <Route path="/account/:userId" element={<Account />} />
        
      </Routes>
    </Router>
    
    
    

    </>
  );
}

export default App;



/*
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Sidebar from './components/Sidebar'
import Contact from './components/Contact'


function App() {
  const [count, setCount] = useState(0)


  return (
    <>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <Sidebar />
      <Contact />


    </>
  )
}
export default App;  */
