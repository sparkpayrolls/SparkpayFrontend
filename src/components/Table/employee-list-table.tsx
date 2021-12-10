import { useEffect } from 'react';
import { Util } from 'src/helpers/util';
import { Table } from './Table.component';
 
export const EmployeeListTable = () => {
  return (
    <div className="transaction-table">
      <Table
        headerRow={[
          'Name',
          'Last Name',
          'Email Address',
          'Salary Amount',
        ]}
      >
        {() => {
          return (
            <tbody>
             
                  <tr>
                    <td>{name}</td>
                    <td>
                      {lastName}
                    </td>                   
                    <td>
                      {email} />
                    </td>
                    <td>
                      {salaryAmount} />
                    </td>
                  </tr>
                );
            </tbody>
          );
        }}
      </Table>
    </div>
  );
};
