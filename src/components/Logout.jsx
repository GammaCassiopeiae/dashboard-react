import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import '../styles/Dashboard.scss';

const Logout = () => {
    return (
        <>
        <aside className="logout">
          <h1>You are logged out...</h1>
          
        </aside>
        
        </>
);

} 
export default Logout;