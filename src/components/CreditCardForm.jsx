import React, { useState } from 'react';

const CreditCardForm = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [isValid, setIsValid] = useState(null);
  const [cardType, setCardType] = useState('');

  const validateLuhn = (number) => {
    // Remove non-digit characters
    const digits = number.replace(/\D/g, '').split('').reverse();
    
    // Check if all characters are digits
    if (digits.length === 0) return false;
    
    // Apply Luhn algorithm
    let sum = 0;
    for (let i = 0; i < digits.length; i++) {
      let digit = parseInt(digits[i]);
      
      // Double every second digit
      if (i % 2 === 1) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      
      sum += digit;
    }
    
    return sum % 10 === 0;
  };

  // Helper function to determine card type
  const getCardType = (number) => {
    const cleaned = number.replace(/\D/g, '');
    if (cleaned.match(/^4[0-9]{12}(?:[0-9]{3})?$/)) return 'Visa';
    if (cleaned.match(/^5[1-5][0-9]{14}$/)) return 'MasterCard';
    if (cleaned.match(/^3[0-9]{13}$/)) return 'American Express';
    if (cleaned.match(/^3[0-68][0-9]{11}(?:[0-9]{2})?$/)) return 'Diners Club';
    if (cleaned.match(/^6[0-9]{11}(?:[0-9]{2})?$/)) return 'Discover';
    if (cleaned.match(/^2[1-7][0-9]{12}(?:[0-9]{3})?$/)) return 'Maestro';
    //return '';
  };

  const handleCardNumberChange = (e) => {
    const value = e.target.value;
    setCardNumber(value);
    
    // Validate on change and get card type
    if (value.length > 0) {
      setIsValid(validateLuhn(value));
      setCardType(getCardType(value)); // Call getCardType here
    } else {
      setIsValid(null);
      setCardType('');
    }
  };

  return (
    <div className="credit-card-form">
      <div className="form-group">
        <label>
          Enter Your Credit Card Number:
          <input
            type="text"
            value={cardNumber}
            onChange={handleCardNumberChange}
            className="card-input"
            placeholder="Enter card number"
          />
        </label>
      </div>
      
      {isValid !== null && (
        <div className={`validation-message ${isValid ? 'valid' : 'invalid'}`}>
          {isValid ? `✓ Valid ${cardType} card` : `✗ Invalid Card Number${cardType ? ` (${cardType})` : ''}`}
        </div>
      )}
      
      {cardNumber.length > 0 && (
        <div className="card-info">
          <p><strong>Length:</strong> {cardNumber.length}</p>
          {cardType && <p><strong>Card Type:</strong> {cardType}</p>}
        </div>
      )}
    </div>
  );
};

export default CreditCardForm;