import { HttpRepository } from '../repo/http.repo';
import { Employee } from '../types';

export class EmployeeModule extends HttpRepository {
  // eslint-disable-next-line no-unused-vars
  async getEmployees(page = 1, perPage = 7, search = '') {
    const res = await this.get<Employee[]>(
      `/employees?limit=${perPage}&page=${page}`,
    );

    return res;
  }
}
