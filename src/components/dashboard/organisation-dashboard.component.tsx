import Link from 'next/link';
import { EmployeeCardSvg, PayrollBurdenCardSvg, PayrollCardSvg } from '../svg';
import { DashboardCard } from '../Card/dashboard-card.component';
import { Company, Country } from 'src/api/types';
import { useEffect } from 'react';
import { OrganisationDashboardTable } from '../Table/organisation-dashboard-table.component';
import withPermission from 'src/helpers/HOC/withPermission';
import { IOrganisationDashboard } from '../types';
import { Util } from 'src/helpers/util';
import { Bar } from 'react-chartjs-2';

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
