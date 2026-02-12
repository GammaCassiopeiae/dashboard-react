import React, { useState } from "react";
import './WorldBankApi.scss';

const CurrencyConverter = () => {
  // Mock exchange rates (relative to USD)
  const mockRates = {
    USD: 1.00,
    EUR: 0.92,
    JPY: 146.00,
    GBP: 0.81,
    CAD: 1.35,
    AUD: 1.50,
    CHF: 0.91,
    CNY: 7.20,
    INR: 83.00,
    RUB: 94.00
  };

  const currencies = ["USD", "EUR", "JPY", "GBP", "CAD", "AUD", "CHF", "CNY", "INR", "RUB"];

  const [amount, setAmount] = useState(1);
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");

  // Calculate conversion
  const calculateConversion = () => {
    const result = amount * (mockRates[to] / mockRates[from]);
    return result.toFixed(2);
  };

  return (
    <div className="currency-converter">
      <h1>💱 Currency Converter</h1>

      <div className="converter-box">
        <div className="input-group">
          <label htmlFor="amount">Amount:</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={e => setAmount(parseFloat(e.target.value) || 0)}
            min="0"
            step="0.01"
          />
        </div>

        <div className="input-group">
          <label htmlFor="from">From:</label>
          <select
            id="from"
            value={from}
            onChange={e => setFrom(e.target.value)}
          >
            {currencies.map(curr => (
              <option key={curr} value={curr}>
                {curr}
              </option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label htmlFor="to">To:</label>
          <select
            id="to"
            value={to}
            onChange={e => setTo(e.target.value)}
          >
            {currencies.map(curr => (
              <option key={curr} value={curr}>
                {curr}
              </option>
            ))}
          </select>
        </div>

        <div className="result">
          <strong>
            {amount.toFixed(2)} {from} = {calculateConversion()} {to}
          </strong>
        </div>
      </div>

      <div className="exchange-rates">
        <h2>Exchange Rates (1 {from} = ?)</h2>
        <div className="rates-grid">
          {currencies.map(curr => (
            <div key={curr} className="rate-item">
              <span className="currency">{curr}</span>
              <span className="value">
                {(mockRates[curr] / mockRates[from]).toFixed(4)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;