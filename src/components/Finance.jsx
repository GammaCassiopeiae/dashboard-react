
import React, { useState, useEffect, useRef } from 'react';
import '../styles/Finance.scss';  //The .. means "go up one directory level" (from components to src), then access styles/Finance.scss.

const Finance = () => {
  const [yahooData, setYahooData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const canvasRefs = useRef({});

  // Mock data generator - replace with real API calls
  const generateMockData = () => {
    return [
      {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        price: 180.5,
        change: 2.3,
        percent: 1.3,
        history: [175, 177, 178, 179, 180, 180.5]
      },
      {
        symbol: 'GOOGL',
        name: 'Alphabet Inc.',
        price: 145.2,
        change: 1.8,
        percent: 1.25,
        history: [140, 141, 142, 143, 144, 145.2]
      },
      {
        symbol: 'MSFT',
        name: 'Microsoft Corp.',
        price: 385.7,
        change: 3.5,
        percent: 0.92,
        history: [375, 378, 380, 382, 384, 385.7]
      },
      {
        symbol: 'TSLA',
        name: 'Tesla Inc.',
        price: 250.1,
        change: -5.2,
        percent: -2.02,
        history: [265, 262, 258, 255, 252, 250.1]
      },
      {
        symbol: 'AMZN',
        name: 'Amazon.com Inc.',
        price: 140.8,
        change: 0.4,
        percent: 0.29,
        history: [138, 139, 139.5, 140, 140.5, 140.8]
      },
      {
        symbol: 'NVDA',
        name: 'NVIDIA Corp.',
        price: 1050.3,
        change: 12.5,
        percent: 1.21,
        history: [1020, 1025, 1030, 1040, 1045, 1050.3]
      },
      {
        symbol: 'ORCL',
        name: 'Oracle Corp.',
        price: 970.3,
        change: -20.5,
        percent: 5.21,
        history: [1020, 1025, 1030, 1040, 1045, 1050.3]
      },
      {
        symbol: 'NFLX',
        name: 'Netflix Inc.',
        price: 445.2,
        change: 12.5,
        percent: 2.89,
        history: [420, 425, 430, 435, 440, 445.2]
      },
      {
        symbol: 'TSMC',
        name: 'Taiwan Semiconductor',
        price: 125.8,
        change: 3.2,
        percent: 2.60,
        history: [115, 118, 120, 122, 124, 125.8]
      },
      {
        symbol: 'JPM',
        name: 'JPMorgan Chase',
        price: 195.6,
        change: 2.1,
        percent: 1.08,
        history: [188, 190, 192, 194, 195, 195.6]
      },
      {
        symbol: 'V',
        name: 'Visa Inc.',
        price: 285.4,
        change: 4.3,
        percent: 1.53,
        history: [275, 278, 280, 282, 284, 285.4]
      },
      {
      symbol: 'WMT',
      name: 'Walmart Inc.',
      price: 92.3,
      change: 1.2,
      percent: 1.31,
      history: [88, 89, 90, 91, 91.5, 92.3]
      },
      {
      symbol: 'JNJ',
      name: 'Johnson & Johnson',
      price: 155.2,
      change: 2.5,
      percent: 1.63,
      history: [148, 150, 152, 153, 154, 155.2]
      },
      {
      symbol: 'KO',
      name: 'The Coca-Cola Company',
      price: 62.8,
      change: 0.5,
      percent: 0.80,
      history: [60, 60.5, 61, 61.5, 62.3, 62.8]
      },
      {
      symbol: 'BA',
      name: 'The Boeing Company',
      price: 185.3,
      change: 3.8,
      percent: 2.09,
      history: [175, 178, 180, 182, 184, 185.3]
      },
      {
      symbol: 'GE',
      name: 'General Electric',
      price: 78.5,
      change: 1.5,
      percent: 1.94,
      history: [74, 75, 76, 77, 78, 78.5]
      },
      {
      symbol: 'IBM',
      name: 'International Business Machines',
      price: 142.6,
      change: -1.2,
      percent: -0.83,
      history: [34, 75, 66, 57, 58, 58.5]
      }
    ];
  };

  // Fetch data on component mount
  useEffect(() => {
    const fetchYahooData = async () => {
      try {
        setLoading(true);
        // Replace with actual Yahoo Finance API call
        // const response = await fetch('YOUR_YAHOO_API_ENDPOINT');
        // const data = await response.json();
        
        // Using mock data for now
        const data = generateMockData();
        setYahooData(data.slice(0, 17));
        setError(null);
      } catch (err) {
        setError('Failed to fetch Yahoo Finance data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchYahooData();
  }, []);

  // Draw canvas line graph
  const drawLineGraph = (canvasId, data) => {
    const canvas = canvasRefs.current[canvasId];
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    if (data.length < 2) return;

    // Calculate scaling
    const minPrice = Math.min(...data);
    const maxPrice = Math.max(...data);
    const priceRange = maxPrice - minPrice || 1;
    const xStep = width / (data.length - 1);
    const yStep = height / priceRange;

    // Draw background grid
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < data.length; i++) {
      const x = i * xStep;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Draw line graph
    ctx.beginPath();
    ctx.moveTo(0, height - (data - minPrice) * yStep);

    data.forEach((price, index) => {
      const x = index * xStep;
      const y = height - (price - minPrice) * yStep;
      ctx.lineTo(x, y);
    });

    ctx.strokeStyle = '#3498db';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Add price labels
    ctx.font = '10px Arial';
    ctx.fillStyle = '#34495e';
    ctx.textAlign = 'center';
    data.forEach((price, index) => {
      const x = index * xStep;
      const y = height - (price - minPrice) * yStep;
      ctx.fillText(price.toFixed(2), x, y - 5);
    });
  };

  // Update graphs when data changes
  useEffect(() => {
    Object.keys(canvasRefs.current).forEach((canvasId) => {
      const data = yahooData.find(item => item.symbol === canvasId)?.history || [];
      drawLineGraph(canvasId, data);
    });
  }, [yahooData]);

  if (loading) {
    return (
      <div className="finance-container">
        <h3>Yahoo Finance API</h3>
        <p>Loading data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="finance-container">
        <h3>Yahoo Finance API</h3>
        <p className="error">{error}</p>
      </div>
    );
  }

  return (
    
    <div className="finance-container">
      <h3>Fortune 100 World's Biggest Firms, Finance & Stocks in $ Dollar Currency</h3>
      
      
      {yahooData.map((item) => (
        <div key={item.symbol} className="yahoo-item">
          <div className="symbol">{item.symbol}</div>
          <div className="name">{item.name}</div>
          <div className="price">{item.price}</div>
          <div className={`change ${item.change >= 0 ? 'positive' : 'negative'}`}>
            {item.change > 0 ? '+' : ''}{item.change}
          </div>
          <div className="percent">{item.percent}%</div>
          <canvas 
            id={`graph-${item.symbol}`} 
            ref={(el) => { canvasRefs.current[item.symbol] = el; }}
            width="200" 
            height="100"
          ></canvas>
        </div>
      ))}
    </div>
  );
};


/*
// Mock Yahoo Finance API data (replace with actual API calls)
const mockYahooData = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 180.5, change: 2.3, percent: 1.3 },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 145.2, change: 1.8, percent: 1.25 },
  { symbol: 'MSFT', name: 'Microsoft Corp.', price: 385.7, change: 3.5, percent: 0.92 },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 250.1, change: -5.2, percent: -2.02 },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 140.8, change: 0.4, percent: 0.29 },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 1050.3, change: 12.5, percent: 1.21 }
];  */

export default Finance;