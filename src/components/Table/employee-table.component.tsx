import NiceModal from '@ebay/nice-modal-react';
import { useEffect, useState } from 'react';
import { Util } from 'src/helpers/util';
import withPermission from 'src/helpers/HOC/withPermission';
import { DateTimeChip } from '../DateTimeChip/date-time-chip';
import { StatusChip } from '../StatusChip/status-chip.component';
import { IKebabItem, KebabMenu } from '../KebabMenu/KebabMenu.component';
import { IEmployeeTable } from '../types';
import { Table, TR } from './Table.component';
import { Employee, Group } from 'src/api/types';
import Link from 'next/link';
import { EditEmployeeDetailsModal } from '../Modals/EditDetailsModal.component';
import { getEmployeeEditSubmitHandler } from 'src/helpers/methods';

export const EmployeeTable = (props: IEmployeeTable) => {
  const {
    employees,
    paginationMeta,
    getEmployees,
    // onFilter,
    loading,
    onStatusToggle,
    onDelete,
    administrator,
    onSendOnboardingLink,
  } = props;
  const [selected, setSelected] = useState<string[]>([]);
  const allChecked =
    !!selected.length &&
    employees.every((employee) => selected.includes(employee.id));
  const currency = Util.getCurrencySymbolFromAdministrator(administrator);
  const hasWriteAccess = Util.canActivate(
    [['Employee', 'write']],
    administrator,
  );

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
    if (employees.every((e) => selected.includes(e.id))) {
      setSelected([]);
      return;
    }

    setSelected(employees.map((e) => e.id));
  };

  const kebabMenu = hasWriteAccess
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
        {
          action: () => onSendOnboardingLink(selected),
          value: 'Resend onboarding link',
        },
      ]
    : undefined;

  const employeeKebabMenu = (employee: Employee) => {
    const { id, status } = employee;

    const menu: IKebabItem[] = [
      {
        href: `/employees/${employee.id}`,
        value: 'View',
      },
    ];
    if (hasWriteAccess) {
      menu.push(
        {
          action: () => {
            NiceModal.show(EditEmployeeDetailsModal, {
              administrator,
              employee,
              onSubmit: getEmployeeEditSubmitHandler(employee.id, getEmployees),
            });
          },
          value: 'Edit',
        },
        {
          action: () => kebabHandler('Delete')(id),
          value: 'Delete',
        },
        {
          action: () =>
            kebabHandler(status === 'active' ? 'Deactivate' : 'Activate')(id),
          value: status === 'active' ? 'Deactivate' : 'Activate',
        },
        {
          action: () => onSendOnboardingLink(id),
          value: 'Resend onboarding link',
        },
      );
    }

    return menu;
  };

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
          `Amount`,
          'Status',
          'Group',
          'Date\xa0Added',
        ]}
        allChecked={allChecked}
        onCheckAllClick={onCheckAll}
        paginationMeta={paginationMeta}
        refresh={getEmployees}
        title={`${paginationMeta.total}\xa0Employee${
          paginationMeta.total > 1 ? 's' : ''
        }`}
        // onFilterClick={onFilter}
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
                      <Link href={`/employees/${employee.id}`}>
                        <a>
                          {employee.firstname} {employee.lastname}
                        </a>
                      </Link>
                    </td>
                    <td>
                      <span className="email" title={employee.email}>
                        {employee.email}
                      </span>
                    </td>
                    <td>
                      {currency} {Util.formatMoneyNumber(employee.salary)}
                    </td>
                    <td>
                      <StatusChip status={employee.status} />
                    </td>
                    <td>
                      {employee.groups
                        .map(
                          (employeeGroup) =>
                            (employeeGroup.group as Group).name,
                        )
                        .join(', ')}
                    </td>
                    <td>
                      <span className="d-flex justify-content-space-between align-items-center">
                        <DateTimeChip
                          date={employee.createdAt}
                          dateFormat={'MMM\xa0DD,\xa0YYYY'}
                        />
                        <KebabWithPermissions
                          items={employeeKebabMenu(employee)}
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
