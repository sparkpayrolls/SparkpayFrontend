import { NextPage } from 'next';
import DashboardLayout from 'src/layouts/dashboard-layout/DashBoardLayout';
import withAuth from 'src/helpers/HOC/withAuth';
import { TransactionTable } from '@/components/Table/transaction-table.component';
import { WalletCard } from '@/components/Wallet/wallet-card.component';
import { PayrollUpdateCard } from '@/components/Wallet/payroll-update-card.component';
import { useWalletBalance } from 'src/helpers/hooks/use-wallet-balance.hook';
import { usePayrollUpdateMessage } from 'src/helpers/hooks/use-payroll-update-message.hoook';

const WalletBilling: NextPage = () => {
  const { walletBalance, loading: loadingWalletBalance } = useWalletBalance();
  const { update: payrollUpdate, loading } = usePayrollUpdateMessage();

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
            amount={walletBalance}
            loading={loadingWalletBalance}
          />
          <PayrollUpdateCard
            payrollDate={payrollUpdate.message}
            actions={payrollUpdate.actions}
            loading={loading}
          />
        </div>
        <TransactionTable />
      </div>
    </DashboardLayout>
  );
};

export default withAuth(WalletBilling, ['Transaction', 'read']);
