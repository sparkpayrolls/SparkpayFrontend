import type { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import DashboardLayout from '../../src/layouts/dashboard-layout/DashBoardLayout';
import BackIcon from '../../public/svgs/backicon.svg';
import { SingleDetail } from '@/components/Employee/single-detail.component';


const EmployeeDetails: NextPage = () => {
  return (
    <DashboardLayout pageTitle="Organisation Details">
      <div className="employee-details">
        <div className=" employee-details__employee-details-settings">
          <div className="employee-details__employee-details-header">
            <Link href="/organisations">
              <a>
                <Image
                  src={BackIcon}
                  alt="back-icon"
                  className="employee-details__back-icon"
                />
              </a>
            </Link>
            <h5 className="employee-details__employee-header">Back</h5>
          </div>
          {/* <div>
            <button
              className="employee-details__employee-button"
            >
              Salary Breakdown
            </button>
          </div> */}
        </div>
        <div className="employee-details__employee-settings-details">
          <div className="employee-details__employee-settings-flex">
            <div>
              <SingleDetail
                title="Name"
                details="Credpal"
                //   loading={loading}
              />
            </div>
            <div>
              <SingleDetail
                title="Phone Number"
                details="+234 703 321 8457"
                //   loading={loading}
              />
            </div>
            <div>
              <SingleDetail
                title="Email Address"
                details="hello@credpal.com"
                //   loading={loading}
              />
            </div>
            <div>
              <SingleDetail
                title="Date Created"
                details="July 20, 2021"
                //   loading={loading}
              />
            </div>
          </div>
          <hr />

          <div className="employee-details__employee-settings-flex">
            <div>
              <SingleDetail
                title="Country"
                details="Nigeria"
                //   loading={loading}
              />
            </div>
            <div>
              <SingleDetail
                title="RC Number"
                details="AP 703 321 AAA"
                //   loading={loading}
              />
            </div>
            <div>
              <SingleDetail
                title="RC Number"
                details="AP 703 321 AAA"
                //   loading={loading}
              />
            </div>
            <div>
              <SingleDetail
                title="Status"
                details="Active"
                //   loading={loading}
              />
            </div>
          </div>
          <hr />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EmployeeDetails;
