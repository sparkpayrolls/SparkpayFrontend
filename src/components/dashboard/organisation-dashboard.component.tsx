import Link from 'next/link';
import { EmployeeCardSvg, PayrollBurdenCardSvg, PayrollCardSvg } from '../svg';
import { DashboardCard } from '../Card/dashboard-card.component';
import { Company, Country } from 'src/api/types';
import { useEffect } from 'react';
import { OrganisationDashboardTable } from '../Table/organisation-dashboard-table.component';
import withPermission from 'src/helpers/HOC/withPermission';
import { IOrganisationDashboard } from '../types';
import { Util } from 'src/helpers/util';
import { OrganizationDashboardBarChart } from '../Chart/organizationdashoard-chart';
import { Select } from '../Input/select.component';
import moment from 'moment';

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
        <div className="disbursement">
          <div className="disbursement__header">
            <div className="disbursement__info">
              <p className="disbursement__title">Payroll trend</p>
              <p className="disbursement__date">
                {moment().format('MMMM DD, YYYY, hh:mm A')}
              </p>
            </div>

            <div className="disbursement__select">
              <Select value="monthly">
                <Select.Option value="monthly">Monthly</Select.Option>
                <Select.Option value="yearly">Yearly</Select.Option>
              </Select>
            </div>
          </div>
          <OrganizationDashboardBarChart />
        </div>
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
