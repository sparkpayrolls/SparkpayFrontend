import { useTransactions } from 'src/helpers/hooks/use-transactions.hook';
import { Util } from 'src/helpers/util';
import { useAppSelector } from 'src/redux/hooks';
import { DateTimeChip } from '../DateTimeChip/date-time-chip';
import { StatusChip } from '../StatusChip/status-chip.component';
import { TransactionMethod } from '../TransactionMethod/transaction-method.component';
import { Table } from './Table.component';

export const TransactionTable = () => {
  const { loading, transactions, setParams } = useTransactions();
  const administrator = useAppSelector((state) => state.administrator);
  const currency = Util.getCurrencySymbolFromAdministrator(administrator);
  const refresh = (
    page?: number,
    limit?: number,
    search?: string,
    all?: boolean,
  ) => {
    setParams({ page, limit, search, all });
  };

  return (
    <div className="transaction-table">
      <Table
        headerRow={[
          'Transaction ID',
          'Amount',
          'Transaction\xa0Method',
          'Balance',
          'Status',
          'Date Added',
        ]}
        isNotSelectable
        isNotSearchable
        title="Transactions"
        refresh={refresh}
        isLoading={loading}
        isEmpty={!transactions?.data?.length}
        emptyStateText={'No transactions yet'}
        paginationMeta={transactions?.meta}
      >
        {() => {
          return (
            <tbody>
              {transactions?.data?.map((transaction) => {
                return (
                  <tr key={transaction.id}>
                    <td>{transaction.id.toUpperCase()}</td>
                    <td>
                      {currency}&nbsp;
                      {Util.formatMoneyNumber(transaction.amount)}
                    </td>
                    <td>
                      <TransactionMethod
                        method={transaction.transactionMethod}
                      />
                    </td>
                    <td>
                      {currency}&nbsp;
                      {Util.formatMoneyNumber(transaction.balance)}
                    </td>
                    <td>
                      <StatusChip status={transaction.status} />
                    </td>
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
    </div>
  );
};
