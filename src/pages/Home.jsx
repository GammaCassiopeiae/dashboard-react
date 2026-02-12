
// Dashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
//import React, { useEffect, useRef } from 'react';
import './Home.scss';

const Home = () => {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Stock Exchange, Gold prices, Crypto-currencies, Finacial Analytics Dashboard</h1>
        
        
        <div className="date-filter">
          <span>Last 30 days</span>
          <button className="refresh-btn">Refresh</button>
        </div>
      </div>
    
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon revenue">
            <i className="fas fa-dollar-sign"></i>
          </div>
          <div className="metric-info">
            <h3>$24,569</h3>
            <p>Total Revenue</p>
          </div>
          <div className="metric-trend positive">
            <i className="fas fa-arrow-up"></i> 12.5%
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon users">
            <i className="fas fa-users"></i>
          </div>
          <div className="metric-info">
            <h3>1,842</h3>
            <p>New Users</p>
          </div>
          <div className="metric-trend positive">
            <i className="fas fa-arrow-up"></i> 8.3%
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon orders">
            <i className="fas fa-shopping-cart"></i>
          </div>
          <div className="metric-info">
            <h3>2,456</h3>
            <p>Total Orders</p>
          </div>
          <div className="metric-trend negative">
            <i className="fas fa-arrow-down"></i> 2.1%
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon conversion">
            <i className="fas fa-percentage"></i>
          </div>
          <div className="metric-info">
            <h3>4.8%</h3>
            <p>Conversion Rate</p>
          </div>
          <div className="metric-trend positive">
            <i className="fas fa-arrow-up"></i> 1.2%
          </div>
        </div>
      </div>

      <div className="charts-row">
        <div className="chart-card">
          <h3>Sales Overview</h3>
          <div className="chart-placeholder">
            <div className="bar-chart">
              {[35, 50, 55, 65, 75, 79, 79, 85, 90, 92, 94, 95, 98, 98, 99, 100].map((height, index) => (
                <div key={index} className="bar" style={{ height: `${height}%` }}></div>
              ))}
            </div>
          </div>
        </div>

        <div className="chart-card">
          <h3>Revenue Distribution</h3>
          <div className="chart-placeholder">
            <div className="pie-chart">
              <div className="slice" style={{ 
                clipPath: 'polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 50% 100%, 50% 50%)',
                backgroundColor: '#4361ee'
              }}></div>
              <div className="slice" style={{ 
                clipPath: 'polygon(50% 50%, 100% 100%, 0% 100%, 0% 0%, 50% 0%, 50% 50%)',
                backgroundColor: '#3a0ca3'
              }}></div>
              <div className="slice" style={{ 
                clipPath: 'polygon(50% 50%, 0% 0%, 50% 0%, 50% 100%, 0% 100%, 50% 50%)',
                backgroundColor: '#4cc9f0'
              }}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="recent-activity">
        <Link to="/users" className="btn">Go to Users</Link>
        <h3>Recent Activity</h3>
        <div className="activity-list">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="activity-item">
              <div className="activity-icon">
                <i className="fas fa-user-plus"></i>
              </div>
              <div className="activity-content">
                <h4>New User Registered</h4>
                <p>John Doe joined the platform</p>
              </div>
              <span className="activity-time">2 min ago</span>
            </div>
          ))}
        </div>
      </div>
      <Link to="/services" className="btn">View Services</Link>
      </div>
      

  );
};

export default Home; 


/*import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="page-container">
      <h1>Welcome to MyApp</h1>
      <p>This is the home page. Explore our services and portfolio.</p>
      <Link to="/services" className="btn">View Services</Link>
    </div>
  );
}

export default Home;  */