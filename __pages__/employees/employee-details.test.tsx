import React from 'react';
import renderer from 'react-test-renderer';
import EmployeeDetails from '../../pages/employees/[id]';

it('renders correctly', () => {
  const Employeedetails = renderer.create(<EmployeeDetails />);
  expect(Employeedetails).toMatchSnapshot();
});
