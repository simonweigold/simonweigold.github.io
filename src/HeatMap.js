import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { MatrixController, MatrixElement } from 'chartjs-chart-matrix';

Chart.register(...registerables, MatrixController, MatrixElement);

function HeatmapChart() {
  const heatmapRef = useRef(null);

  useEffect(() => {
    const ctx = heatmapRef.current.getContext('2d');

    const mockData = [];
    const xLabels = [];
    const yLabels = [];

    // Generate mock data
    for (let x = 0; x < 10; x++) {
      xLabels.push(`X${x + 1}`);
      for (let y = 0; y < 10; y++) {
        if (x === 0) {
          yLabels.push(`Y${y + 1}`);
        }
        mockData.push({
          x,
          y,
          v: Math.floor(Math.random() * 100), // Random value between 0 and 100
        });
      }
    }

    new Chart(ctx, {
      type: 'matrix',
      data: {
        datasets: [
          {
            label: 'Mock Data Heatmap',
            data: mockData,
            backgroundColor: function (context) {
              const value = context.dataset.data[context.dataIndex].v;
              const alpha = value / 100; // Value from 0.0 to 1.0
              return `rgba(255, 99, 132, ${alpha})`; // Red color scaling by value
            },
            borderWidth: 1,
            width: (ctx.chart.chartArea || {}).width / xLabels.length - 1,
            height: (ctx.chart.chartArea || {}).height / yLabels.length - 1,
          },
        ],
      },
      options: {
        scales: {
          x: {
            type: 'category',
            labels: xLabels,
            title: {
              display: true,
              text: 'X Axis',
            },
            offset: true,
            grid: {
              display: false,
            },
          },
          y: {
            type: 'category',
            labels: yLabels,
            title: {
              display: true,
              text: 'Y Axis',
            },
            offset: true,
            grid: {
              display: false,
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
  }, []);

  return (
    <div className="heatmap-container">
      <canvas ref={heatmapRef} />
    </div>
  );
}

export default HeatmapChart;
