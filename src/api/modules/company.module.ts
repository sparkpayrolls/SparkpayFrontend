import { HttpRepository } from '../repo/http.repo';
import { Administrator, Company, FileUploadPayload } from '../types';

export class CompanyModule extends HttpRepository {
  async getCompanies() {
    const { data } = await this.get<Administrator[]>('/companies');

    return data;
  }

  async selectCompany(id: string) {
    const { data } = await this.put<Administrator>(`/companies/${id}/select`);

    return data;
  }

  async unselectCompany(id: string) {
    const { data } = await this.put<Administrator>(`/companies/${id}/unselect`);

    return data;
  }

  async getCompaniesPaginated(
    query: Record<string, string | number | boolean>,
  ) {
    const queryString = this.parseQueryObject(query);
    return this.get<Administrator[]>(`/companies/paginated${queryString}`);
  }

  async deleteCompany(id: string) {
    await this.delete(`/companies/${id}`, {});
  }

  async createCompany(
    company: Pick<Company, 'country' | 'email' | 'phonenumber' | 'name'>,
  ) {
    const { data } = await this.post<Company>('/companies', company);

    return data;
  }

  async getCurrentCompany() {
    const { data } = await this.get<Administrator>('/companies/current');

    return data;
  }

  async getCompanyById(id: string) {
    const { data } = await this.get<Company>(`/companies/${id}`);

    return data;
  }

  async updateCompanyById(
    id: string,
    update: Partial<
      Pick<
        Company,
        | 'name'
        | 'email'
        | 'salaryBreakdown'
        | 'phonenumber'
        | 'bank'
        | 'bvnName'
        | 'bvn'
        | 'accountNumber'
        | 'statutoryDeductions'
      > & {
        logoFile: FileUploadPayload;
      }
    >,
  ) {
    const { data } = await this.put<Company>(`/companies/${id}`, update);

    return data;
  }
}
