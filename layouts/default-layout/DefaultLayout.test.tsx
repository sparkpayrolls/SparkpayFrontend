import React from 'react';
import renderer from 'react-test-renderer';
import DefaultLayout from './DefaultLayout';

it('renders correctly', () => {
  const layout = renderer.create(<DefaultLayout />).toJSON();
  expect(layout).toMatchSnapshot();
});
