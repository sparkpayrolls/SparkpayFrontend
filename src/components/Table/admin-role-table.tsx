import { StatusChip } from '../StatusChip/status-chip.component';
import { IRoleTable } from '../types';
import { Table, TR } from './Table.component';
import { KebabMenu } from '../KebabMenu/KebabMenu.component';
import { Pagination } from '../Pagination/pagination.component';

export const AdminRoleTable = (props: IRoleTable) => {
  const {
    onFilter,
    loading,
  } = props;

    const kebabMenu = 
       [
          {  value: 'View' },
          {
            value: 'Edit',
          },
          
        ];

  return (
    <div className="employee-table">
      <Table
        headerRow={[
          'Role Name',
          'Pemissions',
          `No. Of Users`,
          'Status',
          'Date',
        ]}
        onFilterClick={onFilter}
        emptyStateText="No employee yet"
        kebabMenuItems={kebabMenu}
        isLoading={loading}
        title={`4 Roles`}
      >
        {() => {
          return (
            <tbody>
              <TR>
                <td>Super Admin</td>
                <td>View,Edit</td>
                <td>1</td>
                <td>
                  <StatusChip status={'successful'} />
                </td>
                <td>
                  <span className="d-flex justify-content-space-between align-items-center">
                    May 27, 2020 | 12:38 PM
                    <KebabMenu
                      items={[
                        {
                          value: 'View',
                        },
                        {
                          value: 'Edit',
                        },
                      ]}
                    />
                  </span>
                </td>
              </TR>
            </tbody>
          );
        }}
      </Table>
      <div className="invitation-table--lock__pagination">
        <Pagination />
      </div>
    </div>
  );
};
