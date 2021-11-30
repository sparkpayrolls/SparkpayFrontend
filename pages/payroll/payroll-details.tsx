import type { NextPage } from 'next';
import Image from 'next/image';
import DashboardLayoutV2 from 'src/layouts/dashboard-layout-v2/DashboardLayoutV2';
import BackIcon from '../../public/svgs/backicon.svg';

export const SinglePayroll =({
  title,
  details,
} :{
  title:string;
  details:string;
}) => {
  return(
<div className="payroll-details-section__single-details">
<div>
  <p className="employee-details__employee-details-text">{title}</p>   
    <p className="employee-details__employee-details-text-one">{details}</p>
  </div>
</div>
  );
}

const payDetails: NextPage = () => {
  return (
    <DashboardLayoutV2 title="Payroll details">
      <div className=" payroll-details-section">
         <div className=" payroll-details-section__back-icon">
          <Image src={BackIcon} alt="back-icon" />
          <div className="payroll-details-section__payroll-details-header">
            <p className="payroll-details-section__payroll-header">
              Payroll Details{' '}
              <span className="payroll-details-section__payroll-wallet">
                (wallet balance ₦ 120,000)
              </span>
            </p>
            <p className="payroll-details-section__payroll-cost">
              Total Payroll Cost:{' '}
              <span className="payroll-details-section__payroll-amount">
                ₦ 120,000
              </span>
            </p>
          </div>
      <div className="payroll-details-section__payroll-settings-details">
        <div className="employee-details__employee-settings-flex">
          <SinglePayroll
          title="Payroll Size"
          details="20"
          />
          <SinglePayroll
          title="Unit Cost"
          details="₦ 50"
          />
          <SinglePayroll
          title="Wallet Balance"
          details="₦ 500,000"
          />
          <SinglePayroll
          title="Payout Date"
          details="May 27, 2020 | 12:38 PM "
          />
          <SinglePayroll
          title="Month"
          details="October"
          />
          <SinglePayroll
          title="Status"
          details="Successful"
          />
       </div>
      </div>
      <p>llohe</p>
      </div>
      </div>
    </DashboardLayoutV2>
  );
};

export default payDetails;
