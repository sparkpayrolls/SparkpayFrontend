import Link from 'next/link';
import Image from 'next/image';
import withAuth from 'src/helpers/HOC/withAuth';
import DashboardLayout from 'src/layouts/dashboard-layout/DashBoardLayout';
import backicon from '../../../../public/svgs/back-icon.svg';
import { Table } from '@/components/Table/Table.component';
import { KebabMenu } from '@/components/KebabMenu/KebabMenu.component';
import { Util } from 'src/helpers/util';
import { useGroupEmployeesPageContext } from 'src/helpers/hooks/use-groupemployeespage-logic';

const GroupEmployeesPage = () => {
  const {
    groupId,
    paginationMeta,
    allChecked,
    params,
    selected,
    selectAll,
    employees,
    loading,
    handleCheckAllClick,
    addEmployees,
    handleSelectAllClick,
    clearSelection,
    updateParams,
    getCheckClickHandler,
  } = useGroupEmployeesPageContext();

  return (
    <DashboardLayout pageTitle="Group Employees">
      <div className="group-details">
        <div className="group-details__section">
          <div className="group-details__header-content">
            <div className="group-details__group-detail-title-section">
              <Link href={`/employees/groups/${groupId}`}>
                <a>
                  <Image
                    src={backicon}
                    alt="group-details-image"
                    className="group-details__prev-icon"
                  />
                </a>
              </Link>

              <h5 className="group-details__group-detail-title">
                Group Details
              </h5>
            </div>
          </div>

          <div className="group-details__add-employee-section mt-1">
            <div className="group-employee-table">
              <Table
                allowSearch
                title={`${Util.formatMoneyNumber(
                  paginationMeta.total,
                )} Employees`}
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
                    : 'No employees to add to group'
                }
                selectAllNoun="employees"
                kebabMenuItems={[
                  { action: addEmployees(selected), value: 'Add' },
                ]}
                onSelectAll={handleSelectAllClick}
                onClearSelection={clearSelection}
                refreshV2={updateParams}
                allChecked={allChecked}
                shouldClearSelection={selectAll}
                paginationMeta={paginationMeta}
                isEmpty={employees.length < 1}
                isLoading={loading}
                isNotSelectable
              >
                {() => {
                  return (
                    <tbody>
                      {employees.map((employee) => {
                        return (
                          <tr key={employee.id}>
                            <td>
                              <div className="d-flex gap-2 align-items-center">
                                <input
                                  checked={selected.includes(employee.id)}
                                  onChange={getCheckClickHandler(employee.id)}
                                  type="checkbox"
                                />

                                <span>
                                  {employee.firstname} {employee.lastname}
                                </span>

                                <div className="ml-auto">
                                  <KebabMenu
                                    items={[
                                      {
                                        action: addEmployees([employee.id]),
                                        value: 'Add',
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
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default withAuth(GroupEmployeesPage, ['Employee', 'read']);
