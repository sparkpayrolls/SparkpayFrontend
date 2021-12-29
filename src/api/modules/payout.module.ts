import { HttpRepository } from '../repo/http.repo';
import { Bank, PayoutMethod } from '../types';

export class PayoutModule extends HttpRepository {
  async getSupportedPayoutMethods(country: string) {
    const { data } = await this.get<PayoutMethod[]>(
      `/payouts/${country}/supported`,
    );

    return data;
  }

  async getSupportedBanks(country: string, params: Record<string, any> = {}) {
    const query = this.parseQueryObject(params);

    return this.get<Bank[]>(`/payouts/${country}/banks${query}`);
  }

  async validatePayoutMethod(methodId: string, meta?: unknown) {
    const { data } = await this.post('/payouts/validate', { methodId, meta });

    return data;
  }
}
