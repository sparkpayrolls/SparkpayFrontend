import { HttpRepository } from '../repo/http.repo';
import { CompanyWallet, PaginateParams, WalletTransaction } from '../types';

export class CompanyWalletModule extends HttpRepository {
  async getCompanyWallet() {
    const { data } = await this.get<CompanyWallet>('/company-wallets');

    return data;
  }

  async getCompanyWalletTransactions(params: PaginateParams) {
    const query = this.parseQueryObject(params);

    return this.get<WalletTransaction[]>(
      `/company-wallets/transactions${query}`,
    );
  }
}
