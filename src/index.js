import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

function Dashboard() {
  const [cryptoData, setCryptoData] = useState([]);

  useEffect(() => {
    // Fetch the top 5 cryptocurrencies by market cap
    fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&page=1')
      .then(response => response.json())
      .then(data => {
        setCryptoData(data);
        createBarChart(data);
        createLineChart(data);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

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

  const createLineChart = () => {
    // Mock data for 12 months
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const stockData = {
      "Crypto A": [120, 125, 130, 135, 128, 132, 140, 145, 150, 155, 158, 160],
      "Crypto B": [80, 85, 82, 88, 90, 95, 92, 97, 100, 105, 108, 110],
      "Crypto C": [200, 195, 190, 185, 180, 175, 170, 165, 160, 155, 150, 145]
    };

    const ctx = document.getElementById('cryptoLineChart').getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: months,
        datasets: [
          {
            label: 'Crypto A',
            data: stockData["Crypto A"],
            borderColor: 'rgba(75, 192, 192, 1)',
            fill: false,
            tension: 0.1,
          },
          {
            label: 'Crypto B',
            data: stockData["Crypto B"],
            borderColor: 'rgba(255, 99, 132, 1)',
            fill: false,
            tension: 0.1,
          },
          {
            label: 'Crypto C',
            data: stockData["Crypto C"],
            borderColor: 'rgba(54, 162, 235, 1)',
            fill: false,
            tension: 0.1,
          }
        ]
      },
      options: {
        scales: {
          x: {
            type: 'category',
            title: {
              display: true,
              text: 'Month'
            }
          },
          y: {
            beginAtZero: false,
            title: {
              display: true,
              text: 'Crypto Price (USD)'
            }
          }
        }
      }
    });
  };

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      
      <div className="bar-chart-container">
        <canvas id="cryptoBarChart"></canvas>
      </div>

      <div className="line-chart-container">
        <canvas id="cryptoLineChart"></canvas>
      </div>
    </div>
  );
}

ReactDOM.render(<Dashboard />, document.getElementById('root'));
