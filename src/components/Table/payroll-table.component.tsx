import { useEffect } from 'react';
import { Util } from 'src/helpers/util';
import { DateTimeChip } from '../DateTimeChip/date-time-chip';
import { KebabMenu } from '../KebabMenu/KebabMenu.component';
import { StatusChip } from '../StatusChip/status-chip.component';
import { IPayrollTable } from '../types';
import { Table } from './Table.component';

export const PayrollTable = (props: IPayrollTable) => {
  const {
    administrator,
    meta,
    payrolls,
    loading,
    getPayrolls,
    kebabMenuItems,
  } = props;
  const currency = Util.getCurrencySymbolFromAdministrator(administrator);
  const headerRow = [
    'Prorate\xa0Month',
    `Amount\xa0(${currency})`,
    'Payroll\xa0size',
    'Status',
    'Payout\xa0Date',
  ];

  useEffect(() => {
    getPayrolls();
  }, [getPayrolls, administrator]);

  return (
    <section className="payroll-table">
      <Table
        isNotSearchable
        isNotSelectable
        title={`${meta.total} Payroll`}
        headerRow={headerRow}
        isLoading={loading}
        isEmpty={!payrolls.length}
        paginationMeta={meta}
        refresh={getPayrolls}
      >
        {() => {
          return (
            <tbody>
              {payrolls.map((payroll) => {
                return (
                  <tr key={payroll.id}>
                    <td>{payroll.proRateMonth}</td>
                    <td>{Util.formatMoneyNumber(payroll.totalAmount)}</td>
                    <td>{Util.formatNumber(payroll.size || 0)}</td>
                    <td>
                      <StatusChip status={payroll.status as any} />
                    </td>
                    <td>
                      <span className="payroll-table__date-menu">
                        <DateTimeChip date={payroll.payDate} />
                        <KebabMenu items={kebabMenuItems(payroll)} />
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          );
        }}
      </Table>
    </section>
  );
};
