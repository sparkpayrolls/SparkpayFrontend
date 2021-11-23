import { HttpRepository } from '../repo/http.repo';
import { Employee, EmployeeStatus } from '../types';

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
}
