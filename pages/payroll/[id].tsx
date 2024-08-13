import type { NextPage } from 'next';
import { TableLayout } from '@/components/Table/table-layout.component';
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
  PayrollEmployeePayoutStatus,
  PayrollStatus,
  Response,
} from 'src/api/types';
import { HttpError } from 'src/api/repo/http.error';
import { TableV2 } from '@/components/Table/Table.component';
import { TableEmptyState } from '@/components/EmptyState/table-emptystate.component';
import { useSocket } from 'src/helpers/hooks/use-socket.hook';
import { useWalletBalance } from 'src/helpers/hooks/use-wallet-balance.hook';
import { SearchForm } from '@/components/Form/search.form';
import { KebabMenu } from '@/components/KebabMenu/KebabMenu.component';
import { toast } from 'react-toastify';

const PayDetails: NextPage = () => {
  const router = useRouter();
  const administrator = useAppSelector((state) => state.administrator);
  const socket = useSocket();
  const { walletBalance, loading: loadingWalletBalance } = useWalletBalance();
  const [apiCalls, setApiCalls] = useState(0);
  const [payrollNotFound, setPayrollNotFound] = useState(false);
  const [payroll, setPayroll] = useState<Payroll | null>(null);
  const [employees, setEmployees] = useState<Response<PayrollEmployee[]>>();
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState('');

  const currency = Util.getCurrencySymbolFromAdministrator(administrator);
  const totals: Record<string, number> = {
    'Total Salary Amount': 0,
    'Total Net Salary': 0,
  };
  const headerRow: Set<string> = new Set();
  const remittanceRows: string[] = [];
  const loading = apiCalls > 0;
  const hasEmployees = !!employees?.data?.length;
  const payrollId = router.query.id as string;

  employees?.data?.forEach((employee) => {
    totals['Total Salary Amount'] += employee.salary;
    totals['Total Net Salary'] += employee.netSalary;
    if (employee.deductions && employee.deductions.length) {
      totals['Total Deductions'] = totals['Total Deductions'] || 0;
      totals['Total Deductions'] += Util.sum(
        employee.deductions.map((d) => d.amount),
      );
      headerRow.add('deductions');
    }
    if (employee.bonuses && employee.bonuses.length) {
      totals['Total Bonuses'] = totals['Total Bonuses'] || 0;
      totals['Total Bonuses'] += Util.sum(
        employee.bonuses.map((d) => d.amount),
      );
      headerRow.add('bonuses');
    }
    if (employee.remittances && employee.remittances.length) {
      employee.remittances.forEach((remittance) => {
        const name = `Total ${remittance.name}`;
        totals[name] = totals[name] || 0;
        totals[name] += remittance.amount;
        if (!remittanceRows.includes(`${remittance.name} (${currency})`)) {
          remittanceRows.push(`${remittance.name} (${currency})`);
        }
      });
    }
  });

  const getPayroll = useCallback(async () => {
    try {
      setApiCalls((c) => c + 1);
      if (payrollId) {
        const payroll = await $api.payroll.getById(payrollId);
        setPayroll(payroll);
      }
    } catch (error) {
      const err = error as HttpError;
      if (err.status === 404) {
        setPayrollNotFound(true);
      }
    } finally {
      setApiCalls((c) => c - 1);
    }
  }, [setPayroll, payrollId]);

  const getPayrollEmployees = useCallback(async () => {
    try {
      setApiCalls((c) => c + 1);
      if (payrollId) {
        const employees = await $api.payroll.getPayrollEmployees(payrollId, {
          all: true,
        });
        setEmployees(employees);
      }
    } catch (error) {
      // ...
    } finally {
      setApiCalls((c) => c - 1);
    }
  }, [payrollId, setEmployees]);

  const getSelectHandler = (id: string) => {
    return () => {
      if (selected.includes(id)) {
        setSelected(selected.filter((s) => s !== id));
      } else {
        setSelected([...selected, id]);
      }
    };
  };

  const handleSelectAll = () => {
    if (selected.length > 0) {
      setSelected([]);
    } else {
      setSelected((employees?.data || []).map((e) => e.id));
    }
  };

  const downloadPayslips = async (params: {
    shouldDownloadOnly: boolean;
    payrollEmployeeIds: string[];
  }) => {
    try {
      if (loading) {
        return;
      }
      setApiCalls(Math.max(apiCalls + 1, 1));
      const payslips = await $api.payroll.downloadPayslips(payrollId, params);
      if (params.shouldDownloadOnly) {
        payslips.forEach((payslip) => {
          Util.downloadFile({
            file: `data:application/pdf;base64,${payslip}`,
            name: 'payslip.pdf',
          });
        });
      }
      toast.success('payslip fetched successfully');
    } catch (error) {
      Util.onNonAuthError(error, (httpError) => {
        toast.error(`error fetching payslip - ${httpError.message}`);
      });
    } finally {
      setApiCalls(Math.max(apiCalls - 1, 0));
    }
  };

  useEffect(() => {
    getPayroll();
    getPayrollEmployees();
  }, [getPayroll, getPayrollEmployees, administrator]);

  useEffect(() => {
    if (socket) {
      socket.on('Payroll', (data: Payroll) => {
        if (data.id === payroll?.id) {
          setPayroll(data);
        }
      });
      socket.on('PayrollEmployee', (payrollEmployee: PayrollEmployee) => {
        if (payrollEmployee.payroll === payroll?.id) {
          socket.emit(
            'GetPayrollEmployees',
            { all: true, payroll: payroll?.id },
            (data: Response<PayrollEmployee[]>) => {
              setEmployees(data);
            },
          );
        }
      });
    }
  }, [payroll, socket]);

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
                  loading={loadingWalletBalance}
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
                    details={Util.formatMoneyNumber(payroll?.size || 0)}
                    loading={loading && !payroll}
                  />
                  <SinglePayrollDetail
                    title="Total Salary"
                    loading={loading && !payroll}
                    details={
                      payroll && (
                        <>
                          {currency}{' '}
                          {Util.formatMoneyNumber(
                            payroll?.totalSalary ||
                              totals['Total Salary Amount'] ||
                              0,
                            2,
                          )}
                        </>
                      )
                    }
                  />
                  <SinglePayrollDetail
                    title="Total Net Salary"
                    loading={loading && !payroll}
                    details={
                      payroll && (
                        <>
                          {currency}{' '}
                          {Util.formatMoneyNumber(
                            payroll?.totalSalary ||
                              totals['Total Net Salary'] ||
                              0,
                            2,
                          )}
                        </>
                      )
                    }
                  />
                  <SinglePayrollDetail
                    title="Total Bonus"
                    loading={loading && !payroll}
                    details={
                      payroll && (
                        <>
                          {currency}{' '}
                          {Util.formatMoneyNumber(
                            payroll?.totalBonus || totals['Total Bonuses'] || 0,
                            2,
                          )}
                        </>
                      )
                    }
                  />
                  <SinglePayrollDetail
                    title="Total Deductions"
                    loading={loading && !payroll}
                    details={
                      payroll && (
                        <>
                          {currency}{' '}
                          {Util.formatMoneyNumber(
                            payroll?.totalDeductions ||
                              totals['Total Deductions'] ||
                              0,
                            2,
                          )}
                        </>
                      )
                    }
                  />
                  <SinglePayrollDetail
                    title="Total Tax"
                    loading={loading && !payroll}
                    details={
                      payroll && (
                        <>
                          {currency}{' '}
                          {Util.formatMoneyNumber(payroll?.totalTax || 0, 2)}
                        </>
                      )
                    }
                  />
                  <SinglePayrollDetail
                    title="Total Pension"
                    loading={loading && !payroll}
                    details={
                      payroll && (
                        <>
                          {currency}{' '}
                          {Util.formatMoneyNumber(
                            payroll?.totalPension || 0,
                            2,
                          )}
                        </>
                      )
                    }
                  />
                  <SinglePayrollDetail
                    title="Total NHF"
                    loading={loading && !payroll}
                    details={
                      payroll && (
                        <>
                          {currency}{' '}
                          {Util.formatMoneyNumber(payroll?.totalNHF || 0, 2)}
                        </>
                      )
                    }
                  />
                  <SinglePayrollDetail
                    title="Fee"
                    loading={loading && !payroll}
                    details={
                      payroll && (
                        <>
                          {currency}{' '}
                          {Util.formatMoneyNumber(payroll?.fee || 0, 2)}
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

            <div className="d-flex md-align-items-center mt-4 md-justify-content-space-between gap-2 flex-direction-column md-flex-direction-row">
              <p className="payroll-details-section__payroll-breakdown-text">
                Payroll employees
              </p>

              <div className="d-flex gap-1 align-items-center">
                <SearchForm
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search employees"
                />
                <div
                  style={{
                    padding: '0.2rem',
                    border: '1px solid #d7dce0',
                    borderRadius: '4px',
                  }}
                >
                  <KebabMenu
                    items={[
                      {
                        action() {
                          if (selected.length) {
                            downloadPayslips({
                              shouldDownloadOnly: false,
                              payrollEmployeeIds: selected,
                            });
                          }
                        },
                        value: 'Send payslips',
                      },
                      {
                        action() {
                          if (selected.length) {
                            downloadPayslips({
                              shouldDownloadOnly: true,
                              payrollEmployeeIds: selected,
                            });
                          }
                        },
                        value: 'Download payslips',
                      },
                    ]}
                  />
                </div>
              </div>
            </div>
            <TableLayout>
              <TableV2
                className="payroll-create-table"
                loading={loading || !hasEmployees}
              >
                <thead>
                  <tr>
                    <th style={{ paddingRight: 0 }}>
                      <input
                        checked={
                          selected.length > 0 &&
                          selected.length >= (employees?.data?.length || 0)
                        }
                        onChange={handleSelectAll}
                        type="checkbox"
                      />
                    </th>
                    <th style={{ paddingLeft: 0 }}>Name</th>
                    <th>Salary</th>
                    <th>Net Salary </th>
                    <th>Bonuses</th>
                    <th>Deductions</th>
                    <th>Tax</th>
                    <th>Pension</th>
                    <th>NHF</th>
                    <th>Payout Status</th>
                  </tr>
                </thead>
                <tbody>
                  {employees?.data
                    ?.filter((e) => {
                      const employee = e.employee as Employee;
                      const name = `${employee.firstname} ${employee.lastname}`;

                      return name.toLowerCase().includes(search.toLowerCase());
                    })
                    ?.map((e) => {
                      const employee = e.employee as Employee;

                      return (
                        <tr key={employee.id}>
                          <td style={{ paddingRight: 0 }}>
                            <input
                              checked={selected.includes(e.id)}
                              onChange={getSelectHandler(e.id)}
                              type="checkbox"
                            />
                          </td>
                          <td style={{ paddingLeft: 0 }}>
                            {employee.firstname} {employee.lastname}
                          </td>
                          <td>
                            {currency} {Util.formatMoneyNumber(e.salary)}
                          </td>
                          <td>
                            {currency} {Util.formatMoneyNumber(e.netSalary)}
                          </td>
                          <td>
                            {currency}{' '}
                            {Util.formatMoneyNumber(
                              Util.sum(e.bonuses?.map((d) => d.amount) || []),
                            )}
                          </td>
                          <td>
                            {currency}{' '}
                            {Util.formatMoneyNumber(
                              Util.sum(
                                e.deductions?.map((d) => d.amount) || [],
                              ),
                            )}
                          </td>
                          <td>
                            {currency}{' '}
                            {Util.formatMoneyNumber(e.tax?.amount || 0)}
                          </td>
                          <td>
                            {currency}{' '}
                            {Util.formatMoneyNumber(e.pension?.amount || 0)}
                          </td>
                          <td>
                            {currency}{' '}
                            {Util.formatMoneyNumber(e.nhf?.amount || 0)}
                          </td>
                          <td>
                            <div className="d-flex align-items-center justify-content-space-between">
                              <StatusChip
                                status={
                                  e.payoutStatus as PayrollEmployeePayoutStatus
                                }
                              />
                              <KebabMenu
                                items={[
                                  {
                                    action() {
                                      downloadPayslips({
                                        shouldDownloadOnly: false,
                                        payrollEmployeeIds: [e.id],
                                      });
                                    },
                                    value: 'Send payslip',
                                  },
                                  {
                                    action() {
                                      downloadPayslips({
                                        shouldDownloadOnly: true,
                                        payrollEmployeeIds: [e.id],
                                      });
                                    },
                                    value: 'Download payslip',
                                  },
                                ]}
                              />
                            </div>
                          </td>
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
          {/* <div className="create-payroll-page__totals">
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
          </div> */}
        </>
      )}
    </DashboardLayoutV2>
  );
};

export default withAuth(PayDetails, ['Payroll', 'read']);
