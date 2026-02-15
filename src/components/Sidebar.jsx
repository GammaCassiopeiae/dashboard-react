import { Link } from 'react-router-dom';
//port CryptoVault from './components/CryptoVault';
import '../styles/Sidebar.scss';


const Sidebar = () => {
    return (
    
        <aside className="sidebar">
          <h1>ADMIN SIDEBAR</h1>
          <p><b>Dashboard</b></p>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li> 
          <li><Link to="/dashboard">Our Services</Link></li>
          <li><Link to="/services">Services</Link></li>
          <li><Link to="/users">Users</Link></li>
          <li><Link to="/cryptovault">CryptoVAULTS</Link></li>

          
        </aside>
  
       
        
        
        
);

} 
export default Sidebar;
