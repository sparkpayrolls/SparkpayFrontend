import { DateTimeChip } from '../DateTimeChip/date-time-chip';
import { KebabMenu } from '../KebabMenu/KebabMenu.component';
import { Pagination } from '../Pagination/pagination.component';
import { StatusChip } from '../StatusChip/status-chip.component';
import { TableLayout } from '../Table/table-layout.component';
import { TableV2 } from '../Table/Table.component';

export const Roles = () => {
  return (
    <div className="roles">
      <TableLayout title="12 Roles" searchPlaceholder="Search by name">
        <TableV2 className="roles__table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Permissions</th>
              <th>No. of Users</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Human Resource</td>
              <td>
                <span className="roles__permissions">
                  <span>Employee: R,W</span>
                  <span>Payroll: R,W</span>
                  <span>Audit: R,W</span>
                </span>
              </td>
              <td>2</td>
              <td>
                <StatusChip status="active" />
              </td>
              <td>
                <span className="roles__last-table-column">
                  <DateTimeChip />
                  <KebabMenu
                    items={[
                      { value: 'View' },
                      { value: 'Edit' },
                      { value: 'Delete' },
                    ]}
                  />
                </span>
              </td>
            </tr>
          </tbody>
        </TableV2>
      </TableLayout>

      <div className="roles__pagination">
        <Pagination />
      </div>
    </div>
  );
};
