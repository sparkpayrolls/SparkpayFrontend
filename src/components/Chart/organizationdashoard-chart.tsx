import { ChartDataset } from 'chart.js';
import React from 'react';
import { Area, Pie } from '@ant-design/plots';
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

  const data = datasets[0].data.map((data, idx) => {
    return { timePeriod: labels[idx], value: Util.shortenNumber(data) };
  });

  const config = {
    data,
    xField: 'timePeriod',
    yField: 'value',
    xAxis: {
      range: [0, 1],
    },
    yAxis: {
      grid: {
        line: {
          style: {
            lineDash: [6, 8],
            cursor: 'pointer',
          },
        },
      },
    },
    line: {
      color: '#2563EB',
    },
    color: '#B9CFF9',
    tooltip: {
      formatter: (data: IToolTip) => {
        console.log('ToolTip Data: ', data);

        return {
          name: 'value',
          value: `${currency} ${data.value}`,
        };
      },
    },
  };

  return <Area {...config} />;
};

interface IOrganizationDashboardPieChart {
  labels: string[];
  datasets: ChartDataset<'pie', number[]>[];
  currency: string;
}

interface IToolTip {
  value: number;
  type?: string;
  timePeriod?: string;
}

export const OrganizationDashboardPieChart = (
  props: IOrganizationDashboardPieChart,
) => {
  const { labels, datasets, currency } = props;

  const data = datasets[0].data.map((elem, idx) => {
    return { type: labels[idx], value: elem };
  });

  const config = {
    appendPadding: 10,
    data,
    angleField: 'value',
    colorField: 'type', // or seriesField in some cases
    color: datasets[0].backgroundColor,
    radius: 1,
    innerRadius: 0.7,
    autoFit: false,
    height: 380,
    label: {
      type: 'inner',
      offset: '-50%',
      content: '{value}',
      style: {
        textAlign: 'center',
        fontSize: 0,
      },
    },
    tooltip: {
      formatter: (data: IToolTip) => {
        return {
          name: data.type,
          value: `${currency} ${Util.shortenNumber(data.value)}`,
        };
      },
    },
    legend: false,
    interactions: [
      {
        type: 'element-selected',
      },
      {
        type: 'element-active',
      },
    ],
    statistic: {
      title: false,
      content: {
        style: {
          whiteSpace: 'pre-wrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        },
        content: '',
      },
    },
  };

  return <Pie {...config} />;
};
