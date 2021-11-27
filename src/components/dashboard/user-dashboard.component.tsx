import { useEffect } from 'react';
import { EmployeeCardSvg, OrganisationCardSvg, PayrollCardSvg } from '../svg';
import { UserDashboardTable } from '../Table/user-dashboard-table.component';
import { IUserDashboard } from '../types';
import { DashboardCard } from './dashboard-card.component';

export const UserDashboard = (props: IUserDashboard) => {
  const { getData, loading, data } = props;

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <>
      <section className="dashboard__stats-section">
        <DashboardCard
          Icon={OrganisationCardSvg}
          value={data.totalNumberOfCompanies}
          title="Organisations"
          loading={loading}
        />

        <DashboardCard
          Icon={PayrollCardSvg}
          value={data.totalNumberOfPayrolls}
          loading={loading}
          title="Payrolls"
        />

        <DashboardCard
          Icon={EmployeeCardSvg}
          value={data.totalNumberOfEmployees}
          loading={loading}
          title="Employees"
        />
      </section>

      <section className="dashboard__transactions-section">
        <div className="transactions__header">
          <h3 className="transactions__title">Recent Payrolls</h3>
        </div>

        <UserDashboardTable loading={!!loading} data={data.recentPayrolls} />
      </section>
    </>
  );
};
