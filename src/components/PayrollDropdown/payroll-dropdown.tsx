import React from 'react';
import { PayrollInput } from '../Input/payroll-input.component';
import { TotalCard } from '@/components/Card/total-card.component';
import { Util } from 'src/helpers/util';
import NiceModal from '@ebay/nice-modal-react';
import { EditPayrollEmployeeModal } from '../Modals/EditPayrollEmployeeModal.component';
import { ProcessedEmployee } from 'src/helpers/payroll-processor/types';


export type PayrollDropdownProps =  {
  currency:string,
  employee:ProcessedEmployee,
}


const PayrollDropdown = (props:any) => {
 
  const {currency,employee} = props;

  return (
    <div className="create-payroll-page">
      <div className="payroll">
        <div className="payroll__content">
          <div className="payroll__pay">
            <h1 className="payroll__input">Monthly Pay </h1>
            <div className="payroll__salary">
              <h1>Salary</h1>
              <PayrollInput placeholder="₦160,000" />
            </div>
            <div className="payroll__addon">
              <p>Salary Add-Ons</p>
              <p
                className="payroll__addon-add"
                onClick={() => {
                  NiceModal.show(EditPayrollEmployeeModal,{
                    employee,
                    currency,
                    handleUpdates: () => {},  
                    getIndex: () => 0, 
                    bonus: [], 
                    deductions: [],  
                    prorate: null, 
                    year: new Date().getFullYear(),
                    month: new Date().getMonth(),
                  });
                }}
              >
                Add Salary add-ons
              </p>
            </div>
            <div className="payroll__salary">
              <h1>Sales Bonus</h1>
              <PayrollInput placeholder="₦160,000" />
            </div>
          </div>
            <div className="create-payroll-page__totals employee-payroll-breakdown">
              <div className="create-payroll-page__totals__items">
                <TotalCard
                  title={'Gross Pay'}
                  // type="primary"
                  value={`${currency} ${Util.formatMoneyNumber(
                    employee?.salary,
                  )}`}
                />

                <TotalCard
                  title={'Bonus'}
                  value={`${currency} ${Util.formatMoneyNumber(
                    employee?.totalBonus,
                  )}`}
                />

                <TotalCard
                  title={'Prorate'}
                  value={`${currency} ${Util.formatMoneyNumber(
                    employee?.proratedSalary,
                  )}`}
                />

                <TotalCard
                  title={'Employee NC'}
                  value={`${currency} ${Util.formatMoneyNumber(
                    employee?.totalDeductions,
                  )}`}
                />

                <TotalCard
                  title={'PAYE'}
                  value={`${currency} ${Util.formatMoneyNumber(
                    employee?.tax?.amount,
                  )}`}
                />

                <TotalCard
                  title={'Employee Pension'}
                  value={`${currency} ${Util.formatMoneyNumber(
                    employee?.pension?.amount,
                  )}`}
                />
                <TotalCard
                  title={'Net Pay'}
                  value={`${currency} ${Util.formatMoneyNumber(
                    employee?.netSalary,
                  )}`}
                  
                />
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PayrollDropdown;
