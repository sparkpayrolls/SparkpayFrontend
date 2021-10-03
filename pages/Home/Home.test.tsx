import React from 'react';
import renderer from 'react-test-renderer';
import Home from './index';

it('renders homepage correctly', () => {
  const app = renderer.create(<Home />).toJSON();
  expect(app).toMatchSnapshot();
});
