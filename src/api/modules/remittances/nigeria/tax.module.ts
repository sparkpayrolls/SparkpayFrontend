import { HttpRepository } from 'src/api/repo/http.repo';
import {
  AddEmployeeToNigerianTaxPayload,
  EmployeeTaxDetail,
  Group,
  NigerianTaxGroupMeta,
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

  async getTaxGroups(params: Record<string, unknown>) {
    return this.get<Group<NigerianTaxGroupMeta>[]>(
      '/remittances/nigeria/tax/groups',
      { params },
    );
  }

  async createTaxGroup(
    payload: Pick<Group<NigerianTaxGroupMeta>, 'name' | 'description' | 'meta'>,
  ) {
    const { data } = await this.post<Group<NigerianTaxGroupMeta>>(
      '/remittances/nigeria/tax/groups',
      payload,
    );

    return data;
  }

  async updateTaxGroup(
    id: string,
    payload: Pick<Group<NigerianTaxGroupMeta>, 'name' | 'description' | 'meta'>,
  ) {
    const { data } = await this.put<Group<NigerianTaxGroupMeta>>(
      `/remittances/nigeria/tax/groups/${id}`,
      payload,
    );

    return data;
  }

  async deleteTaxGroup(id: string) {
    const { data } = await this.delete<Group<NigerianTaxGroupMeta>>(
      `/remittances/nigeria/tax/groups/${id}`,
    );

    return data;
  }

  async getTaxGroup(id: string) {
    const { data } = await this.get<Group<NigerianTaxGroupMeta>>(
      `/remittances/nigeria/tax/groups/${id}`,
    );

    return data;
  }

  async addEmployeesToTaxGroup(groupId: string, ids: string[]) {
    const { data } = await this.post<unknown>(
      `/remittances/nigeria/tax/groups/${groupId}/employees`,
      { ids },
    );

    return data;
  }

  async removeEmployeesFromTaxGroup(groupId: string, ids: string[]) {
    const { data } = await this.delete<unknown>(
      `/remittances/nigeria/tax/groups/${groupId}/employees`,
      { ids },
    );

    return data;
  }
}
