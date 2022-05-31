import { useEffect } from 'react';
import { Util } from 'src/helpers/util';
import { DateTimeChip } from '../DateTimeChip/date-time-chip';
import { StatusChip } from '../StatusChip/status-chip.component';
import { TransactionMethod } from '../TransactionMethod/transaction-method.component';
import { ITransactionTable } from '../types';
import { Table } from './Table.component';
 
export const TransactionTable = (props: ITransactionTable) => {
  const { loading, administrator, getTransactions, transactions, meta } = props;
  const currency = Util.getCurrencySymbolFromAdministrator(administrator);

  useEffect(() => {
    getTransactions();
  }, [getTransactions, administrator]);

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
        refresh={getTransactions}
        isLoading={!!loading}
        isEmpty={!transactions.length}
        emptyStateText={'No transactions yet'}
        paginationMeta={meta}
      >
        {() => {
          return (
            <tbody>
              {transactions.map((transaction) => {
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
