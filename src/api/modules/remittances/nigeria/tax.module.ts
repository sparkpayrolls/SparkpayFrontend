import { HttpRepository } from 'src/api/repo/http.repo';
import {
  AddEmployeeToNigerianTaxPayload,
  EmployeeTaxDetail,
  NigerianTaxSettings,
  SetupTaxPayload,
  State,
} from 'src/api/types';

export class TaxModule extends HttpRepository {
  async getTaxSettings() {
    const { data } = await this.get<NigerianTaxSettings>(
      '/remittances/nigeria/tax',
    );

    return data;
  }

  async setupTax(payload: SetupTaxPayload) {
    const { data } = await this.post<NigerianTaxSettings>(
      '/remittances/nigeria/tax',
      payload,
    );

    return data;
  }

  async getTaxStates(query: Record<string, any>) {
    const q = this.parseQueryObject(query);

    return this.get<State[]>(`/remittances/nigeria/tax/states${q}`);
  }

  async addEmployees(payload: AddEmployeeToNigerianTaxPayload) {
    await this.post('/remittances/nigeria/tax/employees', payload);
  }

  async getEmployees(query: Record<string, any>) {
    const q = this.parseQueryObject(query);

    return this.get<EmployeeTaxDetail[]>(
      `/remittances/nigeria/tax/employees${q}`,
    );
  }

  async deleteEmployee(id: string) {
    const { data } = await this.delete<EmployeeTaxDetail>(
      `/remittances/nigeria/tax/employees/${id}`,
    );

    return data;
  }
}
