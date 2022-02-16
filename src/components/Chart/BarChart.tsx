import React from 'react';
import { Bar } from 'react-chartjs-2';

const BarChart = () => {
  return (
    <div className="bar-chart-parent-card">
      <div className="bar-chart-card">
        <Bar
          data={{
            labels: [
              'January',
              'Febuary',
              'March',
              'April',
              'May',
              'June',
              'July',
              'August',
              'September',
              'October',
              'November',
              'December',
            ],
            datasets: [
              {
                label: 'Quantity',
                data: [12, 19, 3, 5, 9, 3, 22, 16, 7, 10, 4, 19],
                backgroundColor: '#64E5D6',
                borderWidth: 0,
                borderRadius: Number.MAX_VALUE,
                borderSkipped: false,
              },
            ],
          }}
          options={{
            plugins: {
              legend: {
                display: false,
              },
            },
            scales: {
              xAxes: {
                grid: {
                  display: false,
                },
              },
              yAxes: {
                beginAtZero: true,
                grid: {
                  display: false,
                },
              },
            },
            datasets: {
              bar: {
                barPercentage: 0.2,
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default BarChart;