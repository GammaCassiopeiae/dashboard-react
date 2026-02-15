import React, { useState, useEffect } from 'react';
import '../styles/CryptoFetcher.scss';

const CryptoFetcher = () => {
  const [cryptoData, setCryptoData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saveStatus, setSaveStatus] = useState('');

  // Fetch data from Coinlore API
  const fetchCoinloreData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('https://api.coinlore.net/api/tickers/?start=0&limit=50');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setCryptoData(data.data);
      return data.data;
    } catch (err) {
      setError(err.message);
      console.error('Error fetching from Coinlore:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Save data to json-server
  const saveToJsonServer = async (data) => {
    setSaveStatus('Saving...');
    
    try {
      const response = await fetch('http://localhost:3001/cryptocurrencies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          data: data
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to save: ${response.status}`);
      }

      setSaveStatus('Data saved successfully!');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (err) {
      setSaveStatus(`Save error: ${err.message}`);
      console.error('Error saving to json-server:', err);
    }
  };

  // Fetch and save data
  const handleFetchAndSave = async () => {
    const data = await fetchCoinloreData();
    if (data) {
      await saveToJsonServer(data);
    }
  };

  return (
    <div className="crypto-fetcher">
      <div className="crypto-fetcher__header">
        <h2>Coinlore API Data Fetcher</h2>
        <button 
          onClick={handleFetchAndSave}
          disabled={loading}
          className="crypto-fetcher__button"
        >
          {loading ? 'Fetching...' : 'Fetch & Save Data'}
        </button>
      </div>

      {error && (
        <div className="crypto-fetcher__error">
          Error: {error}
        </div>
      )}

      {saveStatus && (
        <div className={`crypto-fetcher__status ${saveStatus.includes('error') ? 'error' : 'success'}`}>
          {saveStatus}
        </div>
      )}

      {cryptoData.length > 0 && (
        <div className="crypto-fetcher__table-container">
          <h3>Fetched Data ({cryptoData.length} coins)</h3>
          <table className="crypto-fetcher__table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Name</th>
                <th>Symbol</th>
                <th>Price (USD)</th>
                <th>Market Cap</th>
                <th>24h Change (%)</th>
                <th>Volume 24h</th>
              </tr>
            </thead>
            <tbody>
              {cryptoData.map((coin) => (
                <tr key={coin.id}>
                  <td>{coin.rank}</td>
                  <td>{coin.name}</td>
                  <td className="crypto-fetcher__symbol">{coin.symbol}</td>
                  <td className="crypto-fetcher__price">
                    ${parseFloat(coin.price_usd).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 6
                    })}
                  </td>
                  <td>${parseFloat(coin.market_cap_usd).toLocaleString()}</td>
                  <td className={coin.percent_change_24h >= 0 ? 'positive' : 'negative'}>
                    {coin.percent_change_24h}%
                  </td>
                  <td>${parseFloat(coin.volume24).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// npx json-server --watch db.json --port 3001

export default CryptoFetcher;