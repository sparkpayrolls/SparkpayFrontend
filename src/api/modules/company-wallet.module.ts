import { HttpRepository } from '../repo/http.repo';
import { CompanyWallet, PaginateParams, WalletTransaction } from '../types';

export class CompanyWalletModule extends HttpRepository {
  async getCompanyWallet() {
    const { data } = await this.get<CompanyWallet>('/company-wallets');

    return data;
  }

  async getCompanyWalletTransactions(params: PaginateParams) {
    return this.get<WalletTransaction[]>('/company-wallets/transactions', {
      params,
    });
  }

  async exportTransactions(params: PaginateParams) {
    const { data } = await this.get<{ file: string; name: string }>(
      '/company-wallets/transactions/export',
      { params },
    );

    return data;
  }

  async createTransactionAccount<K>(params: unknown) {
    const { data } = await this.post<K>(
      '/company-wallets/transactions/accounts',
      params,
    );

    return data;
  }
}
