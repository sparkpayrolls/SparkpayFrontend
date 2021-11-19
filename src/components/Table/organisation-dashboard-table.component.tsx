import { RecentTransaction } from 'src/api/types';
import { TransactionMethod } from '../TransactionMethod/transaction-method.component';
import { DateTimeChip } from '../DateTimeChip/date-time-chip';
import { Table } from './Table.component';

export const OrganisationDashboardTable = (props: {
  currency: string;
  recentTransactions: RecentTransaction[];
  loading: boolean;
}) => {
  return (
    <Table
      headerRow={[
        'Transaction\xa0ID',
        `Amount\xa0(${props.currency})`,
        'Transaction\xa0Method',
        'Description',
        'Date',
      ]}
      isNotSelectable
      isNotSearchable
      emptyStateText={'No recent transactions'}
      isLoading={props.loading}
      isEmpty={!props.recentTransactions.length}
    >
      {() => {
        return (
          <tbody>
            {props.recentTransactions.map((transaction) => {
              return (
                <tr key={transaction.id}>
                  <td>{transaction.id.toUpperCase()}</td>

                  <td>{transaction.amount}</td>

                  <td>
                    <TransactionMethod method={transaction.transactionMethod} />
                  </td>

                  <td>{transaction.meta?.description}</td>

                  <td>
                    <DateTimeChip date={transaction.date} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        );
      }}
    </Table>
  );
};
