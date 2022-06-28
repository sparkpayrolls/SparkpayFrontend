import { Util } from 'src/helpers/util';
import { DateTimeChip } from '../../DateTimeChip/date-time-chip';
import { KebabMenu } from '../../KebabMenu/KebabMenu.component';
import { StatusChip } from '../../StatusChip/status-chip.component';
import { Table } from '../Table.component';
import { usePayrollTableContext } from './hooks';

export const PayrollTable = () => {
  const {
    headerRow,
    loading,
    payroll,
    getMenuItems,
    refresh,
  } = usePayrollTableContext();

  return (
    <section className="payroll-table">
      <Table
        isNotSearchable
        isNotSelectable
        title={`${payroll?.meta?.total || 0} Payroll`}
        headerRow={headerRow}
        isLoading={loading}
        isEmpty={!payroll?.data?.length}
        paginationMeta={payroll?.meta}
        refresh={refresh}
      >
        {() => {
          return (
            <tbody>
              {payroll?.data?.map((payroll) => {
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
                        <KebabMenu items={getMenuItems(payroll)} />
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
