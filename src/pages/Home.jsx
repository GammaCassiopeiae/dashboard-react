import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="page-container">
      <h1>Welcome to MyApp</h1>
      <p>This is the home page. Explore our services and portfolio.</p>
      <Link to="/services" className="btn">View Services</Link>
    </div>
  );
}

export default Home;