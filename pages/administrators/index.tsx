import {
  Administrators,
  IAdministratorsRef,
} from '@/components/Administrator/administrators.component';
import { Approvers } from '@/components/Administrator/approvers.componet';
import {
  Invitations,
  IInvitationsRef,
} from '@/components/Administrator/invitations.component';
import { IRolesRef, Roles } from '@/components/Administrator/roles.component';
import { Button } from '@/components/Button/Button.component';
import { CreateAdminModal } from '@/components/Modals/CreateAdminModal.component';
import { CreatePayrollApproverModal } from '@/components/Modals/CreatePayrollApproverModal.component';
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

const validTabs = ['admins', 'roles', 'invitations', 'payroll-approvers'];
const AdministratorsPage: NextPage = () => {
  const router = useRouter();
  const adminsRef = useRef<IAdministratorsRef>();
  const rolesRef = useRef<IRolesRef>();
  const invitationsRef = useRef<IInvitationsRef>();

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
    const inviteAdmin = () =>
      NiceModal.show(CreateAdminModal).then(() => {
        adminsRef.current?.refreshAdministrators();
        invitationsRef.current?.refreshInvitations();
      });
    const actions = {
      roles: () =>
        NiceModal.show(CreateRoleModal).then(() => {
          rolesRef.current?.refreshRoles();
        }),
      invitations: inviteAdmin,
      admins: inviteAdmin,
      'payroll-approvers': () => NiceModal.show(CreatePayrollApproverModal),
    };

    actions[selectedTab as keyof typeof actions]?.();
  };

  const buttonText = {
    admins: 'Invite Administrator',
    roles: 'Create Role',
    invitations: 'Invite Administrator',
    'payroll-approvers': 'Add Approver',
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
                    {buttonText[selectedTab as keyof typeof buttonText]}
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
            <Tab.TabPane key="roles" tab="Roles">
              <Roles
                getRef={(ref) => {
                  rolesRef.current = ref;
                }}
              />
            </Tab.TabPane>
            <Tab.TabPane key="invitations" tab="Invitations">
              <Invitations
                getRef={(ref) => {
                  invitationsRef.current = ref;
                }}
              />
            </Tab.TabPane>
            <Tab.TabPane key="payroll-approvers" tab="Payroll Approvers">
              <Approvers />
            </Tab.TabPane>
          </Tab>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default withAuth(AdministratorsPage, ['Administrator', 'read']);
