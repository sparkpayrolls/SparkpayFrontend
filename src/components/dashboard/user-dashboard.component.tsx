import { useCallback, useEffect, useState } from 'react';
import { $api } from 'src/api';
import { UserDashboardData } from 'src/api/types';
import { EmployeeCardSvg, OrganisationCardSvg, PayrollCardSvg } from '../svg';
import { UserDashboardTable } from '../Table/user-dashboard-table.component';
import { DashboardCard } from './dashboard-card.component';

export const UserDashboard = () => {
  const [data, setData] = useState<UserDashboardData>({
    totalNumberOfCompanies: 0,
    recentPayrolls: [],
    totalNumberOfEmployees: 0,
    totalNumberOfPayrolls: 0,
  });
  const [loading, setLoading] = useState(false);

  const getData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await $api.dashboard.getUserDashboardData();

      setData(data);
    } catch (error) {
      // ...
    } finally {
      setLoading(false);
    }
  }, [setData]);

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

        <UserDashboardTable loading={loading} data={data.recentPayrolls} />
      </section>
    </>
  );
};
