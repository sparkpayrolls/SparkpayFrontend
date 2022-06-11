import Image from 'next/image';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Billing from '../../../public/svgs/billing.svg';
import { Button } from '../Button/Button.component';

export const PayrollUpdateCard = ({
  payrollDate,
  actions,
  loading,
}: {
  payrollDate: string;
  actions?: string[];
  loading: boolean;
}) => {
  return (
    <div className="wallet-billing-page__payroll-update">
      <Image src={Billing} alt="billing" />
      <div className="wallet-billing-page__payroll-update-text">
        <p>update</p>
        {loading ? (
          <>
            <Skeleton
              className="wallet-billing-page__payroll-date-text"
              width={400}
              borderRadius={4}
              count={1}
            />
            <Skeleton
              className="wallet-billing-page__payroll-date-text"
              width={150}
              borderRadius={4}
              count={1}
            />
          </>
        ) : (
          <>
            <p className="wallet-billing-page__payroll-date-text">
              {payrollDate}
            </p>
            {!!actions?.length && (
              <div className="wallet-billing-page__payroll-update-actions">
                {actions?.map((action, i) => {
                  switch (action) {
                    case 'create-payroll':
                      return (
                        <Button
                          key={`${action}-${i}`}
                          label={'Click to schedule your next payroll now'}
                          type="button"
                          element="a"
                          className="wallet-billing-page__payroll-update-action-button"
                          href="/payroll/create"
                        />
                      );
                    default:
                      return null;
                  }
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
