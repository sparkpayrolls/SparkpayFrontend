import { ChartDataset } from 'chart.js';
import React from 'react';
import { Area, AreaConfig, Pie, PieConfig } from '@ant-design/plots';
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

  const data = [] as Record<string, unknown>[];

  datasets.forEach((dataset) => {
    dataset.data.forEach((value, index) => {
      data.push({ timePeriod: labels[index], value });
    });
  });

  const config: AreaConfig = {
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
      label: {
        formatter(text) {
          return Util.shortenNumber(+text);
        },
      },
    },
    line: {
      color: '#2563EB',
    },
    color: '#B9CFF9',
    tooltip: {
      formatter: (data) => {
        return {
          name: 'value',
          value: `${currency} ${Util.formatMoneyNumber(data.value, 2)}`,
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
  innerRadius?: number;
}

export const OrganizationDashboardPieChart = (
  props: IOrganizationDashboardPieChart,
) => {
  const { labels, datasets, currency } = props;

  const data = datasets[0].data.map((elem, idx) => {
    return { type: labels[idx], value: elem };
  });

  const config: PieConfig = {
    appendPadding: 10,
    data,
    angleField: 'value',
    colorField: 'type', // or seriesField in some cases
    color: datasets[0].backgroundColor as string,
    radius: 1,
    innerRadius: props.innerRadius || 0.7,
    // autoFit: false,
    // height: 380,
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
      formatter: (data) => {
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
