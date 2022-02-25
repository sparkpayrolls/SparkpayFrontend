import { HttpRepository } from '../repo/http.repo';
import {
  Employee,
  EmployeeGroupPayload,
  EmployeeStatus,
  Group,
} from '../types';

export class EmployeeModule extends HttpRepository {
  async getEmployees(params: Record<string, any>) {
    const query = this.parseQueryObject(params);
    const res = await this.get<Employee[]>(`/employees${query}`);

    return res;
  }

  async addSingleEmployee(
    employee: Pick<Employee, 'firstname' | 'lastname' | 'salary' | 'email'>,
  ) {
    const { data } = await this.post<Employee>('/employees', employee);

    return data;
  }

  async addEmployees(payload: { employees: Record<string, string>[] }) {
    const { data } = await this.post<Employee[]>('employees/bulk', payload);

    return data;
  }

  async updateSingleEmployee(
    id: string,
    employee: Pick<Employee, 'firstname' | 'lastname' | 'salary' | 'email'>,
  ) {
    const { data } = await this.put<Employee>(`/employees/${id}`, employee);

    return data;
  }

  async removeEmployee(id: string) {
    await this.delete(`/employees/${id}`);
  }

  async removeMultipleEmployees(employeeIds: string[]) {
    await this.delete('employees/delete', { employeeIds });
  }

  async updateEmployeeStatus(id: string, status: EmployeeStatus) {
    await this.put(`/employees/${id}/status`, { status });
  }

  async updateMultipleEmployeeStatuses(
    employeeIds: string[],
    status: EmployeeStatus,
  ) {
    await this.put(`/employees/status`, { employeeIds, status });
  }

  async completeEmployeeOnboarding(payload: Record<string, any>) {
    const { data } = await this.put('/employees/onboard', payload);

    return data;
  }

  async getSingleEmployee(id: string) {
    const { data } = await this.get<Employee>(`/employees/${id}`);

    return data;
  }

  async getSingleEmployeeByToken(token: string) {
    const { data } = await this.get<Employee>(`/employees/onboard/${token}`);

    return data;
  }

  async resendOnboardingLink(id: string | string[]) {
    const query = this.parseQueryObject({ employee: id });
    const { data } = await this.post<Employee[]>(
      `/employees/onboard/resend${query}`,
    );

    return data;
  }

  async findEmployeeByEmail(email: string) {
    const { data } = await this.get<Employee>(
      `/employees/find-by-email/${email}`,
    );

    return data;
  }

  async getEmployeeGroups(params: Record<string, any>) {
    return this.get<Group[]>('/employees/groups', { params });
  }

  async createEmployeeGroup(payload: EmployeeGroupPayload) {
    const { data } = await this.post<Group>('/employees/groups', payload);

    return data;
  }

  async updateEmployeeGroup(
    groupId: string,
    payload: Partial<Pick<Group, 'status'> & EmployeeGroupPayload>,
  ) {
    const { data } = await this.put<Group>(
      `/employees/groups/${groupId}`,
      payload,
    );

    return data;
  }

  async deleteEmployeeGroup(groupId: string) {
    const { data } = await this.delete<Group>(`/employees/groups/${groupId}`);

    return data;
  }

  async getEmployeeGroup(groupId: string) {
    const { data } = await this.get<Group>(`/employees/groups/${groupId}`);

    return data;
  }
}
