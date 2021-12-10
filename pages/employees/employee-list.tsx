import type { NextPage } from 'next';
import Image from 'next/image';
import { Button } from '../../src/components/Button/Button.component';
import DashboardLayoutV2 from 'src/layouts/dashboard-layout-v2/DashboardLayoutV2';
import BackIcon from '../../public/svgs/backicon.svg';

const EmployeeList: NextPage = () => {
  return (
    <DashboardLayoutV2 title="Employee List">
      <div className="employee-list-section">
        <div className="">
          <Image src={BackIcon} alt="back-icon" />
        </div>
        <div className="payroll-details-section__payroll-details-header">
          <p className="payroll-details-section__payroll-header">
           Employee List
          </p>
         <div>
          <Button
            label={<>{'Proceed'}</>}
            onClick={() => {}}
            className="employee-section__submit-btn"
            primary
            type="submit"
          />
        </div>
        </div>
      </div>
    </DashboardLayoutV2>
  );
};
export default EmployeeList;
