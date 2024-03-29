import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import backicon from '../../../../public/svgs/back-icon.svg';
import DashboardLayout from 'src/layouts/dashboard-layout/DashBoardLayout';
import withAuth from 'src/helpers/HOC/withAuth';
import { Tab } from '@/components/Tab/tab.component';
import { GroupDetails } from '@/components/Employee/group-detail.component';
import { Addon } from '@/components/Employee/addon.component';
import { useRouter } from 'next/router';

const GroupDetailsPage = () => {
  const [editGroup, setEditGroup] = useState(false);
  const [editAddon, setEditAddon] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const router = useRouter();
  const groupId = router.query.id as string;

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
              <div className="d-flex gap-1 align-items-center">
                <Link href={`/employees/groups/${groupId}/employees`}>
                  <a className="group-details__edit-details-btn-link">
                    Add Employees
                  </a>
                </Link>
                <button
                  onClick={() => {
                    setEditGroup(true);
                  }}
                  className="group-details__edit-details-btn"
                >
                  Edit Details
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setEditAddon(true);
                }}
                className="group-details__edit-details-btn"
              >
                Create Addon
              </button>
            )}
          </div>
          <Tab
            onChange={(activeKey) => setActiveTab(activeKey)}
            default="details"
          >
            <Tab.TabPane tab="Details" key="details">
              <GroupDetails
                editHandler={{ edit: editGroup, setEdit: setEditGroup }}
              />
            </Tab.TabPane>
            <Tab.TabPane tab="Addons" key="addons">
              <Addon editHandler={{ edit: editAddon, setEdit: setEditAddon }} />
            </Tab.TabPane>
          </Tab>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default withAuth(GroupDetailsPage, ['Employee', 'read']);
