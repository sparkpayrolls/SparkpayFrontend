import { HttpRepository } from '../repo/http.repo';
import {
  CompanyWallet,
  Payroll,
  PayrollEmployee,
  PayrollSummary,
  ProcessPayrollPayload,
} from '../types';

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

  async getCompanyWallet() {
    const { data } = await this.get<CompanyWallet>('/payrolls/wallet');

    return data;
  }

  async processPayroll(payload: ProcessPayrollPayload) {
    const { data } = await this.post<PayrollEmployee[]>(
      '/payrolls/process',
      payload,
    );

    return data;
  }

  async getSummary(payload: ProcessPayrollPayload) {
    const { data } = await this.post<PayrollSummary>(
      '/payrolls/summary',
      payload,
    );

    return data;
  }

  async createPayroll(payload: { payDate: string } & ProcessPayrollPayload) {
    const { data } = await this.post<Payroll>('/payrolls', payload);

    return data;
  }

  async getById(id: string) {
    const { data } = await this.get<Payroll>(`/payrolls/${id}`);

    return data;
  }

  async getPayrollEmployees(id: string, params: Record<string, any> = {}) {
    const query = this.parseQueryObject(params);
    return this.get<PayrollEmployee[]>(`/payrolls/${id}/employees${query}`);
  }
}
