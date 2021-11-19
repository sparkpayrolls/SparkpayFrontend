import { HttpRepository } from '../repo/http.repo';
import { UserDashboardData, OrganisationDashboardData } from '../types';

export class DashboardModule extends HttpRepository {
  async getUserDashboardData() {
    const { data } = await this.get<UserDashboardData>('/dashboards/users');

    return data;
  }

  async getCompanyDashboardData() {
    const { data } = await this.get<OrganisationDashboardData>(
      '/dashboards/companies',
    );

    return data;
  }
}
