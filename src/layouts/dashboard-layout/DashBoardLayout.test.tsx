import React from 'react';
import renderer from 'react-test-renderer';
import DashboardLayout from './DashboardLayout';

it('renders correctly', () => {
  const layout = renderer.create(<DashboardLayout />).toJSON();
  expect(layout).toMatchSnapshot();
});
