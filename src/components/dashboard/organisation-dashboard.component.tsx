import Link from 'next/link';
import { EmployeeCardSvg, PayrollBurdenCardSvg, PayrollCardSvg } from '../svg';
import { DashboardCard } from './dashboard-card.component';
import { Company, Country } from 'src/api/types';
import { useEffect } from 'react';
import { OrganisationDashboardTable } from '../Table/organisation-dashboard-table.component';
import withPermission from 'src/helpers/HOC/withPermission';
import { IOrganisationDashboard } from '../types';

const ViewMoreButton = withPermission(() => (
  <Link href="/wallet">
    <a className="transactions__link">View More</a>
  </Link>
));

export const OrganisationDashboard = (props: IOrganisationDashboard) => {
  const { administrator, getData, loading, data } = props;

  const company = props.administrator.company as Company;
  const country = company?.country as Country;
  const currency = country.currencySymbol;

  useEffect(() => {
    getData();
  }, [getData, administrator]);

  return (
    <>
      <section className="dashboard__stats-section">
        <DashboardCard
          Icon={PayrollBurdenCardSvg}
          value={`${currency} ${data.totalPayrollBurden}`}
          title="Payroll burden"
          loading={loading}
        />

        <DashboardCard
          Icon={PayrollCardSvg}
          value={data.totalNumberOfPayrolls}
          title="Payrolls"
          loading={loading}
        />

        <DashboardCard
          Icon={EmployeeCardSvg}
          value={data.totalNumberOfEmployees}
          title="Employees"
          loading={loading}
        />
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

/* DashboardChart
  <section className="dashboard__chart-section">
        <section className="disbursement">
          <div className="disbursement__header">
            <div className="disbursement__info">
              <h3 className="disbursement__title">Payroll trend</h3>
              <span className="disbursement__date">
                August 20, 2021, 12:41 PM
              </span> 
              </div>

              <SelectInput
                options={[
                  { value: 'Monthly' },
                  { value: 'Weekly' },
                  { value: 'Yearly' },
                ]}
                selected={{ value: 'Monthly' }}
                displayValue="value"
                actualValue="value"
              />
            </div>
  
            <Line
              data={{
                labels: ['1', '2', '3', '4', '5', '6'],
                datasets: [
                  {
                    label: 'Payroll amount',
                    data: [12, 19, 3, 5, 2, 3],
                    fill: true,
                    backgroundColor: 'rgb(185 207 249 / 30%)',
                    borderColor: 'rgb(37 99 235)',
                    tension: 0.5,
                  },
                ],
              }}
              options={{
                scales: {
                  y: {
                    grid: {
                      display: true,
                      borderDash: [8, 8],
                      drawBorder: false,
                    },
                    ticks: {
                      stepSize: 10,
                    },
                  },
                  x: {
                    grid: {
                      display: false,
                      drawBorder: false,
                    },
                  },
                },
                plugins: { legend: { display: false } },
              }}
            />
          </section>
  
          <section className="payroll">
           <Doughnut data={doughnutData} options={{ cutout: '75%' }} /> 
  
            <div className="payroll__legend">
              <div className="payroll__legend-item">
                <span className="payroll__legend-indicator">
                  <LegendColorSVG color="rgb(37 99 235)" /> Payroll
                </span>
                <span className="payroll__legend-value">{currency} 3.1m</span>
              </div>
            </div>
          </section>
        </section>
*/
