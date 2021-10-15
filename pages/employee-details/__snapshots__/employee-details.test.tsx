import React from 'react';
import renderer from 'react-test-renderer';
import EmployeeDetails from './../index';


it('renders correctly', () => {
  const Employeedetails = renderer.create( <EmployeeDetails /> );
  expect(Employeedetails).toMatchSnapshot();
});