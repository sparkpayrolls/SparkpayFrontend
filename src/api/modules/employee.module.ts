import { HttpRepository } from '../repo/http.repo';
import { Employee, EmployeeStatus } from '../types';

export class EmployeeModule extends HttpRepository {
  async getEmployees(
    page = 1,
    perPage = 7,
    search = '',
    all = false,
    salaryRange = '',
    status = '',
  ) {
    const res = await this.get<Employee[]>(
      `/employees?limit=${perPage}&page=${page}&search=${search}&all=${all}&salaryRange=${salaryRange}&status=${status}`,
    );

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

  async updateEmployeeStatus(
    id: string,
    status: EmployeeStatus | keyof typeof EmployeeStatus,
  ) {
    await this.put(`/employees/${id}/status`, { status });
  }

  async updateMultipleEmployeeStatuses(
    employeeIds: string[],
    status: EmployeeStatus | keyof typeof EmployeeStatus,
  ) {
    await this.put(`/employees/status`, { employeeIds, status });
  }
}
