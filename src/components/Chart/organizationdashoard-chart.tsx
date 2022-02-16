import { ChartDataset } from 'chart.js';
import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Util } from 'src/helpers/util';

interface IOrganizationDashboardBarChart {
  labels: string[];
  datasets: ChartDataset<'bar', number[]>[];
  currency: string;
}

export const OrganizationDashboardBarChart = (
  props: IOrganizationDashboardBarChart,
) => {
  const { labels, datasets, currency } = props;

  return (
    <Bar
      data={{
        labels,
        datasets: datasets,
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
                data.formattedValue = `${data.dataset.label}: ${currency} ${data.formattedValue}`;

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

interface IOrganizationDashboardPieChart {
  labels: string[];
  datasets: ChartDataset<'pie', number[]>[];
  currency: string;
}

export const OrganizationDashboardPieChart = (
  props: IOrganizationDashboardPieChart,
) => {
  const { labels, datasets, currency } = props;

  return (
    <Pie
      data={{
        labels,
        datasets,
      }}
      options={{
        cutout: '80%',
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            displayColors: false,
            callbacks: {
              label(data) {
                data.formattedValue = `${data.label}: ${currency} ${data.formattedValue}`;

                return [data.formattedValue];
              },
            },
            bodyFont: {
              lineHeight: 1,
              size: 12,
              family: 'karla, Helvetica Neue, Helvetica, Arial, system-ui',
            },
          },
        },
      }}
    />
  );
};
