import { DateTimeChip } from '../DateTimeChip/date-time-chip';
import { Identity } from '../Identity/identity.component';
import { KebabMenu } from '../KebabMenu/KebabMenu.component';
import { Pagination } from '../Pagination/pagination.component';
import { StatusChip } from '../StatusChip/status-chip.component';
import { TableLayout } from '../Table/table-layout.component';
import { TableV2 } from '../Table/Table.component';

export const Administrators = () => {
  return (
    <div className="administrators">
      <TableLayout title="12 Administrators" searchPlaceholder="Search by name">
        <TableV2 className="administrators__table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email Address</th>
              <th>Role</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {new Array(20).fill(null).map((_, i) => {
              return (
                <tr key={i}>
                  <td>
                    <Identity
                      className="administrators__identity"
                      name="Esther Howard"
                      image="https://picsum.photos/32/32"
                      initial="E"
                    />
                  </td>
                  <td>estherhoward@gmail.com</td>
                  <td>Super Admin</td>
                  <td>
                    <StatusChip status="active" />
                  </td>
                  <td>
                    <span className="administrators__last-table-column">
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
              );
            })}
          </tbody>
        </TableV2>
      </TableLayout>

      <div className="administrators__pagination">
        <Pagination meta={{ total: 100 }} />
      </div>
    </div>
  );
};
