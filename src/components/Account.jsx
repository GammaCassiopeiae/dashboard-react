
import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import './Account.scss';
import './CreditCardForm.scss';
import CreditCardForm from './CreditCardForm';
import Portfolio from './Portfolio';

const Account = () => {
  const { userId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.user;

  if (!user) {
    return <div>User not found. <button onClick={() => navigate('/')}>Go Back</button></div>;
  }

  return (
    <div className="account-container">
      <h2>Welcome to Your Account</h2>
      <div className="account-elements"> 
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Surname:</strong> {user.surname}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>My Portfolio Status: Active</strong></p>
        <p><strong>My Balance: $ Positive</strong></p>
      </div>

      <div className="credit-card-section">
        <CreditCardForm />
        <Portfolio />
      </div>

      <button className="button-btn" onClick={() => navigate('/')}>
        Logout
      </button>
    </div>
  );
};

export default Account;