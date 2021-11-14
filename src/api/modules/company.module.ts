import { HttpRepository } from '../repo/http.repo';
import { Administrator } from '../types';

export class CompanyModule extends HttpRepository {
  async getCompanies() {
    const { data } = await this.get<Administrator[]>('/companies');

    return data;
  }

  async selectCompany(id: string) {
    const { data } = await this.put<Administrator>(`/companies/${id}/select`);

    return data;
  }
}
