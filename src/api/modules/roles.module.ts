import { HttpRepository } from '../repo/http.repo';
import { Permission, Role } from '../types';

export class RolesModule extends HttpRepository {
  getCompanyRoles(params: Record<string, any>) {
    return this.get<Role[]>('/roles', { params });
  }

  async updateRole(id: string, payload: Pick<Role, 'name' | 'permissions'>) {
    const { data } = await this.put<Role>(`/roles/${id}`, payload);

    return data;
  }

  async deleteRole(id: string) {
    const { data } = await this.delete<Role>(`/roles/${id}`);

    return data;
  }

  async getPermissions(params: Record<string, any>) {
    return this.get<Permission[]>('roles/permissions', { params });
  }

  async createRole(payload: Pick<Role, 'name' | 'permissions'>) {
    const { data } = await this.post<Role>(`/roles`, payload);

    return data;
  }
}
