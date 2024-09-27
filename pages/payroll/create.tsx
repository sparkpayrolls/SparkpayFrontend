import { useState, useEffect } from 'react';
import { TotalCard } from '@/components/Card/total-card.component';
import { DatePicker } from '@/components/Input/date-picker.component';
import { InputV2 } from '@/components/Input/Input.component';
import { FileStorageSVG } from '@/components/svg';
import { CheckboxTableColumn } from '@/components/Table/check-box-table-col.component';
import { TableLayout } from '@/components/Table/table-layout.component';
import { TableV2 } from '@/components/Table/Table.component';
import { WalletBalanceChip } from '@/components/WalletBalanceChip/wallet-balance-chip.component';
import { NextPage } from 'next';
import withAuth from 'src/helpers/HOC/withAuth';
import { useCreatePayrollPageLogic } from 'src/helpers/hooks/use-create-payroll-page-logic.hook';
import { Util } from 'src/helpers/util';
import DashboardLayoutV2 from 'src/layouts/dashboard-layout-v2/DashboardLayoutV2';
import { Button } from '@/components/Button/Button.component';
import PayrollScrollState from '../../src/components/Payroll/payroll-scroll-state';
import { SearchSVG } from '@/components/svg';
import Image from 'next/image';
import payroll_dropdown from '../../public/svgs/payroll-dropdown.svg';
import PayrollDropdown from '@/components/payrollDropdown/payroll-dropdown';

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
    allChecked,
    handleCheck,
    handleCheckAll,
    allUnchecked,
  } = useCreatePayrollPageLogic();

  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const handleRowClick = (rowId: string) => {
    setExpandedRow(expandedRow === rowId ? null : rowId);
    console.log('Clicked row ID:', rowId);
    console.log('Current expandedRow state:', expandedRow);
  };

  const { styles, handleScroll } = PayrollScrollState();

  useEffect(() => {
    console.log('Input color updated:', styles);
    const scrollableContent = document.querySelector(
      '.dashboard-layout-v2__content',
    );
    scrollableContent?.addEventListener('scroll', handleScroll);
    return () => {
      scrollableContent?.removeEventListener('scroll', handleScroll);
    };
  }, [styles, handleScroll]);

  return (
    <DashboardLayoutV2
      loading={loadingPayroll}
      title="Create payroll"
      href="/payroll"
      getScroll={handleScroll}
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
                    href: summaryUrl,
                    primary: true,
                    type: 'button',
                    disabled: allUnchecked,
                    title: allUnchecked
                      ? 'Select at least one employee to proceed'
                      : '',
                  },
                ]
              : []
          }
        >
          <div className="inputs sticky-div" style={styles}>
            <div className="inputs__search-component">
              <InputV2
                label="Search"
                className="inputs__search"
                type="search"
                placeholder="Search by employee name"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <SearchSVG />
            </div>

            <DatePicker
              label="Month"
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
          </div>
          <div className="create-payroll-content">
            <div className="payroll-create-table">
              {hasEmployees ? (
                <>
                  <TableV2 loading={loadingPayroll}>
                    <thead>
                      <tr>
                        <CheckboxTableColumn
                          checked={allChecked}
                          onChange={handleCheckAll}
                          element="th"
                        >
                          Employee Name
                        </CheckboxTableColumn>
                        <th>Salary</th>
                        <th>Net Salary</th>
                        <th></th>
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
                            <>
                              <tr onClick={() => handleRowClick(e.id)}>
                                <CheckboxTableColumn
                                  checked={params.checked.includes(e.id)}
                                  onChange={handleCheck(e.id)}
                                  element="td"
                                >
                                  <button
                                    className="create-payroll-page__employee-name"
                                    // onClick={handleEmployeeClick(e)}
                                  >
                                    {e.firstname} {e.lastname}
                                  </button>
                                </CheckboxTableColumn>
                                <td>
                                  {currency} {Util.formatMoneyNumber(e.salary)}
                                </td>
                                <td>
                                  {currency}{' '}
                                  {Util.formatMoneyNumber(e.netSalary)}
                                </td>
                                <td>
                                  <Image
                                    src={payroll_dropdown}
                                    alt="Dropdown Icon"
                                    style={{
                                      cursor: 'pointer',
                                      transform:
                                        expandedRow === e.id
                                          ? 'rotate(180deg)'
                                          : 'rotate(0)',
                                    }}
                                    onClick={() => handleRowClick(e.id)}
                                  />
                                </td>
                              </tr>
                              {expandedRow === e.id && (
                                <tr
                                  className={`dropdown-row ${
                                    expandedRow === e.id
                                      ? 'expanded'
                                      : 'collapsed'
                                  }`}
                                >
                                  <td colSpan={4}>
                                    <div className="dropdown-content">
                                      <PayrollDropdown
                                        currency={currency}
                                        employee={e}
                                      />
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </>
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
            </div>
            <>
              {hasEmployees && (
                <div className="create-payroll-page__totals">
                  <p>Total Earnings and Taxes</p>
                  <div className="create-payroll-page__totals__section">
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
                    </div>
                  </div>
                </div>
              )}
            </>
          </div>
        </TableLayout>
      </div>
    </DashboardLayoutV2>
  );
};

export default withAuth(CreatePayroll, ['Payroll', 'write']);
