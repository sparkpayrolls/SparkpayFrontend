import type { NextPage } from 'next';
import { TableLayout } from '@/components/Table/table-layout.component';
import { TotalCard } from '@/components/Card/total-card.component';
import { Util } from 'src/helpers/util';
import { useAppSelector } from 'src/redux/hooks';
import { useCallback, useEffect, useState } from 'react';
import DashboardLayoutV2 from 'src/layouts/dashboard-layout-v2/DashboardLayoutV2';
import { WalletBalanceChip } from '@/components/WalletBalanceChip/wallet-balance-chip.component';
import { StatusChip } from '@/components/StatusChip/status-chip.component';
import { DateTimeChip } from '@/components/DateTimeChip/date-time-chip';
import { SinglePayrollDetail } from '@/components/Payroll/single-payroll-detail.component';
import { $api } from 'src/api';
import { TotalPayrollChip } from '@/components/Payroll/total-payroll-chip.component';
import { useRouter } from 'next/router';
import withAuth from 'src/helpers/HOC/withAuth';
import { NotFound } from '@/components/Misc/not-found.component';
import {
  Employee,
  Payroll,
  PayrollEmployee,
  PayrollStatus,
} from 'src/api/types';
import { HttpError } from 'src/api/repo/http.error';
import { TableV2 } from '@/components/Table/Table.component';
import { TableEmptyState } from '@/components/EmptyState/table-emptystate.component';
import { IF } from '@/components/Misc/if.component';

const PayDetails: NextPage = () => {
  const router = useRouter();
  const administrator = useAppSelector((state) => state.administrator);
  const [walletBalance, setWalletBalance] = useState(0);
  const [apiCalls, setApiCalls] = useState(0);
  const [payrollNotFound, setPayrollNotFound] = useState(false);
  const [payroll, setPayroll] = useState<Payroll | null>(null);
  const [employees, setEmployees] = useState<PayrollEmployee[]>([]);

  const currency = Util.getCurrencySymbolFromAdministrator(administrator);
  const totals: Record<string, number> = {
    'Total Salary Amount': 0,
    'Total Net Salary': 0,
  };
  const headerRow: string[] = [];
  const loading = apiCalls > 0;
  const hasEmployees = !!employees.length;
  const payrollId = router.query.id as string;

  employees.forEach((employee) => {
    totals['Total Salary Amount'] += employee.salary;
    totals['Total Net Salary'] += employee.netSalary;
    if (employee.deductions && employee.deductions.length) {
      totals['Total Deductions'] = totals['Total Deductions'] || 0;
      totals['Total Deductions'] += Util.sum(
        employee.deductions.map((d) => d.amount),
      );
    }
    if (employee.bonuses && employee.bonuses.length) {
      totals['Total Bonuses'] = totals['Total Bonuses'] || 0;
      totals['Total Bonuses'] += Util.sum(
        employee.bonuses.map((d) => d.amount),
      );
    }
  });

  employees.forEach((e) => {
    const deductionRow = `Deductions (${currency})`;
    const bonusRow = `Bonuses (${currency})`;
    if (e.deductions?.length && !headerRow.includes(deductionRow)) {
      headerRow.push(deductionRow);
    }
    if (e.bonuses?.length && !headerRow.includes(bonusRow)) {
      headerRow.push(bonusRow);
    }
  });

  const getCompanyWallet = useCallback(async () => {
    try {
      setApiCalls((c) => c + 1);
      const wallet = await $api.payroll.getCompanyWallet();

      setWalletBalance(wallet.balance);
    } catch (error) {
      // ...
    } finally {
      setApiCalls((c) => c - 1);
    }
  }, [setWalletBalance]);

  const getPayroll = useCallback(async () => {
    try {
      setApiCalls((c) => c + 1);
      const payroll = await $api.payroll.getById(payrollId);
      setPayroll(payroll);
    } catch (error) {
      const err = error as HttpError;
      if (err.status === 400) {
        setPayrollNotFound(true);
      }
    } finally {
      setApiCalls((c) => c - 1);
    }
  }, [setPayroll, payrollId]);

  const getPayrollEmployees = useCallback(async () => {
    try {
      setApiCalls((c) => c + 1);
      const { data } = await $api.payroll.getPayrollEmployees(payrollId, {
        all: true,
      });
      setEmployees(data);
    } catch (error) {
      // ...
    } finally {
      setApiCalls((c) => c - 1);
    }
  }, [payrollId, setEmployees]);

  useEffect(() => {
    getCompanyWallet();
    getPayroll();
    getPayrollEmployees();
  }, [getCompanyWallet, getPayroll, getPayrollEmployees, administrator]);

  return (
    <DashboardLayoutV2 title="Payroll details" href="/payroll">
      {payrollNotFound && <NotFound message={`Payroll not found`} />}
      {!payrollNotFound && (
        <>
          <div className=" payroll-details-section">
            <div className=" payroll-details-section__back-icon">
              <div className="payroll-details-section__payroll-details-header">
                <WalletBalanceChip
                  title="Payroll Details"
                  balance={walletBalance}
                  currency={currency}
                  loading={loading && walletBalance <= 0}
                />

                <TotalPayrollChip
                  amount={payroll?.totalAmount || 0}
                  currency={currency}
                  loading={loading && !payroll}
                />
              </div>
              <div className="payroll-details-section__payroll-settings-details">
                <div className="employee-details__employee-settings-flex">
                  <SinglePayrollDetail
                    title="Payroll Size"
                    details={payroll?.size}
                    loading={loading && !payroll}
                  />
                  <SinglePayrollDetail
                    title="Fee"
                    loading={loading && !payroll}
                    details={
                      payroll && (
                        <>
                          {currency} {payroll?.fee}
                        </>
                      )
                    }
                  />
                  <SinglePayrollDetail
                    title="Date Created"
                    loading={loading && !payroll}
                    details={
                      payroll && (
                        <DateTimeChip
                          textSize="text-large"
                          date={payroll.createdAt}
                        />
                      )
                    }
                  />
                  <SinglePayrollDetail
                    title="Payout Date"
                    loading={loading && !payroll}
                    details={
                      payroll && (
                        <DateTimeChip
                          textSize="text-large"
                          date={payroll.payDate}
                        />
                      )
                    }
                  />
                  <SinglePayrollDetail
                    title="Prorate Month"
                    loading={loading && !payroll}
                    details={payroll?.proRateMonth}
                  />
                  <SinglePayrollDetail
                    title="Status"
                    loading={loading && !payroll}
                    details={
                      payroll && (
                        <StatusChip status={payroll.status as PayrollStatus} />
                      )
                    }
                  />
                </div>
              </div>
            </div>
            <p className="payroll-details-section__payroll-breakdown-text">
              Payroll breakdown
            </p>
            <TableLayout>
              <TableV2
                className="payroll-create-table"
                loading={loading && !hasEmployees}
              >
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Salary ({currency})</th>
                    <th>Net Salary ({currency}) </th>
                    {headerRow.map((row) => {
                      return <th key={row}>{row}</th>;
                    })}
                  </tr>
                </thead>
                <tbody>
                  {employees.map((e) => {
                    const employee = e.employee as Employee;

                    return (
                      <tr key={employee.id}>
                        <td>
                          {employee.firstname} {employee.lastname}
                        </td>
                        <td>
                          {currency} {Util.formatMoneyNumber(e.salary)}
                        </td>
                        <td>
                          {currency} {Util.formatMoneyNumber(e.netSalary)}
                        </td>
                        <IF
                          condition={headerRow.includes(
                            `Deductions (${currency})`,
                          )}
                        >
                          <td>
                            {currency}{' '}
                            {Util.formatMoneyNumber(
                              Util.sum(
                                e.deductions?.map((d) => d.amount) || [],
                              ),
                            )}
                          </td>
                        </IF>
                        <IF
                          condition={headerRow.includes(
                            `Bonuses (${currency})`,
                          )}
                        >
                          <td>
                            {currency}{' '}
                            {Util.formatMoneyNumber(
                              Util.sum(e.bonuses?.map((d) => d.amount) || []),
                            )}
                          </td>
                        </IF>
                      </tr>
                    );
                  })}
                </tbody>
              </TableV2>
            </TableLayout>
            {!hasEmployees && (
              <TableEmptyState
                className="payroll-details-section__table-empty-state"
                text={loading ? 'Getting data...' : 'No employees in payroll'}
              />
            )}
          </div>
          <div className="create-payroll-page__totals">
            <div className="create-payroll-page__totals__items">
              {Object.keys(totals).map((key, i) => {
                return (
                  <TotalCard
                    key={key}
                    loading={loading && !hasEmployees}
                    title={key}
                    type={i === 0 ? 'primary' : 'secondary'}
                    value={`${currency} ${Util.formatMoneyNumber(totals[key])}`}
                  />
                );
              })}
            </div>
          </div>
        </>
      )}
    </DashboardLayoutV2>
  );
};

export default withAuth(PayDetails, ['Payroll', 'read']);
