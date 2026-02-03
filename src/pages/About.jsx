import { Link } from 'react-router-dom';

function About() {
  return (
    
    <div className="page-container">
      <h1>About Us</h1>
      <p>We are a team of passionate developers building amazing web applications.</p>
      <section>
        <h2>Our Mission</h2>
        <p>To create innovative solutions that solve real-world problems.</p>
      </section>
      <Link to="/">Back to Home</Link>
    </div>
    
    
  );
}

export default About;

