import { HttpRepository } from '../repo/http.repo';
import { Payroll } from '../types';

export class PayrollModule extends HttpRepository {
  async getPayrolls(params: Record<string, any>) {
    const query = this.parseQueryObject(params);
    return this.get<Payroll[]>(`/payrolls${query}`);
  }

  async pausePendingPayroll(id: string) {
    const { data } = await this.put<Payroll>(`/payrolls/${id}/pause`);

    return data;
  }

  async resumePausedPayroll(id: string) {
    const { data } = await this.put<Payroll>(`/payrolls/${id}/resume`);

    return data;
  }

  async deletePayroll(id: string) {
    const { data } = await this.delete<Payroll>(`/payrolls/${id}`);

    return data;
  }
}
