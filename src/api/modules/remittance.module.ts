import { HttpRepository } from '../repo/http.repo';
import { RemittancePayment } from '../types';

export class RemittanceModule extends HttpRepository {
  async getRemittancePayments(params: Record<string, any>) {
    return this.get<RemittancePayment[]>(`/statutory`, { params });
  }
}
