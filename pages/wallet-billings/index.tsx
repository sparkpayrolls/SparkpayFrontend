import React from 'react';
import { NextPage } from 'next';
import Image from 'next/image';
import DashboardLayout from 'src/layouts/dashboard-layout/DashBoardLayout';
import { Button } from '../../src/components/Button/Button.component';
import Billing from '../../public/svgs/Billing.svg';
import PurpleImage from '../../public/svgs/purplewallet.svg';
import YellowImage from '../../public/svgs/yellowsvg.svg'


 const WalletCard =({
  title,
   amount,
  
}) => {
return (
  <div>
    <div className="wallet-billing-page__wallet-amount">
    <div className="wallet-billing-page__wallet-purple-image">
    <Image src={PurpleImage} alt="purple image"/>
    </div>
      <div className="wallet-billing-page__wallet-text">
      <p>{title}</p>
      <p className="wallet-billing-page__wallet-amount-text">{amount}</p>
    </div>
       <div>    
                <Button
                  label={<>{'Fund Wallet'}</>}
                  onClick={() => {}}
                  className="employee-section__submit-btn"
                  primary
                  type="submit"
                />
              </div>
         </div>
               <div className="wallet-billing-page__wallet-yellow-image">
    <Image src={YellowImage} alt="yellowImage" />
    </div>
  </div>
);
}
const PayrollCard =({
   payrollDate,
  
}) => {
return (
 
    <div className="wallet-billing-page__payroll-update">
    <Image src={Billing} alt="billing" />
      <div className="wallet-billing-page__payroll-update-text">
      <p>update</p>
      <p  className="wallet-billing-page__payroll-date-text">{payrollDate}</p>
    </div>
         </div>
);
}
const WalletBilling: NextPage = () =>
{
  return (
      <DashboardLayout pageTitle="WalletBilling">
  <div className="wallet-billing-page">      
     <h1 className="wallet-billing-page__wallet-header-title">Wallet & Billings</h1> 
         <div
      className="wallet-billing-page__wallet-cards
    "
    >
        <WalletCard
        title="Wallet Balance"
        amount="₦25,000,000.00"  
        />
        <PayrollCard
        payrollDate="Next payroll date is on the 27, may"
        />
        </div>

        <h1>Hello</h1>
    </div>

      </DashboardLayout>
  );
};

export default WalletBilling;
