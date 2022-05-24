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
import moment from 'moment';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { stringifyUrl } from 'query-string';
import { useCallback, useEffect, useState } from 'react';
import { $api } from 'src/api';
import { Employee, ProcessPayrollResponse } from 'src/api/types';
import withAuth from 'src/helpers/HOC/withAuth';
import useApiCall from 'src/helpers/hooks/useapicall.hook';
import { Util } from 'src/helpers/util';
import DashboardLayoutV2 from 'src/layouts/dashboard-layout-v2/DashboardLayoutV2';
import { useAppSelector } from 'src/redux/hooks';

const CreatePayroll: NextPage = () => {
  const administrator = useAppSelector((state) => state.administrator);
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [loading, startLoading, endLoading] = useApiCall();
  const [walletBalance, setWalletBalance] = useState(0);
  const [payroll, setPayroll] = useState<ProcessPayrollResponse>();
  const [params, setParams] = useState({
    proRateMonth: moment().format('MMMM'),
    excludedEmployeeIds: [] as string[],
    cycle: 0,
    year: NaN,
  });

  const getCompanyWallet = useCallback(async () => {
    try {
      startLoading();
      const wallet = await $api.payroll.getCompanyWallet();

      setWalletBalance(wallet.balance);
    } catch (error) {
      // ...
    } finally {
      endLoading();
    }
  }, [startLoading, endLoading]);

  const getPayroll = useCallback(async () => {
    if (isNaN(params.year)) return;
    try {
      startLoading();
      const payroll = await $api.payroll.processPayroll(params);

      setPayroll(payroll);
    } catch (error) {
      // ...
    } finally {
      endLoading();
    }
  }, [startLoading, params, endLoading]);

  useEffect(() => {
    getPayroll();
  }, [getPayroll, administrator]);

  useEffect(() => {
    getCompanyWallet();
  }, [getCompanyWallet, administrator]);

  useEffect(() => {
    if (router.isReady) {
      const query: Record<string, any> = {
        excludedEmployeeIds: Util.getQueryArrayValue(
          router.query.excludedEmployeeIds,
        ),
        year: 0,
        proRateMonth: moment()
          .month(`${router.query.proRateMonth}`)
          .format('MMMM'),
      };
      if (Number(router.query.cycle) >= 1) {
        query.cycle = Number(router.query.cycle);
      }
      if (Number(router.query.year) >= 1) {
        query.year = Number(router.query.year);
      }
      setParams((params) => ({ ...params, ...query }));
    }
  }, [router]);

  const currency = Util.getCurrencySymbolFromAdministrator(administrator);
  const { payrollEmployees: employees = [] } = payroll || {};
  const hasEmployees = !!employees.length;
  const allExcluded = employees.length === selected.length;
  const summaryUrl = stringifyUrl({
    url: '/payroll/summary',
    query: {
      excludedEmployeeIds: selected,
      cycle: params.cycle || payroll?.cycle || 1,
      year: params.year || payroll?.year || moment().year(),
      proRateMonth: params.proRateMonth,
    },
  });

  const totals: Record<string, number> = {
    'Total Salary Amount': 0,
    'Total Net Salary': 0,
  };
  const headerRow: string[] = [];
  const remittanceRows: string[] = [];

  employees.forEach((employee) => {
    if (selected.includes((employee.employee as Employee).id)) {
      return;
    }

    totals['Total Salary Amount'] += employee.salary;
    totals['Total Net Salary'] += employee.netSalary;
    if (employee.deductions && employee.deductions.length) {
      totals['Total Deductions'] = totals['Total Deductions'] || 0;
      totals['Total Deductions'] += Util.sum(
        employee.deductions.map((d) => d.amount),
      );
      if (!headerRow.includes(`Deductions (${currency})`)) {
        headerRow.push(`Deductions (${currency})`);
      }
    }
    if (employee.bonuses && employee.bonuses.length) {
      totals['Total Bonuses'] = totals['Total Bonuses'] || 0;
      totals['Total Bonuses'] += Util.sum(
        employee.bonuses.map((d) => d.amount),
      );
      if (!headerRow.includes(`Bonuses (${currency})`)) {
        headerRow.push(`Bonuses (${currency})`);
      }
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

  const onCheckall = () => {
    if (selected.length !== 0) {
      setSelected([]);
    } else {
      setSelected(employees.map((e) => (e.employee as Employee).id));
    }
  };

  const onCheck = (id: string) => {
    return () => {
      if (selected.includes(id)) {
        setSelected(selected.filter((e: any) => e !== id));
      } else {
        setSelected([...selected, id]);
      }
    };
  };

  return (
    <DashboardLayoutV2 title="Create payroll" href="/payroll">
      <div className="create-payroll-page">
        <TableLayout
          title={
            <WalletBalanceChip
              title="Payroll"
              balance={walletBalance}
              currency={currency}
              loading={loading && walletBalance <= 0}
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
                  value={params.cycle || payroll?.cycle || 1}
                  onChange={(event) =>
                    setParams({ ...params, cycle: +event.target.value })
                  }
                />
                <DatePicker
                  label="Prorate Month"
                  picker="month"
                  format={'MMMM/YYYY'}
                  className="inputs__prorate-month"
                  value={moment()
                    .month(params.proRateMonth)
                    .year(params.year || payroll?.year || moment().year())}
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
                  label="Search"
                  className="inputs__search"
                  type="search"
                  placeholder="Search by Employee Name"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <TableV2 className="payroll-create-table" loading={loading}>
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
                    {headerRow.map((row) => {
                      return <th key={row}>{row}</th>;
                    })}
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
                            {employee.firstname} {employee.lastname}
                          </CheckboxTableColumn>
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
              {loading ? (
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
                    loading={loading}
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
