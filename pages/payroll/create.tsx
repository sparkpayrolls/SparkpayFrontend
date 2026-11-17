import { Button } from '@/components/Button/Button.component';
import { TotalCard } from '@/components/Card/total-card.component';
import { DatePicker } from '@/components/Input/date-picker.component';
import { InputV2 } from '@/components/Input/Input.component';
import { FileStorageSVG } from '@/components/svg';
import { TableLayout } from '@/components/Table/table-layout.component';
import type { PayrollAgGridRow } from '@/components/Payroll/payroll-employees-ag-grid.types';
import { WalletBalanceChip } from '@/components/WalletBalanceChip/wallet-balance-chip.component';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import withAuth from 'src/helpers/HOC/withAuth';
import { useCreatePayrollPageLogic } from 'src/helpers/hooks/use-create-payroll-page-logic.hook';
import { Util } from 'src/helpers/util';
import DashboardLayoutV2 from 'src/layouts/dashboard-layout-v2/DashboardLayoutV2';

const PayrollEmployeesAgGrid = dynamic(
  () =>
    import('@/components/Payroll/payroll-employees-ag-grid').then(
      (mod) => mod.PayrollEmployeesAgGrid,
    ),
  { ssr: false },
) as typeof import('@/components/Payroll/payroll-employees-ag-grid').PayrollEmployeesAgGrid;

const CreatePayroll: NextPage = () => {
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
    allUnchecked,
    handleEmployeeClick,
    handleSelectedIdsChange,
    handleSalaryChange,
    handleNetSalaryChange,
  } = useCreatePayrollPageLogic();

  const rows = useMemo<PayrollAgGridRow[]>(() => {
    return (payroll?.employees || []).map((e) => ({
      id: e.id,
      name: `${e.firstname} ${e.lastname}`,
      salary: e.salary,
      netSalary: e.netSalary,
      bonus: e.totalBonus || 0,
      deduction: e.totalDeductions || 0,
      tax: e.tax?.amount || 0,
      employerPension: (e.pension?.employerContribution as number) || 0,
      employeePension: (e.pension?.employeeContribution as number) || 0,
      voluntaryPension: (e.pension?.voluntaryPension as number) || 0,
      nhf: e.nhf?.amount || 0,
      nsitf: e.nsitf?.amount || 0,
      nhis: e.nhis?.amount || 0,
    }));
  }, [payroll?.employees]);

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
        >
          {hasEmployees ? (
            <PayrollEmployeesAgGrid
              mode="create"
              rows={rows}
              currency={currency}
              search={search}
              loading={loadingPayroll}
              selectedIds={params.checked}
              onSelectedIdsChange={handleSelectedIdsChange}
              onNameClick={(row) => {
                const employee = payroll?.employees.find((e) => e.id === row.id);
                if (employee) {
                  handleEmployeeClick(employee)();
                }
              }}
              onAddonClick={(row, type) => {
                const employee = payroll?.employees.find((e) => e.id === row.id);
                if (employee) {
                  handleEmployeeClick(employee, type)();
                }
              }}
              onSalaryChange={handleSalaryChange}
              onNetSalaryChange={handleNetSalaryChange}
              height="calc(100vh - 320px)"
            />
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
                  payroll?.totalSalary || 0,
                )}`}
              />

              <TotalCard
                loading={loadingPayroll}
                title={'Total Net Salary'}
                value={`${currency} ${Util.formatMoneyNumber(
                  payroll?.totalNetSalary || 0,
                )}`}
              />

              <TotalCard
                loading={loadingPayroll}
                title={'Total Bonus'}
                value={`${currency} ${Util.formatMoneyNumber(
                  payroll?.totalBonus || 0,
                )}`}
              />

              <TotalCard
                loading={loadingPayroll}
                title={'Total Deduction'}
                value={`${currency} ${Util.formatMoneyNumber(
                  payroll?.totalDeductions || 0,
                )}`}
              />

              <TotalCard
                loading={loadingPayroll}
                title={'Total Tax'}
                value={`${currency} ${Util.formatMoneyNumber(
                  payroll?.totalPayrollTax || 0,
                )}`}
              />

              <TotalCard
                loading={loadingPayroll}
                title={'Total Pension'}
                value={`${currency} ${Util.formatMoneyNumber(
                  payroll?.totalPayrollPension || 0,
                )}`}
              />

              <TotalCard
                loading={loadingPayroll}
                title={'Total NHF'}
                value={`${currency} ${Util.formatMoneyNumber(
                  payroll?.totalPayrollNHF || 0,
                )}`}
              />

              <TotalCard
                loading={loadingPayroll}
                title={'Total NSITF'}
                value={`${currency} ${Util.formatMoneyNumber(
                  payroll?.totalPayrollNSITF || 0,
                )}`}
              />

              <TotalCard
                loading={loadingPayroll}
                title={'Total NHIS'}
                value={`${currency} ${Util.formatMoneyNumber(
                  payroll?.totalPayrollNHIS || 0,
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
