import { EmployeeDetail } from '@/components/Employee/employee-detail.component';
import { Tab } from '@/components/Tab/tab.component';
import { NextPage } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import withAuth from 'src/helpers/HOC/withAuth';
import DashboardLayout from 'src/layouts/dashboard-layout/DashBoardLayout';
import BackIcon from '../../public/svgs/backicon.svg';
import { Addon } from '@/components/Employee/addon.component';
import { IF } from '@/components/Misc/if.component';
import { EmployeePayrollHistory } from '@/components/Employee/payroll-history.component/payroll-history.component';

const EmployeeDetailPage: NextPage = () => {
  const [showEditGroupModal, setShowEditGroupModal] = useState(false);
  const [showCreateAddonModal, setShowCreateAddonModal] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  return (
    <DashboardLayout pageTitle="Employee Details">
      <div className="employee-details">
        <div className=" employee-details__employee-details-settings">
          <div className="employee-details__employee-details-header">
            <Link href="/employees">
              <a>
                <Image
                  src={BackIcon}
                  alt="back-icon"
                  className="employee-details__back-icon"
                />
              </a>
            </Link>
            <h5 className="employee-details__employee-header">
              Employees Details
            </h5>
          </div>
          <IF condition={activeTab === 'details'}>
            <button
              className="employee-details__employee-button"
              onClick={() => setShowEditGroupModal(true)}
            >
              Edit Details
            </button>
          </IF>
          <IF condition={activeTab === 'addons'}>
            <button
              className="employee-details__employee-button"
              onClick={() => setShowCreateAddonModal(true)}
            >
              Create Addon
            </button>
          </IF>
        </div>
        <Tab
          onChange={(activeKey) => setActiveTab(activeKey)}
          default="details"
        >
          <Tab.TabPane tab="Details" key="details">
            <EmployeeDetail
              editHandler={{
                edit: showEditGroupModal,
                setEdit: setShowEditGroupModal,
              }}
            />
          </Tab.TabPane>

          <Tab.TabPane tab="Addons" key="addons">
            <Addon
              editHandler={{
                edit: showCreateAddonModal,
                setEdit: setShowCreateAddonModal,
              }}
            />
          </Tab.TabPane>

          <Tab.TabPane tab="Payroll History" key="payroll">
            <EmployeePayrollHistory />
          </Tab.TabPane>
        </Tab>
      </div>
    </DashboardLayout>
  );
};

export default withAuth(EmployeeDetailPage, ['Employee', 'read']);
