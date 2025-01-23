import { TableLayout } from '../Table/table-layout.component';
import { TableV2 } from '../Table/Table.component';
import { Identity } from '../Identity/identity.component';
import { DateTimeChip } from '../DateTimeChip/date-time-chip';
import { KebabMenu } from '../KebabMenu/KebabMenu.component';
import { TableEmptyState } from '../EmptyState/table-emptystate.component';
import { Pagination } from '../Pagination/pagination.component';
import { useApprovers } from './administrator.hook';

export const Approvers = () => {
  const {
    meta,
    title,
    loading,
    administrators,
    getAdminDetails,
    handleSearch,
    setParams,
  } = useApprovers();

  return (
    <div className="administrators">
      <TableLayout
        title={title}
        searchPlaceholder="Search by name"
        onSearch={handleSearch}
      >
        <TableV2 loading={loading} className="administrators__table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email Address</th>
              <th>Role</th>
              <th>Approver Index</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {administrators.map((admin) => {
              const {
                name,
                initial,
                avatar,
                email,
                role,
                createdAt,
                options,
                payrollApproverIndex,
              } = getAdminDetails(admin);

              return (
                <tr key={admin.id}>
                  <td>
                    <Identity
                      className="administrators__identity"
                      name={name}
                      image={avatar}
                      initial={initial}
                    />
                  </td>
                  <td>{email}</td>
                  <td>{role}</td>
                  <td>{payrollApproverIndex}</td>
                  <td>
                    <span className="administrators__last-table-column">
                      <DateTimeChip date={createdAt} />
                      {options.length && <KebabMenu items={options} />}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </TableV2>
      </TableLayout>
      {administrators.length < 1 && (
        <TableEmptyState
          text={
            loading ? 'Loading data...' : 'Payroll approvers will appear here'
          }
        />
      )}

      <div className="administrators__pagination">
        <Pagination meta={meta} refresh={setParams} />
      </div>
    </div>
  );
};
