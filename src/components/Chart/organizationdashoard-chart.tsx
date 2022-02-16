import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Util } from 'src/helpers/util';

export const OrganizationDashboardBarChart = () => {
  return (
    <Bar
      data={{
        labels: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ],
        datasets: [
          {
            label: 'Payroll burden',
            data: [
              12234567,
              19234543,
              30234987,
              50123435,
              90345378,
              30290839,
              22365478,
              16234323,
              70467543,
              10374565,
              40435555,
              19987556,
            ],
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
            labels: {
              font: {
                size: 16,
                lineHeight: 24,
                weight: 'bold',
                family: 'karla, Helvetica Neue, Helvetica, Arial, system-ui',
              },
            },
          },
          tooltip: {
            displayColors: false,
            callbacks: {
              label(data) {
                data.formattedValue = `${data.dataset.label}: ₦ ${data.formattedValue}`;

                return [data.formattedValue];
              },
            },
            bodyFont: {
              lineHeight: 1,
              size: 12,
              family: 'karla, Helvetica Neue, Helvetica, Arial, system-ui',
            },
            titleFont: {
              size: 16,
              family: 'karla, Helvetica Neue, Helvetica, Arial, system-ui',
            },
          },
        },
        scales: {
          xAxes: {
            grid: {
              display: false,
            },
            ticks: {
              font: {
                lineHeight: 1,
                size: 10,
                family: 'karla, Helvetica Neue, Helvetica, Arial, system-ui',
              },
            },
          },
          yAxes: {
            beginAtZero: true,
            grid: {
              display: false,
            },
            ticks: {
              callback(item) {
                return Util.shortenNumber(+item);
              },
              font: {
                lineHeight: 1,
                size: 12,
                family: 'karla, Helvetica Neue, Helvetica, Arial, system-ui',
              },
            },
          },
        },
        datasets: {
          bar: {
            barPercentage: 0.1,
          },
        },
      }}
    />
  );
};
