import moment from 'moment';
import { RecentPayroll } from 'src/api/types';
import { Identity } from '../Identity/identity.component';
import { StatusChip } from '../StatusChip/status-chip.component';
import { Table } from './Table.component';

export const UserDashboardTable = ({
  data,
  loading,
}: {
  data: RecentPayroll[];
  loading: boolean;
}) => {
  return (
    <Table
      headerRow={['Organisation', 'Amount', 'Size', 'Status', 'Paydate']}
      isNotSelectable
      isNotSearchable
      emptyStateText={'No recent payrolls'}
      isEmpty={!data.length}
      isLoading={loading}
    >
      {() => {
        return (
          <tbody>
            {data.map((payroll) => {
              return (
                <tr key={payroll.id}>
                  <td>
                    <Identity
                      name={payroll.company?.name}
                      initial={payroll.company?.name?.charAt(0)}
                      image={payroll.company?.logo}
                    />
                  </td>

                  <td>
                    {payroll.company?.country?.currencySymbol}
                    {payroll.totalAmount}
                  </td>

                  <td>{payroll.size}</td>

                  <td>
                    <StatusChip status={payroll.status} />
                  </td>

                  <td>{moment(payroll.payDate).format('MMMM DD, YYYY')}</td>
                </tr>
              );
            })}
          </tbody>
        );
      }}
    </Table>
  );
};
