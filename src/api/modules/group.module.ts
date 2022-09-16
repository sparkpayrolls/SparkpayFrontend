import { HttpRepository } from '../repo/http.repo';
import { Employee, EmployeeGroup } from '../types';

export class GroupModule extends HttpRepository {
  getGroupEmployees(groupId: string, params: Record<string, any>) {
    return this.get<EmployeeGroup[]>(`groups/${groupId}/employees`, { params });
  }

  getEmployeesNotInGroup(groupId: string, params: Record<string, any>) {
    return this.get<Employee[]>(`groups/${groupId}/unadded-employees`, {
      params,
    });
  }
}
