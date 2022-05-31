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
          <button
            className="employee-details__employee-button"
            onClick={() =>
              activeTab === 'details'
                ? setShowEditGroupModal(true)
                : setShowCreateAddonModal(true)
            }
          >
            {activeTab === 'details' ? 'Edit Details' : 'Create Addon'}
          </button>
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
        </Tab>
      </div>
    </DashboardLayout>
  );
};

export default withAuth(EmployeeDetailPage, ['Employee', 'read']);
