import React, {useState}from 'react';
import { PayrollInput } from '../Input/payroll-input.component';
import { useCreatePayrollPageLogic } from 'src/helpers/hooks/use-create-payroll-page-logic.hook';
import { TotalCard } from '@/components/Card/total-card.component';
import { Util } from 'src/helpers/util';
import NiceModal from '@ebay/nice-modal-react';
import { SalaryAddOnModal } from '../Modals/SalaryAddOnModal.component';
const PayrollTotalCard = () => {
  const {
    loadingPayroll,
    currency,
    payrolltotals
  } = useCreatePayrollPageLogic();
  return (
    <div className="create-payroll-page">
      <div className="payroll">
        <div className="payroll__content">
          <div className='payroll__pay'>
            <h1 className="payroll__input">Monthly Pay </h1>
            <div className="payroll__salary">
              <h1>Salary</h1>
              <PayrollInput 
              placeholder="₦160,000" 
               />
            </div>
            <div className="payroll__addon">
              <p>Salary Add-Ons</p>
              <p className="payroll__addon-add"  onClick={() => {
              NiceModal.show(SalaryAddOnModal);
            }}>Add Salary add-ons</p>
            </div>
          </div>
          <div className='create-payroll-page__total'>
             <div className="create-payroll-page__totals__items">
              {Object.keys(payrolltotals).map((key, i) => {
                return (
                  <TotalCard
                    key={key}
                    loading={loadingPayroll}
                    title={key}
                    // type={i === 0 ? 'primary' : 'secondary'}
                    value={`${currency} ${Util.formatMoneyNumber(payrolltotals[key])}`}
                  />
                );
              })}
            </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PayrollTotalCard;
