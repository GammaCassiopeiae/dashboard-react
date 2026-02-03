import { Link } from 'react-router-dom';
import './pages.scss';
function Services() {
  const services = [
    { id: 1, name: 'Web Development', description: 'Custom web applications' },
    { id: 2, name: 'Mobile Apps', description: 'iOS and Android solutions' }
    
  ];

  return (
    <div className="page-container">
      <h1>Our Services</h1>
      <div className="services-grid">
        {services.map(service => (
          <div key={service.id} className="service-card">
            <h3>{service.name}</h3>
            <p>{service.description}</p>
          </div>
        ))}
        <Link to="/">Back to Home</Link>
      </div>
    </div>
  );
}

export default Services;