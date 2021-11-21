import { useEffect, useState } from 'react';
import { Util } from 'src/helpers/util';
import withPermission from 'src/helpers/HOC/withPermission';
import { DateTimeChip } from '../DateTimeChip/date-time-chip';
import { StatusChip } from '../StatusChip/status-chip.component';
import { KebabMenu } from '../KebabMenu/KebabMenu.component';
import { IEmployeeTable } from '../types';
import { Table, TR } from './Table.component';

export const EmployeeTable = (props: IEmployeeTable) => {
  const {
    employees,
    paginationMeta,
    getEmployees,
    onFilter,
    loading,
    onStatusToggle,
    onDelete,
    administrator,
  } = props;
  const [selected, setSelected] = useState<string[]>([]);
  const allChecked =
    !!selected.length &&
    employees.every((employee) => selected.includes(employee.id));
  const currency = Util.getCurrencySymbolFromAdministrator(administrator);

  const kebabHandler = (action: 'Delete' | 'Activate' | 'Deactivate') => {
    switch (action) {
      case 'Activate':
      case 'Deactivate': {
        return onStatusToggle(action);
      }
      default:
        return onDelete;
    }
  };

  const onEmployeeSelect = (id: string) => {
    return () => {
      if (selected.includes(id)) {
        setSelected(selected.filter((sel) => sel !== id));
        return;
      }

      setSelected([...selected, id]);
    };
  };

  const onCheckAll = () => {
    setSelected(employees.map((e) => e.id));
  };

  const kebabMenu = Util.canActivate([['Employee', 'write']], administrator)
    ? [
        { action: () => kebabHandler('Delete')(selected), value: 'Delete' },
        {
          action: () => kebabHandler('Activate')(selected),
          value: 'Activate',
        },
        {
          action: () => kebabHandler('Deactivate')(selected),
          value: 'Deactivate',
        },
      ]
    : undefined;

  const employeeKebabMenu = (id: string, status: string) => [
    {
      action: () => kebabHandler('Delete')(id),
      value: 'Delete',
    },
    {
      action: () =>
        kebabHandler(status === 'active' ? 'Deactivate' : 'Activate')(id),
      value: status === 'active' ? 'Deactivate' : 'Activate',
    },
  ];

  const KebabWithPermissions = withPermission(KebabMenu, ['Employee', 'write']);

  useEffect(() => {
    const ids = employees.map((employee) => employee.id);

    setSelected((i) => i.filter((s) => ids.includes(s)));
  }, [employees]);

  return (
    <div className="employee-table">
      <Table
        headerRow={[
          'Name',
          'Email\xa0Address',
          `Amount\xa0(${currency})`,
          'Status',
          'Group',
          'Date\xa0Added',
        ]}
        allChecked={allChecked}
        onCheckAllClick={onCheckAll}
        paginationMeta={paginationMeta}
        refresh={getEmployees}
        title={`${paginationMeta.total}\xa0Employee(s)`}
        onFilterClick={onFilter}
        isEmpty={!employees.length}
        emptyStateText="No employee yet"
        isLoading={loading}
        kebabMenuItems={kebabMenu}
      >
        {() => {
          return (
            <tbody>
              {employees.map((employee) => {
                return (
                  <TR
                    key={employee.id}
                    checked={selected.includes(employee.id)}
                    onChange={onEmployeeSelect(employee.id)}
                  >
                    <td>
                      {employee.firstname} {employee.lastname}
                    </td>
                    <td>
                      <span className="email" title={employee.email}>
                        {employee.email}
                      </span>
                    </td>
                    <td>{employee.salary}</td>
                    <td>
                      <StatusChip status={employee.status} />
                    </td>
                    <td>
                      {employee.groups
                        .map((employeeGroup) => employeeGroup.group.name)
                        .join(', ')}
                    </td>
                    <td>
                      <span className="d-flex justify-content-space-between align-items-center">
                        <DateTimeChip
                          date={employee.createdAt}
                          dateFormat={'MMM\xa0DD,\xa0YYYY'}
                        />
                        <KebabWithPermissions
                          items={employeeKebabMenu(
                            employee.id,
                            employee.status,
                          )}
                        />
                      </span>
                    </td>
                  </TR>
                );
              })}
            </tbody>
          );
        }}
      </Table>
    </div>
  );
};
