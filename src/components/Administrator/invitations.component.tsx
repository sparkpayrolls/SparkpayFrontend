import { DateTimeChip } from '../DateTimeChip/date-time-chip';
// import { TableEmptyState } from '../EmptyState/table-emptystate.component';
import { KebabMenu } from '../KebabMenu/KebabMenu.component';
import { Pagination } from '../Pagination/pagination.component';
import { StatusChip } from '../StatusChip/status-chip.component';
import { TableLayout } from '../Table/table-layout.component';
import { TableV2 } from '../Table/Table.component';

export const Invitations = () => {
  return (
    <div className="invitations">
      <TableLayout title="12 Invitations" searchPlaceholder="Search by name">
        <TableV2 className="invitations__table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {new Array(10).fill(null).map((_, i) => {
              return (
                <tr key={i}>
                  <td>John Doe</td>
                  <td>john@doe.com</td>
                  <td>Human Resource</td>
                  <td>
                    <StatusChip status="pending" />
                  </td>
                  <td>
                    <span className="invitations__last-table-column">
                      <DateTimeChip />
                      <KebabMenu items={[{ value: 'Delete' }]} />
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </TableV2>
      </TableLayout>

      {/* <TableEmptyState text="Invitations will appear here" /> */}

      <div className="roles__pagination">
        <Pagination />
      </div>
    </div>
  );
};
