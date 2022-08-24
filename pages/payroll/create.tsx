import { Button } from '@/components/Button/Button.component';
import { TotalCard } from '@/components/Card/total-card.component';
import { DatePicker } from '@/components/Input/date-picker.component';
import { InputV2 } from '@/components/Input/Input.component';
import { IF } from '@/components/Misc/if.component';
import { FileStorageSVG } from '@/components/svg';
import { CheckboxTableColumn } from '@/components/Table/check-box-table-col.component';
import { TableLayout } from '@/components/Table/table-layout.component';
import { TableV2 } from '@/components/Table/Table.component';
import { WalletBalanceChip } from '@/components/WalletBalanceChip/wallet-balance-chip.component';
import { NextPage } from 'next';
import { useState } from 'react';
import { Employee } from 'src/api/types';
import withAuth from 'src/helpers/HOC/withAuth';
import { useCreatePayrollPageLogic } from 'src/helpers/hooks/use-create-payroll-page-logic.hook';
import { Util } from 'src/helpers/util';
import DashboardLayoutV2 from 'src/layouts/dashboard-layout-v2/DashboardLayoutV2';

const CreatePayroll: NextPage = () => {
  const [search, setSearch] = useState('');
  const {
    setParams,
    hasEmployees,
    employees,
    loadingPayroll,
    loadingWalletBalance,
    currency,
    walletBalance,
    params,
    allExcluded,
    summaryUrl,
    headerRow,
    remittanceRows,
    onCheckall,
    onCheck,
    selected,
    totals,
    thisMoment,
    onEmployeeClick,
  } = useCreatePayrollPageLogic();

  return (
    <DashboardLayoutV2
      loading={loadingPayroll && !hasEmployees}
      title="Create payroll"
      href="/payroll"
    >
      <div className="create-payroll-page">
        <TableLayout
          title={
            <WalletBalanceChip
              title="Payroll"
              balance={walletBalance}
              currency={currency}
              loading={loadingWalletBalance}
            />
          }
          buttons={
            hasEmployees
              ? [
                  {
                    label: 'Proceed',
                    href: allExcluded ? '' : summaryUrl,
                    primary: true,
                    type: 'button',
                    disabled: allExcluded,
                    title: allExcluded
                      ? 'Select at least one employee to proceed'
                      : '',
                  },
                ]
              : []
          }
        >
          {hasEmployees ? (
            <>
              <div className="inputs">
                <InputV2
                  label="Cycle"
                  className="inputs__cycle"
                  type="number"
                  placeholder="Cycle"
                  defaultValue={params.cycle}
                  onChange={(event) =>
                    setParams({ cycle: +event.target.value })
                  }
                />
                <DatePicker
                  label="Prorate Month"
                  picker="month"
                  format={'MMMM/YYYY'}
                  className="inputs__prorate-month"
                  defaultValue={thisMoment
                    .clone()
                    .month(params.proRateMonth)
                    .year(params.year || thisMoment.year())}
                  onChange={(value) => {
                    if (value) {
                      setParams({
                        proRateMonth: value.format('MMMM'),
                        year: value.year(),
                      });
                    }
                  }}
                />
                <InputV2
                  label="Search"
                  className="inputs__search"
                  type="search"
                  placeholder="Search by Employee Name"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <TableV2
                className="payroll-create-table"
                loading={loadingPayroll}
              >
                <thead>
                  <tr>
                    <CheckboxTableColumn
                      checked={!selected.length}
                      onChange={onCheckall}
                      element="th"
                    >
                      Name
                    </CheckboxTableColumn>
                    <th>Salary ({currency})</th>
                    <th>Net Salary ({currency}) </th>
                    <IF condition={headerRow.has('bonuses')}>
                      <th>Bonuses ({currency})</th>
                    </IF>
                    <IF condition={headerRow.has('deductions')}>
                      <th>Deductions ({currency})</th>
                    </IF>
                    {remittanceRows.map((row) => {
                      return <th key={row}>{row}</th>;
                    })}
                  </tr>
                </thead>
                <tbody>
                  {employees
                    .filter(({ employee }) => {
                      const { firstname, lastname } = (employee ||
                        {}) as Employee;
                      const name = `${firstname} ${lastname}`;

                      return !search || name.toLowerCase().includes(search);
                    })
                    .map((e) => {
                      const employee = e.employee as Employee;

                      return (
                        <tr key={employee.id}>
                          <CheckboxTableColumn
                            checked={!selected.includes(employee.id)}
                            onChange={onCheck(employee.id)}
                            element="td"
                          >
                            <button
                              className="create-payroll-page__employee-name"
                              onClick={onEmployeeClick(e)}
                            >
                              {employee.firstname} {employee.lastname}
                            </button>
                          </CheckboxTableColumn>
                          <td>
                            {currency} {Util.formatMoneyNumber(e.salary)}
                          </td>
                          <td>
                            {currency} {Util.formatMoneyNumber(e.netSalary)}
                          </td>
                          <IF condition={headerRow.has('bonuses')}>
                            <td>
                              {currency}{' '}
                              {Util.formatMoneyNumber(
                                Util.sum(e.bonuses?.map((d) => d.amount) || []),
                              )}
                            </td>
                          </IF>
                          <IF condition={headerRow.has('deductions')}>
                            <td>
                              {currency}{' '}
                              {Util.formatMoneyNumber(
                                Util.sum(
                                  e.deductions?.map((d) => d.amount) || [],
                                ),
                              )}
                            </td>
                          </IF>
                          {remittanceRows.map((row) => {
                            const remittances = e.remittances || [];
                            const remittance = remittances.find(
                              (r) =>
                                r.name === row.replace(` (${currency})`, ''),
                            );

                            return (
                              <td key={`${employee.id}-${row}`}>
                                {currency}{' '}
                                {Util.formatMoneyNumber(
                                  remittance?.amount || 0,
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                </tbody>
              </TableV2>
            </>
          ) : (
            <div className="create-payroll-page__empty-state">
              <div className="create-payroll-page__empty-state__icon">
                <FileStorageSVG />
              </div>
              {loadingPayroll ? (
                <div className="create-payroll-page__empty-state__text">
                  Getting data....
                </div>
              ) : (
                <>
                  <div className="create-payroll-page__empty-state__text">
                    No details found.
                    <br /> Add employees to create payroll
                  </div>
                  <div className="create-payroll-page__empty-state__cta">
                    <Button
                      element="a"
                      href="/employees"
                      type="button"
                      label="Add Employee"
                      primary
                    />
                  </div>
                </>
              )}
            </div>
          )}
        </TableLayout>

        {hasEmployees && (
          <div className="create-payroll-page__totals">
            <div className="create-payroll-page__totals__items">
              {Object.keys(totals).map((key, i) => {
                return (
                  <TotalCard
                    key={key}
                    loading={loadingPayroll}
                    title={key}
                    type={i === 0 ? 'primary' : 'secondary'}
                    value={`${currency} ${Util.formatMoneyNumber(totals[key])}`}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </DashboardLayoutV2>
  );
};

export default withAuth(CreatePayroll, ['Payroll', 'write']);
