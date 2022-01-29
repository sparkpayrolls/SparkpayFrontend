import { Button } from '@/components/Button/Button.component';
import { TotalCard } from '@/components/Card/total-card.component';
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
import {
  Employee,
  PayrollEmployee,
  ProcessPayrollPayload,
} from 'src/api/types';
import withAuth from 'src/helpers/HOC/withAuth';
import { Util } from 'src/helpers/util';
import DashboardLayoutV2 from 'src/layouts/dashboard-layout-v2/DashboardLayoutV2';
import { useAppSelector } from 'src/redux/hooks';

const CreatePayroll: NextPage = () => {
  const [walletBalance, setWalletBalance] = useState(0);
  const [employees, setEmployees] = useState<PayrollEmployee[]>([]);
  const [apiCalls, setApiCalls] = useState(0);
  const administrator = useAppSelector((state) => state.administrator);
  const router = useRouter();
  const [exclude, setExclude] = useState<string[]>([]);

  const currency = Util.getCurrencySymbolFromAdministrator(administrator);
  const hasEmployees = !!employees.length;
  const loading = apiCalls > 0;
  const allExcluded = employees.length === exclude.length;
  const summaryUrl = stringifyUrl({
    url: '/payroll/summary',
    query: { exclude },
  });

  const totals: Record<string, number> = {
    'Total Salary Amount': 0,
    'Total Net Salary': 0,
  };
  const headerRow: string[] = [];
  const remittanceRows: string[] = [];

  employees.forEach((employee) => {
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

  const getEmployees = useCallback(
    async (payload: ProcessPayrollPayload) => {
      try {
        setApiCalls((c) => c + 1);
        const employees = await $api.payroll.processPayroll(payload);

        setEmployees(employees);
      } catch (error) {
        // ...
      } finally {
        setApiCalls((c) => c - 1);
      }
    },
    [setEmployees],
  );

  const updateUrl = (exclude: string[]) => {
    const { pathname, query } = router;
    const url = stringifyUrl({
      url: pathname,
      query: { ...query, exclude },
    });

    router.push(url);
  };

  const onCheckall = () => {
    if (exclude.length !== 0) {
      updateUrl([]);
    } else {
      updateUrl(employees.map((e) => (e.employee as Employee).id));
    }
  };

  const onCheck = (id: string) => {
    return () => {
      if (exclude.includes(id)) {
        updateUrl(exclude.filter((e) => e !== id));
      } else {
        updateUrl([...exclude, id]);
      }
    };
  };

  useEffect(() => {
    getEmployees({ proRateMonth: moment().format('MMMM') });
    getCompanyWallet();
  }, [getCompanyWallet, getEmployees, administrator]);

  useEffect(() => {
    const { query } = router;
    const exclude = Util.getQueryArrayValue(query.exclude);
    setExclude(exclude);
  }, [router]);

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
            <TableV2 className="payroll-create-table" loading={loading}>
              <thead>
                <tr>
                  <CheckboxTableColumn
                    checked={!exclude.length}
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
                {employees.map((e) => {
                  const employee = e.employee as Employee;

                  return (
                    <tr key={employee.id}>
                      <CheckboxTableColumn
                        checked={!exclude.includes(employee.id)}
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
                            Util.sum(e.deductions?.map((d) => d.amount) || []),
                          )}
                        </td>
                      </IF>
                      <IF
                        condition={headerRow.includes(`Bonuses (${currency})`)}
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
                          (r) => r.name === row.replace(` (${currency})`, ''),
                        );

                        return (
                          <td key={`${employee.id}-${row}`}>
                            {currency}{' '}
                            {Util.formatMoneyNumber(remittance?.amount || 0)}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </TableV2>
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
