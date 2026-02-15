import React, { useState, useEffect } from 'react';
import '../styles/Dashboard.scss';

const Dashboard = () => {
  const [statistics, setStatistics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/db.json');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setStatistics(data.statistics);
        setError(null);
      } catch (err) {
        setError(err.message);
        setStatistics([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="dashboard-container"><p>Loading...</p></div>;
  if (error) return <div className="dashboard-container"><p className="error">Error: {error}</p></div>;

  return (
    <div className="dashboard-container">
      
      <table className="zebra-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Category</th>
            <th>Value</th>
            <th>Unit</th>
            <th>Date</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {statistics.map((stat) => (
            <tr key={stat.id}>
              <td>{stat.id}</td>
              <td>{stat.category}</td>
              <td>{stat.value}</td>
              <td>{stat.unit}</td>
              <td>{stat.date}</td>
              <td>{stat.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;