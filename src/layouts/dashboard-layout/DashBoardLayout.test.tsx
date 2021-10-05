import React from 'react';
import renderer from 'react-test-renderer';
import DashBoardLayout from './DashBoardLayout';

it('renders correctly', () => {
  const layout = renderer.create(<DashBoardLayout />).toJSON();
  expect(layout).toMatchSnapshot();
});
