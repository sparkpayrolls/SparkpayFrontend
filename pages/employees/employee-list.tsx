import type { NextPage } from 'next';
import Image from 'next/image';
import  PlusSvg  from '../../public/svgs/add-icon.svg';
import { Button } from '../../src/components/Button/Button.component';
import DashboardLayoutV2 from 'src/layouts/dashboard-layout-v2/DashboardLayoutV2';
import BackIcon from '../../public/svgs/backicon.svg';
import DeleteIcon from "../../public/svgs/Delete.svg";
import { CheckboxTableColumn } from '@/components/Table/check-box-table-col.component';
import { TableLayout } from '@/components/Table/table-layout.component';;
import { TableV2 } from '@/components/Table/Table.component';


 const EmployeeList: NextPage = () => {
 return(

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
          <div  className="employee-list-section__employee-delete-image">
         <Image src={DeleteIcon} alt="back-icon"/>
            </div>
            <div className="employee-list-section__employee-add-row">
         <Image src={PlusSvg } alt="plus-svg" className="employee-list-section__employee-add-row-image"/>
         <p  className="employee-list-section__employee-add-row-text">Add Row</p>  
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
                  <CheckboxTableColumn element="th"                 >
                    Name
                  </CheckboxTableColumn>
                  <th>Last Name</th>
                  <th>Email Address</th>
                  <th>Salary Amount</th>
                </tr>
              </thead>
              <tr>
                <CheckboxTableColumn
                        element="td"
                      >
                        Christianah
                      </CheckboxTableColumn>
                <td>
                  Amoo
                </td>
                <td>
                 kolajoelizabeth@gmail.com
                </td>
                <td>
                 ₦ 120,000
                </td>
              </tr>
              </TableV2>
        </div>
      </div>
       
    </DashboardLayoutV2>
 )
};
export default EmployeeList;
