/*


import React, { useState, useEffect } from 'react';
import './Portfolio.scss';

const Portfolio = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartType, setChartType] = useState('line');
  const [selectedStock, setSelectedStock] = useState(null);

  useEffect(() => {
    // Try to fetch the JSON file
    fetch('/stocks.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Fetched data:', data); // Debug
        if (Array.isArray(data)) {
          setStocks(data);
          setSelectedStock(data);
        } else {
          console.error('Data is not an array:', data);
          setError('Invalid data format');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Fetch error:', err); // Debug
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const getMaxPrice = () => {
    if (!selectedStock || !selectedStock.history) return 0;
    return Math.max(...selectedStock.history);
  };

  const getMinPrice = () => {
    if (!selectedStock || !selectedStock.history) return 0;
    return Math.min(...selectedStock.history);
  };

  const renderLineChart = () => {
    if (!selectedStock || !selectedStock.history) return null;

    const maxPrice = getMaxPrice();
    const minPrice = getMinPrice();
    const priceRange = maxPrice - minPrice || 1;
    const chartHeight = 200;
    const chartWidth = 500;
    const padding = 20;

    const points = selectedStock.history.map((price, index) => {
      const x = (index / (selectedStock.history.length - 1)) * (chartWidth - 2 * padding) + padding;
      const y = chartHeight - ((price - minPrice) / priceRange) * (chartHeight - 2 * padding) - padding;
      return `${x},${y}`;
    }).join(' ');

    return (
      <div className="chart-container">
        <h3>{selectedStock.name} ({selectedStock.symbol})</h3>
        <div className="chart-info">
          <span className={`price ${selectedStock.change >= 0 ? 'positive' : 'negative'}`}>
            ${selectedStock.price}
          </span>
          <span className={`change ${selectedStock.change >= 0 ? 'positive' : 'negative'}`}>
            {selectedStock.change >= 0 ? '+' : ''}{selectedStock.change} ({selectedStock.percent}%)
          </span>
        </div>
        <svg className="line-chart" viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
          <polyline
            fill="none"
            stroke={selectedStock.change >= 0 ? '#4caf50' : '#f44336'}
            strokeWidth="2"
            points={points}
          />
          {selectedStock.history.map((price, index) => {
            const x = (index / (selectedStock.history.length - 1)) * (chartWidth - 2 * padding) + padding;
            const y = chartHeight - ((price - minPrice) / priceRange) * (chartHeight - 2 * padding) - padding;
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="4"
                fill={selectedStock.change >= 0 ? '#4caf50' : '#f44336'}
              />
            );
          })}
        </svg>
        <div className="chart-labels">
          <span>Min: ${minPrice.toFixed(2)}</span>
          <span>Max: ${maxPrice.toFixed(2)}</span>
        </div>
      </div>
    );
  };

  const renderPieChart = () => {
    if (stocks.length === 0) return null;

    const total = stocks.reduce((sum, stock) => sum + stock.price, 0);
    let currentAngle = 0;
    const radius = 100;
    const centerX = 150;
    const centerY = 150;

    const colors = [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
      '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0', '#FF6384',
      '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
      '#FF6384', '#C9CBCF'
    ];

    return (
      <div className="chart-container">
        <h3>Portfolio Distribution</h3>
        <svg className="pie-chart" viewBox="0 0 300 300">
          {stocks.map((stock, index) => {
            const percentage = (stock.price / total) * 100;
            const angle = (percentage / 100) * 360;
            const startAngle = currentAngle;
            const endAngle = currentAngle + angle;

            const startX = centerX + radius * Math.cos((startAngle - 90) * Math.PI / 180);
            const startY = centerY + radius * Math.sin((startAngle - 90) * Math.PI / 180);
            const endX = centerX + radius * Math.cos((endAngle - 90) * Math.PI / 180);
            const endY = centerY + radius * Math.sin((endAngle - 90) * Math.PI / 180);

            const largeArcFlag = angle > 180 ? 1 : 0;

            const pathData = [
              `M ${centerX} ${centerY}`,
              `L ${startX} ${startY}`,
              `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`,
              'Z'
            ].join(' ');

            currentAngle += angle;

            return (
              <path
                key={index}
                d={pathData}
                fill={colors[index % colors.length]}
                stroke="#fff"
                strokeWidth="2"
              />
            );
          })}
        </svg>
        <div className="pie-legend">
          {stocks.map((stock, index) => {
            const percentage = ((stock.price / total) * 100).toFixed(2);
            return (
              <div key={index} className="legend-item">
                <span 
                  className="legend-color" 
                  style={{ backgroundColor: colors[index % colors.length] }}
                ></span>
                <span className="legend-text">
                  {stock.symbol}: {percentage}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="portfolio loading">Loading portfolio data...</div>;
  }

  if (error) {
    return <div className="portfolio error">Error: {error}</div>;
  }

  return (
    <div className="portfolio">
      <h2>My Portfolio</h2>
      
      <div className="chart-controls">
        <button 
          className={`chart-btn ${chartType === 'line' ? 'active' : ''}`}
          onClick={() => setChartType('line')}
        >
          Line Chart
        </button>
        <button 
          className={`chart-btn ${chartType === 'pie' ? 'active' : ''}`}
          onClick={() => setChartType('pie')}
        >
          Pie Chart
        </button>
      </div>

      {chartType === 'line' && selectedStock && (
        <div className="stock-selector">
          <label>Select Stock:</label>
          <select 
            value={selectedStock?.symbol} 
            onChange={(e) => setSelectedStock(stocks.find(s => s.symbol === e.target.value))}
          >
            {stocks.map(stock => (
              <option key={stock.symbol} value={stock.symbol}>
                {stock.symbol} - {stock.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="chart-display">
        {chartType === 'line' ? renderLineChart() : renderPieChart()}
      </div>

      <div className="stocks-grid">
        {stocks.map(stock => (
          <div 
            key={stock.symbol} 
            className={`stock-card ${selectedStock?.symbol === stock.symbol ? 'selected' : ''}`}
            onClick={() => {
              setSelectedStock(stock);
              setChartType('line');
            }}
          >
            <h4>{stock.symbol}</h4>
            <p className="stock-name">{stock.name}</p>
            <p className="stock-price">${stock.price}</p>
            <p className={`stock-change ${stock.change >= 0 ? 'positive' : 'negative'}`}>
              {stock.change >= 0 ? '+' : ''}{stock.change} ({stock.percent}%)
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Portfolio;
*/

/*
import React, { useState, useEffect } from 'react';
import './Portfolio.scss';

const Portfolio = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartType, setChartType] = useState('line');
  const [selectedStock, setSelectedStock] = useState(null);

  useEffect(() => {
    fetchStocks();
  }, []);

  const fetchStocks = async () => {
    try {
      const response = await fetch('/stocks.json');
      if (!response.ok) {
        throw new Error('Failed to fetch stocks data');
      }
      const data = await response.json();
      console.log('Fetched data:', data);
      if (Array.isArray(data)) {
        setStocks(data);
        setSelectedStock(data);
      } else {
        console.error('Data is not an array:', data);
        setError('Invalid data format');
      }
      setLoading(false);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const getMaxPrice = () => {
    if (!selectedStock || !selectedStock.history) return 0;
    return Math.max(...selectedStock.history);
  };

  const getMinPrice = () => {
    if (!selectedStock || !selectedStock.history) return 0;
    return Math.min(...selectedStock.history);
  };

  const renderLineChart = () => {
    if (!selectedStock || !selectedStock.history) return null;

    const maxPrice = getMaxPrice();
    const minPrice = getMinPrice();
    const priceRange = maxPrice - minPrice || 1;
    const chartHeight = 200;
    const chartWidth = 500;
    const padding = 20;

    // Calculate the actual chart area dimensions
    const chartAreaHeight = chartHeight - 2 * padding;
    const chartAreaWidth = chartWidth - 2 * padding;

    // Calculate the scaling factors for x and y axes
    const xScale = chartAreaWidth / (selectedStock.history.length - 1 || 1);
    const yScale = chartAreaHeight / priceRange;

    // Calculate the y position for the line
    const points = selectedStock.history.map((price, index) => {
      const x = padding + index * xScale;
      const y = chartHeight - padding - (price - minPrice) * yScale;
      return `${x},${y}`;
    }).join(' ');

    return (
      <div className="chart-container">
        <h3>{selectedStock.name} ({selectedStock.symbol})</h3>
        <div className="chart-info">
          <span className={`price ${selectedStock.change >= 0 ? 'positive' : 'negative'}`}>
            ${selectedStock.price}
          </span>
          <span className={`change ${selectedStock.change >= 0 ? 'positive' : 'negative'}`}>
            {selectedStock.change >= 0 ? '+' : ''}{selectedStock.change} ({selectedStock.percent}%)
          </span>
        </div>
        <svg className="line-chart" viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
         
          <line x1={padding} y1={chartHeight - 2 * padding} x2={padding} y2={padding} stroke="black" strokeWidth="2" />
          
          
          <line x1={padding} y1={chartHeight - 2 * padding} x2={chartWidth - padding} y2={chartHeight - 2 * padding} stroke="black" strokeWidth="2" />
          
        
          {[
            { value: minPrice, y: chartHeight - ((minPrice - minPrice) / priceRange) * (chartHeight - 2 * padding) - padding },
            { value: maxPrice, y: chartHeight - ((maxPrice - minPrice) / priceRange) * (chartHeight - 2 * padding) - padding }
          ].map((label, index) => {
            const y = label.y;
            return (
              <g key={index}>
                <text x={padding - 10} y={y} textAnchor="end" dominantBaseline="middle" fontSize="12" fill="#666">
                  ${label.value.toFixed(2)}
                </text>
                <line x1={padding} y1={y} x2={padding - 5} y2={y} stroke="black" strokeWidth="1" />
              </g>
            );
          })}
          
         
          {selectedStock.history.map((_, index) => {
            const x = padding + index * (chartAreaWidth / (selectedStock.history.length - 1 || 1));
            const label = index === 0 ? 'Start' : index === selectedStock.history.length - 1 ? 'End' : (index + 1).toString();
            return (
              <g key={index}>
                <text x={x} y={chartHeight - 5} textAnchor="middle" fontSize="12" fill="#666">
                  {label}
                </text>
                <line x1={x} y1={chartHeight - 2 * padding} x2={x} y2={chartHeight - 2 * padding + 5} stroke="black" strokeWidth="1" />
              </g>
            );
          })}
          
         
          <polyline
            fill="none"
            stroke={selectedStock.change >= 0 ? '#4caf50' : '#f44336'}
            strokeWidth="2"
            points={points}
          />
          {selectedStock.history.map((price, index) => {
            const x = padding + index * (chartAreaWidth / (selectedStock.history.length - 1 || 1));
            const y = chartHeight - padding - (price - minPrice) * (chartAreaHeight / priceRange);
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="4"
                fill={selectedStock.change >= 0 ? '#4caf50' : '#f44336'}
              />
            );
          })}
        </svg>
        <div className="chart-labels">
          <span>Min: ${minPrice.toFixed(2)}</span>
          <span>Max: ${maxPrice.toFixed(2)}</span>
        </div>
      </div>
    );
  };

  const renderPieChart = () => {
    if (stocks.length === 0) return null;

    const total = stocks.reduce((sum, stock) => sum + stock.price, 0);
    let currentAngle = 0;
    const radius = 100;
    const centerX = 150;
    const centerY = 150;

    const colors = [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
      '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0', '#FF6384',
      '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
      '#FF6384', '#C9CBCF'
    ];

    return (
      <div className="chart-container">
        <h3>Portfolio Distribution</h3>
        <svg className="pie-chart" viewBox="0 0 300 300">
          {stocks.map((stock, index) => {
            const percentage = (stock.price / total) * 100;
            const angle = (percentage / 100) * 360;
            const startAngle = currentAngle;
            const endAngle = currentAngle + angle;

            const startX = centerX + radius * Math.cos((startAngle - 90) * Math.PI / 180);
            const startY = centerY + radius * Math.sin((startAngle - 90) * Math.PI / 180);
            const endX = centerX + radius * Math.cos((endAngle - 90) * Math.PI / 180);
            const endY = centerY + radius * Math.sin((endAngle - 90) * Math.PI / 180);

            const largeArcFlag = angle > 180 ? 1 : 0;

            const pathData = [
              `M ${centerX} ${centerY}`,
              `L ${startX} ${startY}`,
              `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`,
              'Z'
            ].join(' ');

            currentAngle += angle;

            return (
              <path
                key={index}
                d={pathData}
                fill={colors[index % colors.length]}
                stroke="#fff"
                strokeWidth="2"
              />
            );
          })}
        </svg>
        <div className="pie-legend">
          {stocks.map((stock, index) => {
            const percentage = ((stock.price / total) * 100).toFixed(2);
            return (
              <div key={index} className="legend-item">
                <span 
                  className="legend-color" 
                  style={{ backgroundColor: colors[index % colors.length] }}
                ></span>
                <span className="legend-text">
                  {stock.symbol}: {percentage}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="portfolio loading">Loading portfolio data...</div>;
  }

  if (error) {
    return <div className="portfolio error">Error: {error}</div>;
  }

  return (
    <div className="portfolio">
      <h2>My Portfolio</h2>
      
      <div className="chart-controls">
        <button 
          className={`chart-btn ${chartType === 'line' ? 'active' : ''}`}
          onClick={() => setChartType('line')}
        >
          Line Chart
        </button>
        <button 
          className={`chart-btn ${chartType === 'pie' ? 'active' : ''}`}
          onClick={() => setChartType('pie')}
        >
          Pie Chart
        </button>
      </div>

      {chartType === 'line' && selectedStock && (
        <div className="stock-selector">
          <label>Select Stock:</label>
          <select 
            value={selectedStock?.symbol} 
            onChange={(e) => setSelectedStock(stocks.find(s => s.symbol === e.target.value))}
          >
            {stocks.map(stock => (
              <option key={stock.symbol} value={stock.symbol}>
                {stock.symbol} - {stock.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="chart-display">
        {chartType === 'line' ? renderLineChart() : renderPieChart()}
      </div>

      <div className="stocks-grid">
        {stocks.map(stock => (
          <div 
            key={stock.symbol} 
            className={`stock-card ${selectedStock?.symbol === stock.symbol ? 'selected' : ''}`}
            onClick={() => {
              setSelectedStock(stock);
              setChartType('line');
            }}
          >
            <h4>{stock.symbol}</h4>
            <p className="stock-name">{stock.name}</p>
            <p className="stock-price">${stock.price}</p>
            <p className={`stock-change ${stock.change >= 0 ? 'positive' : 'negative'}`}>
              {stock.change >= 0 ? '+' : ''}{stock.change} ({stock.percent}%)
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Portfolio;  */


/*
import React, { useState, useEffect } from 'react';
import './Portfolio.scss';

const Portfolio = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartType, setChartType] = useState('line');
  const [selectedStock, setSelectedStock] = useState(null);

  useEffect(() => {
    fetchStocks();
  }, []);

  const fetchStocks = async () => {
    try {
      const response = await fetch('/stocks.json');
      if (!response.ok) {
        throw new Error('Failed to fetch stocks data');
      }
      const data = await response.json();
      console.log('Fetched data:', data);
      if (Array.isArray(data)) {
        setStocks(data);
        setSelectedStock(data);
      } else {
        console.error('Data is not an array:', data);
        setError('Invalid data format');
      }
      setLoading(false);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const getMaxPrice = () => {
    if (!selectedStock || !selectedStock.history) return 0;
    return Math.max(...selectedStock.history);
  };

  const getMinPrice = () => {
    if (!selectedStock || !selectedStock.history) return 0;
    return Math.min(...selectedStock.history);
  };

  const renderLineChart = () => {
    if (!selectedStock || !selectedStock.history) return null;

    const maxPrice = getMaxPrice();
    const minPrice = getMinPrice();
    const priceRange = maxPrice - minPrice || 1;
    const chartHeight = 200;
    const chartWidth = 500;
    const padding = 20;

    // Calculate the actual chart area dimensions
    const chartAreaHeight = chartHeight - 2 * padding;
    const chartAreaWidth = chartWidth - 2 * padding;

    // Calculate the scaling factors for x and y axes
    const xScale = chartAreaWidth / (selectedStock.history.length - 1 || 1);
    const yScale = chartAreaHeight / priceRange;

    // Calculate the y position for the line
    const points = selectedStock.history.map((price, index) => {
      const x = padding + index * xScale;
      const y = chartHeight - padding - (price - minPrice) * yScale;
      return `${x},${y}`;
    }).join(' ');

    return (
      <div className="chart-container">
        <h3>{selectedStock.name} ({selectedStock.symbol})</h3>
        <div className="chart-info">
          <span className={`price ${selectedStock.change >= 0 ? 'positive' : 'negative'}`}>
            ${selectedStock.price}
          </span>
          <span className={`change ${selectedStock.change >= 0 ? 'positive' : 'negative'}`}>
            {selectedStock.change >= 0 ? '+' : ''}{selectedStock.change} ({selectedStock.percent}%)
          </span>
        </div>
        <svg className="line-chart" viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
          
          <line x1={padding} y1={chartHeight - 2 * padding} x2={padding} y2={padding} stroke="black" strokeWidth="2" />
          
         
          <line x1={padding} y1={chartHeight - 2 * padding} x2={chartWidth - padding} y2={chartHeight - 2 * padding} stroke="black" strokeWidth="2" />
          
          
          {[
            { value: minPrice, y: chartHeight - ((minPrice - minPrice) / priceRange) * (chartHeight - 2 * padding) - padding },
            { value: maxPrice, y: chartHeight - ((maxPrice - minPrice) / priceRange) * (chartHeight - 2 * padding) - padding }
          ].map((label, index) => {
            const y = label.y;
            return (
              <g key={index}>
                <text x={padding - 10} y={y} textAnchor="end" dominantBaseline="middle" fontSize="12" fill="#666">
                  ${label.value.toFixed(2)}
                </text>
                <line x1={padding} y1={y} x2={padding - 5} y2={y} stroke="black" strokeWidth="1" />
              </g>
            );
          })}
          
         
          {selectedStock.history.map((_, index) => {
            const x = padding + index * (chartAreaWidth / (selectedStock.history.length - 1 || 1));
            const label = index === 0 ? 'Start' : index === selectedStock.history.length - 1 ? 'End' : (index + 1).toString();
            return (
              <g key={index}>
                <text x={x} y={chartHeight - 5} textAnchor="middle" fontSize="12" fill="#666">
                  {label}
                </text>
                <line x1={x} y1={chartHeight - 2 * padding} x2={x} y2={chartHeight - 2 * padding + 5} stroke="black" strokeWidth="1" />
              </g>
            );
          })}
          
          
          <polyline
            fill="none"
            stroke={selectedStock.change >= 0 ? '#4caf50' : '#f44336'}
            strokeWidth="2"
            points={points}
          />
          {selectedStock.history.map((price, index) => {
            const x = padding + index * (chartAreaWidth / (selectedStock.history.length - 1 || 1));
            const y = chartHeight - padding - (price - minPrice) * (chartAreaHeight / priceRange);
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="4"
                fill={selectedStock.change >= 0 ? '#4caf50' : '#f44336'}
              />
            );
          })}
        </svg>
        <div className="chart-labels">
          <span>Min: ${minPrice.toFixed(2)}</span>
          <span>Max: ${maxPrice.toFixed(2)}</span>
        </div>
      </div>
    );
  };

  const renderPieChart = () => {
    if (stocks.length === 0) return null;

    const total = stocks.reduce((sum, stock) => sum + stock.price, 0);
    let currentAngle = 0;
    const radius = 100;
    const centerX = 150;
    const centerY = 150;

    const colors = [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
      '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0', '#FF6384',
      '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
      '#FF6384', '#C9CBCF'
    ];

    return (
      <div className="chart-container">
        <h3>Portfolio Distribution</h3>
        <svg className="pie-chart" viewBox="0 0 300 300">
          {stocks.map((stock, index) => {
            const percentage = (stock.price / total) * 100;
            const angle = (percentage / 100) * 360;
            const startAngle = currentAngle;
            const endAngle = currentAngle + angle;

            const startX = centerX + radius * Math.cos((startAngle - 90) * Math.PI / 180);
            const startY = centerY + radius * Math.sin((startAngle - 90) * Math.PI / 180);
            const endX = centerX + radius * Math.cos((endAngle - 90) * Math.PI / 180);
            const endY = centerY + radius * Math.sin((endAngle - 90) * Math.PI / 180);

            const largeArcFlag = angle > 180 ? 1 : 0;

            const pathData = [
              `M ${centerX} ${centerY}`,
              `L ${startX} ${startY}`,
              `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`,
              'Z'
            ].join(' ');

            currentAngle += angle;

            return (
              <path
                key={index}
                d={pathData}
                fill={colors[index % colors.length]}
                stroke="#fff"
                strokeWidth="2"
              />
            );
          })}
        </svg>
        <div className="pie-legend">
          {stocks.map((stock, index) => {
            const percentage = ((stock.price / total) * 100).toFixed(2);
            return (
              <div key={index} className="legend-item">
                <span 
                  className="legend-color" 
                  style={{ backgroundColor: colors[index % colors.length] }}
                ></span>
                <span className="legend-text">
                  {stock.symbol}: {percentage}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="portfolio loading">Loading portfolio data...</div>;
  }

  if (error) {
    return <div className="portfolio error">Error: {error}</div>;
  }

  return (
    <div className="portfolio">
      <h2>My Portfolio</h2>
      
      <div className="chart-controls">
        <button 
          className={`chart-btn ${chartType === 'pie' ? 'active' : ''}`}
          onClick={() => setChartType('pie')}
        >
          Pie Chart
        </button>
        <button 
          className={`chart-btn ${chartType === 'line' ? 'active' : ''}`}
          onClick={() => setChartType('line')}
        >
          Line Chart
        </button>
      </div>

      {chartType === 'line' && selectedStock && (
        <div className="stock-selector">
          <label>Select Stock:</label>
          <select 
            value={selectedStock?.symbol} 
            onChange={(e) => setSelectedStock(stocks.find(s => s.symbol === e.target.value))}
          >
            {stocks.map(stock => (
              <option key={stock.symbol} value={stock.symbol}>
                {stock.symbol} - {stock.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="chart-display">
        {chartType === 'line' ? renderLineChart() : renderPieChart()}
      </div>

      <div className="stocks-grid">
        {stocks.map(stock => (
          <div 
            key={stock.symbol} 
            className={`stock-card ${selectedStock?.symbol === stock.symbol ? 'selected' : ''}`}
            onClick={() => {
              setSelectedStock(stock);
              setChartType('line');
            }}
          >
            <h4>{stock.symbol}</h4>
            <p className="stock-name">{stock.name}</p>
            <p className="stock-price">${stock.price}</p>
            <p className={`stock-change ${stock.change >= 0 ? 'positive' : 'negative'}`}>
              {stock.change >= 0 ? '+' : ''}{stock.change} ({stock.percent}%)
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Portfolio;  */
/*

import React, { useState, useEffect } from 'react';
import './Portfolio.scss';

const Portfolio = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartType, setChartType] = useState('line');
  const [selectedStock, setSelectedStock] = useState(null);

  useEffect(() => {
    fetchStocks();
  }, []);

  const fetchStocks = async () => {
    try {
      const response = await fetch('/stocks.json');
      if (!response.ok) {
        throw new Error('Failed to fetch stocks data');
      }
      const data = await response.json();
      console.log('Fetched data:', data);
      if (Array.isArray(data)) {
        setStocks(data);
        setSelectedStock(data);
      } else {
        console.error('Data is not an array:', data);
        setError('Invalid data format');
      }
      setLoading(false);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const getMaxPrice = () => {
    if (!selectedStock || !selectedStock.history) return 0;
    return Math.max(...selectedStock.history);
  };

  const getMinPrice = () => {
    if (!selectedStock || !selectedStock.history) return 0;
    return Math.min(...selectedStock.history);
  };

  const renderLineChart = () => {
    if (!selectedStock || !selectedStock.history) return null;

    const maxPrice = getMaxPrice();
    const minPrice = getMinPrice();
    const priceRange = maxPrice - minPrice || 1;
    const chartHeight = 200;
    const chartWidth = 500;
    const padding = 20;

    // Calculate the actual chart area dimensions
    const chartAreaHeight = chartHeight - 2 * padding;
    const chartAreaWidth = chartWidth - 2 * padding;

    // Calculate the scaling factors for x and y axes
    const xScale = chartAreaWidth / (selectedStock.history.length - 1 || 1);
    const yScale = chartAreaHeight / priceRange;

    // Calculate the y position for the line
    const points = selectedStock.history.map((price, index) => {
      const x = padding + index * xScale;
      const y = chartHeight - padding - (price - minPrice) * yScale;
      return `${x},${y}`;
    }).join(' ');

    return (
      <div className="chart-container">
        <h3>{selectedStock.name} ({selectedStock.symbol})</h3>
        <div className="chart-info">
          <span className={`price ${selectedStock.change >= 0 ? 'positive' : 'negative'}`}>
            ${selectedStock.price}
          </span>
          <span className={`change ${selectedStock.change >= 0 ? 'positive' : 'negative'}`}>
            {selectedStock.change >= 0 ? '+' : ''}{selectedStock.change} ({selectedStock.percent}%)
          </span>
        </div>
        <svg className="line-chart" viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
          
          <line x1={padding} y1={chartHeight - 2 * padding} x2={padding} y2={padding} stroke="black" strokeWidth="2" />
          
          
          <line x1={padding} y1={chartHeight - 2 * padding} x2={chartWidth - padding} y2={chartHeight - 2 * padding} stroke="black" strokeWidth="2" />
          
          
          {[
            { value: minPrice, y: chartHeight - ((minPrice - minPrice) / priceRange) * (chartHeight - 2 * padding) - padding },
            { value: maxPrice, y: chartHeight - ((maxPrice - minPrice) / priceRange) * (chartHeight - 2 * padding) - padding }
          ].map((label, index) => {
            const y = label.y;
            return (
              <g key={index}>
                <text x={padding - 10} y={y} textAnchor="end" dominantBaseline="middle" fontSize="12" fill="#666">
                  ${label.value.toFixed(2)}
                </text>
                <line x1={padding} y1={y} x2={padding - 5} y2={y} stroke="black" strokeWidth="1" />
              </g>
            );
          })}
          
          
          {selectedStock.history.map((_, index) => {
            const x = padding + index * (chartAreaWidth / (selectedStock.history.length - 1 || 1));
            const label = index === 0 ? 'Start' : index === selectedStock.history.length - 1 ? 'End' : (index + 1).toString();
            return (
              <g key={index}>
                <text x={x} y={chartHeight - 5} textAnchor="middle" fontSize="12" fill="#666">
                  {label}
                </text>
                <line x1={x} y1={chartHeight - 2 * padding} x2={x} y2={chartHeight - 2 * padding + 5} stroke="black" strokeWidth="1" />
              </g>
            );
          })}
          
         
          <polyline
            fill="none"
            stroke={selectedStock.change >= 0 ? '#4caf50' : '#f44336'}
            strokeWidth="2"
            points={points}
          />
          {selectedStock.history.map((price, index) => {
            const x = padding + index * (chartAreaWidth / (selectedStock.history.length - 1 || 1));
            const y = chartHeight - padding - (price - minPrice) * (chartAreaHeight / priceRange);
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="4"
                fill={selectedStock.change >= 0 ? '#4caf50' : '#f44336'}
              />
            );
          })}
        </svg>
        <div className="chart-labels">
          <span>Min: ${minPrice.toFixed(2)}</span>
          <span>Max: ${maxPrice.toFixed(2)}</span>
        </div>
      </div>
    );
  };

  const renderPieChart = () => {
    if (stocks.length === 0) return null;

    const total = stocks.reduce((sum, stock) => sum + stock.price, 0);
    let currentAngle = 0;
    const radius = 100;
    const centerX = 150;
    const centerY = 150;

    const colors = [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
      '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0', '#FF6384',
      '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
      '#FF6384', '#C9CBCF'
    ];

    return (
      <div className="chart-container">
        <h3>Portfolio Distribution</h3>
        <svg className="pie-chart" viewBox="0 0 300 300">
          {stocks.map((stock, index) => {
            const percentage = (stock.price / total) * 100;
            const angle = (percentage / 100) * 360;
            const startAngle = currentAngle;
            const endAngle = currentAngle + angle;

            const startX = centerX + radius * Math.cos((startAngle - 90) * Math.PI / 180);
            const startY = centerY + radius * Math.sin((startAngle - 90) * Math.PI / 180);
            const endX = centerX + radius * Math.cos((endAngle - 90) * Math.PI / 180);
            const endY = centerY + radius * Math.sin((endAngle - 90) * Math.PI / 180);

            const largeArcFlag = angle > 180 ? 1 : 0;

            const pathData = [
              `M ${centerX} ${centerY}`,
              `L ${startX} ${startY}`,
              `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`,
              'Z'
            ].join(' ');

            currentAngle += angle;

            return (
              <path
                key={index}
                d={pathData}
                fill={colors[index % colors.length]}
                stroke="#fff"
                strokeWidth="2"
              />
            );
          })}
        </svg>
        <div className="pie-legend">
          {stocks.map((stock, index) => {
            const percentage = ((stock.price / total) * 100).toFixed(2);
            return (
              <div key={index} className="legend-item">
                <span 
                  className="legend-color" 
                  style={{ backgroundColor: colors[index % colors.length] }}
                ></span>
                <span className="legend-text">
                  {stock.symbol}: {percentage}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="portfolio loading">Loading portfolio data...</div>;
  }

  if (error) {
    return <div className="portfolio error">Error: {error}</div>;
  }

  return (
    <div className="portfolio">
      <h2>My Portfolio</h2>
      
      <div className="chart-controls">
        <div className="stock-selector">
          <label>Select Stock:</label>
          <select 
            value={selectedStock?.symbol} 
            onChange={(e) => setSelectedStock(stocks.find(s => s.symbol === e.target.value))}
          >
            {stocks.map(stock => (
              <option key={stock.symbol} value={stock.symbol}>
                {stock.symbol} - {stock.name}
              </option>
            ))}
          </select>
        </div>
        
        <button 
          className={`chart-btn ${chartType === 'pie' ? 'active' : ''}`}
          onClick={() => setChartType('pie')}
        >
          Pie Chart
        </button>
        <button 
          className={`chart-btn ${chartType === 'line' ? 'active' : ''}`}
          onClick={() => setChartType('line')}
        >
          Line Chart
        </button>
      </div>

      {chartType === 'line' && selectedStock && (
        <div className="chart-display">
          {renderLineChart()}
        </div>
      )}

      {chartType === 'pie' && (
        <div className="chart-display">
          {renderPieChart()}
        </div>
      )}

      <div className="stocks-grid">
        {stocks.map(stock => (
          <div 
            key={stock.symbol} 
            className={`stock-card ${selectedStock?.symbol === stock.symbol ? 'selected' : ''}`}
            onClick={() => {
              setSelectedStock(stock);
              setChartType('line');
            }}
          >
            <h4>{stock.symbol}</h4>
            <p className="stock-name">{stock.name}</p>
            <p className="stock-price">${stock.price}</p>
            <p className={`stock-change ${stock.change >= 0 ? 'positive' : 'negative'}`}>
              {stock.change >= 0 ? '+' : ''}{stock.change} ({stock.percent}%)
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Portfolio;  

*/
import React, { useState, useEffect } from 'react';
import './Portfolio.scss';

const Portfolio = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartType, setChartType] = useState('line');
  const [selectedStock, setSelectedStock] = useState(null);
  const [portfolio, setPortfolio] = useState([]);
  const [budget, setBudget] = useState(5000);
  const [selectedStocks, setSelectedStocks] = useState([]);

  useEffect(() => {
    fetchStocks();
  }, []);

  const fetchStocks = async () => {
    try {
      const response = await fetch('/stocks.json');
      if (!response.ok) {
        throw new Error('Failed to fetch stocks data');
      }
      const data = await response.json();
      console.log('Fetched data:', data);
      if (Array.isArray(data)) {
        setStocks(data);
        setSelectedStock(data);
      } else {
        console.error('Data is not an array:', data);
        setError('Invalid data format');
      }
      setLoading(false);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const getMaxPrice = () => {
    if (!selectedStock || !selectedStock.history) return 0;
    return Math.max(...selectedStock.history);
  };

  const getMinPrice = () => {
    if (!selectedStock || !selectedStock.history) return 0;
    return Math.min(...selectedStock.history);
  };

  const renderLineChart = () => {
    if (!selectedStock || !selectedStock.history) return null;

    const maxPrice = getMaxPrice();
    const minPrice = getMinPrice();
    const priceRange = maxPrice - minPrice || 1;
    const chartHeight = 200;
    const chartWidth = 500;
    const padding = 20;

    // Calculate the actual chart area dimensions
    const chartAreaHeight = chartHeight - 2 * padding;
    const chartAreaWidth = chartWidth - 2 * padding;

    // Calculate the scaling factors for x and y axes
    const xScale = chartAreaWidth / (selectedStock.history.length - 1 || 1);
    const yScale = chartAreaHeight / priceRange;

    // Calculate the y position for the line
    const points = selectedStock.history.map((price, index) => {
      const x = padding + index * xScale;
      const y = chartHeight - padding - (price - minPrice) * yScale;
      return `${x},${y}`;
    }).join(' ');

    return (
      <div className="chart-container">
        <h3>{selectedStock.name} ({selectedStock.symbol})</h3>
        <div className="chart-info">
          <span className={`price ${selectedStock.change >= 0 ? 'positive' : 'negative'}`}>
            ${selectedStock.price}
          </span>
          <span className={`change ${selectedStock.change >= 0 ? 'positive' : 'negative'}`}>
            {selectedStock.change >= 0 ? '+' : ''}{selectedStock.change} ({selectedStock.percent}%)
          </span>
        </div>
        <svg className="line-chart" viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
          {/* Y-axis line (black) */}
          <line x1={padding} y1={chartHeight - 2 * padding} x2={padding} y2={padding} stroke="black" strokeWidth="2" />
          
          {/* X-axis line (black) */}
          <line x1={padding} y1={chartHeight - 2 * padding} x2={chartWidth - padding} y2={chartHeight - 2 * padding} stroke="black" strokeWidth="2" />
          
          {/* Y-axis labels */}
          {[
            { value: minPrice, y: chartHeight - ((minPrice - minPrice) / priceRange) * (chartHeight - 2 * padding) - padding },
            { value: maxPrice, y: chartHeight - ((maxPrice - minPrice) / priceRange) * (chartHeight - 2 * padding) - padding }
          ].map((label, index) => {
            const y = label.y;
            return (
              <g key={index}>
                <text x={padding - 10} y={y} textAnchor="end" dominantBaseline="middle" fontSize="12" fill="#666">
                  ${label.value.toFixed(2)}
                </text>
                <line x1={padding} y1={y} x2={padding - 5} y2={y} stroke="black" strokeWidth="1" />
              </g>
            );
          })}
          
          {/* X-axis labels */}
          {selectedStock.history.map((_, index) => {
            const x = padding + index * (chartAreaWidth / (selectedStock.history.length - 1 || 1));
            const label = index === 0 ? 'Start' : index === selectedStock.history.length - 1 ? 'End' : (index + 1).toString();
            return (
              <g key={index}>
                <text x={x} y={chartHeight - 5} textAnchor="middle" fontSize="12" fill="#666">
                  {label}
                </text>
                <line x1={x} y1={chartHeight - 2 * padding} x2={x} y2={chartHeight - 2 * padding + 5} stroke="black" strokeWidth="1" />
              </g>
            );
          })}
          
          {/* Line and points */}
          <polyline
            fill="none"
            stroke={selectedStock.change >= 0 ? '#4caf50' : '#f44336'}
            strokeWidth="2"
            points={points}
          />
          {selectedStock.history.map((price, index) => {
            const x = padding + index * (chartAreaWidth / (selectedStock.history.length - 1 || 1));
            const y = chartHeight - padding - (price - minPrice) * (chartAreaHeight / priceRange);
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="4"
                fill={selectedStock.change >= 0 ? '#4caf50' : '#f44336'}
              />
            );
          })}
        </svg>
        <div className="chart-labels">
          <span>Min: ${minPrice.toFixed(2)}</span>
          <span>Max: ${maxPrice.toFixed(2)}</span>
        </div>
      </div>
    );
  };

  const renderPieChart = () => {
    if (stocks.length === 0) return null;

    const total = stocks.reduce((sum, stock) => sum + stock.price, 0);
    let currentAngle = 0;
    const radius = 100;
    const centerX = 150;
    const centerY = 150;

    const colors = [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
      '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0', '#FF6384',
      '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
      '#FF6384', '#C9CBCF'
    ];

    return (
      <div className="chart-container">
        <h3>Portfolio Distribution</h3>
        <svg className="pie-chart" viewBox="0 0 300 300">
          {stocks.map((stock, index) => {
            const percentage = (stock.price / total) * 100;
            const angle = (percentage / 100) * 360;
            const startAngle = currentAngle;
            const endAngle = currentAngle + angle;

            const startX = centerX + radius * Math.cos((startAngle - 90) * Math.PI / 180);
            const startY = centerY + radius * Math.sin((startAngle - 90) * Math.PI / 180);
            const endX = centerX + radius * Math.cos((endAngle - 90) * Math.PI / 180);
            const endY = centerY + radius * Math.sin((endAngle - 90) * Math.PI / 180);

            const largeArcFlag = angle > 180 ? 1 : 0;

            const pathData = [
              `M ${centerX} ${centerY}`,
              `L ${startX} ${startY}`,
              `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`,
              'Z'
            ].join(' ');

            currentAngle += angle;

            return (
              <path
                key={index}
                d={pathData}
                fill={colors[index % colors.length]}
                stroke="#fff"
                strokeWidth="2"
              />
            );
          })}
        </svg>
        <div className="pie-legend">
          {stocks.map((stock, index) => {
            const percentage = ((stock.price / total) * 100).toFixed(2);
            return (
              <div key={index} className="legend-item">
                <span 
                  className="legend-color" 
                  style={{ backgroundColor: colors[index % colors.length] }}
                ></span>
                <span className="legend-text">
                  {stock.symbol}: {percentage}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const handleAddToPortfolio = (stock) => {
    if (budget < stock.price) {
      alert("You don't have enough budget to buy this stock.");
      return;
    }

    // Check if the stock is already in the portfolio
    const existingStock = portfolio.find(s => s.symbol === stock.symbol);
    if (existingStock) {
      // If stock is already in portfolio, increase quantity
      const updatedPortfolio = portfolio.map(s => 
        s.symbol === stock.symbol ? { ...s, quantity: s.quantity + 1 } : s
      );
      setPortfolio(updatedPortfolio);
      setBudget(budget - stock.price);
      return;
    }

    // Add new stock to portfolio
    const newStock = { ...stock, quantity: 1 };
    setPortfolio([...portfolio, newStock]);
    setBudget(budget - stock.price);
  };

  const handleRemoveFromPortfolio = (stock) => {
    // Check if the stock is in the portfolio
    const existingStock = portfolio.find(s => s.symbol === stock.symbol);
    if (!existingStock) {
      alert("This stock is not in your portfolio.");
      return;
    }

    // Remove stock from portfolio
    const updatedPortfolio = portfolio.filter(s => s.symbol !== stock.symbol);
    setPortfolio(updatedPortfolio);
    setBudget(budget + stock.price);
  };

  const handleAddToStocks = (stock) => {
    // Check if the stock is already selected
    const existingStock = selectedStocks.find(s => s.symbol === stock.symbol);
    if (existingStock) {
      // If stock is already selected, remove it
      const updatedStocks = selectedStocks.filter(s => s.symbol !== stock.symbol);
      setSelectedStocks(updatedStocks);
      return;
    }

    // Add stock to selected stocks
    setSelectedStocks([...selectedStocks, stock]);
  };

  const handleRemoveFromStocks = (stock) => {
    // Check if the stock is in the selected stocks
    const existingStock = selectedStocks.find(s => s.symbol === stock.symbol);
    if (!existingStock) {
      alert("This stock is not selected.");
      return;
    }

    // Remove stock from selected stocks
    const updatedStocks = selectedStocks.filter(s => s.symbol !== stock.symbol);
    setSelectedStocks(updatedStocks);
  };

  const getPortfolioTotal = () => {
    return portfolio.reduce((sum, stock) => sum + (stock.price * stock.quantity), 0);
  };

  const getSelectedStocksTotal = () => {
    return selectedStocks.reduce((sum, stock) => sum + stock.price, 0);
  };

  if (loading) {
    return <div className="portfolio loading">Loading portfolio data...</div>;
  }

  if (error) {
    return <div className="portfolio error">Error: {error}</div>;
  }

  return (
    <div className="portfolio">
      <h2>My Portfolio</h2>
      
      <div className="chart-controls">
        <div className="stock-selector">
          <label>Select Stock:</label>
          <select 
            value={selectedStock?.symbol} 
            onChange={(e) => setSelectedStock(stocks.find(s => s.symbol === e.target.value))}
          >
            {stocks.map(stock => (
              <option key={stock.symbol} value={stock.symbol}>
                {stock.symbol} - {stock.name}
              </option>
            ))}
          </select>
        </div>
        
        <button 
          className={`chart-btn ${chartType === 'pie' ? 'active' : ''}`}
          onClick={() => setChartType('pie')}
        >
          Pie Chart
        </button>
        <button 
          className={`chart-btn ${chartType === 'line' ? 'active' : ''}`}
          onClick={() => setChartType('line')}
        >
          Line Chart
        </button>
      </div>

      {chartType === 'line' && selectedStock && (
        <div className="chart-display">
          {renderLineChart()}
        </div>
      )}

      {chartType === 'pie' && (
        <div className="chart-display">
          {renderPieChart()}
        </div>
      )}

      <div className="portfolio-summary">
        <h3>My Portfolio</h3>
        <p>Total Value: ${getPortfolioTotal().toFixed(2)}</p>
        <p>Remaining Budget: ${budget.toFixed(2)}</p>
        <p>Selected Stocks: {selectedStocks.length}</p>
        <p>Selected Total: ${getSelectedStocksTotal().toFixed(2)}</p>
      </div>

      <div className="stocks-grid">
        {stocks.map(stock => (
          <div 
            key={stock.symbol} 
            className={`stock-card ${selectedStock?.symbol === stock.symbol ? 'selected' : ''}`}
            onClick={() => {
              setSelectedStock(stock);
              setChartType('line');
            }}
          >
            <h4>{stock.symbol}</h4>
            <p className="stock-name">{stock.name}</p>
            <p className="stock-price">${stock.price}</p>
            <p className={`stock-change ${stock.change >= 0 ? 'positive' : 'negative'}`}>
              {stock.change >= 0 ? '+' : ''}{stock.change} ({stock.percent}%)
            </p>
            <div className="stock-actions">
              <button 
                className="add-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToPortfolio(stock);
                }}
              >
                Add to Portfolio
              </button>
              <button 
                className="add-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToStocks(stock);
                }}
              >
                Add to Selection
              </button>
            </div>
          </div>
        ))}
      </div>

      {portfolio.length > 0 && (
        <div className="portfolio-items">
          <h3>Portfolio Items</h3>
          {portfolio.map(stock => (
            <div key={stock.symbol} className="portfolio-item">
              <div className="portfolio-item-info">
                <h4>{stock.symbol}</h4>
                <p>{stock.name}</p>
                <p>Quantity: {stock.quantity}</p>
                <p>Price: ${stock.price}</p>
              </div>
              <button 
                className="remove-btn"
                onClick={() => handleRemoveFromPortfolio(stock)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Portfolio;
