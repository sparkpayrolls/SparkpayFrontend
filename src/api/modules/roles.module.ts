import { HttpRepository } from '../repo/http.repo';
import { Role } from '../types';

export class RolesModule extends HttpRepository {
  getCompanyRoles(params: Record<string, any>) {
    return this.get<Role[]>('/roles', { params });
  }
}
