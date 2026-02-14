
import React, { useState, useEffect } from 'react';
import '../styles/CryptoVault.scss';



const CryptoVault = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeNav, setActiveNav] = useState('dashboard');

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleNavClick = (nav) => {
    setActiveNav(nav);
    closeSidebar();
  };

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [isDarkMode]);

  return (
    <div className={`crypto-vault ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      {/* Mobile Menu Toggle */}
      <button 
        className="mobile-menu-toggle" 
        onClick={toggleSidebar}
        aria-label="Toggle menu"
      >
        <div className="hamburger">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={closeSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? 'active' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon">CV</div>
            <div className="logo-text">CryptoVault</div>
          </div>
        </div>
        <ul className="nav-links">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: '📊' },
            { id: 'wallet', label: 'Wallet', icon: '💰' },
            { id: 'portfolio', label: 'Portfolio', icon: '📈' },
            { id: 'transactions', label: 'Transactions', icon: '🔄' },
            { id: 'settings', label: 'Settings', icon: '⚙️' }
          ].map((item) => (
            <li key={item.id} className="nav-item">
              <a 
                href="#" 
                className={`nav-link ${activeNav === item.id ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.id);
                }}
              >
                <i>{item.icon}</i>
                <span>{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        <div className="header">
          <h1 className="page-title">Dashboard Overview</h1>
          <div className="user-actions">
            <button 
              className="theme-toggle" 
              onClick={toggleTheme}
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
            <div className="user-profile">
              <div className="avatar">JD</div>
              <span>John Doe</span>
            </div>
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="dashboard-grid">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Total Balance</h3>
              <div className="card-change positive">
                <span>↑ 2.5%</span>
              </div>
            </div>
            <div className="card-value">$42,876.45</div>
            <div className="card-change positive">
              <span>+ $1,023.45 today</span>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">24h Profit</h3>
              <div className="card-change positive">
                <span>↑ 1.2%</span>
              </div>
            </div>
            <div className="card-value">$2,156.78</div>
            <div className="card-change positive">
              <span>+ $432.10 yesterday</span>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Portfolio Value</h3>
              <div className="card-change negative">
                <span>↓ 0.8%</span>
              </div>
            </div>
            <div className="card-value">$38,720.12</div>
            <div className="card-change negative">
              <span>- $312.45 today</span>
            </div>
          </div>
        </div>

        {/* Crypto Table */}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Coin</th>
                <th>Price</th>
                <th>24h Change</th>
                <th>Holdings</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {[
                { 
                  name: 'Bitcoin', 
                  symbol: 'BTC', 
                  price: '$62,345.67', 
                  change: '+2.3%', 
                  holdings: '0.5 BTC', 
                  value: '$31,172.84',
                  logo: 'BTC'
                },
                { 
                  name: 'Ethereum', 
                  symbol: 'ETH', 
                  price: '$3,421.89', 
                  change: '-0.5%', 
                  holdings: '2.3 ETH', 
                  value: '$7,868.35',
                  logo: 'ETH'
                },
                { 
                  name: 'Cardano', 
                  symbol: 'ADA', 
                  price: '$0.4567', 
                  change: '+5.2%', 
                  holdings: '1,200 ADA', 
                  value: '$548.04',
                  logo: 'ADA'
                },
                { 
                  name: 'Solana', 
                  symbol: 'SOL', 
                  price: '$142.34', 
                  change: '+8.7%', 
                  holdings: '15 SOL', 
                  value: '$2,135.10',
                  logo: 'SOL'
                }
              ].map((crypto, index) => (
                <tr key={index}>
                  <td>
                    <div className="crypto-icon">
                      <div className="coin-logo">{crypto.logo}</div>
                      <div>
                        <div className="crypto-name">{crypto.name}</div>
                        <div className="crypto-symbol">{crypto.symbol}</div>
                      </div>
                    </div>
                  </td>
                  <td>{crypto.price}</td>
                  <td className={`price-change ${parseFloat(crypto.change) >= 0 ? 'positive' : 'negative'}`}>
                    {crypto.change}
                  </td>
                  <td>{crypto.holdings}</td>
                  <td>{crypto.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button className="btn btn-primary">Buy Crypto</button>
          <button className="btn btn-outline">Transfer Funds</button>
        </div>
      </div>
    </div>
  );
};

export default CryptoVault;