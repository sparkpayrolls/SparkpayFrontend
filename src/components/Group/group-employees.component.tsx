import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { $api } from 'src/api';
import { Employee, EmployeeGroup } from 'src/api/types';
import { Util } from 'src/helpers/util';
import removeicon from '../../../public/svgs/remove-icon.svg';
import { EmployeeAutocompleteForm } from '../Form/employee-autocomplete.form';
import { Container } from '../Shared/container.component';

export type IGroupEmployees = {
  groupId?: string;
};

export const GroupEmployees = (props: IGroupEmployees) => {
  const { groupId } = props;
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState<EmployeeGroup[]>([]);

  const getEmployees = useCallback(async () => {
    if (!groupId) return;
    try {
      setLoading(true);
      const { data: employees } = await $api.group.getGroupEmployees(groupId, {
        all: true,
      });
      setEmployees(employees);
    } catch (error) {
      Util.onNonAuthError(error, (httpError) => {
        toast.error(`error getting employees - ${httpError.message}`);
      });
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    getEmployees();
  }, [getEmployees]);

  const addEmployee = async (id: string) => {
    if (!groupId) return;
    try {
      setLoading(true);
      await $api.employee.addEmployeesToGroup(groupId, [id]);
      await getEmployees();
      toast.success('employee added successfully.');
    } catch (error) {
      Util.onNonAuthError(error, (httpError) => {
        toast.error(httpError.message);
      });
    } finally {
      setLoading(false);
    }
  };
  const removeEmployee = async (id: string) => {
    if (!groupId) return;
    try {
      setLoading(true);
      await $api.employee.removeEmployeesFromGroup(groupId, [id]);
      await getEmployees();
      toast.success('employee removed successfully.');
    } catch (error) {
      Util.onNonAuthError(error, (httpError) => {
        toast.error(httpError.message);
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="group-details__employee-header">
        <p className="group-details__employee-number">
          {employees.length} Employee{employees.length !== 1 && 's'}
        </p>
      </div>
      <Container
        loading={loading}
        showContent
        className="group-details__parent-container"
      >
        <EmployeeAutocompleteForm
          onSelect={(employee) => addEmployee(employee.id)}
          clearOnSelect
        />

        <div className="items">
          {employees.map((groupEmloyee) => {
            const employee = groupEmloyee.employee as Employee;
            if (!employee) return null;

            return (
              <div className="group-details__user" key={groupEmloyee.id}>
                <p className="group-details__name">
                  {employee.firstname} {employee.lastname}
                </p>
                <div
                  onClick={() => removeEmployee(employee.id)}
                  className="group-details__image-container"
                >
                  <Image
                    src={removeicon}
                    className="group-details__remove-icon"
                    alt="group-details-image"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </div>
  );
};
