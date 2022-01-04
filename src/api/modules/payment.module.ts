import { HttpRepository } from '../repo/http.repo';
import { PaymentMethod } from '../types';

export class PaymentModule extends HttpRepository {
  async getPaymentMethods(countryId: string) {
    const { data } = await this.get<PaymentMethod[]>(
      `/payments/${countryId}/supported`,
    );

    return data;
  }
}
