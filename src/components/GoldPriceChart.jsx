import React, { useState, useEffect, useRef } from 'react';
import './GoldPriceChart.scss';

const GoldPriceChart = () => {
  // Mock data - this will be replaced by fetched data
  const mockGoldPrices = [
    {
      id: 1,
      date: '2024-01-01',
      price: 2063.50,
      region: 'North America',
      volume: 1200
    },
    {
      id: 2,
      date: '2024-01-02',
      price: 2071.30,
      region: 'Europe',
      volume: 980
    },
    {
      id: 3,
      date: '2024-01-03',
      price: 2055.80,
      region: 'Asia',
      volume: 1500
    },
    {
      id: 4,
      date: '2024-01-04',
      price: 2089.20,
      region: 'North America',
      volume: 1100
    },
    {
      id: 5,
      date: '2024-01-05',
      price: 2095.60,
      region: 'Europe',
      volume: 850
    },
    {
      id: 6,
      date: '2024-01-06',
      price: 2102.40,
      region: 'Asia',
      volume: 1650
    }
  ];

  const [goldPrices, setGoldPrices] = useState(mockGoldPrices);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const lineChartRef = useRef(null);
  const pieChartRef = useRef(null);

  // Fetch data from json-server
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/goldprices');
        if (!response.ok) {
          throw new Error('Failed to fetch from server');
        }
        const data = await response.json();
        setGoldPrices(data);
        console.log('Data fetched successfully:', data);
      } catch (err) {
        console.log('Using mock data instead:', err.message);
        setGoldPrices(mockGoldPrices);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Draw Line Chart
  useEffect(() => {
    if (goldPrices.length > 0 && lineChartRef.current) {
      drawLineChart();
    }
  }, [goldPrices]);

  // Draw Pie Chart
  useEffect(() => {
    if (goldPrices.length > 0 && pieChartRef.current) {
      drawPieChart();
    }
  }, [goldPrices]);

  const drawLineChart = () => {
    const canvas = lineChartRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const padding = 50;

    ctx.clearRect(0, 0, width, height);

    const prices = goldPrices.map(item => item.price);
    const dates = goldPrices.map(item => item.date);
    const maxPrice = Math.max(...prices);
    const minPrice = Math.min(...prices);
    const priceRange = maxPrice - minPrice;

    // Draw axes
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    // Draw grid lines
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = padding + (height - 2 * padding) * (i / 5);
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();

      const priceValue = maxPrice - (priceRange * i / 5);
      ctx.fillStyle = '#333';
      ctx.font = '12px Arial';
      ctx.textAlign = 'right';
      ctx.fillText(`$${priceValue.toFixed(2)}`, padding - 10, y + 5);
    }

    // Draw line
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 3;
    ctx.beginPath();

    prices.forEach((price, index) => {
      const x = padding + (width - 2 * padding) * (index / (prices.length - 1));
      const y = height - padding - ((price - minPrice) / priceRange) * (height - 2 * padding);

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    // Draw points
    prices.forEach((price, index) => {
      const x = padding + (width - 2 * padding) * (index / (prices.length - 1));
      const y = height - padding - ((price - minPrice) / priceRange) * (height - 2 * padding);

      ctx.fillStyle = '#FF6B35';
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#333';
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      ctx.save();
      ctx.translate(x, height - padding + 20);
      ctx.rotate(-Math.PI / 4);
      ctx.fillText(dates[index], 0, 0);
      ctx.restore();
    });

    ctx.fillStyle = '#333';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Gold Price Trend', width / 2, 25);
  };

  const drawPieChart = () => {
    const canvas = pieChartRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 60;

    ctx.clearRect(0, 0, width, height);

    const regionData = {};
    goldPrices.forEach(item => {
      if (regionData[item.region]) {
        regionData[item.region] += item.volume;
      } else {
        regionData[item.region] = item.volume;
      }
    });

    const totalVolume = Object.values(regionData).reduce((sum, val) => sum + val, 0);
    const colors = ['#FFD700', '#FF6B35', '#4ECDC4', '#95E1D3', '#F38181'];

    let startAngle = -Math.PI / 2;
    Object.entries(regionData).forEach(([region, volume], index) => {
      const sliceAngle = (volume / totalVolume) * Math.PI * 2;
      const endAngle = startAngle + sliceAngle;

      ctx.fillStyle = colors[index % colors.length];
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();

      const middleAngle = startAngle + sliceAngle / 2;
      const textX = centerX + Math.cos(middleAngle) * (radius * 0.7);
      const textY = centerY + Math.sin(middleAngle) * (radius * 0.7);
      const percentage = ((volume / totalVolume) * 100).toFixed(1);

      ctx.fillStyle = '#fff';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${percentage}%`, textX, textY);

      startAngle = endAngle;
    });

    let legendY = 20;
    Object.entries(regionData).forEach(([region, volume], index) => {
      ctx.fillStyle = colors[index % colors.length];
      ctx.fillRect(20, legendY, 20, 20);

      ctx.fillStyle = '#333';
      ctx.font = '12px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`${region}: ${volume}`, 50, legendY + 15);

      legendY += 30;
    });

    ctx.fillStyle = '#333';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Volume Distribution by Region', width / 2, height - 20);
  };

  if (loading) {
    return <div className="gold-price-chart loading">Loading...</div>;
  }

  if (error) {
    return <div className="gold-price-chart error">Error: {error}</div>;
  }

  return (
    <div className="gold-price-chart">
      <h1 className="gold-price-chart__title">Gold Price Dashboard</h1>

      <div className="gold-price-chart__data-table">
        <h2>Raw Data</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Price (USD)</th>
              <th>Region</th>
              <th>Volume</th>
            </tr>
          </thead>
          <tbody>
            {goldPrices.map(item => (
              <tr key={item.id}>
                <td>{item.date}</td>
                <td>${item.price.toFixed(2)}</td>
                <td>{item.region}</td>
                <td>{item.volume}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="gold-price-chart__charts">
        <div className="chart-container">
          <canvas
            ref={lineChartRef}
            width={700}
            height={400}
            className="chart-canvas"
          />
        </div>

        <div className="chart-container">
          <canvas
            ref={pieChartRef}
            width={500}
            height={400}
            className="chart-canvas"
          />
        </div>
      </div>
    </div>
  );
};

export default GoldPriceChart;