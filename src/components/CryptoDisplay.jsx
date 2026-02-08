import React, { useState, useEffect } from 'react';
import './CryptoDisplay.scss';

const CryptoDisplay = () => {
  const [savedData, setSavedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedEntry, setSelectedEntry] = useState(null);

  // Fetch data from json-server
  const fetchFromJsonServer = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3001/cryptocurrencies');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setSavedData(data);
      
      // Automatically select the most recent entry
      if (data.length > 0) {
        setSelectedEntry(data[data.length - 1]);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching from json-server:', err);
    } finally {
      setLoading(false);
    }
  };

  // Delete an entry
  const deleteEntry = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/cryptocurrencies/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete');
      }

      // Refresh data
      fetchFromJsonServer();
    } catch (err) {
      console.error('Error deleting entry:', err);
    }
  };

  useEffect(() => {
    fetchFromJsonServer();
  }, []);

  return (
    <div className="crypto-display">
      <div className="crypto-display__header">
        <h2>Saved Cryptocurrency Data</h2>
        <button 
          onClick={fetchFromJsonServer}
          disabled={loading}
          className="crypto-display__button"
        >
          {loading ? 'Loading...' : 'Refresh Data'}
        </button>
      </div>

      {error && (
        <div className="crypto-display__error">
          Error: {error}
        </div>
      )}

      {savedData.length === 0 && !loading && (
        <div className="crypto-display__empty">
          No saved data found. Please fetch and save data first.
        </div>
      )}

      {savedData.length > 0 && (
        <div className="crypto-display__content">
          <div className="crypto-display__sidebar">
            <h3>Saved Entries ({savedData.length})</h3>
            <ul className="crypto-display__list">
              {savedData.map((entry) => (
                <li 
                  key={entry.id}
                  className={`crypto-display__list-item ${selectedEntry?.id === entry.id ? 'active' : ''}`}
                >
                  <div 
                    onClick={() => setSelectedEntry(entry)}
                    className="crypto-display__list-content"
                  >
                    <div className="crypto-display__list-date">
                      {new Date(entry.timestamp).toLocaleString()}
                    </div>
                    <div className="crypto-display__list-count">
                      {entry.data?.length || 0} coins
                    </div>
                  </div>
                  <button
                    onClick={() => deleteEntry(entry.id)}
                    className="crypto-display__delete-btn"
                    title="Delete entry"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {selectedEntry && (
            <div className="crypto-display__main">
              <div className="crypto-display__entry-header">
                <h3>Entry Details</h3>
                <div className="crypto-display__entry-info">
                  <span>Saved: {new Date(selectedEntry.timestamp).toLocaleString()}</span>
                  <span>Total Coins: {selectedEntry.data?.length || 0}</span>
                </div>
              </div>

              <div className="crypto-display__table-container">
                <table className="crypto-display__table">
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
                    {selectedEntry.data?.map((coin) => (
                      <tr key={coin.id}>
                        <td>{coin.rank}</td>
                        <td>{coin.name}</td>
                        <td className="crypto-display__symbol">{coin.symbol}</td>
                        <td className="crypto-display__price">
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
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CryptoDisplay;