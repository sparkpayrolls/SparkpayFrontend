import type { NextPage } from 'next';

import Image from 'next/image';
import DashboardLayout from '../../src/layouts/dashboard-layout/DashBoardLayout';
import withAuth from 'src/helpers/HOC/withAuth';
import BackIcon from '../../public/svgs/backicon.svg';

const EmployeeDetails: NextPage = () => {
  return (
    <DashboardLayout pageTitle="Employee Details">
      <div className="employee-details">
        <div className=" employee-details__employee-details-settings">
          <div className="employee-details__employee-details-header">
            <Image src={BackIcon} alt="back-icon" />
            <p className="employee-details__employee-header">
              Employees Details
            </p>
          </div>
          <button className="employee-details__employee-button">
            Edit Details
          </button>
        </div>
        <div className="employee-details__employee-settings-details">
          <div className="employee-details__employee-settings-flex">
            <div>
              <p className="employee-details__employee-details-text">Name</p>
              <p className="employee-details__employee-details-text-one">
                Esther Howard
              </p>
            </div>
            <div>
              <p className="employee-details__employee-details-text">
                Email Address
              </p>
              <p className="employee-details__employee-details-text-one">
                estherhoward@gmail.com
              </p>
            </div>
            <div>
              <p className="employee-details__employee-details-text">Group</p>
              <p className="employee-details__employee-details-text-one">
                Payroll group 1
              </p>
            </div>
            <div>
              <p className="employee-details__employee-details-text">
                Dated Created
              </p>
              <p className="employee-details__employee-details-text-one">
                July 20, 2021{' '}
              </p>
            </div>
          </div>
          <hr />
          <div className="employee-details__employee-settings-flex">
            <div>
              <p className="employee-details__employee-details-text">
                Salary Amount
              </p>
              <p className="employee-details__employee-details-text-one">
                ₦ 210,000
              </p>
            </div>
            <div>
              <p className="employee-details__employee-details-text">
                Payment Method
              </p>
              <p className="employee-details__employee-details-text-one">
                Bank Account
              </p>
              <p className="employee-details__employee-details-text-one"></p>
            </div>
            <div>
              <p className="employee-details__employee-details-text">
                Bank Name
              </p>
              <p className="employee-details__employee-details-text-one">
                First Bank Nigeria
              </p>
            </div>
            <div>
              <p className="employee-details__employee-details-text">
                Account Number
              </p>
              <p className="employee-details__employee-details-text-one">
                0033000099
              </p>
            </div>
          </div>
          <hr />

          <div className="employee-details__employee-settings-flex">
            <div>
              <p className="employee-details__employee-details-text">
                Resident Country
              </p>
              <p className="employee-details__employee-details-text-one">
                Nigeria
              </p>
            </div>
            <div>
              <p className="employee-details__employee-details-text">
                Country Of Origin
              </p>
              <p className="employee-details__employee-details-text-one">
                Nigeria
              </p>
            </div>
          </div>
          <hr />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default withAuth(EmployeeDetails);
