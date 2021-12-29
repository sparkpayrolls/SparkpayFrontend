import Image from 'next/image';
import { EmployeePlusSvg } from '@/components/svg';
// import PlusSvg from '../../public/svgs/add-icon.svg';
import { Button } from '../../src/components/Button/Button.component';
import DashboardLayoutV2 from 'src/layouts/dashboard-layout-v2/DashboardLayoutV2';
import BackIcon from '../../public/svgs/backicon.svg';
import DeleteIcon from '../../public/svgs/Delete.svg';
import { CheckboxTableColumn } from '@/components/Table/check-box-table-col.component';
import { TableV2 } from '@/components/Table/Table.component';
import EditIcon from '@../../public/svgs/edit-icon.svg';
import withAuth from 'src/helpers/HOC/withAuth';

// import { EmployeeOnboarding } from '@/components/types';



const EmployeeList = () => {
  return (
    <>
      <DashboardLayoutV2 title="Employee List">
        <div className="">
          <Image src={BackIcon} alt="back-icon" />
        </div>
        <div className="payroll-details-section__payroll-details-header">
          <p className="payroll-details-section__payroll-header">
            Employee List
          </p>               
          <div className="employee-list-section__employee-button-section">
       
            <div className="employee-list-section__employee-delete-image">
              <Image src={DeleteIcon} alt="back-icon"  />
            </div>
            <div className="employee-list-section__employee-add-row">
              <Button
                label={
                  <>
                    <EmployeePlusSvg />
                    &nbsp;{'Add\xa0Row'}
                  </>
                }
                onClick={() => { }}
                className="employee-list-section__submit-btn"
                primary
                type="submit"
              />

            </div>
            <Button
              label={<>{'Proceed'}</>}
              onClick={() => { }}
              className="employee-section__submit-btn"
              primary
              type="submit"
            />
          </div>
        </div>
        <div className="employee-list-section__employee-list-table">
         
   <div>
     
          <TableV2 className="payroll-create-table">
            {/* <thead>
              <tr>
                <CheckboxTableColumn element="th">Name</CheckboxTableColumn>
                <th>Last Name</th>
                <th>Email Address</th>
                <th>Salary Amount</th>
              </tr>
            </thead> */}
                <tr>
                  <CheckboxTableColumn element="td">
                    <input
                     type="text"
                     className="employee-list-section__employee-input"
                    //  onChange={handleChange}
                    //  value={values.firstname}
                      />
                   
                    <span className="employee-list-section__employee-list-image">
                      <Image src={EditIcon} alt="edit-icon" />
                    </span>
                  </CheckboxTableColumn>
                  <td>
                    <input type="text" className="employee-list-section__employee-input" />
                    <span className="employee-list-section__employee-list-image">
                      <Image src={EditIcon} alt="edit-icon" />
                    </span>
                  </td>
                  <td>
                    <input type="text" className="employee-list-section__employee-input" />
                    <span className="employee-list-section__employee-list-image">
                      <Image src={EditIcon} alt="edit-icon" />
                    </span>
                  </td>
                  <td>
                    <input type="text" className="employee-list-section__employee-input"  />
                    <span className="employee-list-section__employee-list-image">
                      <Image src={EditIcon} alt="edit-icon" />
                    </span>
                  </td>
                </tr>
          </TableV2>
                </div>
        </div>
        {/* <div className="button-section">
              <button className="button add" type="button" onClick={() => addFormFields()}>Add</button>
              <button className="button submit" type="submit">Submit</button>
            </div> */}
      </DashboardLayoutV2>
    </>
  );
};
export default withAuth(EmployeeList);




