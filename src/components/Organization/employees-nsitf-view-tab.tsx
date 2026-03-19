import { Util } from 'src/helpers/util';
import { InfoPopUp } from './salary-breakdown';
import Skeleton from 'react-loading-skeleton';
import { TableLayout } from '../Table/table-layout.component';
import { TableV2 } from '../Table/Table.component';
import { TableEmptyState } from '../EmptyState/table-emptystate.component';
import { Pagination } from '../Pagination/pagination.component';
import { InputV2 } from '../Input/Input.component';
import { StatusChip } from '../StatusChip/status-chip.component';
import { Switch } from 'antd';
import { useRemittanceEmployeesTabContext } from './organization-hooks';

export const EmployeesNSITFViewTab = () => {
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
            <InfoPopUp>Total amount of NSITF Remittance</InfoPopUp>
          </div>
          <p className="view-employees__tax__top-cont__info-md">
            {!Number.isFinite(data?.data?.totalPayrollNSITF) ? (
              <Skeleton width={150} />
            ) : (
              Util.formatMoneyString(currency)(data?.data?.totalPayrollNSITF)
            )}
          </p>
        </div>
        <div className="view-employees__tax__top-cont">
          <div className="view-employees__tax__top-cont__info">
            <div className="view-employees__tax__top-cont__info-sm">
              <p>Active NSITF Employees</p>
            </div>
            <InfoPopUp>Employees who are on NSITF remittance</InfoPopUp>
          </div>
          <p className="view-employees__tax__top-cont__info-md">
            {!Number.isFinite(data?.data?.nsitfEmployees) ? (
              <Skeleton width={150} />
            ) : (
              <>{Util.formatNumber(data?.data?.nsitfEmployees)} Employees</>
            )}
          </p>
        </div>
        <div className="view-employees__tax__top-cont">
          <div className="view-employees__tax__top-cont__info">
            <p className="view-employees__tax__top-cont__info-sm">
              Non Active NSITF Employees
            </p>
            <InfoPopUp>Employees who are not on NSITF remittance</InfoPopUp>
          </div>
          <p className="view-employees__tax__top-cont__info-md">
            {!Number.isFinite(data?.data?.nsitfEmployees) ? (
              <Skeleton width={150} />
            ) : (
              <>
                {Util.formatNumber(
                  (data?.meta?.total || 0) - (data?.data?.nsitfEmployees || 0),
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
        fixedHeader
      >
        <TableV2 loading={loading}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Salary</th>
              <th>NSITF</th>
              <th>NSITF ID</th>
              <th>BVN</th>
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
                    {Util.formatMoneyString(currency)(employee.nsitf?.amount)}
                  </td>

                  <td style={{ padding: 0 }}>
                    <InputV2
                      style={{ borderRadius: 0, background: 'transparent' }}
                      placeholder="Enter NSITF ID"
                      defaultValue={employee.nsitfId}
                      loading={employeeLoading[`${employee.id}_nsitfId`]}
                      disabled={employeeLoading[`${employee.id}_nsitfId`]}
                      onBlur={updateEmployee(employee, true, true)}
                      name="nsitfId"
                    />
                  </td>

                  <td style={{ padding: 0 }}>
                    <InputV2
                      style={{ borderRadius: 0, background: 'transparent' }}
                      placeholder="Enter BVN"
                      defaultValue={employee.bvn}
                      loading={employeeLoading[`${employee.id}_bvn`]}
                      disabled={employeeLoading[`${employee.id}_bvn`]}
                      name="bvn"
                      onBlur={updateEmployee(employee, true, true)}
                    />
                  </td>

                  <td>
                    <div style={{ display: 'flex', gap: '22px' }}>
                      <StatusChip
                        status={
                          (employee.nsitf?.amount || 0) > 0
                            ? 'Enabled'
                            : 'Disabled'
                        }
                      />

                      <Switch
                        className="organization-menu__dropdown__item__switch"
                        checked={(employee.nsitf?.amount || 0) > 0}
                        loading={
                          employeeLoading[`${employee.id}_statutoryDeductions`]
                        }
                        disabled={
                          employeeLoading[`${employee.id}_statutoryDeductions`]
                        }
                        onChange={updateStatus(employee, 'nsitf')}
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
