import type { NextPage } from 'next';
import { useState } from 'react';
import Image from 'next/image';
import DashboardLayout from '../../src/layouts/dashboard-layout/DashBoardLayout';
import withAuth from 'src/helpers/HOC/withAuth';
import BackIcon from '../../public/svgs/backicon.svg';

export const SingleDetail = ({
  title,
  details,
}: {
  title: string;
  details: string;
}) => {
  return (
    <div className="employee-details-section__single-details">
      <div>
        <p className="employee-details__employee-details-text">{title}</p>
        <p className="employee-details__employee-details-text-one">{details}</p>
      </div>
    </div>
  );
};

const EmployeeDetails: NextPage = () => {
  const [employee] = useState({
    name: 'Esther Howard',
    email: 'estherhoward@gmail.com',
    group: 'Payroll group 1',
    date: 'July 20, 2021 ',
    salary: '₦ 210,000',
    paymentMethodd: 'Bank Account',
    bankName: 'First Bank Nigeria',
    accountNumber: '0033000099',
    residentCountry: 'Nigeria',
    countryOrigin: 'Nigeria',
  });
  return (
    <DashboardLayout pageTitle="Employee Details">
      <div className="employee-details">
        <div className=" employee-details__employee-details-settings">
          <div className="employee-details__employee-details-header">
            <Image
              src={BackIcon}
              alt="back-icon"
              className="employee-details__back-icon"
            />
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
              <SingleDetail title="Name" details={employee.name} />
            </div>
            <div>
              <SingleDetail title="Email Address" details={employee.email} />
            </div>
            <div>
              <SingleDetail title="Name" details={employee.group} />
            </div>
            <div>
              <SingleDetail title="Date Created" details={employee.date} />
            </div>
          </div>
          <hr />
          <div className="employee-details__employee-settings-flex">
            <div>
              <SingleDetail title="Salary Amount" details={employee.salary} />
            </div>
            <div>
              <SingleDetail
                title="Payment Method"
                details={employee.paymentMethodd}
              />
            </div>
            <div>
              <SingleDetail title="Bank Name" details={employee.bankName} />
            </div>
            <div>
              <SingleDetail
                title="Account Number"
                details={employee.accountNumber}
              />
            </div>
          </div>
          <hr />

          <div className="employee-details__employee-settings-flex">
            <div>
              <SingleDetail
                title="Resident Country"
                details={employee.residentCountry}
              />
            </div>
            <div>
              <SingleDetail
                title="Country of Origin"
                details={employee.countryOrigin}
              />
            </div>
          </div>
          <hr />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default withAuth(EmployeeDetails);
