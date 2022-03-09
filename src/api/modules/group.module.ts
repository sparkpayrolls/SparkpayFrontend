import { HttpRepository } from '../repo/http.repo';
import { EmployeeGroup } from '../types';

export class GroupModule extends HttpRepository {
  getGroupEmployees(groupId: string, params: Record<string, any>) {
    return this.get<EmployeeGroup[]>(`groups/${groupId}/employees`, { params });
  }
}
