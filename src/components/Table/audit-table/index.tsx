import { DateTimeChip } from '@/components/DateTimeChip/date-time-chip';
import { TableEmptyState } from '@/components/EmptyState/table-emptystate.component';
import { Identity } from '@/components/Identity/identity.component';
import { Pagination } from '@/components/Pagination/pagination.component';
import { StatusChip } from '@/components/StatusChip/status-chip.component';
import { Popover } from 'antd';
import { User } from 'src/api/types';
import { TableLayout } from '../table-layout.component';
import { TableV2 } from '../Table.component';
import { getDescriptionComponent, useLogic } from './helpers';

export const AuditTable = () => {
  const {
    auditLogs,
    isEmpty,
    loading,
    title,
    onSearch,
    setParams,
  } = useLogic();

  return (
    <div className="audit-table">
      <TableLayout
        title={title}
        onSearch={onSearch}
        searchPlaceholder="Search by name"
        fixedHeader
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
            {auditLogs?.data?.map((log) => {
              const user = log.actionBy as User;
              const Content = getDescriptionComponent(log.description);

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
                    <div>
                      <Popover
                        placement="top"
                        // title={text}
                        content={
                          <Content
                            description={log.description}
                            meta={log.meta}
                          />
                        }
                        trigger="click"
                      >
                        {log.description}
                      </Popover>
                    </div>
                  </td>
                  <td>{log.role}</td>
                  <td>
                    <StatusChip status={log.action} />
                  </td>
                  <td>
                    <DateTimeChip date={log.createdAt} />
                  </td>
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
      <Pagination refresh={setParams} meta={auditLogs?.meta} />
    </div>
  );
};
