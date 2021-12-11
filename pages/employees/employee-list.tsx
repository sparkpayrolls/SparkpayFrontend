import type { NextPage } from 'next';
import Image from 'next/image';
import PlusSvg from '../../public/svgs/add-icon.svg';
import { Button } from '../../src/components/Button/Button.component';
import DashboardLayoutV2 from 'src/layouts/dashboard-layout-v2/DashboardLayoutV2';
import BackIcon from '../../public/svgs/backicon.svg';
import DeleteIcon from '../../public/svgs/Delete.svg';
import { CheckboxTableColumn } from '@/components/Table/check-box-table-col.component';
import { TableV2 } from '@/components/Table/Table.component';
import EditIcon from '@../../public/svgs/edit-icon.svg';




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

          <div className="employee-list-section__employee-button-section">
            <div className="employee-list-section__employee-delete-image">
              <Image src={DeleteIcon} alt="back-icon" />
            </div>
            <div className="employee-list-section__employee-add-row">
              <Image
                src={PlusSvg}
                alt="plus-svg"
                className="employee-list-section__employee-add-row-image"
              />
              <p className="employee-list-section__employee-add-row-text">
                Add Row
              </p>
            </div>
            <Button
              label={<>{'Proceed'}</>}
              onClick={() => {}}
              className="employee-section__submit-btn"
              primary
              type="submit"
            />
          </div>
        </div>
        <div className="employee-list-section__employee-list-table">
          <TableV2 className="payroll-create-table">
            <thead>
              <tr>
                <CheckboxTableColumn element="th">Name</CheckboxTableColumn>
                <th>Last Name</th>
                <th>Email Address</th>
                <th>Salary Amount</th>
              </tr>
            </thead>
            <tr>
              <CheckboxTableColumn element="td">
               <input type="text" className="employee-list-section__employee-input"/>
                <span className="employee-list-section__employee-list-image">
                  <Image src={EditIcon} />
                </span>
              </CheckboxTableColumn>
              <td>
               <input type="text" className="employee-list-section__employee-input"/>
                <span className="employee-list-section__employee-list-image">
                  <Image src={EditIcon} />
                </span>
              </td>
              <td>
               <input type="text" className="employee-list-section__employee-input"/>               
                <span className="employee-list-section__employee-list-image">
                  <Image src={EditIcon} />
                </span>
              </td>
              <td>
               <input type="text" className="employee-list-section__employee-input"/>               
                <span className="employee-list-section__employee-list-image">
                  <Image src={EditIcon} />                 
                </span>
                <KebabMenuSVG/>
              </td>
            </tr>
          </TableV2>
        </div>
      </div>
    </DashboardLayoutV2>
  );
};
export default EmployeeList;


const KebabMenuSVG = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10 6C8.89543 6 8 5.10457 8 4C8 2.89543 8.89543 2 10 2C11.1046 2 12 2.89543 12 4C12 5.10457 11.1046 6 10 6Z"
      fill="#3A434B"
    />
    <path
      d="M10 12C8.89543 12 8 11.1046 8 10C8 8.89543 8.89543 8 10 8C11.1046 8 12 8.89543 12 10C12 11.1046 11.1046 12 10 12Z"
      fill="#3A434B"
    />
    <path
      d="M10 18C8.89543 18 8 17.1046 8 16C8 14.8954 8.89543 14 10 14C11.1046 14 12 14.8954 12 16C12 17.1046 11.1046 18 10 18Z"
      fill="#3A434B"
    />
  </svg>
);
