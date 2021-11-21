import Image from 'next/image';
import Billing from '../../../public/svgs/Billing.svg';

export const PayrollUpdateCard = ({ payrollDate }: { payrollDate: string }) => {
  return (
    <div className="wallet-billing-page__payroll-update">
      <Image src={Billing} alt="billing" />
      <div className="wallet-billing-page__payroll-update-text">
        <p>update</p>
        <p className="wallet-billing-page__payroll-date-text">{payrollDate}</p>
      </div>
    </div>
  );
};
