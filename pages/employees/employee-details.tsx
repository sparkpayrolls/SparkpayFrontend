import type { NextPage } from 'next';
import Image from 'next/image';
import DashboardLayout from '../../src/layouts/dashboard-layout/DashBoardLayout';
import withAuth from 'src/helpers/HOC/withAuth';
import BackIcon from '../../public/svgs/backicon.svg';

export const SinglePayroll = ({
  title,
  details,
}: {
  title: string;
  details: string;
}) => {
  return (
    <div className="payroll-details-section__single-details">
      <div>
        <p className="employee-details__employee-details-text">{title}</p>
        <p className="employee-details__employee-details-text-one">{details}</p>
      </div>
    </div>
  );
};

const EmployeeDetails: NextPage = () => {
  return (
    <DashboardLayout pageTitle="Employee Details">
      <div className="employee-details">
        <div className=" employee-details__employee-details-settings">
          <div className="employee-details__employee-details-header">
            <Image src={BackIcon} alt="back-icon" className="employee-details__back-icon"/>
            <h5 className="employee-details__employee-header">
              Employees Details
            </h5>
          </div>
          <button className="employee-details__employee-button">
            Edit Details
          </button>
        </div>
        <div className="employee-details__employee-settings-details">
          <div className="employee-details__employee-settings-flex">
            <div>
              <SinglePayroll title="Name" details="Esther Howard" />
            </div>
            <div>
              <SinglePayroll
                title="Email Address"
                details="estherhoward@gmail.com"
              />
            </div>
            <div>
              <SinglePayroll title="Group" details=" Payroll group 1" />
            </div>
            <div>
              <SinglePayroll title=" Date Created" details="July 20, 2021" />
            </div>
          </div>
          <hr />
          <div className="employee-details__employee-settings-flex">
            <div>
              <SinglePayroll title="Salary Amount" details="₦ 210,000" />
            </div>
            <div>
              <SinglePayroll title="Payment Method" details="Bank Account" />
            </div>
            <div>
              <SinglePayroll title="Bank Name" details=" First Bank Nigeria" />
            </div>
            <div>
              <SinglePayroll title="Account Number" details="  0033000099" />
            </div>
          </div>
          <hr />

          <div className="employee-details__employee-settings-flex">
            <div>
              <SinglePayroll title="Resident Country" details="Nigeria" />
            </div>
            <div>
              <SinglePayroll title="Country of Origin" details="Nigeria" />
            </div>
          </div>
          <hr />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default withAuth(EmployeeDetails);

