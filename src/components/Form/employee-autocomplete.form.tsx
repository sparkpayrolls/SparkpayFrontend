import { useState } from 'react';
import { $api } from 'src/api';
import { Employee } from 'src/api/types';
import { Button } from '../Button/Button.component';
import { AutoComplete } from '../Input/autocomplete.component';

interface IEmployeeAutoCompleteForm {
  // eslint-disable-next-line no-unused-vars
  onSubmit?(e: Employee): any;
  // eslint-disable-next-line no-unused-vars
  onSelect?(e: Employee): any;
}

export const EmployeeAutocompleteForm = (props: IEmployeeAutoCompleteForm) => {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [autoCompleteValue, setAutoCompleteValue] = useState('');

  const handleSearch = (search: string) => {
    if (!search) {
      setEmployees([]);
      return;
    }

    $api.employee
      .getEmployees({ search, limit: 5 })
      .then(({ data: employees }) => {
        setEmployees(employees);
      })
      .catch(() => {
        /** */
      });
  };
  return (
    <form
      action=""
      className="employee-auto-complete-form"
      onSubmit={(e) => {
        e.preventDefault();
        if (selectedEmployee) {
          if (props.onSubmit) {
            props.onSubmit(selectedEmployee);
          }
          setSelectedEmployee(null);
          setAutoCompleteValue('');
        }
      }}
    >
      <AutoComplete
        id="autocomplete-employee"
        placeholder="Search by employee name or email"
        onSearch={handleSearch}
        onSelect={(_name, option) => {
          const employee = employees.find((e) => e.id === option.key);
          if (employee) {
            setSelectedEmployee(employee);
            if (props.onSelect) {
              props.onSelect(employee);
            }
          }
        }}
        value={autoCompleteValue}
        onChange={(e) => {
          setSelectedEmployee(null);
          setAutoCompleteValue(e);
        }}
        label="Employee"
      >
        {employees.map((employee) => {
          return (
            <AutoComplete.Option
              key={employee.id}
              value={`${employee.firstname} ${employee.lastname}`}
            >
              {employee.firstname} {employee.lastname}
            </AutoComplete.Option>
          );
        })}
      </AutoComplete>
      <Button
        label={<>Add</>}
        type="submit"
        disabled={!selectedEmployee}
        primary
      />
    </form>
  );
};
