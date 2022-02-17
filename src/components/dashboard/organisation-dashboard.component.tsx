import Link from 'next/link';
import { EmployeeCardSvg, PayrollBurdenCardSvg, PayrollCardSvg } from '../svg';
import { DashboardCard } from '../Card/dashboard-card.component';
import { Company, Country, CompanyChartData } from 'src/api/types';
import { useEffect, useState, useCallback } from 'react';
import { OrganisationDashboardTable } from '../Table/organisation-dashboard-table.component';
import withPermission from 'src/helpers/HOC/withPermission';
import { IOrganisationDashboard } from '../types';
import { Util } from 'src/helpers/util';
import {
  OrganizationDashboardBarChart,
  OrganizationDashboardPieChart,
} from '../Chart/organizationdashoard-chart';
import { Select } from '../Input/select.component';
import moment from 'moment';
import { $api } from 'src/api';
import Skeleton from 'react-loading-skeleton';

import 'react-loading-skeleton/dist/skeleton.css';
import { TableEmptyState } from '../EmptyState/table-emptystate.component';

const ViewMoreButton = withPermission(() => (
  <Link href="/wallet">
    <a className="transactions__link">View More</a>
  </Link>
));

const LegendColorSVG = ({ color }: { color: string }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="16" height="16" rx="4" fill={color} />
  </svg>
);

export const OrganisationDashboard = (props: IOrganisationDashboard) => {
  const { administrator, getData, loading, data } = props;
  const [loadingData, setLoadingData] = useState(false);
  const [filter, setFilter] = useState({
    filterBy: 'months',
    filterFormat: 'MMM',
  });
  const [chartData, setChartData] = useState<CompanyChartData>();

  const company = props.administrator.company as Company;
  const country = company?.country as Country;
  const currency = country.currencySymbol;
  const chartDataEmpty = chartData?.barChart?.datasets?.every((dataset) =>
    dataset.data.every((data) => data <= 0),
  );

  const getChartData = useCallback(() => {
    setLoadingData(true);
    $api.dashboard
      .getCompanyChartData(filter)
      .then((data) => {
        setChartData(data);
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => setLoadingData(false));
  }, [filter]);

  useEffect(() => {
    getData();
    getChartData();
  }, [getData, getChartData, administrator]);

  return (
    <>
      <section className="dashboard__stats-section">
        <DashboardCard
          Icon={PayrollBurdenCardSvg}
          value={`${currency} ${Util.formatMoneyNumber(
            data.totalPayrollBurden,
          )}`}
          title="Payroll burden"
          loading={loading}
        />

        <DashboardCard
          Icon={PayrollCardSvg}
          value={Util.formatNumber(data.totalNumberOfPayrolls)}
          title="Payrolls"
          loading={loading}
        />

        <DashboardCard
          Icon={EmployeeCardSvg}
          value={Util.formatNumber(data.totalNumberOfEmployees)}
          title="Employees"
          loading={loading}
        />
      </section>

      <section className="dashboard__chart-section">
        <div className="disbursement">
          {!chartDataEmpty && (
            <>
              <div className="disbursement__header">
                <div className="disbursement__info">
                  <p className="disbursement__title">Payroll trend</p>
                  <p className="disbursement__date">
                    {moment().format('MMMM DD, YYYY, hh:mm A')}
                  </p>
                </div>

                <div className="disbursement__select">
                  <Select
                    value={filter.filterBy}
                    onChange={(filterBy) => {
                      const filter = {
                        filterBy,
                        filterFormat: filterBy === 'years' ? 'YYYY' : 'MMM',
                      };
                      setFilter(filter);
                    }}
                  >
                    <Select.Option value="months">Monthly</Select.Option>
                    <Select.Option value="years">Yearly</Select.Option>
                  </Select>
                </div>
              </div>

              {!loadingData && chartData && (
                <OrganizationDashboardBarChart
                  datasets={chartData.barChart.datasets as any}
                  labels={chartData.barChart.labels}
                  currency={currency}
                />
              )}
              {loadingData && (
                <Skeleton
                  width="100%"
                  borderRadius={4}
                  count={1}
                  height={318}
                />
              )}
            </>
          )}
          {/* TODO: Get something better */}
          {chartDataEmpty && <TableEmptyState text="No data to display" />}
        </div>

        {!chartDataEmpty && (
          <div className="payroll">
            {!loadingData && chartData && (
              <OrganizationDashboardPieChart
                labels={chartData.pieChart.labels}
                datasets={chartData.pieChart.datasets}
                currency={currency}
              />
            )}
            {loadingData && (
              <Skeleton width={250} borderRadius="50%" count={1} height={250} />
            )}

            <div className="payroll__legend">
              {loadingData && (
                <Skeleton
                  width="100%"
                  borderRadius={4}
                  count={3}
                  style={{ marginBottom: '1.5rem' }}
                />
              )}
              {!loadingData &&
                chartData?.pieChart?.labels?.map((label, i) => {
                  const colors = chartData.pieChart.datasets[0].backgroundColor;

                  return (
                    <div
                      key={`pie-label-${i}`}
                      className="payroll__legend-item"
                    >
                      <span className="payroll__legend-indicator">
                        <LegendColorSVG color={colors[i % colors.length]} />{' '}
                        {label}
                      </span>
                      <span className="payroll__legend-value">
                        {currency}{' '}
                        {Util.shortenNumber(
                          chartData.pieChart.datasets[0].data[i],
                          2,
                        )}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </section>

      <section className="dashboard__transactions-section">
        <div className="transactions__header">
          <h3 className="transactions__title">Recent Transactions</h3>

          <ViewMoreButton />
        </div>

        <OrganisationDashboardTable
          loading={!!loading}
          recentTransactions={data.recentTransactions}
          currency={currency}
        />
      </section>
    </>
  );
};
