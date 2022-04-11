import { NextPage } from 'next';
import DashboardLayout from 'src/layouts/dashboard-layout/DashBoardLayout';
import withAuth from 'src/helpers/HOC/withAuth';
import { CreateOrganisationButton } from '@/components/Button/create-organisation-button.component';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { UserDashboard } from '@/components/dashboard/user-dashboard.component';
import { OrganisationDashboard } from '@/components/dashboard/organisation-dashboard.component';
import NiceModal from '@ebay/nice-modal-react';
import { useCallback, useEffect, useState } from 'react';
import { OrganisationDashboardData, UserDashboardData } from 'src/api/types';
import { $api } from 'src/api';
import { CreateOrgnizationModal } from '@/components/Modals/CreateOrganizationModal.component';
import { refreshCompanies } from 'src/redux/slices/companies/companies.slice';

const Dashboard: NextPage = () => {
  const { administrator, companies } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [userDashboardData, setUserDashboardData] = useState<UserDashboardData>(
    {
      totalNumberOfCompanies: 0,
      recentPayrolls: [],
      totalNumberOfEmployees: 0,
      totalNumberOfPayrolls: 0,
    },
  );
  const [
    organisationDashboardData,
    setOrganisationDashboardData,
  ] = useState<OrganisationDashboardData>({
    recentTransactions: [],
    totalNumberOfEmployees: 0,
    totalNumberOfPayrolls: 0,
    totalPayrollBurden: 0,
  });

  const getUserDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await $api.dashboard.getUserDashboardData();

      setUserDashboardData(data);
    } catch (error) {
      // ...
    } finally {
      setLoading(false);
    }
  }, [setUserDashboardData]);

  const getOrganisationDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await $api.dashboard.getCompanyDashboardData();

      setOrganisationDashboardData(data);
    } catch (error) {
      // ...
    } finally {
      setLoading(false);
    }
  }, [setOrganisationDashboardData]);

  useEffect(() => {
    if (!companies.length) {
      NiceModal.show(CreateOrgnizationModal).then(() => {
        refreshCompanies(dispatch);
        getUserDashboardData();
      });
    }

    return () => {
      NiceModal.hide(CreateOrgnizationModal);
    };
  }, [companies, dispatch, getUserDashboardData]);

  return (
    <DashboardLayout pageTitle="Dashboard">
      <div className="dashboard">
        <div className="dashboard__top-bar">
          <h2 className="dashboard__title">Dashboard</h2>

          {!administrator && (
            <CreateOrganisationButton onCreate={getUserDashboardData} />
          )}
        </div>

        {!administrator ? (
          <UserDashboard
            getData={getUserDashboardData}
            loading={loading}
            data={userDashboardData}
          />
        ) : (
          <OrganisationDashboard
            getData={getOrganisationDashboardData}
            loading={loading}
            data={organisationDashboardData}
            administrator={administrator}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default withAuth(Dashboard);
