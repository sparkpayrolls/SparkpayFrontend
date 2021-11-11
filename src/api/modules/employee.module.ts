import { HttpRepository } from '../repo/http.repo';
import { Employee } from '../types';

export class EmployeeModule extends HttpRepository {
  async getEmployees(page = 1, perPage = 7, search = '', all = false) {
    const res = await this.get<Employee[]>(
      `/employees?limit=${perPage}&page=${page}&search=${search}&all=${all}`,
    );

    return res;
  }
}
