import { HttpRepository } from '../repo/http.repo';
import { PaymentMethod } from '../types';

export class PaymentModule extends HttpRepository {
  async getPaymentMethods(countryId: string) {
    const { data } = await this.get<PaymentMethod[]>(
      `/payments/${countryId}/supported`,
    );

    return data;
  }
  async hydratePaymentDetails(_: unknown) {
    return {
      payoutMethod: { id: 'some-id', name: 'Bank Transfer' },
      payoutMethodMeta: {
        bankId: { id: 'some-id', name: 'United Bank For Africa' },
        accountNumber: 2189428060,
      },
    };
  }
}
