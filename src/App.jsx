import React from 'react';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import FinancialDashboard from './components/FinancialDashboard';
//import Blog from './pages/Blog';
import Sidebar from './components/Sidebar';
import Logout from './components/Logout';
import Dashboard from './components/Dashboard'; //
import WorldBankApi from './components/WorldBankApi';
import Finance from './components/Finance'; //
import FetchAPI from './components/FetchAPI';
import CryptoFetcher from './components/CryptoFetcher';
import FetchAll from './components/FetchAll';
import GoldPriceChart from './components/GoldPriceChart';
//import CryptoDisplay from './components/CryptoDisplay';
//import Calculator from './components/Calculator';
import Users from './components/Users';
import Account from './components/Account';

import './App.scss';

function App() {
  //const [statistics, setStatistics] = useState([]);
  return (
    
    
    <Router>
    <Sidebar />
      <nav className="navbar">
        <div className="nav-container">
          <ul className="nav-menu">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/dash">Dash</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/worldbank">WorldBank</Link></li>
            <li><Link to="/finance">Finance</Link></li>
            <li><Link to="/fetchapi">FetchAPI</Link></li>
            <li><Link to="/cryptofetch">Crypto</Link></li> 
            <li><Link to="/fetchall">FetchAll</Link></li>
            <li><Link to="/goldprices">GoldPriceChart</Link></li>
            <li><Link to="/users">Users</Link></li>
            <li><Link to="/logout">Logout</Link></li>
          </ul>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/dash" element={<FinancialDashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/worldbank" element={<WorldBankApi />} />
        <Route path="/finance" element={<Finance />} />
        <Route path="/fetchapi" element={<FetchAPI />} />
        <Route path="/cryptofetch" element={<CryptoFetcher />}/>
        <Route path="/fetchall" element={<FetchAll />}/>
        <Route path="/goldprices" element={<GoldPriceChart />}/>
        <Route path="/users" element={<Users />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/account/:userId" element={<Account />} />       
      </Routes>
    </Router>
    
  )
};

export default App;
