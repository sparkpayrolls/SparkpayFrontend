import { HttpRepository } from '../repo/http.repo';
import {
  Employee,
  EmployeeGroup,
  EmployeeGroupPayload,
  EmployeePayrollHistory,
  EmployeeStatus,
  Group,
  SalaryAddOn,
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

  async addEmployees(payload: { employees: Record<string, unknown>[] }) {
    const { data } = await this.post<Employee[]>('employees/bulk', payload);

    return data;
  }

  async updateSingleEmployee(
    id: string,
    employee: Partial<
      Pick<
        Employee,
        | 'firstname'
        | 'lastname'
        | 'salary'
        | 'email'
        | 'taxId'
        | 'taxState'
        | 'bvn'
        | 'statutoryDeductions'
      >
    >,
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

  async findEmployeesByEmail(emails: string[]) {
    const { data } = await this.get<Employee[]>(`/employees/find-by-email`, {
      params: { emails },
    });

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

  async addEmployeesToGroup(groupId: string, ids: string[], all = false) {
    const { data } = await this.post<Employee | EmployeeGroup[]>(
      `/employees/groups/${groupId}/employees`,
      { ids, all },
    );

    return data;
  }

  async removeEmployeesFromGroup(groupId: string, ids: string[], all = false) {
    const { data } = await this.delete<Employee | EmployeeGroup[]>(
      `/employees/groups/${groupId}/employees`,
      { ids, all },
    );

    return data;
  }

  async createSalaryAddon(
    entity: string,
    payload: Pick<
      SalaryAddOn,
      | 'name'
      | 'description'
      | 'amount'
      | 'type'
      | 'frequency'
      | 'startYear'
      | 'dates'
      | 'isNotTaxable'
    >,
  ) {
    const { data } = await this.post<SalaryAddOn>('/employees/addons', {
      ...payload,
      entity,
    });

    return data;
  }

  async updateSalaryAddon(
    id: string,
    payload: Partial<
      Pick<
        SalaryAddOn,
        | 'name'
        | 'description'
        | 'amount'
        | 'type'
        | 'frequency'
        | 'startYear'
        | 'dates'
        | 'status'
      >
    >,
  ) {
    const { data } = await this.put<SalaryAddOn>(
      `/employees/addons/${id}`,
      payload,
    );

    return data;
  }

  async deleteSalaryAddon(id: string) {
    const { data } = await this.delete<SalaryAddOn>(`/employees/addons/${id}`);

    return data;
  }

  async getSalaryAddons(entity: string, params: Record<string, any>) {
    return this.get<SalaryAddOn[]>(`/employees/${entity}/addons`, { params });
  }

  async getEmployeeUploadSheetFormat(payoutMethod: string) {
    const { data } = await this.get<{ file: string; name: string }>(
      '/employees/employee-upload-sheet-format',
      { params: { payoutMethod } },
    );

    return data;
  }

  async getEmployeePayrollHistory(
    employee: string,
    params: Record<string, unknown>,
  ) {
    return this.get<EmployeePayrollHistory[]>(
      `/employees/${employee}/payrolls`,
      { params },
    );
  }

  async getEmployeePayslips(
    employee: string,
    params: { all?: boolean; shouldDownloadOnly?: boolean; payrolls: string[] },
  ) {
    const { data } = await this.get<string[]>(
      `/employees/${employee}/payslips`,
      { params },
    );

    return data;
  }
}
