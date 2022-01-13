import { NextPage } from 'next';
import DashboardLayout from 'src/layouts/dashboard-layout/DashBoardLayout';
import { Button } from '../../src/components/Button/Button.component';



const RemittancesTax: NextPage = () => {
  return (
    <DashboardLayout pageTitle="remittances-tax">
      <div className="remittances-page">
        <div className="payroll-section__head">
          <h1 className="payroll-section__title">Payroll</h1>
          <div className="payroll-section__employee-button">
            <Button
              label={
                <>
                  {'Create Payroll'}
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
    </DashboardLayout>
  );
};

export default RemittancesTax;
