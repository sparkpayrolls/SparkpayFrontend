import React, { useCallback, useState, useEffect } from 'react';
import { NextPage } from 'next';
import DashboardLayout from 'src/layouts/dashboard-layout/DashBoardLayout';
import withAuth from 'src/helpers/HOC/withAuth';
import { Util } from 'src/helpers/util';
import {
  Administrator,
  CompanyWallet,
  WalletTransaction,
  PaymentMethod,
  Country,
  Company,
} from 'src/api/types';
import { $api } from 'src/api';
import { useAppSelector } from 'src/redux/hooks';
import { TransactionTable } from '@/components/Table/transaction-table.component';
import { WalletCard } from '@/components/Wallet/wallet-card.component';
import { PayrollUpdateCard } from '@/components/Wallet/payroll-update-card.component';

const WalletBilling: NextPage = () => {
  const administrator = useAppSelector((state) => state.administrator);
  const [transactionMeta, setTransactionMeta] = useState(
    Util.getDefaultPaginationMeta({}),
  );
  const [wallet, setWallet] = useState<CompanyWallet | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastQuery, setLastQuery] = useState<Record<string, any>>({});
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const currency = Util.getCurrencySymbolFromAdministrator(administrator);

  const getTransactions = useCallback(
    async (page?: number, perPage = 10, search?: string, all?: boolean) => {
      try {
        setLoading(true);
        const {
          data,
          meta,
        } = await $api.companyWallet.getCompanyWalletTransactions({
          page,
          perPage,
          search,
          all,
        });
        setTransactionMeta(meta as any);
        setTransactions(data);
        setLastQuery({ page, perPage, search, all });
      } catch (error) {
        //....
      } finally {
        setLoading(false);
      }
    },
    [setTransactions, setTransactionMeta],
  );

  const getWallet = useCallback(async () => {
    try {
      setLoading(true);
      const wallet = await $api.companyWallet.getCompanyWallet();

      setWallet(wallet);
    } catch (error) {
      // ...
    } finally {
      setLoading(false);
    }
  }, [setWallet]);

  const getPaymentMethods = useCallback(async () => {
    try {
      setLoading(true);
      const company = administrator?.company as Company;
      const country = company?.country as Country;
      const paymentMethods = await $api.payment.getPaymentMethods(country.id);

      setPaymentMethods(paymentMethods);
    } catch (error) {
      // ...
    } finally {
      setLoading(false);
    }
  }, [setPaymentMethods, administrator]);

  const refreshAfterFund = () => {
    getWallet();
    getTransactions(
      lastQuery.page,
      lastQuery.perPage,
      lastQuery.search,
      lastQuery.all,
    );
  };

  useEffect(() => {
    getWallet();
    getPaymentMethods();
  }, [getWallet, administrator, getPaymentMethods]);

  return (
    <DashboardLayout pageTitle="Transactions">
      <div className="wallet-billing-page">
        <h1 className="wallet-billing-page__wallet-header-title">
          Transactions
        </h1>
        <div
          className="wallet-billing-page__wallet-cards
    "
        >
          <WalletCard
            title="Balance"
            amount={`${currency}${Util.formatMoneyNumber(
              wallet?.balance ?? 0,
            )}`}
            administrator={administrator as Administrator}
            refreshBalance={refreshAfterFund}
            paymentMethods={paymentMethods}
          />
          <PayrollUpdateCard payrollDate="Next payroll date is on the 27th, May" />
        </div>
        <TransactionTable
          getTransactions={getTransactions}
          loading={loading}
          administrator={administrator}
          meta={transactionMeta}
          transactions={transactions}
        />
      </div>
    </DashboardLayout>
  );
};

export default withAuth(WalletBilling, ['Transaction', 'read']);