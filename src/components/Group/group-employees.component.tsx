import { Employee } from 'src/api/types';
import { Util } from 'src/helpers/util';
import { KebabMenu } from '../KebabMenu/KebabMenu.component';
import { Table } from '../Table/Table.component';
import { useGroupEmployeeContext } from './hooks';

export type IGroupEmployees = {
  groupId?: string;
  addEmployee?(_id: string): Promise<unknown>;
  removeEmployee?(_id: string): Promise<unknown>;
};

export const GroupEmployees = (props: IGroupEmployees) => {
  const {
    selected,
    allChecked,
    handleCheckAllClick,
    paginationMeta,
    handleSelectAllClick,
    clearSelection,
    employees,
    selectAll,
    getCheckClickHandler,
    loading,
    updateParams,
    params,
    removeEmployees,
  } = useGroupEmployeeContext(props);

  return (
    <div className="group-employee-table">
      <Table
        headerRow={[
          <div key="name_th_content" className="d-flex gap-2">
            <input
              checked={allChecked}
              onChange={handleCheckAllClick}
              type="checkbox"
            />
            <span>Name</span>
          </div>,
        ]}
        emptyStateText={
          params.search
            ? 'No employees match your search'
            : 'No employees in group'
        }
        selectAllNoun="employees"
        title={`${Util.formatMoneyNumber(paginationMeta.total)} Employees`}
        kebabMenuItems={[
          { action: removeEmployees(selected), value: 'Delete' },
        ]}
        paginationMeta={paginationMeta}
        onSelectAll={handleSelectAllClick}
        onClearSelection={clearSelection}
        refreshV2={updateParams}
        allChecked={allChecked}
        isNotSelectable
        isEmpty={employees.length < 1}
        shouldClearSelection={selectAll}
        isLoading={loading}
      >
        {() => {
          return (
            <tbody>
              {employees.map((groupEmployee) => {
                const employee = groupEmployee.employee as Employee;

                return (
                  <tr key={groupEmployee.id}>
                    <td>
                      <div className="d-flex gap-2 align-items-center">
                        <input
                          checked={selected.includes(groupEmployee.id)}
                          onChange={getCheckClickHandler(groupEmployee.id)}
                          type="checkbox"
                        />

                        <span>
                          {employee.firstname} {employee.lastname}
                        </span>

                        <div className="ml-auto">
                          <KebabMenu
                            items={[
                              {
                                action: removeEmployees([employee.id]),
                                value: 'Delete',
                              },
                            ]}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          );
        }}
      </Table>
    </div>
  );
};
