import DashboardLayout from 'src/layouts/dashboard-layout/DashBoardLayout';
import { Button } from '../../src/components/Button/Button.component';
import Image from 'next/image';
import backicon from '../../public/svgs/back-icon.svg';
import Link from 'next/link';
import { Table } from '../../src/components/Table/Table.component';

 const EmployeeTaxList = () => { 
   return(

  <DashboardLayout pageTitle="remittances-tax">
    <div className="remittances-tax-page">
      <div className="remittances-tax-section">
        <div className="group-details__header-content">
          <div className="group-details__group-detail-title-section">
            <Link href="/remittances">
              <a>
                <Image
                  src={backicon}
                  alt="group-details-image"
                  className="group-details__prev-icon"
                />
              </a>
            </Link>
            <h5 className="group-details__group-detail-title">Tax</h5>
          </div>
          <Button
            label={<>{'Save'}</>}
            element="a"
            className="payroll-section__submit-btn"
            primary
            type="submit"
          />
        </div>
           <div className="remittances-tax-page__tax-details-table">
          <div className="employee-table">
            <Table
              headerRow={[
                'Name',
                'Email\xa0Address',
                `Amount`,
                'Status',
                'Group',
                'Date\xa0Added',
              ]}
            >
              {() => {
                return (
                  <tbody>
                   
                      <td>
                        hello
                      </td>
                      <td>
                        hello

                      </td>
                      <td>
                        hello
                      </td>
                      <td>
                        hello
                      </td>
                      <td>
                        hello
                      </td>
 <td>
                        hello
                      </td>
                    <td>
                      hello
                    </td>
                  </tbody>
                );
              }}
            </Table>
          </div>
        </div>
          </div>
      </div>
    
  </DashboardLayout> 
   );
 };


export default EmployeeTaxList;