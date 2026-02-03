import React from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

const Account = () => {
  const { userId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.user;

  if (!user) {
    return <div>User not found. <button onClick={() => navigate('/')}>Go Back</button></div>;
  }
  // <div style={{ position: 'fixed', top: '0', left: '0', width: '100%', padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: 'black', zIndex: '1000', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
  //<div style={{ margin: 'auto', width: '40%', padding: '20px', fontFamily: 'Arial, sans-serif', marginTop: '0' }}>

  return (
    <div style={{ position: 'fixed', top: '0', left: '0', bottom: '0', width: '100%', padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: 'black', zIndex: '1000', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
      <h2>Welcome to Your Account</h2>
      <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '5px' }}>
        <p><strong>User ID:</strong> {user.userID}</p>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Surname:</strong> {user.surname}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>My Portfolio: </strong></p>
        <p><strong>My Credit Card</strong></p>
        <p><strong>My Balance</strong></p>
        
      </div>
      <button 
        onClick={() => navigate('/')}
        style={{ marginTop: '20px', padding: '10px 20px', borderRadius: '10px', backgroundColor: '#2196F3', color: 'white', border: 'none', cursor: 'pointer' }}
      >
        Back to Home
      </button>
    </div>
  );
};

export default Account;