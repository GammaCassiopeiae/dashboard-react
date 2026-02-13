import React, { useState, useEffect, useRef } from 'react';
import './FinancialDashboard.scss';


export default function FinancialDashboard() {
  const [financialData, setFinancialData] = useState([]);
  const [demographicData, setDemographicData] = useState([]);
  const [economicData, setEconomicData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Canvas refs for charts
  const canvasRefs = {
    gdpGrowth: useRef(null),
    inflation: useRef(null),
    unemployment: useRef(null),
    population: useRef(null),
    gdpPerCapita: useRef(null),
    tradeBalance: useRef(null),
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/db.json');
        if (!response.ok) throw new Error('Failed to fetch data');
        
        const data = await response.json();
        setFinancialData(data.financial_data);
        setDemographicData(data.demographic_data);
        setEconomicData(data.economic_data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Draw Bar Chart
  const drawBarChart = (canvasRef, data, label, color = '#319795') => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    // Clear canvas
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.fillRect(0, 0, width, height);

    // Draw grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // Find max value
    const maxValue = Math.max(...data);
    const barWidth = chartWidth / data.length;

    // Draw bars
    data.forEach((value, index) => {
      const barHeight = (value / maxValue) * chartHeight;
      const x = padding + index * barWidth + barWidth * 0.1;
      const y = height - padding - barHeight;

      // Draw bar with gradient
      const gradient = ctx.createLinearGradient(0, y, 0, height - padding);
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, color + '80');
      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, barWidth * 0.8, barHeight);

      // Draw value on top of bar
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(value.toFixed(1), x + barWidth * 0.4, y - 5);
    });

    // Draw axes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    // Draw labels
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    data.forEach((_, index) => {
      const x = padding + index * barWidth + barWidth * 0.5;
      ctx.fillText(index + 1, x, height - padding + 20);
    });
  };

  // Draw Line Chart
  const drawLineChart = (canvasRef, data, label, color = '#4299e1') => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    // Clear canvas
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.fillRect(0, 0, width, height);

    // Draw grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // Find max value
    const maxValue = Math.max(...data);
    const xStep = chartWidth / (data.length - 1);

    // Draw line
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    data.forEach((value, index) => {
      const x = padding + index * xStep;
      const y = height - padding - (value / maxValue) * chartHeight;
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Draw points
    ctx.fillStyle = color;
    data.forEach((value, index) => {
      const x = padding + index * xStep;
      const y = height - padding - (value / maxValue) * chartHeight;
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, 2 * Math.PI);
      ctx.fill();
    });

    // Draw labels
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    data.forEach((_, index) => {
      const x = padding + index * xStep;
      ctx.fillText(index + 1, x, height - padding + 20);
    });
  };

  // Extract data for charts
  const gdpGrowthData = financialData.map(d => d.gdp_growth_rate);
  const inflationData = financialData.map(d => d.inflation_rate);
  const unemploymentData = financialData.map(d => d.unemployment_rate);
  const populationData = demographicData.map(d => d.population);
  const gdpPerCapitaData = economicData.map(d => d.gdp_per_capita);
  const tradeBalanceData = economicData.map(d => d.trade_balance);

  // Draw charts when data is available
  useEffect(() => {
    if (financialData.length > 0 && demographicData.length > 0 && economicData.length > 0) {
      drawBarChart(canvasRefs.gdpGrowth, gdpGrowthData, 'GDP Growth Rate');
      drawBarChart(canvasRefs.inflation, inflationData, 'Inflation Rate');
      drawBarChart(canvasRefs.unemployment, unemploymentData, 'Unemployment Rate');
      drawBarChart(canvasRefs.population, populationData, 'Population');
      drawBarChart(canvasRefs.gdpPerCapita, gdpPerCapitaData, 'GDP Per Capita');
      drawLineChart(canvasRefs.tradeBalance, tradeBalanceData, 'Trade Balance');
    }
  }, [financialData, demographicData, economicData]);

  if (loading) return <div className="p-6 text-center">Loading data...</div>;
  if (error) return <div className="p-6 text-red-600 text-center">Error: {error}</div>;

  return (
    <div className="data-display">
      <h2>Global Economic & Demographic Data</h2>

      {/* Charts Row */}
      <div className="charts-row">
        <div className="chart-card">
          <h3>GDP Growth Rate</h3>
          <div className="chart-placeholder">
            <canvas ref={canvasRefs.gdpGrowth} width="400" height="200"></canvas>
          </div>
        </div>

        <div className="chart-card">
          <h3>Inflation Rate</h3>
          <div className="chart-placeholder">
            <canvas ref={canvasRefs.inflation} width="400" height="200"></canvas>
          </div>
        </div>

        <div className="chart-card">
          <h3>Unemployment Rate</h3>
          <div className="chart-placeholder">
            <canvas ref={canvasRefs.unemployment} width="400" height="200"></canvas>
          </div>
        </div>

        <div className="chart-card">
          <h3>Population</h3>
          <div className="chart-placeholder">
            <canvas ref={canvasRefs.population} width="400" height="200"></canvas>
          </div>
        </div>

        <div className="chart-card">
          <h3>GDP Per Capita</h3>
          <div className="chart-placeholder">
            <canvas ref={canvasRefs.gdpPerCapita} width="400" height="200"></canvas>
          </div>
        </div>

        <div className="chart-card">
          <h3>Trade Balance</h3>
          <div className="chart-placeholder">
            <canvas ref={canvasRefs.tradeBalance} width="400" height="200"></canvas>
          </div>
        </div>
      </div>

      {/* Data Tables */}
      <section className="mb-8">
        <h2>Financial Data</h2>
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table>
            <thead>
              <tr>
                <th>Country</th>
                <th>GDP Growth (%)</th>
                <th>Inflation (%)</th>
                <th>Unemployment (%)</th>
                <th>Interest Rate (%)</th>
                <th>Gov Debt/GDP (%)</th>
                <th>Current Account ($B)</th>
                <th>Stock Market</th>
                <th>Exchange Rate (USD)</th>
                <th>Consumer Spending Growth (%)</th>
              </tr>
            </thead>
            <tbody>
              {financialData.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.country}</td>
                  <td>{item.gdp_growth_rate}</td>
                  <td>{item.inflation_rate}</td>
                  <td>{item.unemployment_rate}</td>
                  <td>{item.interest_rate}</td>
                  <td>{item.government_debt_gdp_ratio}</td>
                  <td>{item.current_account_balance}</td>
                  <td>{item.stock_market_index}</td>
                  <td>{item.currency_exchange_rate_usd}</td>
                  <td>{item.consumer_spending_growth}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-8">
        <h2>Demographic Data</h2>
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table>
            <thead>
              <tr>
                <th>Country</th>
                <th>Population</th>
                <th>Median Age</th>
                <th>Birth Rate</th>
                <th>Death Rate</th>
                <th>Life Expectancy</th>
                <th>Urbanization (%)</th>
                <th>Fertility Rate</th>
                <th>Net Migration</th>
                <th>Dependency Ratio</th>
                <th>Pop Growth (%)</th>
              </tr>
            </thead>
            <tbody>
              {demographicData.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.country}</td>
                  <td>{item.population}</td>
                  <td>{item.median_age}</td>
                  <td>{item.birth_rate}</td>
                  <td>{item.death_rate}</td>
                  <td>{item.life_expectancy}</td>
                  <td>{item.urbanization_rate}</td>
                  <td>{item.fertility_rate}</td>
                  <td>{item.net_migration_rate}</td>
                  <td>{item.dependency_ratio}</td>
                  <td>{item.population_growth_rate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-8">
        <h2>Economic Data</h2>
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table>
            <thead>
              <tr>
                <th>Country</th>
                <th>GDP Per Capita</th>
                <th>Exports ($B)</th>
                <th>Imports ($B)</th>
                <th>Trade Balance ($B)</th>
                <th>FDI Net ($B)</th>
                <th>Total Reserves ($B)</th>
                <th>External Debt ($B)</th>
                <th>Current Account Deficit ($B)</th>
                <th>Gov Revenue ($B)</th>
                <th>Gov Expenditure ($B)</th>
              </tr>
            </thead>
            <tbody>
              {economicData.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.country}</td>
                  <td>{item.gdp_per_capita}</td>
                  <td>{item.exports_value}</td>
                  <td>{item.imports_value}</td>
                  <td>{item.trade_balance}</td>
                  <td>{item.foreign_direct_investment_net}</td>
                  <td>{item.total_reserves}</td>
                  <td>{item.external_debt}</td>
                  <td>{item.current_account_deficit}</td>
                  <td>{item.government_revenue}</td>
                  <td>{item.government_expenditure}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}