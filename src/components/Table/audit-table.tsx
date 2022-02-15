import { User } from 'src/api/types';
import { DateTimeChip } from '../DateTimeChip/date-time-chip';
import { TableEmptyState } from '../EmptyState/table-emptystate.component';
import { Identity } from '../Identity/identity.component';
import { Pagination } from '../Pagination/pagination.component';
import { StatusChip } from '../StatusChip/status-chip.component';
import { IAuditTable } from '../types';
import { MenuTableColumn } from './menu-table-col.component';
import { TableLayout } from './table-layout.component';
import { TableV2 } from './Table.component';

export const AuditTable = (props: IAuditTable) => {
  const { logs, meta, getLogs, loading } = props;
  const isEmpty = logs.length <= 0;

  const onSearch = (search: string) => {
    getLogs({ search, page: 1, perPage: meta.perPage });
  };

  return (
    <div className="audit-table">
      <TableLayout
        title={`${meta.total} Logs`}
        onSearch={onSearch}
        onFilter={() => {}}
        menuItems={[]}
        searchPlaceholder="Search by name"
      >
        <TableV2 className="audit-table__table" loading={loading}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Activity</th>
              <th>Role</th>
              <th>Action</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => {
              const user = log.actionBy as User;
              return (
                <tr key={log.id}>
                  <th>
                    <Identity
                      image={user.avatar}
                      imageHeight={32}
                      imageWidth={32}
                      initial={user.firstname.charAt(0)}
                      name={`${user.firstname} ${user.lastname}`}
                    />
                  </th>
                  <td className="audit-table__table__description-col">
                    {log.description}
                  </td>
                  <td>{log.role}</td>
                  <td>
                    <StatusChip status={log.action} />
                  </td>
                  <MenuTableColumn items={[]} element="td">
                    <DateTimeChip date={log.createdAt} />
                  </MenuTableColumn>
                </tr>
              );
            })}
          </tbody>
        </TableV2>
      </TableLayout>
      {isEmpty && (
        <TableEmptyState
          text={
            loading ? 'Getting logs...' : 'Your audit logs will appear here.'
          }
        />
      )}
      <Pagination refresh={getLogs} meta={meta} />
    </div>
  );
};
