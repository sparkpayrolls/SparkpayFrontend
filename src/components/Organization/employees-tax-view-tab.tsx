import React, { useEffect, useState } from 'react';
import { $api } from 'src/api';
import { PaginateParams } from 'src/api/types';
import { Util } from 'src/helpers/util';
import { toast } from 'react-toastify';
import { useAppSelector } from 'src/redux/hooks';
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

function EmployeesTaxViewTab() {
  const administrator = useAppSelector((state) => state.administrator);
  const [params, setParams] = useState<PaginateParams>({});
  // eslint-disable-next-line no-undef
  const [data, setData] = useState<Awaited<
    ReturnType<typeof $api.payroll.getRemittanceEmployees>
  > | null>(null);
  const [loading, setLoading] = useState(true);
  const currency = Util.getCurrencySymbolFromAdministrator(administrator);
  const isEmpty = (data?.meta?.total || 0) <= 0;

  useEffect(() => {
    setLoading(true);
    $api.payroll
      .getRemittanceEmployees(params)
      .then(setData)
      .catch((error) => {
        Util.onNonAuthError(error, (httpError) => {
          toast.error(httpError.message);
        });
      })
      .finally(() => setLoading(false));
  }, [params]);

  return (
    <div className="view-employees__tax">
      <div className="view-employees__tax__top">
        <div className="view-employees__tax__top-cont">
          <div className="view-employees__tax__top-cont__info">
            <p className="view-employees__tax__top-cont__info-sm">
              Total Amount Remittance
            </p>
            <InfoPopUp>Total amount of tax remited to employees</InfoPopUp>
          </div>
          <p className="view-employees__tax__top-cont__info-md">
            {!Number.isFinite(data?.data?.totalPayrollTax) ? (
              <Skeleton width={150} />
            ) : (
              Util.formatMoneyString(currency)(data?.data?.totalPayrollTax)
            )}
          </p>
        </div>
        <div className="view-employees__tax__top-cont">
          <div className="view-employees__tax__top-cont__info">
            <div className="view-employees__tax__top-cont__info-sm">
              <p>Active Tax Employees</p>
            </div>
            <InfoPopUp>Employees who are on tax remittances</InfoPopUp>
          </div>
          <p className="view-employees__tax__top-cont__info-md">
            {!Number.isFinite(data?.data?.taxEmployees) ? (
              <Skeleton width={150} />
            ) : (
              <>{Util.formatNumber(data?.data?.taxEmployees)} Employees</>
            )}
          </p>
        </div>
        <div className="view-employees__tax__top-cont">
          <div className="view-employees__tax__top-cont__info">
            <p className="view-employees__tax__top-cont__info-sm">
              Non Active Tax Employees
            </p>
            <InfoPopUp>Employees who are not on tax remittances</InfoPopUp>
          </div>
          <p className="view-employees__tax__top-cont__info-md">
            {!Number.isFinite(data?.data?.taxEmployees) ? (
              <Skeleton width={150} />
            ) : (
              <>
                {Util.formatNumber(
                  (data?.data?.taxEmployees || 0) - (data?.meta?.total || 0),
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
        onSearch={(search) => {
          setParams({ ...params, search });
        }}
        // onFilter={() => {}}
        // filterButtonClassName="view-employees__tax__mid__filter__action"
        fixedHeader
      >
        <TableV2 loading={loading}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Salary</th>
              <th>Tax</th>
              <th>Tax ID</th>
              <th>Tax State</th>
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
                    {Util.formatMoneyString(currency)(employee.tax?.amount)}
                  </td>

                  <td style={{ padding: 0 }}>
                    <InputV2
                      style={{ borderRadius: 0, background: 'transparent' }}
                      placeholder="Enter Tax ID"
                      defaultValue={employee.taxId}
                    />
                  </td>

                  <td style={{ padding: 0 }}>
                    <SelectInput
                      options={['Abuja']}
                      showSearch="Search States"
                      placeholder="Select State"
                      selectorStyle={{ background: 'none', borderRadius: 0 }}
                      value={employee.taxState}
                    />
                  </td>

                  <td style={{ padding: 0 }}>
                    <InputV2
                      style={{ borderRadius: 0, background: 'transparent' }}
                      placeholder="Enter BVN"
                      defaultValue={employee.bvn}
                    />
                  </td>

                  <td>
                    <div style={{ display: 'flex', gap: '22px' }}>
                      <StatusChip
                        status={
                          (employee.tax?.amount || 0) > 0
                            ? 'Enabled'
                            : 'Disabled'
                        }
                      />

                      <Switch
                        className="organization-menu__dropdown__item__switch"
                        checked={(employee.tax?.amount || 0) > 0}
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
}

export default EmployeesTaxViewTab;
