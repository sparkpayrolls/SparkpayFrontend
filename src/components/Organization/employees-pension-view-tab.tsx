import { Util } from 'src/helpers/util';
import { InfoPopUp } from './salary-breakdown';
import Skeleton from 'react-loading-skeleton';
import { TableLayout } from '../Table/table-layout.component';
import { TableV2 } from '../Table/Table.component';
import { TableEmptyState } from '../EmptyState/table-emptystate.component';
import { Pagination } from '../Pagination/pagination.component';
import { InputV2 } from '../Input/Input.component';
import { SelectInput } from '../Input/seletct-input';
import { StatusChip } from '../StatusChip/status-chip.component';
import { Switch } from 'antd';
import { useRemittanceEmployeesTabContext } from './organization-hooks';
import { usePFAs } from 'src/helpers/hooks/use-org-details';

export const EmployeesPensionViewTab = () => {
  const { pfas } = usePFAs();
  const {
    updateStatus,
    updateEmployee,
    handleSearch,
    isEmpty,
    currency,
    employeeLoading,
    loading,
    data,
    setParams,
  } = useRemittanceEmployeesTabContext();

  return (
    <div className="view-employees__tax">
      <div className="view-employees__tax__top">
        <div className="view-employees__tax__top-cont">
          <div className="view-employees__tax__top-cont__info">
            <p className="view-employees__tax__top-cont__info-sm">
              Total Remittance Amount
            </p>
            <InfoPopUp>Total amount of Pension Remittance</InfoPopUp>
          </div>
          <p className="view-employees__tax__top-cont__info-md">
            {!Number.isFinite(
              data?.data?.payrollTotalsByCountry?.NG?.totalPayrollPension,
            ) ? (
              <Skeleton width={150} />
            ) : (
              Util.formatMoneyString(currency)(
                data?.data?.payrollTotalsByCountry?.NG?.totalPayrollPension,
              )
            )}
          </p>
        </div>
        <div className="view-employees__tax__top-cont">
          <div className="view-employees__tax__top-cont__info">
            <div className="view-employees__tax__top-cont__info-sm">
              <p>Active Pension Employees</p>
            </div>
            <InfoPopUp>Employees who are on Pension remittance</InfoPopUp>
          </div>
          <p className="view-employees__tax__top-cont__info-md">
            {!Number.isFinite(data?.data?.pensionEmployees) ? (
              <Skeleton width={150} />
            ) : (
              <>{Util.formatNumber(data?.data?.pensionEmployees)} Employees</>
            )}
          </p>
        </div>
        <div className="view-employees__tax__top-cont">
          <div className="view-employees__tax__top-cont__info">
            <p className="view-employees__tax__top-cont__info-sm">
              Non Active Pension Employees
            </p>
            <InfoPopUp>Employees who are not on Pension remittance</InfoPopUp>
          </div>
          <p className="view-employees__tax__top-cont__info-md">
            {!Number.isFinite(data?.data?.pensionEmployees) ? (
              <Skeleton width={150} />
            ) : (
              <>
                {Util.formatNumber(
                  (data?.meta?.total || 0) -
                    (data?.data?.pensionEmployees || 0),
                )}{' '}
                Employees
              </>
            )}
          </p>
        </div>
      </div>

      <TableLayout
        title={
          !Number.isFinite(data?.meta?.total) ? (
            <Skeleton width={150} />
          ) : (
            <span className="view-employees__tax__mid-text">
              {data?.meta?.total} Employees
            </span>
          )
        }
        searchPlaceholder="Search by name"
        onSearch={handleSearch}
        // onFilter={() => {}}
        // filterButtonClassName="view-employees__tax__mid__filter__action"
        fixedHeader
      >
        <TableV2 loading={loading}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Salary</th>
              <th>Employer Contribution</th>
              <th>Employee Contribution</th>
              <th>Voluntary Contribution</th>
              <th>Pension ID</th>
              <th>PFA</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {data?.data?.employees?.map((employee) => {
              return (
                <tr key={employee.id}>
                  <td className="white-space-nowrap">
                    {employee.firstname} {employee.lastname}
                  </td>

                  <td>{Util.formatMoneyString(currency)(employee.salary)}</td>

                  <td>
                    {Util.formatMoneyString(currency)(
                      employee.pension?.employerContribution,
                    )}
                  </td>

                  <td>
                    {Util.formatMoneyString(currency)(
                      employee.pension?.employeeContribution,
                    )}
                  </td>

                  <td style={{ padding: 0 }}>
                    <InputV2
                      style={{ borderRadius: 0, background: 'transparent' }}
                      placeholder="Enter Contribution"
                      defaultValue={employee.voluntaryPensionContribution}
                      type="number"
                      min={0}
                      loading={
                        employeeLoading[
                          `${employee.id}_voluntaryPensionContribution`
                        ]
                      }
                      disabled={
                        employeeLoading[
                          `${employee.id}_voluntaryPensionContribution`
                        ]
                      }
                      onBlur={updateEmployee(employee, true)}
                      name="voluntaryPensionContribution"
                    />
                  </td>

                  <td style={{ padding: 0 }}>
                    <InputV2
                      style={{ borderRadius: 0, background: 'transparent' }}
                      placeholder="Enter Pension ID"
                      defaultValue={employee.pensionId}
                      loading={employeeLoading[`${employee.id}_pensionId`]}
                      disabled={employeeLoading[`${employee.id}_pensionId`]}
                      onBlur={updateEmployee(employee)}
                      name="pensionId"
                    />
                  </td>

                  <td style={{ padding: 0 }}>
                    <SelectInput
                      showSearch="Search PFAs"
                      placeholder="Select PFA"
                      selected={{ id: employee.pfa }}
                      options={pfas}
                      displayValue="name"
                      actualValue="id"
                      selectorStyle={{ background: 'none', borderRadius: 0 }}
                      loading={employeeLoading[`${employee.id}_pfa`]}
                      name="pfa"
                      onBlur={updateEmployee(employee, false, true)}
                    />
                  </td>

                  <td>
                    <div style={{ display: 'flex', gap: '22px' }}>
                      <StatusChip
                        status={
                          (employee.pension?.amount || 0) > 0
                            ? 'Enabled'
                            : 'Disabled'
                        }
                      />

                      <Switch
                        className="organization-menu__dropdown__item__switch"
                        checked={(employee.pension?.amount || 0) > 0}
                        loading={
                          employeeLoading[`${employee.id}_statutoryDeductions`]
                        }
                        disabled={
                          employeeLoading[`${employee.id}_statutoryDeductions`]
                        }
                        onChange={updateStatus(employee, 'pension')}
                      />
                    </div>
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
            loading
              ? 'Getting employees...'
              : 'Your remittance employees will appear here.'
          }
        />
      )}

      <Pagination refresh={setParams} meta={data?.meta} />
    </div>
  );
};
