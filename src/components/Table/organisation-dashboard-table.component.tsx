import { RecentTransaction } from 'src/api/types';
import { TransactionMethod } from '../TransactionMethod/transaction-method.component';
import { DateTimeChip } from '../DateTimeChip/date-time-chip';
import { Table } from './Table.component';
import { Util } from 'src/helpers/util';

export const OrganisationDashboardTable = (props: {
  currency: string;
  recentTransactions: RecentTransaction[];
  loading: boolean;
}) => {
  return (
    <Table
      headerRow={[
        'Transaction\xa0ID',
        `Amount`,
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

                  <td>
                    {props.currency}{' '}
                    {Util.formatMoneyNumber(transaction.amount)}
                  </td>

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
