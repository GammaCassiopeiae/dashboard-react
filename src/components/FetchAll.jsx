import React, { useState, useEffect, useRef } from 'react';
import './FetchAll.scss';

const FetchAll = () => {
  const [allData, setAllData] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chartType, setChartType] = useState('line');
  const [dataMetric, setDataMetric] = useState('price');
  const [hoveredCoin, setHoveredCoin] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  
  const canvasRef = useRef(null);
  const canvasContainerRef = useRef(null);

  // Neon colors for charts
  const NEON_COLORS = [
    '#00ff41', '#ff00ff', '#00ffff', '#ffff00', '#ff0080',
    '#0080ff', '#80ff00', '#ff8000', '#8000ff', '#00ff80',
    '#ff0040', '#40ff00', '#0040ff', '#ff4000', '#4000ff',
    '#00ff40', '#ff00c0', '#00c0ff', '#c0ff00', '#ffc000'
  ];

  // Fetch all data from json-server
  const fetchAllData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3001/cryptocurrencies');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setAllData(data);
      
      if (data.length > 0) {
        setSelectedEntry(data[data.length - 1]);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Prepare chart data
  const prepareChartData = () => {
    if (!selectedEntry || !selectedEntry.data) return [];

    return selectedEntry.data.slice(0, 20).map(coin => {
      let value;
      switch (dataMetric) {
        case 'price':
          value = parseFloat(coin.price_usd);
          break;
        case 'marketCap':
          value = parseFloat(coin.market_cap_usd) / 1000000000;
          break;
        case 'volume':
          value = parseFloat(coin.volume24) / 1000000;
          break;
        case 'change':
          value = parseFloat(coin.percent_change_24h);
          break;
        default:
          value = parseFloat(coin.price_usd);
      }

      return {
        name: coin.symbol,
        value: value,
        fullName: coin.name,
        rank: parseFloat(coin.rank)
      };
    });
  };

  // Draw Line Chart
  const drawLineChart = (ctx, data, width, height) => {
    const padding = 60;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Background
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgba(255, 0, 255, 0.1)');
    gradient.addColorStop(1, 'rgba(0, 255, 255, 0.1)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Find min and max values
    const values = data.map(d => d.value);
    const maxValue = Math.max(...values);
    const minValue = Math.min(...values);
    const valueRange = maxValue - minValue || 1;

    // Draw grid
    ctx.strokeStyle = 'rgba(0, 255, 65, 0.2)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();

      // Y-axis labels
      const value = maxValue - (valueRange / 5) * i;
      ctx.fillStyle = '#00ffff';
      ctx.font = '12px Arial';
      ctx.textAlign = 'right';
      ctx.fillText(value.toFixed(2), padding - 10, y + 4);
    }

    // Draw axes
    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    // Draw line
    ctx.strokeStyle = '#ff00ff';
    ctx.lineWidth = 3;
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ff00ff';
    ctx.beginPath();

    data.forEach((point, index) => {
      const x = padding + (chartWidth / (data.length - 1)) * index;
      const y = height - padding - ((point.value - minValue) / valueRange) * chartHeight;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();
    ctx.shadowBlur = 0;

    // Draw points
    data.forEach((point, index) => {
      const x = padding + (chartWidth / (data.length - 1)) * index;
      const y = height - padding - ((point.value - minValue) / valueRange) * chartHeight;

      // Point glow
      ctx.fillStyle = '#00ff41';
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#00ff41';
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // X-axis labels
      if (index % 2 === 0) {
        ctx.fillStyle = '#00ffff';
        ctx.font = '11px Arial';
        ctx.textAlign = 'center';
        ctx.save();
        ctx.translate(x, height - padding + 20);
        ctx.rotate(-Math.PI / 4);
        ctx.fillText(point.name, 0, 0);
        ctx.restore();
      }
    });
  };

  // Draw Scatter Plot
  const drawScatterPlot = (ctx, data, width, height) => {
    const padding = 60;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    ctx.clearRect(0, 0, width, height);

    // Background
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, 'rgba(0, 255, 255, 0.1)');
    gradient.addColorStop(1, 'rgba(255, 0, 255, 0.1)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    const values = data.map(d => d.value);
    const ranks = data.map(d => d.rank);
    const maxValue = Math.max(...values);
    const minValue = Math.min(...values);
    const maxRank = Math.max(...ranks);
    const minRank = Math.min(...ranks);
    const valueRange = maxValue - minValue || 1;
    const rankRange = maxRank - minRank || 1;

    // Draw grid
    ctx.strokeStyle = 'rgba(0, 255, 65, 0.2)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();

      const x = padding + (chartWidth / 5) * i;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, height - padding);
      ctx.stroke();
    }

    // Draw axes
    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    // Axis labels
    ctx.fillStyle = '#00ffff';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Rank', width / 2, height - 10);
    ctx.save();
    ctx.translate(15, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Value', 0, 0);
    ctx.restore();

    // Draw scatter points
    data.forEach((point, index) => {
      const x = padding + ((point.rank - minRank) / rankRange) * chartWidth;
      const y = height - padding - ((point.value - minValue) / valueRange) * chartHeight;

      const color = NEON_COLORS[index % NEON_COLORS.length];
      
      // Point glow
      ctx.fillStyle = color;
      ctx.shadowBlur = 25;
      ctx.shadowColor = color;
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Point border
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.stroke();
    });
  };

  // Draw Pie Chart
  const drawPieChart = (ctx, data, width, height) => {
    ctx.clearRect(0, 0, width, height);

    // Background
    const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width / 2);
    gradient.addColorStop(0, 'rgba(255, 0, 255, 0.1)');
    gradient.addColorStop(1, 'rgba(0, 255, 255, 0.1)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 3;

    const total = data.reduce((sum, item) => sum + Math.abs(item.value), 0);
    let currentAngle = -Math.PI / 2;

    data.forEach((item, index) => {
      const sliceAngle = (Math.abs(item.value) / total) * Math.PI * 2;
      const color = NEON_COLORS[index % NEON_COLORS.length];

      // Draw slice
      ctx.fillStyle = color;
      ctx.shadowBlur = 20;
      ctx.shadowColor = color;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
      ctx.arc(centerX, centerY, innerRadius, currentAngle + sliceAngle, currentAngle, true);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;

      // Slice border
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Label
      const labelAngle = currentAngle + sliceAngle / 2;
      const labelX = centerX + Math.cos(labelAngle) * (radius + 40);
      const labelY = centerY + Math.sin(labelAngle) * (radius + 40);
      const percentage = ((Math.abs(item.value) / total) * 100).toFixed(1);

      ctx.fillStyle = color;
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.shadowBlur = 10;
      ctx.shadowColor = color;
      ctx.fillText(`${item.name}`, labelX, labelY);
      ctx.fillText(`${percentage}%`, labelX, labelY + 15);
      ctx.shadowBlur = 0;

      currentAngle += sliceAngle;
    });
  };

  // Draw Donut Chart
  const drawDonutChart = (ctx, data, width, height) => {
    ctx.clearRect(0, 0, width, height);

    // Background
    const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width / 2);
    gradient.addColorStop(0, 'rgba(0, 255, 255, 0.1)');
    gradient.addColorStop(1, 'rgba(255, 0, 255, 0.1)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;
    const outerRadius = Math.min(width, height) / 3;
    const innerRadius = outerRadius * 0.5;

    const total = data.reduce((sum, item) => sum + Math.abs(item.value), 0);
    let currentAngle = -Math.PI / 2;

    data.forEach((item, index) => {
      const sliceAngle = (Math.abs(item.value) / total) * Math.PI * 2;
      const color = NEON_COLORS[index % NEON_COLORS.length];

      // Draw slice
      ctx.fillStyle = color;
      ctx.shadowBlur = 20;
      ctx.shadowColor = color;
      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius, currentAngle, currentAngle + sliceAngle);
      ctx.arc(centerX, centerY, innerRadius, currentAngle + sliceAngle, currentAngle, true);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;

      // Slice border
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Label
      const labelAngle = currentAngle + sliceAngle / 2;
      const labelX = centerX + Math.cos(labelAngle) * (outerRadius + 40);
      const labelY = centerY + Math.sin(labelAngle) * (outerRadius + 40);
      const percentage = ((Math.abs(item.value) / total) * 100).toFixed(1);

      ctx.fillStyle = color;
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.shadowBlur = 10;
      ctx.shadowColor = color;
      ctx.fillText(`${item.name}`, labelX, labelY);
      ctx.fillText(`${percentage}%`, labelX, labelY + 15);
      ctx.shadowBlur = 0;

      currentAngle += sliceAngle;
    });

    // Center circle
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2);
    ctx.fill();
  };

  // Draw chart based on type
  const drawChart = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const data = prepareChartData();
    
    if (!data || data.length === 0) return;
    
    const width = canvas.width;
    const height = canvas.height;
    
    switch (chartType) {
      case 'line':
        drawLineChart(ctx, data, width, height);
        break;
      case 'scatter':
        drawScatterPlot(ctx, data, width, height);
        break;
      case 'pie':
        drawPieChart(ctx, data, width, height);
        break;
      case 'donut':
        drawDonutChart(ctx, data, width, height);
        break;
      default:
        drawLineChart(ctx, data, width, height);
    }
  };

  // Handle canvas resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const resizeCanvas = () => {
      const container = canvasContainerRef.current;
      if (!container) return;
      
      const width = container.clientWidth;
      const height = container.clientHeight;
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw chart after resize
      drawChart();
    };
    
    // Initial resize
    resizeCanvas();
    
    // Resize on window resize
    window.addEventListener('resize', resizeCanvas);
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [chartType, dataMetric, selectedEntry]);

  // Draw chart when data changes
  useEffect(() => {
    if (canvasRef.current) {
      drawChart();
    }
  }, [chartType, dataMetric, selectedEntry]);

  // Handle hover
  const handleCanvasMouseMove = (e) => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate position relative to canvas
    const canvasX = x;
    const canvasY = y;
    
    // Update tooltip position
    setTooltipPos({ x: canvasX, y: canvasY });
  };

  // Get chart data
  const getChartTitle = () => {
    switch (chartType) {
      case 'line': return 'Line Chart';
      case 'scatter': return 'Scatter Plot';
      case 'pie': return 'Pie Chart';
      case 'donut': return 'Donut Chart';
      default: return 'Line Chart';
    }
  };

  const getMetricLabel = () => {
    switch (dataMetric) {
      case 'price': return 'Price (USD)';
      case 'marketCap': return 'Market Cap (Billions)';
      case 'volume': return 'Volume 24h (Millions)';
      case 'change': return '24h Change (%)';
      default: return 'Value';
    }
  };

  return (
    <div className="fetch-all">
      <div className="fetch-all__header">
        <h1 className="fetch-all__title">Cryptocurrency Data Visualization</h1>
        <button 
          onClick={fetchAllData}
          disabled={loading}
          className="fetch-all__refresh-btn"
        >
          {loading ? '⟳ Loading...' : '⟳ Refresh Data'}
        </button>
      </div>

      {error && (
        <div className="fetch-all__error">
          ⚠ Error: {error}
        </div>
      )}

      {allData.length > 0 && (
        <>
          {/* Control Panel */}
          <div className="fetch-all__control-panel">
            <div className="control-section">
              <h3>📊 Chart Type</h3>
              <div className="button-group">
                <button
                  className={`control-btn ${chartType === 'line' ? 'active' : ''}`}
                  onClick={() => setChartType('line')}
                >
                  📈 Line Chart
                </button>
                <button
                  className={`control-btn ${chartType === 'scatter' ? 'active' : ''}`}
                  onClick={() => setChartType('scatter')}
                >
                  🔵 Scatter Plot
                </button>
                <button
                  className={`control-btn ${chartType === 'pie' ? 'active' : ''}`}
                  onClick={() => setChartType('pie')}
                >
                  🥧 Pie Chart
                </button>
                <button
                  className={`control-btn ${chartType === 'donut' ? 'active' : ''}`}
                  onClick={() => setChartType('donut')}
                >
                  🍩 Donut Chart
                </button>
              </div>
            </div>

            <div className="control-section">
              <h3>📉 Data Metric</h3>
              <div className="button-group">
                <button
                  className={`control-btn ${dataMetric === 'price' ? 'active' : ''}`}
                  onClick={() => setDataMetric('price')}
                >
                  💰 Price
                </button>
                <button
                  className={`control-btn ${dataMetric === 'marketCap' ? 'active' : ''}`}
                  onClick={() => setDataMetric('marketCap')}
                >
                  📊 Market Cap
                </button>
                <button
                  className={`control-btn ${dataMetric === 'volume' ? 'active' : ''}`}
                  onClick={() => setDataMetric('volume')}
                >
                  📦 Volume
                </button>
                <button
                  className={`control-btn ${dataMetric === 'change' ? 'active' : ''}`}
                  onClick={() => setDataMetric('change')}
                >
                  📈 24h Change
                </button>
              </div>
            </div>

            <div className="control-section">
              <h3>🗂 Data Entry</h3>
              <select 
                className="entry-select"
                value={selectedEntry?.id || ''}
                onChange={(e) => {
                  const entry = allData.find(d => d.id === e.target.value);
                  setSelectedEntry(entry);
                }}
              >
                {allData.map((entry) => (
                  <option key={entry.id} value={entry.id}>
                    {new Date(entry.timestamp).toLocaleString()}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Chart Display */}
          <div className="fetch-all__chart-container">
            <h2 className="chart-title">
              {getChartTitle()} - {getMetricLabel()} - Top 20 Cryptocurrencies
            </h2>
            <div className="canvas-container" ref={canvasContainerRef}>
              <canvas
                ref={canvasRef}
                width="600"
                height="400"
                onMouseMove={handleCanvasMouseMove}
                style={{ cursor: 'pointer' }}
              />
            </div>
          </div>

          {/* Data Table */}
          {selectedEntry && selectedEntry.data && (
            <div className="fetch-all__table-container">
              <h2 className="table-title">
                Complete Data ({selectedEntry.data.length} cryptocurrencies)
              </h2>
              <div className="table-wrapper">
                <table className="fetch-all__table">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Name</th>
                      <th>Symbol</th>
                      <th>Price (USD)</th>
                      <th>Market Cap (USD)</th>
                      <th>24h Change</th>
                      <th>Volume 24h</th>
                      <th>Supply</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedEntry.data.map((coin) => (
                      <tr key={coin.id}>
                        <td className="rank">#{coin.rank}</td>
                        <td className="name">{coin.name}</td>
                        <td className="symbol">{coin.symbol}</td>
                        <td className="price">
                          ${parseFloat(coin.price_usd).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 6
                          })}
                        </td>
                        <td className="market-cap">
                          ${parseFloat(coin.market_cap_usd).toLocaleString()}
                        </td>
                        <td className={`change ${parseFloat(coin.percent_change_24h) >= 0 ? 'positive' : 'negative'}`}>
                          {coin.percent_change_24h}%
                        </td>
                        <td className="volume">
                          ${parseFloat(coin.volume24).toLocaleString()}
                        </td>
                        <td className="supply">
                          {parseFloat(coin.csupply).toLocaleString()} {coin.symbol}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {!loading && allData.length === 0 && !error && (
        <div className="fetch-all__empty">
          <p>No data available. Please fetch some data first using the CryptoFetcher component.</p>
        </div>
      )}
    </div>
  );
};

export default FetchAll;