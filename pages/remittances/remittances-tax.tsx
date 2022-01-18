import { NextPage } from 'next';
import DashboardLayout from 'src/layouts/dashboard-layout/DashBoardLayout';
import { Button } from '../../src/components/Button/Button.component';



const RemittancesTax: NextPage = () => {
  return (
    <DashboardLayout pageTitle="remittances-tax">
      <div className="payroll-section__details">
      <div className="remittances-tax-section">
        <div className="payroll-section__head">
          <h1 className="payroll-section__title">Tax</h1>
          <div className="payroll-section__employee-button">
            <Button
              label={
                <>
                  {'Proceed'}
                </>
              }
              element="a"
              href="/payroll/create"
              className="payroll-section__submit-btn"
              primary
              type="submit"
            />
          </div>
        </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RemittancesTax;
