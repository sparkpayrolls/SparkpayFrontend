import type { NextPage } from 'next';
import { TableLayout } from '@/components/Table/table-layout.component';
import { TotalCard } from '@/components/Card/total-card.component';
import { Util } from 'src/helpers/util';
import Image from 'next/image';
import { useAppSelector } from 'src/redux/hooks';
import {useState } from 'react';
import DashboardLayoutV2 from 'src/layouts/dashboard-layout-v2/DashboardLayoutV2';
import BackIcon from '../../public/svgs/backicon.svg';
import { CheckboxTableColumn } from '@/components/Table/check-box-table-col.component';

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

const PayDetails: NextPage = () => {
  const administrator = useAppSelector((state) => state.administrator);
  const currency = Util.getCurrencySymbolFromAdministrator(administrator);
  const [apiCalls] = useState(0);
  const totals: Record<string, number> = {
    'Total Salary Amount': 1,
    'Total Net Salary': 0,
  };
  const loading = apiCalls > 0;
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
         <div className="payroll-details-section__month-text"> 
          <SinglePayroll
          title="Month"
          details="October"
          />
         </div>
          <div >
          <span >
          <p className="payroll-details-section__status-text">Status</p>
          </span>
          
        <div className="payroll-details-section__successful-icon">
        <span className="payroll-details-section__successful-image">        
         <SuccessSvg/>
        </span>
         <p className="payroll-details-section__successful-text">Successful</p>
          </div>
          </div>
       </div>
        </div>
      </div>
      <p className="payroll-details-section__payroll-breakdown-text">Payroll breakdown</p>
       <TableLayout
        >
          <table className="table payroll-create-table">
            <thead>
              <tr>
                <CheckboxTableColumn element="th">Name</CheckboxTableColumn>
                <th>Salary (₦)</th>
                <th>Net Amount (₦) </th>
                <th>Bonus Amount (₦)  </th>
                <th>Amount Taxed (₦)  </th>
                <th>Pension Amount (₦) </th>
                <th>Other Deductions (₦) </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <CheckboxTableColumn element="td">
                kolajo Tomike
                </CheckboxTableColumn>
                <td>₦ 120,000</td>
                <td>₦ 120,000</td>
                <td>₦ 120,000</td>
                <td>₦ 120,000</td>
                <td>₦ 120,000</td>
                <td>₦ 120,000</td>
                </tr>
                </tbody>
          </table>
             
        </TableLayout>
         <div className="create-payroll-page__totals">
            <div className="create-payroll-page__totals__items">
              {Object.keys(totals).map((key, i) => {
                return (
                  <TotalCard
                    key={key}
                    loading={loading}
                    title={key}
                    type={i === 1 ? 'primary' : 'secondary'}
                    value={`${currency} ${Util.formatMoneyNumber(totals[key])}`}
                  />
                );
              })}
            </div>
          </div>
      </div>
    </DashboardLayoutV2>
  );
};

export default PayDetails;


const SuccessSvg = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="6" cy="6" r="6" fill="#EAFBF1" />
    <circle cx="6" cy="6" r="3" fill="#27BE63" />
  </svg>
);