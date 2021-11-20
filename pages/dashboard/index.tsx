import { NextPage } from 'next';
import DashboardLayout from 'src/layouts/dashboard-layout/DashBoardLayout';
import withAuth from 'src/helpers/HOC/withAuth';
import { CreateOrganisationButton } from '@/components/Button/create-organisation-button.component';
import { useAppSelector } from 'src/redux/hooks';
import { UserDashboard } from '@/components/dashboard/user-dashboard.component';
import { OrganisationDashboard } from '@/components/dashboard/organisation-dashboard.component';

const Dashboard: NextPage = () => {
  const administrator = useAppSelector((state) => state.administrator);

  return (
    <DashboardLayout pageTitle="Dashboard">
      <div className="dashboard">
        <div className="dashboard__top-bar">
          <h2 className="dashboard__title">Dashboard</h2>

          {!administrator && <CreateOrganisationButton />}
        </div>

        {!administrator ? (
          <UserDashboard />
        ) : (
          <OrganisationDashboard administrator={administrator} />
        )}
      </div>
    </DashboardLayout>
  );
};

export default withAuth(Dashboard);
