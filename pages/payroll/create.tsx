import { Button } from '@/components/Button/Button.component';
import { TotalCard } from '@/components/Card/total-card.component';
import { DatePicker } from '@/components/Input/date-picker.component';
import { InputV2 } from '@/components/Input/Input.component';
import { FileStorageSVG } from '@/components/svg';
import { CheckboxTableColumn } from '@/components/Table/check-box-table-col.component';
import { TableLayout } from '@/components/Table/table-layout.component';
import { TableV2 } from '@/components/Table/Table.component';
import { WalletBalanceChip } from '@/components/WalletBalanceChip/wallet-balance-chip.component';
import { NextPage } from 'next';
import { useRef } from 'react';
import withAuth from 'src/helpers/HOC/withAuth';
import { useCreatePayrollPageLogic } from 'src/helpers/hooks/use-create-payroll-page-logic.hook';
import { Util } from 'src/helpers/util';
import DashboardLayoutV2 from 'src/layouts/dashboard-layout-v2/DashboardLayoutV2';

const CreatePayroll: NextPage = () => {
  const ref = useRef<HTMLDivElement>(null);
  const {
    currency,
    payroll,
    loadingPayroll,
    walletBalance,
    loadingWalletBalance,
    search,
    setSearch,
    summaryUrl,
    hasEmployees,
    params,
    setParams,
    thisMoment,
    allChecked,
    handleCheck,
    handleCheckAll,
    allUnchecked,
    handleEmployeeClick,
  } = useCreatePayrollPageLogic();

  const table = (
    <div
      className="min-h-[calc(100% + 128px)]"
      style={{
        minHeight: ref.current
          ? `${ref.current.offsetHeight + 148}px`
          : 'calc(100% + 128px)',
      }}
    >
      <div ref={ref}>
        <TableV2 className="payroll-create-table" loading={loadingPayroll}>
          <thead>
            <tr>
              <CheckboxTableColumn
                checked={allChecked}
                onChange={handleCheckAll}
                element="th"
              >
                Name
              </CheckboxTableColumn>
              <th>Salary</th>
              <th>Net Salary</th>
              <th>Bonus</th>
              <th>Deduction</th>
              <th>Tax</th>
              <th>Employer Pension</th>
              <th>Employee Pension</th>
              <th>Voluntary Pension</th>
              <th>NHF</th>
              <th>NSITF</th>
              <th>NHIS</th>
            </tr>
          </thead>
          <tbody>
            {payroll?.employees
              .filter(({ firstname, lastname }) => {
                const name = `${firstname} ${lastname}`;

                return !search || name.toLowerCase().includes(search);
              })
              .map((e) => {
                return (
                  <tr key={e.id}>
                    <CheckboxTableColumn
                      checked={params.checked.includes(e.id)}
                      onChange={handleCheck(e.id)}
                      element="td"
                    >
                      <button
                        className="create-payroll-page__employee-name"
                        onClick={handleEmployeeClick(e)}
                      >
                        {e.firstname} {e.lastname}
                      </button>
                    </CheckboxTableColumn>
                    <td>
                      {currency} {Util.formatMoneyNumber(e.salary)}
                    </td>
                    <td>
                      {currency} {Util.formatMoneyNumber(e.netSalary)}
                    </td>
                    <td>
                      {currency} {Util.formatMoneyNumber(e.totalBonus)}
                    </td>
                    <td>
                      {currency} {Util.formatMoneyNumber(e.totalDeductions)}
                    </td>
                    <td>
                      {currency} {Util.formatMoneyNumber(e.tax?.amount || 0)}
                    </td>
                    <td>
                      {currency}{' '}
                      {Util.formatMoneyNumber(
                        e.pension?.employerContribution as number,
                      )}
                    </td>
                    <td>
                      {currency}{' '}
                      {Util.formatMoneyNumber(
                        e.pension?.employeeContribution as number,
                      )}
                    </td>
                    <td>
                      {currency}{' '}
                      {Util.formatMoneyNumber(
                        e.pension?.voluntaryPension as number,
                      )}
                    </td>
                    <td>
                      {currency} {Util.formatMoneyNumber(e.nhf?.amount || 0)}
                    </td>
                    <td>
                      {currency} {Util.formatMoneyNumber(e.nsitf?.amount || 0)}
                    </td>
                    <td>
                      {currency} {Util.formatMoneyNumber(e.nhis?.amount || 0)}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </TableV2>
      </div>
    </div>
  );

  return (
    <DashboardLayoutV2
      loading={loadingPayroll}
      title="Create payroll"
      href="/payroll"
    >
      <div
        className="create-payroll-page"
        style={{ height: '100%', overflowY: 'hidden' }}
      >
        <TableLayout
          title={
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '100%',
                  alignItems: 'center',
                }}
              >
                <WalletBalanceChip
                  title="Payroll"
                  balance={walletBalance}
                  currency={currency}
                  loading={loadingWalletBalance}
                />

                {hasEmployees && (
                  <Button
                    label={'Proceed'}
                    href={summaryUrl}
                    element={'a'}
                    primary
                    disabled={allUnchecked}
                    type="button"
                    title={
                      allUnchecked
                        ? 'Select at least one employee to proceed'
                        : ''
                    }
                  />
                )}
              </div>

              <div className="inputs">
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
                        ...params,
                        proRateMonth: value.format('MMMM'),
                        year: value.year(),
                      });
                    }
                  }}
                />
                <InputV2
                  label="Cycles"
                  type="number"
                  placeholder="Cycles"
                  value={String(params.cycles || 1)}
                  style={{ maxWidth: '100px' }}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    const cycles = Number.isFinite(val) && val >= 1 ? val : 1;
                    setParams({
                      ...params,
                      cycles,
                      currentCycle: Math.min(params.currentCycle, cycles),
                    });
                  }}
                />
                <InputV2
                  label="Current Cycle"
                  type="number"
                  placeholder="Current"
                  value={String(params.currentCycle || 1)}
                  style={{ maxWidth: '100px' }}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    setParams({
                      ...params,
                      currentCycle:
                        Number.isFinite(val) && val >= 1
                          ? Math.min(val, params.cycles)
                          : 1,
                    });
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
            </div>
          }
          fixedTitle
          fixedHeader={table}
        >
          {hasEmployees ? (
            table
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
              <TotalCard
                loading={loadingPayroll}
                title={'Total Salary'}
                type="primary"
                value={`${currency} ${Util.formatMoneyNumber(
                  payroll?.totalSalary,
                )}`}
              />

              <TotalCard
                loading={loadingPayroll}
                title={'Total Net Salary'}
                value={`${currency} ${Util.formatMoneyNumber(
                  payroll?.totalNetSalary,
                )}`}
              />

              <TotalCard
                loading={loadingPayroll}
                title={'Total Bonus'}
                value={`${currency} ${Util.formatMoneyNumber(
                  payroll?.totalBonus,
                )}`}
              />

              <TotalCard
                loading={loadingPayroll}
                title={'Total Deduction'}
                value={`${currency} ${Util.formatMoneyNumber(
                  payroll?.totalDeductions,
                )}`}
              />

              <TotalCard
                loading={loadingPayroll}
                title={'Total Tax'}
                value={`${currency} ${Util.formatMoneyNumber(
                  payroll?.totalPayrollTax,
                )}`}
              />

              <TotalCard
                loading={loadingPayroll}
                title={'Total Pension'}
                value={`${currency} ${Util.formatMoneyNumber(
                  payroll?.totalPayrollPension,
                )}`}
              />

              <TotalCard
                loading={loadingPayroll}
                title={'Total NHF'}
                value={`${currency} ${Util.formatMoneyNumber(
                  payroll?.totalPayrollNHF,
                )}`}
              />

              <TotalCard
                loading={loadingPayroll}
                title={'Total NSITF'}
                value={`${currency} ${Util.formatMoneyNumber(
                  payroll?.totalPayrollNSITF,
                )}`}
              />

              <TotalCard
                loading={loadingPayroll}
                title={'Total NHIS'}
                value={`${currency} ${Util.formatMoneyNumber(
                  payroll?.totalPayrollNHIS,
                )}`}
              />
            </div>
          </div>
        )}
      </div>
    </DashboardLayoutV2>
  );
};

export default withAuth(CreatePayroll, ['Payroll', 'write']);
