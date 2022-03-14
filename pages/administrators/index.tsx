import { Administrators } from '@/components/Administrator/administrators.component';
import { Button } from '@/components/Button/Button.component';
import { CreateAdminModal } from '@/components/Modals/CreateAdminModal.component';
import { PlusSvg } from '@/components/svg';
import { Tab } from '@/components/Tab/tab.component';
import NiceModal from '@ebay/nice-modal-react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { stringifyUrl } from 'query-string';
import { useEffect } from 'react';
import withAuth from 'src/helpers/HOC/withAuth';
import DashboardLayout from 'src/layouts/dashboard-layout/DashBoardLayout';

const validTabs = ['admins', 'roles'];
const AdministratorsPage: NextPage = () => {
  const router = useRouter();
  const tab = router.query.tab as string;
  const selectedTab = validTabs.includes(tab) ? tab : 'admins';

  const onTabChange = (tab: string) => {
    const { pathname, query } = router;
    const url = stringifyUrl({
      url: pathname,
      query: { ...query, tab },
    });

    router.push(url);
  };

  useEffect(() => {
    NiceModal.show(CreateAdminModal);
  }, []);

  if (!router.isReady) {
    return null;
  }

  return (
    <DashboardLayout pageTitle="Administrators">
      <div className="dashboard-page-layout">
        <div className="dashboard-page-layout__header">
          <h1 className="dashboard-page-layout__title">Admin Management</h1>
          <div className="dashboard-page-layout__buttons">
            <Button
              label={
                <>
                  <PlusSvg /> <span>Create Admin</span>
                </>
              }
              type="button"
              primary
              className="create-admin-button"
            />
          </div>
        </div>

        <div className="dashboard-page-layout__body">
          <Tab onChange={onTabChange} active={selectedTab} default={'admins'}>
            <Tab.TabPane tab="Admin Users" key="admins">
              <Administrators />
            </Tab.TabPane>
            <Tab.TabPane key="roles" tab="Roles"></Tab.TabPane>
          </Tab>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default withAuth(AdministratorsPage);
