import NiceModal from '@ebay/nice-modal-react';
import DashboardLayout from 'src/layouts/dashboard-layout/DashBoardLayout';
import type { NextPage } from 'next';
import { PlusSvg } from '@/components/svg';
import { Button } from '../../src/components/Button/Button.component';
import { Tab } from '@/components/Tab/tab.component';
import { useRouter } from 'next/router';
import { stringifyUrl } from 'query-string';
import AdminRoleTab from "../../src/components/admin/role"
import {  useState } from 'react';
import { AdminRoleModal } from '@/components/Modals/CreateRoleModal.component';

const validTabs = ['Admin Users', 'Roles'];
const Admin: NextPage = () => {
  const [loading] = useState(false);
    const router = useRouter();
  const tab = router.query.tab as string;
  const activeTab = validTabs.includes(tab) ? tab : validTabs[0];


  
  const onTabChange = (tab: string) => {
    const { pathname, query } = router;
    const url = stringifyUrl({
      url: pathname,
      query: { ...query, tab },
    });

    router.push(url);
  };

 const onAdminRole = () => {
    NiceModal.show(AdminRoleModal);
  };
  return (
    <DashboardLayout pageTitle="Admin">
      <div className="employee-section">
        <div className="employee-section__details">
          <div className="employee-section__head">
            <h1 className="employee-section__title">Admin Management</h1>
            <div className="employee-section__employee-button">
              <Button
                label={
                  <>
                    <PlusSvg />
                    &nbsp;{'Create Role'}
                  </>
                }
                onClick={ onAdminRole}
                className="employee-section__submit-btn"
                primary
                type="submit"
              />
            </div>
          </div>
        </div>
        <Tab
            onChange={onTabChange}
            active={activeTab}
            default="admin"
          >
            <Tab.TabPane tab="Admin Users" key="Admin Users">
            </Tab.TabPane>
            <Tab.TabPane tab="Roles" key="Roles">
              <AdminRoleTab
                loading={loading}
              />
            </Tab.TabPane>
          </Tab>
      </div>
    </DashboardLayout>
  );
};

export default Admin;
