import { Link } from 'react-router-dom';
//import CryptoVault from './components/CryptoVault';
import '../styles/Sidebar.scss';

/*
const Sidebar = () => {
    return (
    
        <aside className="sidebar">
          <h1>ADMIN SIDEBAR</h1>
          <p><b>Dashboard</b></p>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/dashboard">Our Services</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          <li><Link to="/users">Users</Link></li>
          <li><Link to="/cryptovault">My Crypto Vault</Link></li>
        </aside>    
);

} 
export default Sidebar;  */

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar__header">
        <h1 className="sidebar__title">ADMIN SIDEBAR</h1>
      </div>

      <div className="sidebar__content">
        <p className="sidebar__label">Dashboard</p>
        <nav className="sidebar__nav">
          <ul className="sidebar__list">
            <li className="sidebar__item">
              <Link to="/" className="sidebar__link">
                <span className="sidebar__icon">🏠</span>
                <span className="sidebar__text">Home</span>
              </Link>
            </li>
            <li className="sidebar__item">
              <Link to="/dashboard" className="sidebar__link">
                <span className="sidebar__icon">⚙️</span>
                <span className="sidebar__text">Our Services</span>
              </Link>
            </li>
            <li className="sidebar__item">
              <Link to="/contact" className="sidebar__link">
                <span className="sidebar__icon">📞</span>
                <span className="sidebar__text">Contact</span>
              </Link>
            </li>
            <li className="sidebar__item">
              <Link to="/users" className="sidebar__link">
                <span className="sidebar__icon">👥</span>
                <span className="sidebar__text">Users</span>
              </Link>
            </li>
            <li className="sidebar__item">
              <Link to="/cryptovault" className="sidebar__link">
                <span className="sidebar__icon">🔐</span>
                <span className="sidebar__text">My Crypto Vault</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
