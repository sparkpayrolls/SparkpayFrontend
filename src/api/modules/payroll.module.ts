import { HttpRepository } from '../repo/http.repo';
import {
  Addon,
  CompanyWallet,
  Employee,
  ICreatePayrollPayload,
  Payroll,
  PayrollEmployee,
  PayrollSummary,
  PayrollUpdateResponse,
  ProcessPayrollPayload,
  ProcessPayrollResponse,
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

  async processPayroll(
    payload: Omit<ProcessPayrollPayload, 'cycle' | 'year'> &
      Partial<Pick<ProcessPayrollPayload, 'cycle' | 'year'>>,
  ) {
    const { data } = await this.post<ProcessPayrollResponse>(
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

  async createPayroll(payload: ICreatePayrollPayload) {
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

  async updateEmployeeSalary(employee: string, salary: string) {
    const { data } = await this.put<Employee>(`/payrolls/update-salary`, {
      employee,
      salary,
    });

    return data;
  }

  async deletePayrollSalaryAddon(payload: {
    addOnId: string;
    year: number;
    proRateMonth: string;
  }) {
    const { data } = await this.put<Addon>(
      `/payrolls/delete-salary-addon`,
      payload,
    );

    return data;
  }

  async updatePayrollSalaryAddon(
    payload: Pick<Addon, 'addonId' | 'name' | 'amount' | 'type' | 'dates'>,
  ) {
    const { data } = await this.put<Addon>(
      `/payrolls/update-salary-addon`,
      payload,
    );

    return data;
  }

  async addToRemittance(payload: { remittanceName: string; employee: string }) {
    const { data } = await this.put(`/payrolls/add-to-remittance`, payload);

    return data;
  }

  async removeFromRemittance(payload: {
    remittanceName: string;
    employee: string;
  }) {
    const { data } = await this.put(
      `/payrolls/remove-from-remittance`,
      payload,
    );

    return data;
  }

  async removeFromRemittanceGroup(payload: {
    remittanceName: string;
    employee: string;
    groupId: string;
  }) {
    const { data } = await this.put(
      `/payrolls/remove-from-remittance-group`,
      payload,
    );

    return data;
  }

  async addToRemittanceGroup(payload: {
    remittanceName: string;
    employee: string;
    groupId: string;
  }) {
    const { data } = await this.put(
      `/payrolls/add-to-remittance-group`,
      payload,
    );

    return data;
  }

  async getPayrollUpdate() {
    const { data } = await this.get<PayrollUpdateResponse>(
      `/payrolls/payroll-update`,
    );

    return data;
  }

  async downloadPayslips(
    payrollId: string,
    params: { payrollEmployeeIds: string[]; shouldDownloadOnly?: boolean },
  ) {
    const { data } = await this.get<string[]>(
      `/payrolls/${payrollId}/payslips`,
      { params },
    );

    return data;
  }
}
