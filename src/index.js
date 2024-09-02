import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

function Dashboard() {
  const [cryptoData, setCryptoData] = useState([]);
  const [selectedCrypto, setSelectedCrypto] = useState('');
  const [historicalData, setHistoricalData] = useState(null);

  useEffect(() => {
    // Fetch the top 5 cryptocurrencies by market cap
    fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&page=1')
      .then(response => response.json())
      .then(data => {
        setCryptoData(data);
        setSelectedCrypto(data[0].id); // Set the first crypto as the default selection
        fetchHistoricalData(data[0].id); // Fetch historical data for the default selection
        createBarChart(data);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const fetchHistoricalData = (cryptoId) => {
    // Fetch historical data for the selected cryptocurrency
    fetch(`https://api.coingecko.com/api/v3/coins/${cryptoId}/market_chart?vs_currency=usd&days=365&interval=daily`)
      .then(response => response.json())
      .then(data => {
        setHistoricalData(data.prices);
        createLineChart(data.prices);
      })
      .catch(error => console.error('Error fetching historical data:', error));
  };

  const createBarChart = (data) => {
    const ctx = document.getElementById('cryptoBarChart').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.map(coin => coin.name),
        datasets: [{
          label: 'Price in USD',
          data: data.map(coin => coin.current_price),
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  };

  const createLineChart = (prices) => {
    const ctx = document.getElementById('cryptoLineChart').getContext('2d');
    const chartData = {
      labels: prices.map(price => new Date(price[0]).toLocaleDateString()),
      datasets: [{
        label: `Price over the past year`,
        data: prices.map(price => price[1]),
        fill: false,
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1
      }]
    };

    new Chart(ctx, {
      type: 'line',
      data: chartData,
      options: {
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'month'
            }
          }
        }
      }
    });
  };

  const handleCryptoChange = (event) => {
    const selectedId = event.target.value;
    setSelectedCrypto(selectedId);
    fetchHistoricalData(selectedId);
  };

  return (
    <div className="dashboard-container">
      <h1>Cryptocurrency Dashboard</h1>
      
      <div className="bar-chart-container">
        <canvas id="cryptoBarChart"></canvas>
      </div>

      <div className="selector-container">
        <label htmlFor="crypto-select">Select a cryptocurrency: </label>
        <select id="crypto-select" value={selectedCrypto} onChange={handleCryptoChange}>
          {cryptoData.map(coin => (
            <option key={coin.id} value={coin.id}>{coin.name}</option>
          ))}
        </select>
      </div>

      <div className="line-chart-container">
        <canvas id="cryptoLineChart"></canvas>
      </div>
    </div>
  );
}

ReactDOM.render(<Dashboard />, document.getElementById('root'));
