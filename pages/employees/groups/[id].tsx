import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import backicon from '../../../public/svgs/back-icon.svg';
import DashboardLayout from 'src/layouts/dashboard-layout/DashBoardLayout';
import withAuth from 'src/helpers/HOC/withAuth';
import { Tab } from '@/components/Tab/tab.component';
import { GroupDetails } from '@/components/Employee/group-detail.component';

const GroupDetailsPage = () => {
  const [activeTab, setActiveTab] = useState('details');

  return (
    <DashboardLayout pageTitle="Employees Group Details">
      <div className="group-details">
        <div className="group-details__section">
          <div className="group-details__header-content">
            <div className="group-details__group-detail-title-section">
              <Link href="/employees?tab=groups">
                <a>
                  <Image
                    src={backicon}
                    alt="group-details-image"
                    className="group-details__prev-icon"
                  />
                </a>
              </Link>

              <h5 className="group-details__group-detail-title">
                Group Details
              </h5>
            </div>
            {activeTab === 'details' ? (
              <button className="group-details__edit-details-btn">
                Edit Details
              </button>
            ) : (
              <button className="group-details__edit-details-btn">
                Create Addon
              </button>
            )}
          </div>
          <Tab
            onChange={(activeKey) => setActiveTab(activeKey)}
            default="details"
          >
            <Tab.TabPane tab="Details" key="details">
              <GroupDetails />
            </Tab.TabPane>
            <Tab.TabPane tab="Addons" key="addons">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit.
              Voluptatibus, autem ipsam. Corporis possimus quam impedit
              explicabo nostrum tempora dolore tenetur quod ea rem ex quos fuga,
              voluptas facilis ad vero.
            </Tab.TabPane>
          </Tab>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default withAuth(GroupDetailsPage, ['Employee', 'read']);
