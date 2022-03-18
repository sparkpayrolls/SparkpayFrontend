import {
  Administrators,
  IAdministratorsRef,
} from '@/components/Administrator/administrators.component';
import { Invitations } from '@/components/Administrator/invitations.component';
import { IRolesRef, Roles } from '@/components/Administrator/roles.component';
import { Button } from '@/components/Button/Button.component';
import { CreateAdminModal } from '@/components/Modals/CreateAdminModal.component';
import { CreateRoleModal } from '@/components/Modals/CreateRoleModal.component';
import { PlusSvg } from '@/components/svg';
import { Tab } from '@/components/Tab/tab.component';
import NiceModal from '@ebay/nice-modal-react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { stringifyUrl } from 'query-string';
import { useRef } from 'react';
import withAuth from 'src/helpers/HOC/withAuth';
import DashboardLayout from 'src/layouts/dashboard-layout/DashBoardLayout';

const validTabs = ['admins', 'roles', 'invitations'];
const AdministratorsPage: NextPage = () => {
  const router = useRouter();
  const adminsRef = useRef<IAdministratorsRef>();
  const rolesRef = useRef<IRolesRef>();

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

  if (!router.isReady) {
    return null;
  }

  const onCreateClick = () => {
    if (selectedTab === 'roles') {
      NiceModal.show(CreateRoleModal).then(() => {
        rolesRef.current?.refreshRoles();
      });
      return;
    }

    NiceModal.show(CreateAdminModal).then(() => {
      adminsRef.current?.refreshAdministrators();
    });
  };

  return (
    <DashboardLayout pageTitle="Administrators">
      <div className="dashboard-page-layout">
        <div className="dashboard-page-layout__header">
          <h1 className="dashboard-page-layout__title">Admin Management</h1>
          <div className="dashboard-page-layout__buttons">
            <Button
              label={
                <>
                  <PlusSvg />{' '}
                  <span>
                    {selectedTab === 'roles'
                      ? 'Create Role'
                      : 'Invite Administrator'}
                  </span>
                </>
              }
              onClick={onCreateClick}
              type="button"
              primary
              className="create-admin-button"
            />
          </div>
        </div>

        <div className="dashboard-page-layout__body">
          <Tab onChange={onTabChange} active={selectedTab} default={'admins'}>
            <Tab.TabPane tab="Admininistrators" key="admins">
              <Administrators
                getRef={(ref) => {
                  adminsRef.current = ref;
                }}
              />
            </Tab.TabPane>
            <Tab.TabPane key="invitations" tab="Invitations">
              <Invitations />
            </Tab.TabPane>
            <Tab.TabPane key="roles" tab="Roles">
              <Roles
                getRef={(ref) => {
                  rolesRef.current = ref;
                }}
              />
            </Tab.TabPane>
          </Tab>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default withAuth(AdministratorsPage, ['Admin', 'read']);
